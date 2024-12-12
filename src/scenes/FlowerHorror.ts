import { Mesh, MeshLambertMaterial, PlaneGeometry } from "three";
import BaseScene from "./BaseScene";
import FlowerYellow from "../objects/flower-yellow/flowerYellow";

export class FlowerHorror extends BaseScene {
    flowers: Array<{ x: number; z: number }>;

    constructor(seed : number) {
        super(seed);
        this.flowers = [];
    }

    static generate(seed : number): FlowerHorror {
        console.log('Generating FlowerHorror game/scene!');

        const scene: FlowerHorror = new FlowerHorror(seed);
        const geometry = new PlaneGeometry(scene.getHalfSize()*2, scene.getHalfSize()*2);
        const material = new MeshLambertMaterial({ color: 0xff8080 });
        const plane = new Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        scene.world.add(plane);

        for (let i = 0; i < 10; i++) { // Adjust number of flowers as needed
            const x = Math.random() * 2 * scene.getHalfSize() - scene.getHalfSize();
            const z = Math.random() * 2 * scene.getHalfSize() - scene.getHalfSize();
            const flower = new FlowerYellow();
            flower.position.set(x, 0, z); // Importnat currently disabled for debugging
            scene.world.add(flower);
            scene.addCollisionObject(flower);
            scene.flowers.push({ x, z });
        }

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