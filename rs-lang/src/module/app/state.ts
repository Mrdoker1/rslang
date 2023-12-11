export default class State {
    private static instance: State;
    private _token: string;
    private _refreshToken: string;
    private _userId: string;
    private _name: string;
    private _message: string;
    private _tokenTime: string;
    constructor() {
        this._token = '';
        this._refreshToken = '';
        this._userId = '';
        this._name = '';
        this._message = '';
        this._tokenTime = '';

        if (typeof State.instance === 'object') {
            return State.instance;
        }
        State.instance = this;
        return this;
    }

    get token() {
        return this._token;
    }

    get refreshToken() {
        return this._refreshToken;
    }

    get userId() {
        return this._userId;
    }

    get name() {
        return this._name;
    }

    get message() {
        return this._message;
    }

    get tokenTime() {
        return this._tokenTime;
    }

    set token(value: string) {
        this._token = value;
    }

    set refreshToken(value: string) {
        this._refreshToken = value;
    }

    set userId(value: string) {
        this._userId = value;
    }

    set name(value: string) {
        this._name = value;
    }

    set message(value: string) {
        this._message = value;
    }

    set tokenTime(value: string) {
        this._tokenTime = value;
    }

    toJSON() {
        return {
            token: this.token,
            refreshToken: this.refreshToken,
            userId: this.userId,
            name: this.name,
            message: this.message,
            tokenTime: this.tokenTime,
        };
    }
}
