import { WebGLRenderer, Vector3 } from 'three';
import BaseScene from './scenes/Scene';
import Player from './objects/player/player';

export class GamePlay {
    scene: BaseScene;
    // camera: PerspectiveCamera;
    player: Player;
    generated: boolean;
    renderer: WebGLRenderer;
    canvas: HTMLCanvasElement;
    movementSpeed: number = 5;
    previousTime: DOMHighResTimeStamp;
    keys: { [key: string]: boolean } = { w: false, a: false, s: false, d: false };

    constructor() {
        this.player = new Player();
        this.scene = new BaseScene();
        this.scene.add(this.player);


        // Set up renderer, canvas, and minor CSS adjustments
        this.renderer = new WebGLRenderer({ antialias: true });
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

                this.player.camera.rotation.y -= sensitivity * event.movementX; // Horizontal rotation
                this.player.camera.rotation.x -= sensitivity * event.movementY; // Vertical rotation

                this.player.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.player.camera.rotation.x)); // Clamp vertical rotation
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
        // this.player.camera.position.set(this.scene.player_me.position.x, this.scene.player_me.position.y, this.scene.player_me.position.z);
        this.player.camera.rotation.set(this.scene.player_me.orientation.x, this.scene.player_me.orientation.y, 0);
        // this.player.camera.rotation.z = 0;

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
        const forward = new Vector3(0, 0, -1).applyQuaternion(this.player.camera.quaternion); // Forward direction
        const right = new Vector3(1, 0, 0).applyQuaternion(this.player.camera.quaternion); // Right direction
        if (this.keys.w) this.player.position.add(forward.multiplyScalar(this.movementSpeed * delta));
        if (this.keys.s) this.player.position.add(forward.multiplyScalar(-this.movementSpeed * delta));
        if (this.keys.a) this.player.position.add(right.multiplyScalar(-this.movementSpeed * delta));
        if (this.keys.d) this.player.position.add(right.multiplyScalar(this.movementSpeed * delta));
        this.player.position.y = this.scene.getHeight(this.player.position.x, this.player.position.z);
    
        this.renderer.render(this.scene, this.player.camera);
        this.scene.update && this.scene.update(timeStamp);
        window.requestAnimationFrame(this.onAnimationFrameHandler);
    }

    windowResizeHandler = () => {
        const { innerHeight, innerWidth } = window;
        this.renderer.setSize(innerWidth, innerHeight);
        this.player.camera.aspect = innerWidth / innerHeight;
        this.player.camera.updateProjectionMatrix();
    }
}
