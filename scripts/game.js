const startBtn = document.querySelector('.start');
const controlPanel = document.querySelector('.game__control_panel');
const gameBtns = [...document.querySelectorAll('.level-btn')]; //  Game difficulty buttons
const restartBtn = document.querySelector('.restart');
restartBtn.disabled = true;
const cancelBtn = document.querySelector('.game__cancel-btn');
const exitBtn = document.querySelector('.exit');
let difficultyGame;
let currentImgPuzzle = localStorage.getItem('currentImg');

// set default image as a current image
if(!localStorage.getItem('currentImg')) {
    currentImgPuzzle = choseImage();
    localStorage.setItem('currentImg', currentImgPuzzle);
}

createScreenSaver(currentImgPuzzle); // puzzle image as a screensaver

startBtn.addEventListener('click', ()=> {
    startBtn.classList.add('visually-hidden');
    cancelBtn.classList.add('visually-hidden');
    controlPanel.classList.add('open');
});

cancelBtn.addEventListener('click', ()=> {
    if (hasFavoriteArts() === false) {
        console.log('empty');
        createHint(cancelBtn);
    } else {
        localStorage.removeItem('currentImg');
        window.location.reload();
    }
});

gameBtns.forEach(btn => {
    btn.addEventListener('click', function(){
        if (btn.classList.contains('easy')) difficultyGame = 2;
        if (btn.classList.contains('middle')) difficultyGame = 3;
        if (btn.classList.contains('hard')) difficultyGame = 4;
        document.querySelector('.game__screen-saver').remove();
        initGame(currentImgPuzzle);
    });
});

exitBtn.addEventListener('click', ()=>{
    localStorage.removeItem('currentImg');
    window.location.reload();
});

restartBtn.addEventListener('click', ()=>{
    window.location.reload();
});

function initGame(image) {
    restartBtn.disabled = false;
    class Board {
        constructor(imgNWidth, imgNHeight, rowCols) {
            if (Board._instance) {
                throw new Error('There can be only one board per puzzle');
            }
            Board._instance = this,
            this.rowCols = rowCols,
            //puzzle size
            this.width = 600,
            this.height = 600,
            //size of each piece of original image
            this.widthIP = Math.floor(imgNWidth / this.rowCols),
            this.heightIP = Math.floor(imgNHeight / this.rowCols),
            // size of each tile of the puzzle
            this.tileWidth = Math.floor(this.width / this.rowCols),
            this.tileHeight = Math.floor(this.height / this.rowCols)
        }
    }
    
    var canvas = document.querySelector('.game');
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    var board;
    var tileImgs = [];
    var tileIds = []; // index
    var shuffledIds = [];
    
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = cutImageIntoPieces;
    img.src = `${image}`;
    
    function cutImageIntoPieces() {
        board = new Board(this.naturalWidth, this.naturalHeight, difficultyGame);
        canvas.width = board.width;
        canvas.height = board.height;
        canvas.addEventListener('click', move);
        ctx.fillStyle = 'grey';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        //logic to cut the image into multiple pieces
        let tempCanvas = document.createElement('canvas');
        tempCanvas.width = board.tileWidth;
        tempCanvas.height = board.tileHeight;
        let tempCtx = tempCanvas.getContext('2d');
    
        for(let row = 0; row < board.rowCols; row++) {
            for(let col = 0; col < board.rowCols; col++) {
                tempCtx.drawImage(this, row*board.widthIP, col*board.heightIP, board.widthIP, board.heightIP, 0, 0, tempCanvas.width, tempCanvas.height );
                tileImgs.push(tempCanvas.toDataURL());
                let id = row + col * board.rowCols;
                tileIds.push(id);
            }
        }
        shuffle();
        drawAllTiles();
    }
    
    function shuffle() {
        shuffledIds = [...tileIds];
        shuffledIds.sort(()=> Math.random()-0.5);
        for(let i = 0; i < shuffledIds.length; i++ ) {
            if(shuffledIds[i] != tileIds[i]) {
                let blank = Math.round(Math.random()*(board.rowCols*board.rowCols - 1))
                shuffledIds[blank] = -1;
                return;
            }
        }
        shuffle();
    }
    
    function drawAllTiles() {
        for(let index = 0; index < shuffledIds.length; index++) {
            if(shuffledIds[index] == -1) continue;
    
            let coord = getRowColFromIndex(index) // координаты
            let x = coord.x // row number
            let y = coord.y // column number
            let imgURL = tileImgs[shuffledIds[index]];
            let imgObj = new Image();
            imgObj.onload = function() {
                ctx.drawImage(this, 0, 0, this.width, this.height, x*board.tileWidth, y*board.tileHeight, board.tileWidth, board.tileHeight);
            }
            imgObj.src = imgURL;
        }
    }
    
    function getRowColFromIndex(i) {
        let col = Math.floor(i / board.rowCols);
        let row = i % board.rowCols;
        return {x: row, y: col};
    }
    
    function move(e){
        e.preventDefault();
        let coords = getMouseCoords(e.clientX, e.clientY);
        let tileX = coords.x;  // row number
        let tileY = coords.y;   // column
    
        let blankCoords = getRowColFromIndex(findBlankIndex());
        let blankX = blankCoords.x;  // row number of blank tile
        let blankY = blankCoords.y;  // col number of blank tile
    
        if(!hasBlankNeighbor(tileX, tileY, blankX, blankY)) return;
        // store pixels of the tile with image into temp variable
    
        let swapDataImage = ctx.getImageData(tileX*board.tileWidth, tileY*board.tileHeight, board.tileWidth, board.tileHeight);
        ctx.fillRect(tileX*board.tileWidth, tileY*board.tileHeight, board.tileWidth, board.tileHeight);
        ctx.putImageData(swapDataImage, blankX * board.tileWidth, blankY * board.tileHeight);
    
        const imgIdx = getIndexFromCoords(tileX, tileY);
        const blankIdx = getIndexFromCoords(blankX, blankY);
    
        swapIndex(imgIdx, blankIdx);
    
        if(isSolved()) {
            canvas.removeEventListener('click', move);
            drawLastTile();
            localStorage.removeItem('currentImg');
            controlPanel.classList.remove('open');
            setTimeout(()=> initFireworkAnimation(), 500); // start animation fireworks
        }
    }
    
    function getMouseCoords(x, y) {
        let offset = canvas.getBoundingClientRect();
        let left = Math.floor(offset.left);
        let top = Math.floor(offset.top);
        let row = Math.floor((x - left) / board.tileWidth);
        let col = Math.floor((y - top) / board.tileHeight);
        return {x: row, y: col};
    }
    
    function findBlankIndex() {
        for(let i = 0; i < shuffledIds.length; i++) {
            if(shuffledIds[i] == -1) return i;
        }
    }
    
    function hasBlankNeighbor(tileX, tileY, blankX, blankY) {
        if(tileX != blankX && tileY != blankY) return false;
        if(Math.abs(tileX - blankX) == 1 || Math.abs(tileY - blankY) == 1) return true;
        return false;
    }
    
    function getIndexFromCoords(x, y) {
        return x + y * board.rowCols;
    }
    
    function swapIndex(imgIdx, blankIdx) {
        shuffledIds[blankIdx] = shuffledIds[imgIdx];
        shuffledIds[imgIdx] = - 1;
    }
    
    function isSolved() {
        for(let i = 0; i < shuffledIds.length; i++) {
            if(shuffledIds[i] == -1) continue;
            if(shuffledIds[i] != tileIds[i]) return false;
        }
        return true;
    }
    
    function drawLastTile() {
        let blank = findBlankIndex();
        let coords = getRowColFromIndex(blank);
        let x = coords.x;
        let y = coords.y;
        let imgUrl = tileImgs[tileIds[blank]];
        const imgObj = new Image();
        imgObj.onload = function() {
            ctx.drawImage(this, 0, 0, this.width, this.height, x*board.tileWidth, y*board.tileHeight, board.tileWidth, board.tileHeight );
        }
        imgObj.src = imgUrl;
    }
}

