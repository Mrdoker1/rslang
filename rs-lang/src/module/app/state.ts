export default class State {
    private static instance: State;
    private _token: string;
    constructor() {
        this._token = '';
        if (typeof State.instance === 'object') {
            return State.instance;
        }
        State.instance = this;
        return this;
    }

    get token() {
        return this._token;
    }

    set token(value: string) {
        this._token = value;
    }

    toJSON() {
        return { token: this.token };
    }
}
