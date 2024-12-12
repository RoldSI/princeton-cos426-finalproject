
import { Mesh, MeshLambertMaterial, PlaneGeometry } from "three";
import BaseScene from "./BaseScene";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Nature 
/*
    - pcone 4,5,6,7, 16, 17, 18, 19 are "Grass"
    - pcone 13, 14, 15,  are "Pine Trees"
    - pcone 21, 22, 23 are "Regualr trees"
    - psolid 1,2,3,4 are "Stones "
    - psphere 5,6 are "Stones (Giant)"
*/


export class Forest extends BaseScene {


    constructor(seed : number) {
        super(seed);
    }

    static generate(seed : number): BaseScene {
        console.log('Generating game/scene!');

        const scene: BaseScene = new BaseScene(seed);
        const width = scene.getHalfSize()*2;
        const height = scene.getHalfSize()*2;
        const geometry = new PlaneGeometry(width, height, 100, 100); // 100 determines the detail of height maps 
       
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


}