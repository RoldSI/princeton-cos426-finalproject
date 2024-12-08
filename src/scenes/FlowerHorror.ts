import { Mesh, MeshLambertMaterial, PlaneGeometry } from "three";
import BaseScene from "./BaseScene";

export class FlowerHorror extends BaseScene {
    constructor() {
        super();
    }

    static generate(): BaseScene {
        console.log('Generating game/scene!');

        const scene: BaseScene = new BaseScene();
        const geometry = new PlaneGeometry(160, 160);
        const material = new MeshLambertMaterial({ color: 0xff8080 });
        const plane = new Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        scene.world.add(plane);

        console.log('Game/scene generated!');

        return scene;
    }
}