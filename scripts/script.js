/* API */
const BASE_SERVER_PATH = 'https://api.artic.edu/api/v1';
const ARTWORKS_SERVER_PATH = BASE_SERVER_PATH  + '/artworks';
var swiper;
//localStorage.clear();
let myData;
let dataConfig; // для формирования ссылки на изображения
let artWorkData; // массив с данными о произведениях искусства
let currentPage = 1;

function sendRequest({url}) {
    return fetch(url);
}

function getArtWorks() {
    const paramFields = 'id,title,image_id,date_start,date_end,date_display,artist_title,description,artwork_type_title';
    const paramLimit = '100';
    let paramPage = currentPage;
    const queryParams = '?page=' + paramPage + '&limit=' + paramLimit + '&fields=' + paramFields;

    sendRequest({url: ARTWORKS_SERVER_PATH + queryParams})
    .then((response) => {
        if (response.ok) {
            currentPage++;
            return response.json();
        }
        return Promise.reject(response);
    })
    .then(function(data) {
        isServer();
        myData = data; 
        dataConfig = data.config; // для формирования ссылки на изображения
        artWorkData = data.data; // массив с данными о произведениях искусства
        updatefavoriteList();
        createCardsList();
        popupSliderHandler();
    })
    .catch(error => {
        noServer();
        console.log('Ошибка при получении данных', error.status);
    });
}

getArtWorks();

const loadMoreBtn = document.querySelector('.load-more-btn_js');
loadMoreBtn.addEventListener('click', ()=>{
    getArtWorks();
});

function updatefavoriteList() {
    const favorites = getFavorites();
    let listOfFavoriteCards = document.querySelector('.collection__list');
    let artWorkCards = document.querySelectorAll('.artworks__list .card');

    listOfFavoriteCards.innerHTML = '';
    
    if (Object.keys(favorites).length === 0) {
        listOfFavoriteCards.innerHTML = 'Add your favorite paintings!';
    };

    // отрисовываем карточки,хранящиеся в localStorage, в списке избранного
    if (Object.keys(favorites).length !== 0) {
        for (var key in favorites) {
            createFavoriteCard(favorites[key]);
        }
    };
        
    // Обновляем цвет иконок SVG у кнопок-лайков
    artWorkCards.forEach(artCard => {
        const artWorkId = artCard.dataset.id; // получаем id картщчки из обычного списка
        const favoritesIds = Object.keys(favorites); // получаем все id имеющиеся в хранилище
        const svg = artCard.querySelector('svg');
        svg.style.fill = favoritesIds.includes(artWorkId) ? '#b4241a' : '#f5f0ec';
    
       // удаляем анимацию для кнопок-лайков
        const artworkBtn = artCard.querySelector('.card__btn_like');
       if (artworkBtn.classList.contains("shake")) artworkBtn.classList.remove("shake");
    }); 
}

function createCardsList() {
    let favorites = getFavorites();
    const cardList = document.querySelector('.artworks__list');

    for (let i = 0; i <= artWorkData.length - 1; i++) {
        if (artWorkData[i].artwork_type_title === "Painting") {

            createSlide(artWorkData[i], dataConfig);

            let artWorkCard = createBaseCard(artWorkData[i]);
            artWorkCard.dataset.id = `${artWorkData[i].id}`;

// ЗДЕСЬ ДОЛЖЕН ВКЛЮЧИТСЯ ПРОГРЕСС БАР для карточки.

            let cardImg = createImage('card__img', dataConfig, artWorkData[i]);
            let likeBtn = createElem('button', 'card__btn card__btn_like');
            likeBtn.innerHTML = '<svg width="800px" height="800px" viewBox="0 0 24 24"><path d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z"/></svg>';
            artWorkCard.appendChild(cardImg);
            artWorkCard.appendChild(likeBtn);
            
            const artWorkId = artWorkCard.dataset.id; // получаем id карточки из обычного списка
            let favoritesIds = Object.keys(favorites); // получаем все id имеющиеся в хранилище
            const svg = artWorkCard.querySelector('svg');
            svg.style.fill = favoritesIds.includes(artWorkId) ? '#b4241a' : '#f5f0ec';

            likeBtn.addEventListener('click', () => {
                let favoriteArt = new Object();
                favoriteArt.id = artWorkData[i].id;
                favoriteArt.title = artWorkData[i].title;
                favoriteArt.artist_title = artWorkData[i].artist_title;
                favoriteArt.date_display = artWorkData[i].date_display;
                favoriteArt.description = artWorkData[i].description;
                favoriteArt.image = `${dataConfig.iiif_url}/${artWorkData[i].image_id}/full/843,/0/default.jpg`;
                addFavorite(favoriteArt);
                likeBtn.classList.add("shake"); // Добавляем анимацию для кнопок-лайков
            });
            cardList.appendChild(artWorkCard);
            let hover = gsap.to(artWorkCard, {rotationX: 10, rotationY: -10, duration: 0.4, paused: true, ease: "power1.inOut"});
            artWorkCard.addEventListener("mouseenter", () => hover.play());
            artWorkCard.addEventListener("mouseleave", () => hover.reverse());
        }
    }
}

