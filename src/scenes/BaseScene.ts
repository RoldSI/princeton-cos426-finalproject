import { Group, Mesh, MeshLambertMaterial, Object3D, PlaneGeometry, Scene } from 'three';

class BaseScene extends Scene {
    world: Group;
    collisionObjects: Object3D[];

    constructor() {
        super();
        this.world = new Group();
        this.collisionObjects = [];
        this.add(this.world);
    }

    addCollisionObject(object: Object3D): void {
        this.collisionObjects.push(object);
        this.world.add(object);
    }

    removeCollisionObject(object: Object3D): void {
        const index = this.collisionObjects.indexOf(object);
        if (index > -1) {
            this.collisionObjects.splice(index, 1);
        }
    }

    static generate(): BaseScene {
        console.log('Generating game/scene!');

        const scene: BaseScene = new BaseScene();
        const geometry = new PlaneGeometry(scene.getHalfSize()*2, scene.getHalfSize()*2);
        const material = new MeshLambertMaterial({ color: 0x808080 });
        const plane = new Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        scene.world.add(plane);

        console.log('Game/scene generated!');

        return scene;
    }

    getStartPositions(): [ { x: number, z: number }, { x: number, z: number } ] {
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
        return 15;
    }

    getHeight(_x: number, _z: number): number {
        return 0;
    }
}

export default BaseScene;
