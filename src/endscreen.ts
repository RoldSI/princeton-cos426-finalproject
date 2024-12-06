// ENDGAME SCREENS

export class WinningScreen {
    private container: HTMLDivElement;

    constructor() {
        // Create a container for the winning screen
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
        this.container.style.backgroundColor = 'rgba(0, 255, 0, 0.8)'; // Semi-transparent green background

        // Add a title
        const title = document.createElement('h1');
        title.textContent = 'Congratulations! You Won!';
        title.style.color = 'white';
        title.style.marginBottom = '20px';
        this.container.appendChild(title);

        // Add a restart button
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.style.margin = '10px';
        this.container.appendChild(restartButton);

        restartButton.addEventListener('click', () => {
            location.reload(); // Restart the game
        });
    }

    show(): void {
        document.body.appendChild(this.container);
    }

    hide(): void {
        document.body.removeChild(this.container);
    }
}

export class LosingScreen {
    private container: HTMLDivElement;

    constructor() {
        // Create a container for the losing screen
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
        this.container.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'; // Semi-transparent red background

        // Add a title
        const title = document.createElement('h1');
        title.textContent = 'Game Over. You Lost.';
        title.style.color = 'white';
        title.style.marginBottom = '20px';
        this.container.appendChild(title);

        // Add a restart button
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Try Again';
        restartButton.style.margin = '10px';
        this.container.appendChild(restartButton);

        restartButton.addEventListener('click', () => {
            location.reload(); // Restart the game
        });
    }

    show(): void {
        document.body.appendChild(this.container);
    }

    hide(): void {
        document.body.removeChild(this.container);
    }
}