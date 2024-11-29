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

// global state
export const connectivity = new Connectivity();
export const splashScreen = new SplashScreen();
export const gamePlay = new GamePlay();
export let globalState: {
    playerType: 'A' | 'B' | undefined;
    startOther: boolean;
} = {
    playerType: undefined,
    startOther: false
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
            connectivity.sendData({
                type: 'player',
                content: gamePlay.scene.player_me
            });
        },
        update() {
            console.log("Updating state if necessary");
            if (!gamePlay.generated) {
                gamePlay.generate();
                connectivity.sendData({
                    type: 'world',
                    content: gamePlay.scene.world
                });
            }
            if(gamePlay.scene.player_other != undefined) {
                connectivity.sendData({
                    type: 'start'
                });
                if (globalState.startOther) {
                    gameStateMachine.changeState("GAMEPLAY");
                }
            }
        },
        exit() {
            console.log("Exiting A_INIT");
        }
    },
    B_INIT: {
        enter() {
            console.log("Entering B_INIT");
            connectivity.sendData({
                type: 'player',
                content: gamePlay.scene.player_me
            });
        },
        update() {
            console.log("Updating state if necessary");
            if (gamePlay.scene.world != undefined && gamePlay.scene.player_other != undefined) {
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
            gamePlay.start();
        },
        update() {
            console.log("Updating state if necessary");
        },
        exit() {
            console.log("Exiting Gameplay");
            gamePlay.stop();
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