// cоздание базовой карточки без кнопок
function createBaseCard(data) {
    let card = createElem('li', 'card');
    let cardDescription = createElem('div', 'card__description');
    let cardName = createElem('p', 'card__name');
    cardName.textContent = `${data.title || 'unknown'}`;
    let cardArtist = createElem('p', 'card__artist');
    cardArtist.textContent = `${data.artist_title || 'unknown'}`;
    let cardYears = createElem('p', 'card__years');
    cardYears.textContent = `${data.date_display || 'unknown'}`;
    cardDescription.appendChild(cardName);
    cardDescription.appendChild(cardArtist);
    cardDescription.appendChild(cardYears);
    card.appendChild(cardDescription);
    return card;
}

// cоздание понравившейся карточки для списка избранного
function createFavoriteCard(favoriteArt) {
    let listOfFavoriteCards = document.querySelector('.collection__list');
    let favoriteCard = createBaseCard(favoriteArt);
    favoriteCard.dataset.id = `${favoriteArt.id}`;
    let cardImg = document.createElement('img');
    cardImg.className = 'card__img';
    cardImg.setAttribute('src', `${favoriteArt.image}`);
    cardImg.setAttribute('alt', `${favoriteArt.title}`);
    //cardImg.setAttribute('onerror', `this.src="../image/no_photo.svg"; this.onerror=null;`);
    let deleteBtn = createElem('button', 'card__btn card__btn_delete');
    favoriteCard.appendChild(cardImg);
    favoriteCard.appendChild(deleteBtn);
    listOfFavoriteCards.appendChild(favoriteCard);
    
    deleteBtn.addEventListener('click', () => {
        removeFavorite(favoriteCard);
        favoriteCard.removeEventListener("click", openFavoriteCard);
    });

    let hover = gsap.to(favoriteCard, {rotationX: 10, rotationY: -10, duration: 0.4, paused: true, ease: "power1.inOut"});
        favoriteCard.addEventListener("mouseenter", () => hover.play());
        favoriteCard.addEventListener("mouseleave", () => hover.reverse());
        favoriteCard.addEventListener("click", openLikedCardPopup);
}

// Извлекает данные из localStorage или возвращает пустой массив
function getFavorites() {
    return JSON.parse(localStorage.getItem('favoriteArts')) || {};
}

// Сохраняет в localStorage обновлённый объект избранного со всеми данными, разложенными по id
function saveFavorites(favorites) {
    localStorage.setItem('favoriteArts', JSON.stringify(favorites));
}

// Добавляет карточку в избранное, принимает объект со всеми нужными данными
function addFavorite(favoriteArt) {
    const favorites = getFavorites(); // получаем данные из localStorage
    console.log(favorites);
    
    const favoritesIds = Object.keys(favorites).map(Number); // создаем массив из ключей-id, переводим в числа строки
     // проверяем есть ли в localStorage ключи, если нет, сразу записываем
    if (!favoritesIds.includes(favoriteArt.id)) {
        favorites[`${favoriteArt.id}`] = favoriteArt;
        saveFavorites(favorites);
        createFavoriteCard(favoriteArt, dataConfig);
        updatefavoriteList();
    }
}

