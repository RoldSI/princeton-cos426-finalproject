import { WebGLRenderer, Vector3 } from 'three';
import BaseScene from './scenes/Scene';
import Player from './objects/player/player';

export class GamePlay {
    // config params
    movementSpeed: number; // in m/s
    // internal state
    scene: BaseScene;
    player: Player;
    player_other: Player;
    renderer: WebGLRenderer;
    canvas: HTMLCanvasElement;
    previousTime: DOMHighResTimeStamp;
    keys: { [key: string]: boolean } = { w: false, a: false, s: false, d: false };

    constructor(scene: BaseScene, player: Player, player_other: Player, movementSpeed: number = 5) {
        this.movementSpeed = movementSpeed;
        this.scene = scene;
        this.player = player;
        this.player_other = player_other;

        this.scene.add(this.player);
        this.scene.add(this.player_other);

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
                this.player.modifyOrientation(
                    -sensitivity * event.movementY, // Vertical rotation
                    -sensitivity * event.movementX // Horizontal rotation
                )
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
    }

    start(): void {
        console.log('Starting game!');

        this.windowResizeHandler();
        window.addEventListener('resize', this.windowResizeHandler, false);
        window.requestAnimationFrame(this.onAnimationFrameHandler);

        document.body.appendChild(this.canvas);

        console.log('Game started!');
    }

    stop(): void {
        console.log('Stopping game!');

        document.body.removeChild(this.canvas);

        console.log('Game stopped!');
    }

    onAnimationFrameHandler = (timeStamp: number) => {
        const delta = (timeStamp - this.previousTime) / 1000; // Convert ms to seconds
        this.previousTime = timeStamp;
        const forward = new Vector3(0, 0, -1).applyQuaternion(this.player.quaternion).applyQuaternion(this.player.camera.quaternion); // Forward direction
        const right = new Vector3(1, 0, 0).applyQuaternion(this.player.quaternion).applyQuaternion(this.player.camera.quaternion); // Right direction
        const positionUpdate = new Vector3();
        if (this.keys.w) positionUpdate.add(forward.multiplyScalar(this.movementSpeed * delta));
        if (this.keys.s) positionUpdate.add(forward.multiplyScalar(-this.movementSpeed * delta));
        if (this.keys.a) positionUpdate.add(right.multiplyScalar(-this.movementSpeed * delta));
        if (this.keys.d) positionUpdate.add(right.multiplyScalar(this.movementSpeed * delta));
        this.player.modifyPosition(positionUpdate);
    
        this.renderer.render(this.scene, this.player.camera);
        this.scene.update && this.scene.update(timeStamp);
        this.player.update && this.player.update(timeStamp);
        window.requestAnimationFrame(this.onAnimationFrameHandler);
    }

    windowResizeHandler = () => {
        const { innerHeight, innerWidth } = window;
        this.renderer.setSize(innerWidth, innerHeight);
        this.player.camera.aspect = innerWidth / innerHeight;
        this.player.camera.updateProjectionMatrix();
    }
}
