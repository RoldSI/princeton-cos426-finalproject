import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import SeedScene from './scenes/Scene';
import BasicFlashlight from './lights/basicFlashlight';

export class GamePlay {
    scene: SeedScene;
    camera: PerspectiveCamera;
    generated: boolean;
    renderer: WebGLRenderer;
    canvas: HTMLCanvasElement;
    movementSpeed: number = 5;
    previousTime: DOMHighResTimeStamp;
    keys: { [key: string]: boolean } = { w: false, a: false, s: false, d: false };

    constructor() {
        // Initialize core ThreeJS components
        this.camera = new PerspectiveCamera();
        this.camera.rotation.order = 'YXZ';
        this.camera.add(new BasicFlashlight());
        this.scene = new SeedScene();
        this.scene.add(this.camera);
        this.renderer = new WebGLRenderer({ antialias: true });

        // Set up renderer, canvas, and minor CSS adjustments
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.canvas = this.renderer.domElement;
        this.canvas.style.display = 'block'; // Removes padding below canvas
        document.body.style.margin = '0'; // Removes margin around page
        document.body.style.overflow = 'hidden'; // Fix scrolling

        this.canvas.addEventListener('click', () => {
            this.canvas.requestPointerLock();
        });
        window.addEventListener('mousemove', (event) => {
            if (document.pointerLockElement === this.canvas) {
                const sensitivity = 0.001; // Adjust sensitivity as needed

                this.camera.rotation.y -= sensitivity * event.movementX; // Horizontal rotation
                this.camera.rotation.x -= sensitivity * event.movementY; // Vertical rotation

                this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x)); // Clamp vertical rotation
            }
        });
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'w') this.keys.w = true;
            if (event.key === 'a') this.keys.a = true;
            if (event.key === 's') this.keys.s = true;
            if (event.key === 'd') this.keys.d = true;
        });
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key === 'w') this.keys.w = false;
            if (event.key === 'a') this.keys.a = false;
            if (event.key === 's') this.keys.s = false;
            if (event.key === 'd') this.keys.d = false;
        });
        
        this.previousTime = performance.now();

        this.generated = false;
    }

    generate(): void {
        console.log('Generating game/scene!');
        this.scene.world = {
            ground_color: '#7ec0ee'
        };
        this.generated = true;
        console.log('Game/scene generated!');
    }

    start(): void {
        console.log('Starting game!');

        // Set up camera
        this.camera.position.set(this.scene.player_me.position.x, this.scene.player_me.position.y, this.scene.player_me.position.z);
        this.camera.rotation.set(this.scene.player_me.orientation.x, this.scene.player_me.orientation.y, 0);
        this.camera.rotation.z = 0;

        this.windowResizeHandler();
        window.addEventListener('resize', this.windowResizeHandler, false);

        window.requestAnimationFrame(this.onAnimationFrameHandler);

        document.body.appendChild(this.canvas);

        console.log('Game started!');
    }

    stop(): void {
        console.log('Stopping game!');

        this.generated = false;

        document.body.removeChild(this.canvas);

        console.log('Game stopped!');
    }

    onAnimationFrameHandler = (timeStamp: number) => {
        const delta = (timeStamp - this.previousTime) / 1000; // Convert ms to seconds
        this.previousTime = timeStamp;
        const forward = new Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion); // Forward direction
        const right = new Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion); // Right direction
        if (this.keys.w) this.camera.position.add(forward.multiplyScalar(this.movementSpeed * delta));
        if (this.keys.s) this.camera.position.add(forward.multiplyScalar(-this.movementSpeed * delta));
        if (this.keys.a) this.camera.position.add(right.multiplyScalar(-this.movementSpeed * delta));
        if (this.keys.d) this.camera.position.add(right.multiplyScalar(this.movementSpeed * delta));
    
        this.renderer.render(this.scene, this.camera);
        this.scene.update && this.scene.update(timeStamp);
        window.requestAnimationFrame(this.onAnimationFrameHandler);
    }

    windowResizeHandler = () => {
        const { innerHeight, innerWidth } = window;
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }
}


// // GAMEPLAY

// // Initialize core ThreeJS components
// const scene = new SeedScene();
// const camera = new PerspectiveCamera();
// camera.rotation.order = 'YXZ';

// const renderer = new WebGLRenderer({ antialias: true });

// // Set up camera
// camera.position.set(0, 0, 1.8);
// camera.lookAt(new Vector3(0, 0, 0));
// camera.rotation.z = 0;

// // Set up renderer, canvas, and minor CSS adjustments
// renderer.setPixelRatio(window.devicePixelRatio);
// const canvas = renderer.domElement;
// canvas.style.display = 'block'; // Removes padding below canvas
// document.body.style.margin = '0'; // Removes margin around page
// document.body.style.overflow = 'hidden'; // Fix scrolling
// // document.body.appendChild(canvas);



// canvas.addEventListener('click', () => {
//     canvas.requestPointerLock();
// });
// window.addEventListener('mousemove', (event) => {
//     if (document.pointerLockElement === canvas) {
//         const sensitivity = 0.001; // Adjust sensitivity as needed

//         camera.rotation.y -= sensitivity * event.movementX; // Horizontal rotation
//         camera.rotation.x -= sensitivity * event.movementY; // Vertical rotation

//         camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x)); // Clamp vertical rotation
//     }
// });
// const keys: { [key: string]: boolean } = { w: false, a: false, s: false, d: false, f: false };
// window.addEventListener('keydown', (event: KeyboardEvent) => {
//     if (event.key === 'w') keys.w = true;
//     if (event.key === 'a') keys.a = true;
//     if (event.key === 's') keys.s = true;
//     if (event.key === 'd') keys.d = true;
//     if (event.key === 'f') keys.f = true;
// });
// window.addEventListener('keyup', (event: KeyboardEvent) => {
//     if (event.key === 'w') keys.w = false;
//     if (event.key === 'a') keys.a = false;
//     if (event.key === 's') keys.s = false;
//     if (event.key === 'd') keys.d = false;
//     if (event.key === 'f') keys.f = false;
// });
// const movementSpeed = 5; // Units per second


// // Render loop
// let previousTime = performance.now();
// const onAnimationFrameHandler = (timeStamp: number) => {
//     const delta = (timeStamp - previousTime) / 1000; // Convert ms to seconds
//     previousTime = timeStamp;
//     const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion); // Forward direction
//     const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion); // Right direction
//     if (keys.w) camera.position.add(forward.multiplyScalar(movementSpeed * delta));
//     if (keys.s) camera.position.add(forward.multiplyScalar(-movementSpeed * delta));
//     if (keys.a) camera.position.add(right.multiplyScalar(-movementSpeed * delta));
//     if (keys.d) camera.position.add(right.multiplyScalar(movementSpeed * delta));

//     renderer.render(scene, camera);
//     scene.update && scene.update(timeStamp);
//     window.requestAnimationFrame(onAnimationFrameHandler);
// };
// window.requestAnimationFrame(onAnimationFrameHandler);

// // Resize Handler
// const windowResizeHandler = () => {
//     const { innerHeight, innerWidth } = window;
//     renderer.setSize(innerWidth, innerHeight);
//     camera.aspect = innerWidth / innerHeight;
//     camera.updateProjectionMatrix();
// };
// windowResizeHandler();
// window.addEventListener('resize', windowResizeHandler, false);