// Удаляем картину из избранного, сравнивая ключ объекта localStorage c data-id карточки
function removeFavorite(favoriteCard) {
    const favorites = getFavorites(); 

    if (Object.keys(favorites).length === 0) return;
    let favoriteCardId = favoriteCard.dataset.id;

    const favoritesIds = Object.keys(favorites);
    if (favoritesIds.includes(favoriteCardId)) {
        delete favorites[favoriteCardId];
        console.log(favorites);
        saveFavorites(favorites);
        if (favoriteCard) {
            favoriteCard.remove(); // удаляем элемент, если он действительно присутствует
        }
    }
    updatefavoriteList();
}

function createImage(className, config, data) {
    let elem = document.createElement('img');
    elem.className = className;
    elem.setAttribute('src', `${config.iiif_url}/${data.image_id}/full/843,/0/default.jpg`);
    elem.setAttribute('alt', `${data.title}`);
    //elem.setAttribute('onerror', `this.src="../image/no_photo.svg"; this.onerror=null;`);
    return elem;
}

/* SLIDER */

// cоздание структуры слайда

function createSlide(dataSlide, config) {
    const slider = document.querySelector('.slider');
    let slide = createElem('div', 'swiper-slide slide');
    slide.dataset.id = `${dataSlide.id}`;
    let slideImg = createImage('slide__image', config, dataSlide);
    let slideArtist = createElem('h4', 'slide__artist');
    slideArtist.textContent = `${dataSlide.artist_title || ''}`;
    let slideTitle = createElem('h3', 'slide__title');
    slideTitle.textContent = `« ${dataSlide.title || 'unknown'} »  `;
    slide.appendChild(slideArtist);
    slide.appendChild(slideTitle);
    slide.appendChild(slideImg);
    slider.appendChild(slide);
}

