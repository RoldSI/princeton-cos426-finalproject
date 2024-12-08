// SCREEN WITH SCENE SELECTION

import { gameStateMachine, sceneMap } from "../app";

export class SceneSelectionScreen {
    private container: HTMLDivElement;
    public selectedScene: string | undefined = undefined; // Store the selected scene

    constructor() {
        // Create a container for the screen
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
        const title = document.createElement('div');
        title.textContent = "Select a Scene to Start";
        title.style.color = 'white';
        title.style.textAlign = 'center';
        title.style.fontSize = '24px';
        title.style.marginBottom = '20px';
        this.container.appendChild(title);

        // Add scene selection dropdown
        const dropdown = document.createElement('select');
        dropdown.style.padding = '10px';
        dropdown.style.fontSize = '16px';
        dropdown.style.marginBottom = '20px';

        // Populate dropdown with available scenes
        sceneMap.forEach((_, key) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            dropdown.appendChild(option);
        });

        dropdown.addEventListener('change', () => {
            this.selectedScene = dropdown.value; // Update the selected scene
        });

        this.container.appendChild(dropdown);

        // Add a confirmation button
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        confirmButton.style.padding = '10px 20px';
        confirmButton.style.fontSize = '16px';
        confirmButton.style.cursor = 'pointer';

        confirmButton.addEventListener('click', () => {
            if (this.selectedScene) {
                gameStateMachine.update();
            } else {
                alert('Please select a scene.');
            }
        });

        this.container.appendChild(confirmButton);
    }

    show(): void {
        document.body.appendChild(this.container);
    }

    hide(): void {
        document.body.removeChild(this.container);
    }
}