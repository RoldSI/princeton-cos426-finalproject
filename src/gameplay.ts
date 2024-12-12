import { WebGLRenderer, Vector3, OrthographicCamera, Scene, Mesh, SphereGeometry, MeshBasicMaterial } from 'three';
import BaseScene from './scenes/Scene';
import Player from './objects/player/player';

export class GamePlay {
    // config params
    movementSpeed: number; // in m/s
    // internal state
    private scene: BaseScene;
    player: Player;
    player_other: Player;
    private renderer: WebGLRenderer;
    private canvas: HTMLCanvasElement;
    private previousTime: DOMHighResTimeStamp;
    private keys: { [key: string]: boolean } = { w: false, a: false, s: false, d: false };

    private minimapCamera: OrthographicCamera;
    private minimapRenderer: WebGLRenderer;
    private minimapScene: Scene;
    private playerDot: Mesh;
    private scoreElement: HTMLElement;

    setupFirstPersonRenderer(): void {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.canvas.style.display = 'block'; // Removes padding below canvas
        document.body.style.margin = '0'; // Removes margin around page
        document.body.style.overflow = 'hidden'; // Fix scrolling
    }

    constructFirstPersonScene(): void {
        this.scene.add(this.player);
        this.scene.add(this.player_other);
    }

    setupMouseControls(): void {
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
    }

    setupKeyboardControls(): void {
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
    }

    handleKeyboardControls(timeStamp: number): void {
        const delta = (timeStamp - this.previousTime) / 1000; // Convert ms to seconds
        this.previousTime = timeStamp;

        const forward = new Vector3(0, 0, -1).applyQuaternion(this.player.quaternion); // Forward direction
        const right = new Vector3(1, 0, 0).applyQuaternion(this.player.quaternion); // Right direction
        const positionUpdate = new Vector3();
        if (this.keys.w) {positionUpdate.add(forward.multiplyScalar(this.movementSpeed * delta))};
        if (this.keys.s) positionUpdate.add(forward.multiplyScalar(-this.movementSpeed * delta));
        if (this.keys.a) positionUpdate.add(right.multiplyScalar(-this.movementSpeed * delta));
        if (this.keys.d) positionUpdate.add(right.multiplyScalar(this.movementSpeed * delta));
        this.player.modifyPosition(positionUpdate);
        this.playerDot.position.set(this.player.position.x, 0, this.player.position.z);
        
       
 
    }

    constructMinimapScene(): void {
        const halfSize = this.scene.getHalfSize();
        this.minimapCamera.left = -halfSize;
        this.minimapCamera.right = halfSize;
        this.minimapCamera.top = halfSize;
        this.minimapCamera.bottom = -halfSize;
        this.minimapCamera.updateProjectionMatrix();

        this.minimapCamera.position.set(0, 20, 0);
        this.minimapCamera.lookAt(0, 0, 0);

        this.minimapScene.add(this.playerDot);
    }

    getPlayerDot(): Mesh {
        return new Mesh(
            new SphereGeometry(this.scene.getHalfSize()/20, 16, 1), // Small size for the dot
            new MeshBasicMaterial({ color: 0xff0000 }) // Red dot for visibility
        );
    }

    setupMinimapRenderer(): void {
        this.minimapRenderer.setSize(200, 200); // Minimap size in pixels
        this.minimapRenderer.domElement.style.position = 'absolute';
        this.minimapRenderer.domElement.style.bottom = '10px'; // Offset from the bottom
        this.minimapRenderer.domElement.style.right = '10px'; // Offset from the right
        this.minimapRenderer.domElement.style.border = '2px solid white';
    }

    constructScoreCounterElement(): void {
        this.scoreElement.style.position = 'absolute';
        this.scoreElement.style.bottom = '220px'; // Position above the minimap
        this.scoreElement.style.right = '10px';
        this.scoreElement.style.color = 'white';
        this.scoreElement.style.fontSize = '18px';
        this.scoreElement.style.fontFamily = 'Arial, sans-serif';
        this.scoreElement.style.textAlign = 'right'; // Align text to the right
    }

    constructor(scene: BaseScene, player: Player, player_other: Player, movementSpeed: number = 3) {
        this.movementSpeed = movementSpeed;
        this.scene = scene;
        this.player = player;
        this.player_other = player_other;
        this.renderer = new WebGLRenderer({ antialias: true });
        this.canvas = this.renderer.domElement;
        this.previousTime = performance.now();
        this.minimapScene = new Scene();
        this.minimapCamera = new OrthographicCamera();
        this.playerDot = this.getPlayerDot();
        this.minimapRenderer = new WebGLRenderer({ antialias: true });
        this.scoreElement = document.createElement('div');

        this.setupFirstPersonRenderer();
        this.constructFirstPersonScene();

        this.setupMouseControls();
        this.setupKeyboardControls();

        this.setupMinimapRenderer();
        this.constructMinimapScene();

        this.constructScoreCounterElement();
    }

    start(): void {
        console.log('Starting game!');

        this.windowResizeHandler();
        window.addEventListener('resize', this.windowResizeHandler, false);
        window.requestAnimationFrame(this.onAnimationFrameHandler);

        document.body.appendChild(this.canvas);
        document.body.appendChild(this.minimapRenderer.domElement);
        document.body.appendChild(this.scoreElement);

        console.log('Game started!');
    }

    stop(): void {
        console.log('Stopping game!');

        document.body.removeChild(this.canvas);
        document.body.removeChild(this.minimapRenderer.domElement);
        document.body.removeChild(this.scoreElement);

        console.log('Game stopped!');
    }

    onAnimationFrameHandler = (timeStamp: number) => {
        let delta = (timeStamp - this.previousTime)/1000;
        this.handleKeyboardControls(timeStamp);
        
        if(this.keys.w){
            this.player.currentAnimation = "WalkForward";
        }
        else if(this.keys.s){
            this.player.currentAnimation = "WalkBack";
        }
        else if(this.keys.a){
            this.player.currentAnimation = "WalkLeft";
        }
        else if(this.keys.d){
            this.player.currentAnimation = "WalkRight";
        }
        else{
            this.player.currentAnimation = "Idle";
        }

        this.player.updateAnimation();
        if(this.player.animationMixer != undefined){
            this.player.animationMixer.update(delta);
        }
        this.player_other.updateAnimation();
        if(this.player_other.animationMixer != undefined){
            this.player_other.animationMixer.update(delta);
        }


        this.renderer.render(this.scene, this.player.camera);
        this.minimapRenderer.render(this.minimapScene, this.minimapCamera);

        this.scoreElement.innerHTML = `Player: ${this.player.score}<br>Opponent: ${this.player_other.publicScore}`;

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
