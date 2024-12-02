import { Group, PerspectiveCamera } from 'three';
import BasicFlashlight from '../../lights/basicFlashlight';

class Player extends Group {
    camera: PerspectiveCamera;

    constructor() {
        super();

        this.camera = new PerspectiveCamera();
        this.camera.rotation.order = 'YXZ';
        this.camera.position.set(0, 1.8, 0);
        this.add(this.camera);

        const flashlight = new BasicFlashlight();
        this.camera.add(flashlight);
    }
}

export default Player;