/* Animation fireworks */
function initFireworkAnimation() {
    const fireworksCanvas = document.getElementById("fireworksCanvas");
    fireworksCanvas.style.zIndex = 100;
    fireworksCanvas.style.animation = 'open 0.8s ease forwards';
    const context = fireworksCanvas.getContext("2d");
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    });

    class Particle {
        constructor(x, y, color, size, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = size;
            this.speedX = speedX;
            this.speedY = speedY;
            this.life = 100;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += 0.02;
            this.life -= 1;
        }

        draw() {
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fillStyle = this.color;
            context.fill();
            context.font = "30px Montserrat Alternates";
            context.strokeStyle = "#f5ecec";
            context.textAlign = "center";
            context.strokeText("Congratulations!", fireworksCanvas.width/2, fireworksCanvas.height/2);
        }
    }

    class Firework {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.particles = [];
            this.explode();
        }

        explode() {
            const colors = ["#ff0000", "#ff8800", "#ffcc00", "#00ff00", "#00aaff", "#9900ff"];
            for (let i = 0; i < 50; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3 + 2;
                const color = colors[Math.floor(Math.random() * colors.length)];
                this.particles.push(new Particle(
                    this.x, this.y, color, 2,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed
                ));
            }
        }

        update() {
            this.particles = this.particles.filter(p => p.life > 0);
            this.particles.forEach(p => p.update());
        }

        draw() {
            this.particles.forEach(p => p.draw());
        }
    }

    const fireworks = [];

    function createRandomFirework() {
        const x = Math.random() * fireworksCanvas.width;
        const y = Math.random() * (fireworksCanvas.height / 2);
        fireworks.push(new Firework(x, y));
    }

    function animate() {
        context.fillStyle = "rgba(47, 67, 39, 1)";
        context.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

        fireworks.forEach(f => f.update());
        fireworks.forEach(f => f.draw());

        requestAnimationFrame(animate);
    }

    animate();

    let interval = setInterval(createRandomFirework, 500);
    setTimeout(() => {
        clearInterval(interval);
        window.location.reload();
    }, 10000);

    fireworksCanvas.addEventListener('click', ()=> {window.location.reload();});
}

/* hint */
function createHint(elem) {
    let hint = document.createElement('div');
    hint.className = 'game__hint';
    hint.textContent = 'There are no other images! Add your favorite paintings!';
    elem.appendChild(hint);
    setTimeout(()=>{hint.remove()}, 3000);
}

/* helpers */

function choseImage() {
    let images = [];
    let favoriteArts = JSON.parse(localStorage.getItem('favoriteArts')) || {};
    let arts = Object.values(favoriteArts);
    arts.forEach(art => {
        images.push(art.image);
    });
    let randomImage = (images.length !== 0) ? images[Math.floor(Math.random()*images.length)] : '../image/defalt_img.jpg';

    return randomImage;
}

function createScreenSaver(img) {
    const gameBox = document.querySelector('.game__wrapper');
    let splashImg = document.createElement('img');
    splashImg.className = 'game__screen-saver';
    splashImg.setAttribute('src', `${img}`);
    gameBox.appendChild(splashImg);
}

function hasFavoriteArts() {
    let favoriteArts = JSON.parse(localStorage.getItem('favoriteArts')) || {};
    if (Object.keys(favoriteArts).length === 0) return false;
    return true;
}