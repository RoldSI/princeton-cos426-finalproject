// SPLASH SCREEN/GAME MENU

import { connectivity, globalState } from "../app";

// import { Connectivity } from "./connectivity/connectivity";

export class SplashScreen {
    private container: HTMLDivElement;

    constructor() {
        // Create a container for the splash screen
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Semi-transparent background

        // Add a title
        const title = document.createElement('h1');
        title.textContent = 'Shadow Spy';
        title.style.color = 'white';
        title.style.marginBottom = '20px';
        this.container.appendChild(title);

        // Create buttons for role selection
        const buttonA = document.createElement('button');
        const buttonB = document.createElement('button');
        buttonA.textContent = 'Player A';
        buttonB.textContent = 'Player B';
        buttonA.style.margin = '10px';
        buttonB.style.margin = '10px';

        // Append buttons to the container
        this.container.appendChild(buttonA);
        this.container.appendChild(buttonB);

        buttonA.addEventListener('click', async () => {
            globalState.playerType = 'A';
            const remotePlayerId = prompt('Enter game id:');
            if (remotePlayerId) {
                
                connectivity.connectToPlayer(remotePlayerId);
                this.container.removeChild(buttonA);
                this.container.removeChild(buttonB);
                const notice = document.createElement('div');
                notice.textContent = "Connecting...";
                notice.style.color = 'white';
                this.container.appendChild(notice);
            } else {
                console.error('Player B ID is required.');
            }
        });
        buttonB.addEventListener('click', () => {
            globalState.playerType = 'B';
            console.log('Waiting for Player A to connect...');
            let playerId = connectivity.getPlayerId();
            while (playerId == undefined) {
                playerId = connectivity.getPlayerId();
            }
            this.container.removeChild(buttonA);
            this.container.removeChild(buttonB);
            const notice = document.createElement('div');
            notice.textContent = `The game id is: ${playerId}. Share this with Player A.`;
            notice.style.color = 'white';
            this.container.appendChild(notice);
        });
    }

    show(): void {
        document.body.appendChild(this.container);
    }

    hide(): void {
        document.body.removeChild(this.container);
    }

    setup(): boolean {
        return true;
    }
}
