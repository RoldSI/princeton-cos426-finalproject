import {Forest} from "./ForestScene";
import { Mesh, MeshLambertMaterial,  PlaneGeometry} from "three";
import BaseScene from "./BaseScene";



export class Terrain extends Forest{
    static generate(seed : number): BaseScene {
        

        const scene: Forest = new Forest(seed);
        const width = scene.getHalfSize() * 2;
        const height = scene.getHalfSize() * 2;
        const geometry = new PlaneGeometry(width, height, 100, 100); // Increased segments for smoothness
        const material = new MeshLambertMaterial({ color: 0xFFFFFF});
        const plane = new Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        
        const positions = geometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
        
            // Sample Perlin noise based on the x and z positions
            const noiseValue = scene.perlin.noise(x / 50, z / 50);  // Adjust frequency (50) for smoother hills
        
            // Set the height (y) value based on the noise value
            positions.setZ(i, noiseValue * 5);  // Adjust the scale of the height (5 is an example)
        }
        
        // Mark the position attribute as needing an update
        positions.needsUpdate = true;
        

        scene.world.add(plane);

        return scene;
    }

    getHeight(_x: number, _z: number): number {
        return 0;
    }
} 