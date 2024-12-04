import { Group, PerspectiveCamera, AudioListener, Object3D, Vector3 } from 'three';
import BasicFlashlight from '../../lights/basicFlashlight';
import { connectivity, globalState } from '../../app';

import MODEL from './player.gltf?url';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Player extends Group {
    camera: PerspectiveCamera;
    head: Object3D;
    audioListener: AudioListener;
    score: number;
    lastUpdate: number = 0;

    constructor(_xPosition: number = 0, _zPosition: number = 0) {
        super();

        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        this.head = new Object3D();
        this.head.rotation.order = 'YXZ';
        this.head.position.set(0, 1.8, 0);
        this.add(this.head);

        this.camera = new PerspectiveCamera();
        this.head.add(this.camera);

        const flashlight = new BasicFlashlight();
        this.head.add(flashlight);

        this.audioListener = new AudioListener();
        this.camera.add(this.audioListener);

        this.score = 0;
    }

    toJSON(): any {
        return {
            position: this.getPosition(),
            orientation: this.getOrientation(),
            score: this.score
        };
    }

    static fromJSON(json: any): Player {
        const player = new Player();
        player.setPosition(json.position.x, json.position.z);
        player.modifyOrientation(json.orientation.x, json.orientation.y);
        player.score = json.score;
        return player;
    }

    updateFromJSON(json: any): void {
        this.setPosition(json.position.x, json.position.z);
        this.setOrientation(json.orientation.x, json.orientation.y);
        this.score = json.score;
    }

    update(timeStamp: number): void {
        const interval = 100;
        if (timeStamp - this.lastUpdate > interval) {
            connectivity.sendData({
                type: 'player',
                content: this.toJSON()
            });
        }
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
        // this.position.add(direction);
        // this.position.y = globalState.scene!.getHeight(this.position.x, this.position.z);
    }

    setPosition(x: number, z: number): void {
        const x_restircted = Math.max(globalState.scene!.getXMin(), Math.min(globalState.scene!.getXMax(), x));
        const z_restircted = Math.max(globalState.scene!.getZMin(), Math.min(globalState.scene!.getZMax(), z));
        this.position.set(x_restircted, globalState.scene!.getHeight(x_restircted, z_restircted), z_restircted);
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
