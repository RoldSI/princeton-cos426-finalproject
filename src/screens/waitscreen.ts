// SPLASH SCREEN (STATIC MESSAGE)

export class WaitScreen {
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

        // Add a static notice
        const notice = document.createElement('div');
        notice.textContent = "If the game doesn't start in a few seconds, refresh - you entered an invalid game id.";
        notice.style.color = 'white';
        notice.style.textAlign = 'center';
        notice.style.padding = '20px';
        this.container.appendChild(notice);
    }

    show(): void {
        document.body.appendChild(this.container);
    }

    hide(): void {
        document.body.removeChild(this.container);
    }
}