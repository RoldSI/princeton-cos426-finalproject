import { Scene, Color, Vector3 } from 'three';

import Flower from '../objects/flower/Flower';
import Land from '../objects/land/Land';

export type PlayerState = {
    position: THREE.Vector3;
    orientation: {
        x: number;
        y: number;
    };
    score: number;
};

class BaseScene extends Scene {
    // Define the type of the state field
    player_me: PlayerState;
    player_other: PlayerState | undefined;
    world: undefined | {
        ground_color: string;
    };

    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.player_me = {
            position: new Vector3(0, 0, 0),
            orientation: {
                x: 0,
                y: 0
            },
            score: 0
        };
        this.player_other = undefined;
        this.world = undefined;

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const land = new Land();
        const flower = new Flower();
        this.add(land, flower);
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
