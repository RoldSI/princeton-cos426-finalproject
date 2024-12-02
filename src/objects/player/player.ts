import { Group, PerspectiveCamera, AudioListener } from 'three';
import BasicFlashlight from '../../lights/basicFlashlight';
import { globalState } from '../../app';

class Player extends Group {
    camera: PerspectiveCamera;
    audioListener: AudioListener;
    score: number;

    constructor(_xPosition: number = 0, _zPosition: number = 0) {
        super();

        this.camera = new PerspectiveCamera();
        this.camera.rotation.order = 'YXZ';
        this.camera.position.set(0, 1.8, 0);
        this.add(this.camera);

        const flashlight = new BasicFlashlight();
        this.camera.add(flashlight);

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

    getPosition(): { x: number; y: number; z: number } {
        return {
            x: this.position.x,
            y: this.position.y + 1.8,
            z: this.position.z
        };
    }

    setPosition(x: number, z: number): void {
        this.position.set(x, globalState.scene!.getHeight(x, z), z);
    }

    getOrientation(): { x: number; y: number } {
        return {
            x: this.camera.rotation.x,
            y: this.rotation.y
        };
    }

    modifyOrientation(x: number, y: number): void {
        this.rotation.y += y;
        this.camera.rotation.x += x;
        this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x))
    }
}

export default Player;
