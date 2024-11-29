import { Group, SpotLight, Object3D } from 'three';

class BasicFlashlight extends Group {
    constructor() {
        // Invoke parent Group() constructor
        super();

        const flashlight = new SpotLight(0xffffff, 2, 10, Math.PI / 8, 0.3, 1); // Narrower angle, soft edges
        flashlight.position.set(0, 0, 0);
        this.add(flashlight);

        const target = new Object3D();
        target.position.set(0, 0, -1);
        this.add(target);
        flashlight.target = target;
    }
}

export default BasicFlashlight;
