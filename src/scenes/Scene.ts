import { Mesh, MeshLambertMaterial, PlaneGeometry, Scene } from 'three';

class BaseScene extends Scene {

    constructor() {
        // Call parent Scene() constructor
        super();
    }

    static generate(): BaseScene {
        console.log('Generating game/scene!');

        const scene: BaseScene = new BaseScene();
        const geometry = new PlaneGeometry(160, 160);
        const material = new MeshLambertMaterial({ color: 0x808080 });
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
        return BaseScene.generate();
    }

    update(_timeStamp: number): void {
        
    }

    getHalfSize(): number {
        return 80;
    }

    getHeight(_x: number, _z: number): number {
        return 0;
    }
}

export default BaseScene;