document.addEventListener("DOMContentLoaded", ()=> {
    swiper = new Swiper(".artSwiper", {
        init: false,
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 80,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
});

function popupSliderHandler() {
    const popupSlider = document.querySelector(`.popup-slider_js`);
    const closeSliderbtn = document.querySelector(`.popup-slider__close-btn_js`);
    const openSliderElements = [...document.querySelectorAll('.artworks__list .card .card__description')];

    if(!openSliderElements) return;

    if(!popupSlider || !popupSlider.classList.contains('visually-hidden')) return;

    openSliderElements.forEach(openSliderElem => {
        
        let slideNumber = openSliderElements.indexOf(openSliderElem); //  это значение передается в параметр initialSlide в swiper 
        openSliderElem.addEventListener('click', () => {
            swiper.init();
            swiper.slideTo(slideNumber);
            openPopupSlider();
            swiper.update();
        });
    });

    function openPopupSlider() {
        window.scrollTo(0, 0);
        popupSlider.classList.remove('visually-hidden');
        document.body.classList.add('no-scroll');
        window.addEventListener('keydown', escClosePopupSlider);
        
        if(closeSliderbtn) { 
            closeSliderbtn.addEventListener('click', closePopupSlider);
        }
    }

    function closePopupSlider() {
        popupSlider.classList.add('visually-hidden');
        document.body.classList.remove('no-scroll');
        window.removeEventListener('keydown', escClosePopupSlider);
        if(closeSliderbtn) { 
            closeSliderbtn.removeEventListener('click', closePopupSlider);
        }
    } 

    function escClosePopupSlider(e) {
        if(e.code === "Escape" && !popupSlider.classList.contains('visually-hidden')) {
            closePopupSlider();
        }
    }
}

/* popup with favorite art */

function createLikedCardPopup(favoriteArt) {
    let likedCardPopup = createElem('div','popup liked-card-popup liked-card-popup_js');
    let likedCardWrapper = createElem('div','popup__inner');
    let closeBtn = createElem('button', 'popup__close-btn liked-card-popup__close-btn popup__close-btn_js');
    let likedCard = createElem('div', 'liked-card');
    let title = createElem('p', 'liked-card__title');
    title.textContent = `${favoriteArt.title || 'unknown'}`;
    let artist = createElem('p', 'liked-card__artist');
    artist.textContent = `${favoriteArt.artist_title || 'unknown'}`;
    let years = createElem('p', 'liked-card__years');
    years.textContent = `${favoriteArt.date_display || 'unknown'}`;
    let description = createElem('p', 'liked-card__desc');
    description.innerHTML = `${favoriteArt.description || 'unknown'}`;
    let img = document.createElement('img');
    img.className = 'liked-card__img';
    img.setAttribute('src', `${favoriteArt.image}`);
    img.setAttribute('alt', `${favoriteArt.title}`);
    likedCard.appendChild(title);
    likedCard.appendChild(artist);
    likedCard.appendChild(years);
    likedCard.appendChild(description);
    likedCardWrapper.appendChild(img);
    likedCardWrapper.appendChild(likedCard);
    likedCardPopup.appendChild(closeBtn);
    likedCardPopup.appendChild(likedCardWrapper);
    return likedCardPopup;
}

function openLikedCardPopup(e) {
    let collection = document.querySelector('#my_collection .collection__list');
    let favorites = getFavorites();
    if(favorites.length === 0) return;
    if(collection.querySelector('li') === null) return;
    if(collection.querySelector('li') !== null) console.log('not empty');
    let popup;

    let favoritesIds = Object.keys(favorites); // получаем все id имеющиеся в хранилище
    let currentCardId = this.dataset.id;

    if(favoritesIds.includes(currentCardId)) {
        popup = createLikedCardPopup(favorites[currentCardId]);
        collection.appendChild(popup);
    }

    let img = popup.querySelector('.liked-card__img');
    let likedCardDesc = popup.querySelector('.liked-card');

    img.addEventListener('click', () => {
        likedCardDesc.classList.toggle('switching');
    });

    likedCardDesc.addEventListener('click', () => {
        likedCardDesc.classList.remove('switching');
    });

    let closeBtnPopup = popup.querySelector('.popup__close-btn_js');
    window.scrollTo(0, 0);
    document.body.classList.add('no-scroll');
    window.addEventListener('keydown', escDeletePopup);
    
    if(closeBtnPopup) { 
        closeBtnPopup.addEventListener('click', ()=> {
            document.body.classList.remove('no-scroll');
            popup.remove();
        });
    }
}

function escDeletePopup(e) {
    let popup = document.querySelector('.liked-card-popup_js');
    if(e.code === "Escape" && popup) {
        document.body.classList.remove('no-scroll');
        popup.remove();
    }
}

/* loaders */
function createProgressBar() {
    let wrapper = createElem('div', 'progress');
    let progressBar = createElem('div', 'progress-bar');
    wrapper.appendChild(progressBar);
    return wrapper;
}

function showProgressBar() {
    let loader = document.querySelector('.progress');
    if (loader.classList.contains('visually-hidden')) {
        loader.classList.remove('visually-hidden');
    }
}

function removeProgressBar() {
    const loader = document.querySelector('.progress');
    if (!loader.classList.contains('visually-hidden')) {
        loader.classList.add('visually-hidden');
    } 
}

/* error */
function noServer() {
    if (!document.body.classList.contains('no-server')) {
        document.body.classList.add('no-server');
        let titlesSection = document.querySelectorAll('h2');
        titlesSection.forEach(el=>{
            el.classList.add('visually-hidden');
        })
        let errorMessage = createElem('div', 'no-server__message');
        errorMessage.textContent = 'The gallery is temporarily closed... Try again later!'
        document.body.appendChild(errorMessage);
    }
}

function isServer() {
    if (document.body.classList.contains('no-server')) {
        document.body.classList.remove('no-server');
        let titlesSection = document.querySelectorAll('h2');
        titlesSection.forEach(el=>{
            el.classList.remove('visually-hidden');
        })
    }
}

/* handlers */

function createElem(tag, className) {
    let elem = document.createElement(tag);
    elem.className = className;
    return elem;
}