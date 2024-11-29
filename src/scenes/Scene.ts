import { Scene, Color, Vector3 } from 'three';

import Flower from '../objects/Flower';
import Land from '../objects/Land';
import BasicLights from '../lights/BasicLights';

// Define an object type which describes each object in the update list
// type UpdateChild = {
//     // Each object *might* contain an update function
//     update?: (timeStamp: number) => void;
// };

export type PlayerState = {
    position: THREE.Vector3;
    orientation: {
        x: number;
        y: number;
    };
    score: number;
};

class SeedScene extends Scene {
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
        const lights = new BasicLights();
        this.add(land, flower, lights);
    }

    update(_timeStamp: number): void {
        
    }
}

export default SeedScene;
