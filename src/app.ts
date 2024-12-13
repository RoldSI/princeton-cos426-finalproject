/**
 * app.ts
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { Connectivity } from './connectivity/connectivity';
import { SplashScreen } from './screens/splashscreen';
import { GamePlay } from './gameplay';
import StateMachine, { StateMap } from './utilities/statemachine';
import Player from './objects/player/player';
import BaseScene from './scenes/BaseScene';
import { LosingScreen, WinningScreen } from './screens/endscreen';
import { WaitScreen } from './screens/waitscreen';
import { SceneSelectionScreen } from './screens/sceneselectionscreen';
import { FlowerHorror } from './scenes/FlowerHorror';
import { Forest } from './scenes/ForestScene';

export const sceneMap: Map<string, typeof BaseScene> = new Map<string, typeof BaseScene>([
    ['Base Scene', BaseScene],
    ['Flower Horror', FlowerHorror],
    ['Forest', Forest]
]);
// global state
export const connectivity = new Connectivity();
export const splashScreen = new SplashScreen();
export const sceneSelectionScreen = new SceneSelectionScreen();
export const waitScreen = new WaitScreen();
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
            sceneSelectionScreen.show();
        },
        update() {
            console.log("Updating state if necessary");
            if (sceneSelectionScreen.selectedScene != null) {
                if (globalState.gamePlay == undefined) {
                    console.log(connectivity.seed);
                    const scene = sceneMap.get(sceneSelectionScreen.selectedScene)!.generate(connectivity.seed);
                    globalState.scene = scene;
                    const startPositions = scene.getStartPositions();
                    const playerA = new Player(startPositions[0], true);
                    const playerB = new Player(startPositions[1], false);
                    connectivity.sendData({
                        type: 'init',
                        content: {
                            playerA: playerA.toJSON(),
                            playerB: playerB.toJSON(),
                            scene: {
                                type: sceneSelectionScreen.selectedScene,
                                content: scene.toJSON()
                            }
                        }
                    });
                    connectivity.sendData({
                        type: 'start'
                    });
                    globalState.gamePlay = new GamePlay(scene, playerA, playerB);
                }
                if (globalState.startOther) {
                    gameStateMachine.changeState("GAMEPLAY");
                }
            }
        },
        exit() {
            console.log("Exiting A_INIT");
            sceneSelectionScreen.hide();
            globalState.startOther = false;
        }
    },
    B_INIT: {
        enter() {
            console.log("Entering B_INIT");
            waitScreen.show();
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
            waitScreen.hide();
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
