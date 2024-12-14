import { Mesh, MeshLambertMaterial, PlaneGeometry } from "three";
import BaseScene from "./BaseScene";
import FlowerYellow from "../objects/flower-yellow/flowerYellow";
import seedrandom from "seedrandom";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class FlowerHorror extends BaseScene {
    flowers: Array<{ x: number; z: number }>;
    grass : Mesh[] = [];
    constructor(seed : number) {
        super(seed);
        this.flowers = [];
    }

    static generate(seed : number): FlowerHorror {
        console.log('Generating FlowerHorror game/scene!');

        const scene: FlowerHorror = new FlowerHorror(seed);
        const geometry = new PlaneGeometry(scene.getHalfSize()*2, scene.getHalfSize()*2);
        const material = new MeshLambertMaterial({ color: 0x00ff00 });
        const plane = new Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        scene.world.add(plane);
        const rng = seedrandom(String(seed));

        for (let i = 0; i < 20; i++) { // Adjust number of flowers as needed
            const x = rng() * 2 * scene.getHalfSize() - scene.getHalfSize();
            const z = rng()* 2 * scene.getHalfSize() - scene.getHalfSize();
            const flower = new FlowerYellow();
            const r = rng()*Math.PI*2;
            flower.position.set(x, 0, z); // Important currently disabled for debugging
            flower.rotateY(r);
            scene.world.add(flower);
            scene.addCollisionObject(flower);
            scene.flowers.push({ x, z });
        }

        // We reuse the grass from the forest
        const loader = new GLTFLoader();
        const modelPath = new URL(`/NatureModels/nature2.gltf`, import.meta.url).href;
        
        loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            // Setup the models in the array
            model.traverse((child) => {
                // Check if the child is an instance of THREE.Mesh
                if (child instanceof Mesh) {
                    

                    if(child.name.includes("grass")){
                        scene.grass.push(child)
                    }

                }
            });
            const width = 2*scene.getHalfSize();
            const height = 2*scene.getHalfSize();

            const distGrass = 0.5;
            //Place Grass everywhere
            for(let x = - width/2 + distGrass/2; x <= width/2 - distGrass/2; x+= distGrass){
                for(let z = - height/2 + distGrass/2; z <= height/2 - distGrass/2; z+= distGrass){
                    let dx = rng()*distGrass - distGrass/2; // ranoom in [-0.2, 0.25]
                    let dz = rng()*distGrass - distGrass/2; // ranoom in [-0.2, 0.25]

                    let i = Math.floor(rng()*scene.grass.length);
                    let r = 2*Math.PI*rng();

                    let g = scene.grass[i].clone(); 
                    g.scale.set(0.5,0.5,0.5);
                    let posx = x + dx;
                    let posz = z + dz;
                    g.position.set(posx, scene.getHeight(posx,posz),posz);
                    g.rotateY(r);
                    scene.add(g);

                }
            }
        });

        console.log('FlowerHorro game/scene generated!');

        return scene;
    }

    toJSON(): any {
        return {
            flowers: this.flowers,
        };
    }

    static fromJSON(json: any): FlowerHorror {
        const scene = this.generate(json.seed);
        scene.flowers = json.flowers;

        scene.flowers.forEach(({ x, z }) => {
            const flower = new FlowerYellow();
            flower.position.set(x, 0, z);
            scene.world.add(flower);
            scene.addCollisionObject(flower);
        });

        return scene;
    }

    getHalfSize(): number {
        return 15;
    }

    getHeight(_x: number, _y: number): number {
        return 0;
    }
}