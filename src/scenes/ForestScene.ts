
import { Mesh, MeshLambertMaterial, Object3D, PlaneGeometry } from "three";
import BaseScene from "./BaseScene";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import seedrandom from "seedrandom";



// Nature 
/*
    - pcone 4,5,6,7, 16, 17, 18, 19 are "Grass"
    - pcone 13, 14, 15,  are "Pine Trees"
    - pcone 21, 22, 23 are "Regualr trees"
    - psolid 1,2,3,4 are "Stones "
    - psphere 5,6 are "Stones (Giant)"
*/


export class Forest extends BaseScene {


    public grass : Mesh[] = [];
    public trees : Object3D[] = [];

    constructor(seed : number) {
        super(seed);
    }

    static generate(seed : number): BaseScene {
        console.log('Generating game/scene!');

        const scene: Forest = new Forest(seed);
        const width = scene.getHalfSize()*2;
        const height = scene.getHalfSize()*2;
        const geometry = new PlaneGeometry(width, height);
       

        const material = new MeshLambertMaterial({ color: 0x6d712e });
        const plane = new Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;


        scene.world.add(plane);

        const loader = new GLTFLoader();
        const modelPath = new URL(`../objects/NatureModels/nature.gltf`, import.meta.url).href;
        const rng = seedrandom(String(seed));

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

            const tree1 = model.getObjectByName('tree1');
            const tree2 = model.getObjectByName('tree2');
            const tree3 = model.getObjectByName('tree3');
            const pine1 = model.getObjectByName('pine1');
            const pine2 = model.getObjectByName('pine2');
            const pine3 = model.getObjectByName('pine3');
            
            if(tree1 && tree2 && tree3 && pine1 && pine2 && pine3){
                scene.trees.push(tree1);
                scene.trees.push(tree2);
                scene.trees.push(tree3);
                scene.trees.push(pine1);
                scene.trees.push(pine2);
                scene.trees.push(pine3);
            }

            const distGrass = 0.5;
            //Place Grass everywhere
            for(let x = - width/2 + distGrass/2; x < width/2 - distGrass/2; x+= distGrass){
                for(let z = - height/2 + distGrass/2; z < height/2 - distGrass/2; z+= distGrass){
                    let dx = rng()*distGrass - distGrass/2; // ranoom in [-0.2, 0.25]
                    let dz = rng()*distGrass - distGrass/2; // ranoom in [-0.2, 0.25]

                    let i = Math.floor(rng()*scene.grass.length);

                    let g = scene.grass[i].clone(); 
                    g.scale.set(0.2,0.2,0.2);
                    g.position.set(x + dx - 2.5, scene.getHeight(x + dx,z + dz) - 1.25, z + dz + 2.5);
                    console.log("test-a");
                    scene.add(g);

                }
            }
            
            //Place Trees everywhere
            const distTrees = 3;
            for(let x = - width/2 + distTrees/2; x < width/2 - distTrees/2; x+= distTrees){
                for(let z = - height/2 + distTrees/2; z < height/2 - distTrees/2; z+= distTrees){
                    let dx = (rng()*distTrees - distTrees/2)*0.8; 
                    let dz =(rng()*distTrees - distTrees/2)*0.8; //0.8 to prevent trees from spawning in each other

                    let i = Math.floor(rng()*scene.trees.length);

                    let t = scene.trees[i].clone(); 
                    
                    t.scale.set(0.2,0.2,0.2);
                    t.position.set(x + dx -2.5, scene.getHeight(x + dx,z + dz), z + dz + 2.5);
                    console.log("test-b");
                    scene.add(t);

                }
            }
            


        });

        

        console.log('Game/scene generated!');

        return scene;
   
   
    

    }


}