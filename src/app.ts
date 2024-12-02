/**
 * app.ts
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { Connectivity } from './connectivity/connectivity';
import { SplashScreen } from './menu';
import { GamePlay } from './gameplay';
import StateMachine, { StateMap } from './utilities/statemachine';
import Player from './objects/player/player';
import BaseScene from './scenes/Scene';

// global state
export const connectivity = new Connectivity();
export const splashScreen = new SplashScreen();
export const globalState: {
    playerType: 'A' | 'B' | undefined;
    startOther: boolean;
    scene: BaseScene | undefined;
    gamePlay: GamePlay | undefined;
} = {
    playerType: undefined,
    startOther: false,
    scene: undefined,
    gamePlay: undefined
};

const States: StateMap = {
    SPLASHSCREEN: {
        enter() {
            console.log("Entering Splashscreen");
            splashScreen.show();
        },
        update() {
            console.log("Updating state if necessary");
            if (globalState.playerType == 'A') {
                gameStateMachine.changeState("A_INIT");
            } else if (globalState.playerType == 'B') {
                gameStateMachine.changeState("B_INIT");
            }
        },
        exit() {
            console.log("Exiting Splashscreen");
            splashScreen.hide();
        }
    },
    A_INIT: {
        enter() {
            console.log("Entering A_INIT");
            // generate players
            const playerA = new Player();
            const playerB = new Player();
            // generate scene
            const scene = BaseScene.generate();
            globalState.scene = scene;
            // send
            connectivity.sendData({
                type: 'init',
                content: {
                    playerA: playerA.toJSON(),
                    playerB: playerB.toJSON(),
                    scene: scene.toJSON()
                }
            });
            connectivity.sendData({
                type: 'start'
            });
            // gameplay
            globalState.gamePlay = new GamePlay(scene, playerA, playerB);
        },
        update() {
            console.log("Updating state if necessary");
            if (globalState.startOther) {
                gameStateMachine.changeState("GAMEPLAY");
            }
        },
        exit() {
            console.log("Exiting A_INIT");
        }
    },
    B_INIT: {
        enter() {
            console.log("Entering B_INIT");
        },
        update() {
            console.log("Updating state if necessary");
            if (globalState.gamePlay != undefined) {
                connectivity.sendData({
                    type: 'start'
                });
                if (globalState.startOther) {
                    gameStateMachine.changeState("GAMEPLAY");
                }
            }
        },
        exit() {
            console.log("Exiting B_INIT");
        }
    },
    GAMEPLAY: {
        enter() {
            console.log("Entering Gameplay");
            globalState.gamePlay!.start();
        },
        update() {
            console.log("Updating state if necessary");
        },
        exit() {
            console.log("Exiting Gameplay");
            globalState.gamePlay!.stop();
        }
    },
    WIN: {
        enter() {
            console.log("Entering win");
        },
        update() {
            console.log("Updating state if necessary");
        },
        exit() {
            console.log("Exiting win");
        }
    },
    LOSE: {
        enter() {
            console.log("Entering lose");
        },
        update() {
            console.log("Updating state if necessary");
        },
        exit() {
            console.log("Exiting lose");
        }
    }
};
export const gameStateMachine = new StateMachine(States);
gameStateMachine.changeState("SPLASHSCREEN");
