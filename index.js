//https://tympanus.net/codrops/2021/10/04/creating-3d-characters-in-three-js/ - взят за основу
/* 
Используя three.js сделайте любой 3D-объект, используя документацию - https://threejs.org/docs/ 
Основные условия:
Объект:
Может быть любым. Например, простой персонаж или геометрическая фигура.
Освещение:
Добавьте точечный источник света, чтобы объект был виден со всех сторон.
Камера:
Разместите камеру так, чтобы объект было полностью видно.
Камера должна находиться на расстоянии от сцены, чтобы удобно наблюдать вращение объекта.
Анимация:
Настройте анимацию, чтобы объект непрерывно вращался.
 */
const canvas = document.querySelector('canvas');

const scene = new THREE.Scene();

const degreesToRadians = (degrees) => {
	return degrees * (Math.PI / 180)
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });

const render = () => {
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 6;
scene.add(camera);

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    render(renderer);
})

// Material
const material = new THREE.MeshLambertMaterial({ color: 0xF4B480 });

// Geometry (look at Create class)

// Lighting
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.5);
scene.add(lightAmbient);

const lightDirectional = new THREE.DirectionalLight(0xffffff, 1);
scene.add(lightDirectional);

// Move the light source towards us
lightDirectional.position.set(5, 5, 5);

render(renderer);

// Create class
// Figure
class Figure {
	constructor(params) {
		this.params = {
			x: 0,
			y: -1,
			z: 0,
			ry: 0,
			angle: 0,
			...params
		}
		
		// Create group and add to scene
		this.group = new THREE.Group();
		scene.add(this.group);
		
		// Position according to params
		this.group.position.x = this.params.x;
		this.group.position.y = this.params.y;
		this.group.position.z = this.params.z;
		this.group.rotation.y = this.params.ry;
		
		this.arms = [];
	};
	
	createBody() {
		this.body = new THREE.Group();
		const geometry = new THREE.BoxGeometry(1, 1.5, 0.5);
        	const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4DDD4D });
		const bodyMain = new THREE.Mesh(geometry, bodyMaterial);
		
		this.body.add(bodyMain);
		this.group.add(this.body);
		
		this.createLegs();
	};
	
	createHead() {
	        // Create a new group for the head
	        this.head = new THREE.Group();
	        
	        // Create the main sphere of the head and add to the group
	        const geometry = new THREE.SphereGeometry(0.7, 24, 12,);
	        const headMain = new THREE.Mesh(geometry, material);
	        this.head.add(headMain);
	        
	        // Add the head group to the figure
	        this.group.add(this.head);
	        
	        // Position the head group
	        this.head.position.y = 1.55;
	        
	        // Add elements of head by calling functions we already made
	        this.createEyes();
	       this.createNose();
	       this.createMouth();
	       this.createHair();
	};
	
	createArms() {
		const height = 0.85;
		
		for(let i = 0; i < 2; i++) {
			const armGroup = new THREE.Group();
			const geometry = new THREE.BoxGeometry(0.25, height, 0.25);
			const arm = new THREE.Mesh(geometry, material);
			const m = (i % 2) === 0 ? 1 : -1;
			
			// Add arm to group
			armGroup.add(arm);
			
			// Add group to figure
			this.body.add(armGroup);
			
			// Translate the arm by half the height
			arm.position.y = height * -0.5;
			
			// Position the arm relative to the figure
			armGroup.position.x = m * 0.7;
			armGroup.position.y = 0.55;
			
			// Rotate the arm
			armGroup.rotation.z = degreesToRadians(30 * m);
		}
	};
	    createEyes() {
		const eyes = new THREE.Group();
		const geometry = new THREE.SphereGeometry(0.12, 12, 8);
		// Define the eye material
		const material = new THREE.MeshLambertMaterial({ color: 0x45C5C5 });
		
		for(let i = 0; i < 2; i++) {
		    const eye = new THREE.Mesh(geometry, material);
		    const m = (i % 2) === 0 ? 1 : -1;
		    
		    // Add the eye to the group
		    eyes.add(eye);
		    
		    // Position the eye
		    eye.position.x = 0.25 * m;
		};
	
	        // add eyes to head
	        this.head.add(eyes);
	        eyes.position.z = 0.65;
	
		};
	createNose() {
	        const geometry = new THREE.SphereGeometry(0.1, 12, 8);
			const nose = new THREE.Mesh(geometry, material);
	        this.head.add(nose);
	        nose.position.z = 0.6;
	        nose.position.y = -0.2;
	};
    createMouth() {
	        const geometry = new THREE.BoxGeometry(0.25, 0.1, 0.2);
	        const material = new THREE.MeshLambertMaterial({ color: 0xFF7373 });
		const mouth = new THREE.Mesh(geometry, material);
	        this.head.add(mouth);
	        mouth.position.z = 0.45;
	        mouth.position.y = -0.4;
	};
    createHair() {
	        const geometry = new THREE.BoxGeometry(0.1, 1, 1.2);
	        const material = new THREE.MeshLambertMaterial({ color: 0xFFE700 });
		const hair = new THREE.Mesh(geometry, material);
	        this.head.add(hair);
	        hair.position.z = -0.2;
	        hair.position.y = 0.35;
	        hair.rotation.x = degreesToRadians(-20);
	};

    createLegs() {
        const legs = new THREE.Group();
        const geometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
        
        for(let i = 0; i < 2; i++) {
            const leg = new THREE.Mesh(geometry, material);
            const m = (i % 2) === 0 ? 1 : -1;
            
            legs.add(leg);
            leg.position.x = m * 0.22;
        }
        
        this.group.add(legs);
        legs.position.y = -1.35;
        
        this.body.add(legs);
    }

    rotateFigure() {
        this.group.rotation.y = this.params.ry;
    }

	init() {
		this.createBody();
		this.createHead();
		this.createArms();
	};
}

const character = new Figure();
    character.init();

gsap.to(character.params, {
    ry: degreesToRadians(-360),
    repeat: -1,
    duration: 30
});

gsap.ticker.add(() => {
	character.rotateFigure();
	render();
})



