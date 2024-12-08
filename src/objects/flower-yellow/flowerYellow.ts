import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class FlowerYellow extends Object3D {
    constructor() {
        super();
        
        const loader = new GLTFLoader();
        const modelPath = new URL(`./flower-yellow.glb`, import.meta.url).href;
        loader.load(modelPath, (gltf) => {
            this.add(gltf.scene);
        }, undefined, (error) => {
            console.error(`Failed to load model from ${modelPath}:`, error);
        });
    }
}