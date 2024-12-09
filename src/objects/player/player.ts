import { Group, PerspectiveCamera, AudioListener, Object3D, Vector3, Raycaster, Box3 } from 'three';
import BasicFlashlight from '../../lights/basicFlashlight';
import { connectivity, gameStateMachine, globalState } from '../../app';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Player extends Group {
    camera: PerspectiveCamera;
    head: Object3D;
    audioListener: AudioListener;
    score: number;
    previousScore: number;
    publicScore: number;
    seeing: boolean;
    lastUpdate: number = 0;
    flashlight: BasicFlashlight;

    constructor(pos: {x: number, z: number}, character: string = 'flower-blue') {
        super();

        const loader = new GLTFLoader();
        const modelPath = new URL(`../${character}/${character}.glb`, import.meta.url).href;
        loader.load(modelPath, (gltf) => {
            this.add(gltf.scene);
        }, undefined, (error) => {
            console.error(`Failed to load model from ${modelPath}:`, error);
        });

        this.head = new Object3D();
        this.head.rotation.order = 'YXZ';
        this.head.position.set(0, 1.8, 0);
        this.add(this.head);

        this.camera = new PerspectiveCamera();
        this.head.add(this.camera);

        const flashlight = new BasicFlashlight();
        this.flashlight = flashlight;
        this.head.add(flashlight);

        this.audioListener = new AudioListener();
        this.camera.add(this.audioListener);

        this.score = 0;
        this.previousScore = this.score;
        this.publicScore = this.score;
        this.seeing = false;

        this.setPosition(pos.x, pos.z);
    }

    toJSON(): any {
        return {
            position: this.getPosition(),
            orientation: this.getOrientation(),
            score: this.score,
            publicScore: this.publicScore,
            seeing: this.seeing
        };
    }

    static fromJSON(json: any): Player {
        const player = new Player({x: json.position.x, z: json.position.z});
        player.updateFromJSON(json);
        return player;
    }

    updateFromJSON(json: any): void {
        this.setPosition(json.position.x, json.position.z);
        this.setOrientation(json.orientation.x, json.orientation.y);
        this.score = json.score;
        this.publicScore = json.publicScore;
        this.seeing = json.seeing;
    }

    sendPlayerData(timeStamp: number): void {
        const interval = 100;
        if (timeStamp - this.lastUpdate > interval) {
            connectivity.sendData({
                type: 'player',
                content: this.toJSON()
            });
        }
    }

    updateScore(_timeStamp: number): void {
        const sourcePosition = new Vector3();
        this.head.getWorldPosition(sourcePosition);

        const targetPosition = new Vector3();
        globalState.gamePlay!.player_other.head.getWorldPosition(targetPosition);

        const distance = sourcePosition.distanceTo(targetPosition);

        if (distance > this.flashlight.getDistance()) {
            this.seeing = false;
            return;
        }

        const direction = new Vector3().subVectors(targetPosition, sourcePosition).normalize();

        const localizedDirection = direction.clone();
        localizedDirection.add(sourcePosition);
        this.head.worldToLocal(localizedDirection);
        localizedDirection.normalize();
        if(!this.flashlight.isAligned(localizedDirection)) {
            this.seeing = false;
            return;
        }

        const raycaster = new Raycaster();
        raycaster.set(sourcePosition, direction);
        raycaster.far = distance;
        raycaster.near = 0.1;

        const intersections = raycaster.intersectObjects(globalState.scene!.world.children, true);
        if(intersections.length > 0) {
            this.seeing = false;
            return;
        }

        this.seeing = true;
        this.score += 1;
    }

    updatePublicScore(_timeStamp: number): void {
        if (this.previousScore == this.score) {
            this.publicScore = this.score;
        }
        this.previousScore = this.score;
    }

    checkWon(): void {
        if(this.score >= 1000)
            gameStateMachine.changeState("SETTLING")
    }

    reposition(): void {
        if(this.seeing && globalState.gamePlay!.player_other.seeing) {
            const half = globalState.scene!.getHalfSize();
            const x = Math.random() * (half*2) - half;
            const z = Math.random() * (half*2) - half;
            this.setPosition(x, z);
        }
    }

    update(timeStamp: number): void {
        this.sendPlayerData(timeStamp);

        this.updateScore(timeStamp);
        this.updatePublicScore(timeStamp);

        this.checkWon();
        this.reposition();
    }

    getPosition(): { x: number; y: number; z: number } {
        return {
            x: this.position.x,
            y: this.position.y,
            z: this.position.z
        };
    }

    modifyPosition(direction: Vector3): void {
        this.setPosition(this.position.x + direction.x, this.position.z + direction.z);
    }

    setPosition(x: number, z: number): void {
        const halfSize = globalState.scene!.getHalfSize();
        const x_restircted = Math.max(-halfSize, Math.min(halfSize, x));
        const z_restircted = Math.max(-halfSize, Math.min(halfSize, z));
        // verify collisions before proceeding
        if (!this.isColliding(new Vector3(x_restircted, globalState.scene!.getHeight(x_restircted, z_restircted), z_restircted))) {
            this.position.set(x_restircted, globalState.scene!.getHeight(x_restircted, z_restircted), z_restircted);
        }
    }

    private isColliding(newPosition: Vector3): boolean {
        // Create a bounding box for the player at the new position
        const playerBox = new Box3().setFromObject(this);
        playerBox.translate(newPosition.sub(this.position)); // Adjust bounding box to new position
    
        // Check against all objects in the scene
        for (const object of globalState.scene!.collisionObjects) {
            const objectBox = new Box3().setFromObject(object);
            if (playerBox.intersectsBox(objectBox)) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }

    getOrientation(): { x: number; y: number } {
        return {
            x: this.head.rotation.x,
            y: this.rotation.y
        };
    }

    modifyOrientation(x: number, y: number): void {
        this.rotation.y += y;
        this.head.rotation.x += x;
        this.head.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.head.rotation.x))
    }

    setOrientation(x: number, y: number): void {
        this.rotation.y = y;
        this.head.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, x))
    }
}

export default Player;
