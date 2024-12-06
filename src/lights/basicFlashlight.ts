import { Group, SpotLight, Object3D, Vector3 } from 'three';

class BasicFlashlight extends Group {
    constructor() {
        super();

        const flashlight = new SpotLight(0xffffff, 2, 10, Math.PI / 8, 0.3, 1); // Narrower angle, soft edges
        flashlight.position.set(0, 0, 0);
        this.add(flashlight);

        const target = new Object3D();
        target.position.set(0, 0, -1);
        this.add(target);
        flashlight.target = target;
    }

    getDistance(): number {
        return 10
    }

    isAligned(direction: Vector3): boolean {
        const angle = new Vector3(0, 0, -1).angleTo(direction);
        if (angle > Math.PI / 8) {
            return false;
        }
        return true;
    }
}

export default BasicFlashlight;
