import { Group, Mesh, MeshLambertMaterial, Object3D, PlaneGeometry, Scene } from 'three';
import PerlinNoise from '../utilities/perlin_noise';



class BaseScene extends Scene {
    world: Group;
    collisionObjects: Object3D[];
    public perlin : PerlinNoise;
    seed : number;
    
    constructor(seed : number) {
        super();
        console.log("Scene :" , seed);
        this.world = new Group();
        this.collisionObjects = [];
        this.add(this.world);
        this.seed = seed;
        this.perlin = new PerlinNoise(this.seed);
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

    static generate(seed : number): BaseScene {
        console.log('Generating game/scene!');

        const scene: BaseScene = new BaseScene(seed);
        const width = scene.getHalfSize()*2;
        const height = scene.getHalfSize()*2;
        const geometry = new PlaneGeometry(width, height); // 100 determines the detail of height maps 
       /*
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            const x = i % geometry.parameters.widthSegments;
            const y = Math.floor(i / geometry.parameters.widthSegments);
    
            // Map the vertex (x, y) position to a noise value
            const noiseValue = scene.perlin.noise(x / hillSpacing, y / hillSpacing); // Scale the inputs for better results
            const heightValue = noiseValue; // Scale the noise output to control height variation
    
            // Update the Z position of the vertex (which ends up being the "height") (height of the terrain)
            geometry.attributes.position.setZ(i, heightValue*hillHeight);
        }
        */
        const material = new MeshLambertMaterial({ color: 0x00ff00 });
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
        return {seed : this.seed};
    }

    static fromJSON(_json: any): BaseScene {
        return this.generate(_json.seed);
    }

    update(_timeStamp: number): void {
        
    }

    getHalfSize(): number {
        return 15;
    }

    getHeight(_x: number, _z: number): number { // since the plane is rotated the "height is actually 
        // Now rotating around -pi/2 means player


       
        return 0;
    }
}

export default BaseScene;
