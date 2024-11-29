export interface State {
    enter: () => void;
    update: () => void;
    exit: () => void;
}
export type StateMap = {
    [key: string]: State;
};

class StateMachine {
    private states: StateMap;
    private currentState: State | null;

    constructor(states: StateMap) {
        this.states = states;
        this.currentState = null;
    }

    changeState(newState: keyof StateMap): void {
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = this.states[newState];
        if (this.currentState) {
            this.currentState.enter();
        }
    }

    update(): void {
        if (this.currentState && this.currentState.update) {
            this.currentState.update();
        }
    }
}

export default StateMachine;
