
import { Mesh, MeshLambertMaterial, Object3D, PlaneGeometry} from "three";
import BaseScene from "./BaseScene";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import seedrandom from "seedrandom";




export class Winter extends BaseScene {



    public nocollision:  Object3D[] = [];
    public houses : Object3D[] = [];
    public collision : Object3D[] = [];


    constructor(seed : number) {
        super(seed);
    }

    static generate(seed : number): BaseScene {
        

        const scene: Winter = new Winter(seed);
        const width = scene.getHalfSize()*2;
        const height = scene.getHalfSize()*2;
        const geometry = new PlaneGeometry(width, height);
       

        const material = new MeshLambertMaterial({ color: 0xFFFFFF  });
        const plane = new Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;


        scene.world.add(plane);

        const loader = new GLTFLoader();
        const smallStuff = new URL(`../objects/NatureModels/desert.gltf`, import.meta.url).href;
        const modelPath = new URL(`../objects/NatureModels/winter.gltf`, import.meta.url).href;
        const rng = seedrandom(String(seed));

        loader.load(smallStuff, (gltf) => {
            const model = gltf.scene;

            const small2 = model.getObjectByName('smallstone2');
            const grass1 = model.getObjectByName('Grass1');
            const grass2 = model.getObjectByName('grass2');

            if( small2 && grass1 && grass2){
                console.log("check2");
                //scene.nocollision.push(small1);
                scene.nocollision.push(small2);
                
                // Removed grass because it looks better without imo

            }

            const distNo = 2;
            //Place Small objects everywhere
            for(let x = - width/2 + distNo/2; x <= width/2 - distNo/2; x+= distNo){
                for(let z = - height/2 + distNo/2; z <= height/2 - distNo/2; z+= distNo){
                    let dx = rng()*distNo - distNo/2; // ranoom in [-0.2, 0.25]
                    let dz = rng()*distNo - distNo/2; // ranoom in [-0.2, 0.25]

                    let i = Math.floor(rng()*scene.nocollision.length);
                    let r = 2*Math.PI*rng();

                    let g = scene.nocollision[i].clone(); 
                    g.scale.set(3,3,3);
                    let posx = x + dx;
                    let posz = z + dz;
                    g.position.set(posx, scene.getHeight(posx,posz),posz);
                    g.rotateY(r);
                    scene.add(g);

                }
            }

        })
        // Load winter stuff 
        loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            // Setup the models in the array
            const leaf1 = model.getObjectByName('leaf1');
            const leaf2 = model.getObjectByName('leaf2');
            const leaf3 = model.getObjectByName('leaf3');
            const leaf4 = model.getObjectByName('leaf4');
            const leaf5 = model.getObjectByName('leaf5');
            const pine1 = model.getObjectByName('pine1');
            const pine2 = model.getObjectByName('pine2');
            const pine3 = model.getObjectByName('pine3');
            const tree1 = model.getObjectByName('tree1');
            const tree2 = model.getObjectByName('tree2');
            const tree3 = model.getObjectByName('tree3');
            const tree4 = model.getObjectByName('tree4');
            const rock1= model.getObjectByName('rock1');
            const rock2 = model.getObjectByName('rock2');

            if(leaf1 && leaf2 && leaf3 && leaf4 && leaf5 && pine1 && pine2 && pine3 && tree1 && tree2 && tree3 && tree4 && rock1 && rock2){
                scene.collision.push(leaf1);
                scene.collision.push(leaf2);
                scene.collision.push(leaf3);
                scene.collision.push(leaf4);
                scene.collision.push(leaf5);
                scene.collision.push(pine1);
                scene.collision.push(pine2);
                scene.collision.push(pine3);
                scene.collision.push(tree1);
                scene.collision.push(tree2);
                scene.collision.push(tree3);
                scene.collision.push(tree4);
                scene.collision.push(rock1);
                scene.collision.push(rock2);

            }

            const house1 = model.getObjectByName('House1');
            const house2 = model.getObjectByName('House2');
            const house3 = model.getObjectByName('House3');

            if(house1 && house2 && house3){
                console.log("test");
                scene.houses.push(house1);
                scene.houses.push(house2);
                scene.houses.push(house3);
            }

                     

            //Place Objects with collison
            const dist = 6;
            for(let x = - width/2 + dist/2; x <= width/2 - dist/2; x+= dist){
                for(let z = - height/2 + dist/2; z <= height/2 - dist/2; z+= dist){
                    let dx = (rng()*dist - dist/2)*0.8; 
                    let dz =(rng()*dist - dist/2)*0.8; //0.8 to prevent trees from spawning in each other

                    if(rng() < 0.1){ // spawn a house with low probability
                        let i = Math.floor(rng()*scene.houses.length);
                        let t = scene.houses[i].clone(); 
                        let r = 2*Math.PI*rng();
                        let posx = x + dx;
                        let posz = z + dz;
                        t.position.set(posx , scene.getHeight(x + dx,z + dz) - 1,  posz);
                        t.rotateY(r);
                        t.scale.set(8,8,8);
                        scene.add(t);
                        scene.addCollisionObject(t);
                    }
                    else{
                        let i = Math.floor(rng()*scene.collision.length);
                        let t = scene.collision[i].clone(); 
                        let r = 2*Math.PI*rng();
                        
                        let posx = x + dx;
                        let posz = z + dz;
                        t.position.set(posx , scene.getHeight(x + dx,z + dz), posz);
                        t.rotateY(r);
                        t.scale.set(11,11,11);
                        scene.add(t);
                        let f = t.clone();
                        
                        f.scale.set(8,8,8);
                        if(f.name.includes('leaf')){
                            f.scale.set(2,2,2);
                        }
                        scene.addCollisionObject(f, false);
                        
                    }

                }
            }
            


        });

        



        return scene;
   
   
    

    }

    


}