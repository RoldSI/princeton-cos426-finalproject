import { Mesh, MeshBasicMaterial, PlaneGeometry, Scene } from 'three';

class BaseScene extends Scene {

    constructor() {
        // Call parent Scene() constructor
        super();
    }

    static generate(): BaseScene {
        console.log('Generating game/scene!');

        const scene: BaseScene = new BaseScene();
        const geometry = new PlaneGeometry(20, 20);
        const material = new MeshBasicMaterial({ color: 0x808080 });
        const plane = new Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

        console.log('Game/scene generated!');

        return scene;
    }

    toJSON(): any {
        return {};
    }

    static fromJSON(_json: any): BaseScene {
        return new BaseScene();
    }

    update(_timeStamp: number): void {
        
    }

    getXMin(): number {
        return -10;
    }

    getXMax(): number {
        return 10;
    }

    getZMin(): number {
        return -10;
    }

    getZMax(): number {
        return 10;
    }

    getHeight(_x: number, _z: number): number {
        return 0;
    }
}

export default BaseScene;
