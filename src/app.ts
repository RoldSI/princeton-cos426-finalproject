/**
 * app.ts
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { Connectivity } from './connectivity/connectivity';
import { SplashScreen } from './splashscreen';
import { GamePlay } from './gameplay';
import StateMachine, { StateMap } from './utilities/statemachine';
import Player from './objects/player/player';
import BaseScene from './scenes/Scene';
import { LosingScreen, WinningScreen } from './endscreen';

// global state
export const connectivity = new Connectivity();
export const splashScreen = new SplashScreen();
export const winningScreen = new WinningScreen();
export const losingScreen = new LosingScreen();
export const globalState: {
    playerType: 'A' | 'B' | undefined;
    startOther: boolean;
    endOther: boolean;
    scene: BaseScene | undefined;
    gamePlay: GamePlay | undefined;
} = {
    playerType: undefined,
    startOther: false,
    endOther: false,
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
            globalState.playerType = undefined;
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
            globalState.startOther = false;
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
            globalState.startOther = false;
        }
    },
    GAMEPLAY: {
        enter() {
            console.log("Entering Gameplay");
            globalState.gamePlay!.start();
        },
        update() {
            console.log("Updating gameplay state if necessary");
            if(globalState.endOther) {
                gameStateMachine.changeState("SETTLING");
            }
        },
        exit() {
            console.log("Exiting Gameplay");
            globalState.gamePlay!.stop();
        }
    },
    SETTLING: {
        enter() {
            console.log("Entering Settling");
            connectivity.sendData({
                type: 'end',
                content: globalState.gamePlay!.player.toJSON()
            });
            gameStateMachine.update();
        },
        update() {
            console.log("Updating settling state if necessary");
            console.log(globalState.endOther);
            if (globalState.endOther) {
                if (globalState.gamePlay!.player.score >= globalState.gamePlay!.player_other.score) {
                    gameStateMachine.changeState("WIN");
                } else {
                    gameStateMachine.changeState("LOSE");
                }
            }
        },
        exit() {
            console.log("Exiting Settling");
            globalState.gamePlay = undefined;
            globalState.endOther = false;
            globalState.scene = undefined;
        }
    },
    WIN: {
        enter() {
            console.log("Entering win");
            winningScreen.show();
        },
        update() {
            console.log("Updating state if necessary");
        },
        exit() {
            console.log("Exiting win");
            winningScreen.hide();
        }
    },
    LOSE: {
        enter() {
            console.log("Entering lose");
            losingScreen.show();
        },
        update() {
            console.log("Updating state if necessary");
        },
        exit() {
            console.log("Exiting lose");
            losingScreen.hide();
        }
    }
};
export const gameStateMachine = new StateMachine(States);
gameStateMachine.changeState("SPLASHSCREEN");
