import { Group, Mesh, MeshLambertMaterial, PlaneGeometry, Scene } from 'three';

class BaseScene extends Scene {
    world: Group;

    constructor() {
        // Call parent Scene() constructor
        super();
        this.world = new Group();
        this.add(this.world);
    }

    static generate(): BaseScene {
        console.log('Generating game/scene!');

        const scene: BaseScene = new BaseScene();
        const geometry = new PlaneGeometry(160, 160);
        const material = new MeshLambertMaterial({ color: 0x808080 });
        const plane = new Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        scene.world.add(plane);

        console.log('Game/scene generated!');

        return scene;
    }

    getStartPositions(): [ { x: number, z: number }, { x: number, z: number } ] {
        return [
            { x: 0, z: 0 },
            { x: 0, z: 0 }
        ];
        function getRand(x: number): number {
            return Math.random() * (x - x / 2) + x / 2;
        }
        const x = this.getHalfSize();
        return [
            { x: getRand(x), z: getRand(x) },
            { x: -getRand(x), z: -getRand(x) }
        ];
    }

    toJSON(): any {
        return {};
    }

    static fromJSON(_json: any): BaseScene {
        return this.generate();
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
