
import { Mesh, MeshLambertMaterial, Object3D, PlaneGeometry} from "three";
import BaseScene from "./BaseScene";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import seedrandom from "seedrandom";




export class Desert extends BaseScene {



    public nocollision:  Object3D[] = [];

    public collision : Object3D[] = [];


    constructor(seed : number) {
        super(seed);
    }

    static generate(seed : number): BaseScene {
        

        const scene: Desert = new Desert(seed);
        const width = scene.getHalfSize()*2;
        const height = scene.getHalfSize()*2;
        const geometry = new PlaneGeometry(width, height);
       

        const material = new MeshLambertMaterial({ color: 0xFFFF00  });
        const plane = new Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;


        scene.world.add(plane);

        const loader = new GLTFLoader();
        const modelPath = new URL(`../objects/NatureModels/desert.gltf`, import.meta.url).href;
        const rng = seedrandom(String(seed));

        loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            // Setup the models in the array
            const cactus1 = model.getObjectByName('cactus1');
            const cactus2 = model.getObjectByName('cactus2');
            const cactus3 = model.getObjectByName('cactus3');
            const cactus4 = model.getObjectByName('cactus4');
            const tree1 = model.getObjectByName('deadTree');
            const tree2 = model.getObjectByName('deadTree2');
            const tree3 = model.getObjectByName('Palm1');
            const tree4 = model.getObjectByName('palm2');
            const stone1 = model.getObjectByName('Stone1');
            //const stone2 = model.getObjectByName('Stone2'); looks odd in game
            const stone3 = model.getObjectByName('Stone3');

            // const small1 = model.getObjectByName('small stone'); doesnt load properly
            const small2 = model.getObjectByName('smallstone2');
            const grass1 = model.getObjectByName('Grass1');
            const grass2 = model.getObjectByName('grass2');
            const flower1 = model.getObjectByName('flower1');
            const flower2 = model.getObjectByName('flower2');
            const flower3 = model.getObjectByName('flower3');

            if(cactus1 && cactus2 && cactus3 && cactus4 && tree1 && tree2 && tree3 && tree4 && stone1 && stone3){
                console.log("check1");
                scene.collision.push(cactus1);
                scene.collision.push(cactus2);
                scene.collision.push(cactus3);
                scene.collision.push(cactus4);
                scene.collision.push(tree1);
                scene.collision.push(tree2);
                scene.collision.push(tree3);
                scene.collision.push(tree4);
                scene.collision.push(stone1);
                scene.collision.push(stone3);


            }

            if( small2 && grass1 && grass2 && flower1 && flower2 && flower3){
                console.log("check2");
                //scene.nocollision.push(small1);
                scene.nocollision.push(small2);
                scene.nocollision.push(grass1);
                scene.nocollision.push(grass2);
                scene.nocollision.push(grass1);
                scene.nocollision.push(grass2); // make grass a bit more likely
                scene.nocollision.push(flower1);
                scene.nocollision.push(flower2);
                scene.nocollision.push(flower3);
            }





            const distNo = 1.5;
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


            

            //Place Objects with collison
            const dist = 5;
            for(let x = - width/2 + dist/2; x <= width/2 - dist/2; x+= dist){
                for(let z = - height/2 + dist/2; z <= height/2 - dist/2; z+= dist){
                    let dx = (rng()*dist - dist/2)*0.8; 
                    let dz =(rng()*dist - dist/2)*0.8; //0.8 to prevent trees from spawning in each other


                    let i = Math.floor(rng()*scene.collision.length);
                    let t = scene.collision[i].clone(); 
                    let r = 2*Math.PI*rng();
                    
                    let posx = x + dx;
                    let posz = z + dz;
                    t.position.set(posx , scene.getHeight(x + dx,z + dz), posz);
                    t.rotateY(r);
                    t.scale.set(4,4,4);
                    scene.world.add(t);
                    if(t.name == "tree3" || t.name == "tree4"){ // Because of coconut collision feels awful otherwise
                        let f = t.clone();
                        f.scale.set(1,1,1)
                        scene.addCollisionObject(f, false);
                        
                    }
                    else{
                        let f = t.clone();
                        f.scale.set(2,2,2)
                        scene.addCollisionObject(f, false);
                    }
                }
            }
            


        });

        



        return scene;
   
   
    

    }


}