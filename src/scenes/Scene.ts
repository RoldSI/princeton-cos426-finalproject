import { Scene } from 'three';

import Flower from '../objects/flower/Flower';
import Land from '../objects/land/Land';

class BaseScene extends Scene {

    constructor() {
        // Call parent Scene() constructor
        super();

        // Add meshes to scene
        const land = new Land();
        const flower = new Flower();
        this.add(land, flower);
    }

    static generate(): BaseScene {
        console.log('Generating game/scene!');

        const scene: BaseScene = new BaseScene();

        console.log('Game/scene generated!');

        return scene;
    }

    toJSON(): any {
        return {};
    }

    static fromJSON(_json: any): BaseScene {
        return new BaseScene();
    }

    update(_timeStamp: number): void {
        
    }

    getXMin(): number {
        return -10;
    }

    getXMax(): number {
        return 10;
    }

    getZMin(): number {
        return -10;
    }

    getZMax(): number {
        return 10;
    }

    getHeight(_x: number, _z: number): number {
        return 0;
    }
}

export default BaseScene;
