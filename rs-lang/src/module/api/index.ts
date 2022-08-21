//Interface
import IWord from '../interface/IWord';
import IUser from '../interface/IUser';
import IUserBody from '../interface/IUserBody';
import IAuth from '../interface/IAuth';
import IUserWord from '../interface/IUserWord';
import ISettings from '../interface/ISettings';
import IStatistics from '../interface/IStatistics';
import IAggregatedWord from '../interface/IAggregatedWord';

export default class Data {
    private words: string;
    private users: string;
    private sign: string;
    constructor(base: string) {
        this.words = `${base}/words`;
        this.users = `${base}/users`;
        this.sign = `${base}/signin`;
    }

    //Words
    getWords = async (group = 0, page = 0): Promise<number | Array<IWord>> => {
        const response = await fetch(`${this.words}?group=${group}&page=${page}`).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    getWord = async (id: string): Promise<number | IWord> => {
        const response = await fetch(`${this.words}/${id}`).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    //Users
    createUser = async (body: IUserBody): Promise<number | IUser> => {
        const response = await fetch(this.users, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    getUser = async (id: string, token: string): Promise<number | IUser> => {
        const response = await fetch(`${this.users}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    updateUser = async (
        id: string,
        body: { email: string; password: string },
        token: string
    ): Promise<number | IUser> => {
        const response = await fetch(`${this.users}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    deleteUser = async (id: string, token: string): Promise<number | boolean> => {
        const response = await fetch(`${this.users}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return true;
            } else {
                return response.status;
            }
        });
        return response;
    };

    //Users words
    getUserWords = async (id: string, token: string): Promise<number | Array<IUserWord>> => {
        const response = await fetch(`${this.users}/${id}/words`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    getUserWord = async (id: string, wordId: string, token: string): Promise<number | IUserWord> => {
        const response = await fetch(`${this.users}/${id}/words/${wordId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    createUserWord = async (
        id: string,
        wordId: string,
        body: IUserWord,
        token: string
    ): Promise<number | IUserWord> => {
        const response = await fetch(`${this.users}/${id}/words/${wordId}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    updateUserWord = async (
        id: string,
        wordId: string,
        body: IUserWord,
        token: string
    ): Promise<number | IUserWord> => {
        const response = await fetch(`${this.users}/${id}/words/${wordId}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    deleteUserWord = async (id: string, wordId: string, token: string): Promise<number | boolean> => {
        const response = await fetch(`${this.users}/${id}/words/${wordId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return true;
            } else {
                return response.status;
            }
        });
        return response;
    };

    //User statistics
    getUserStatistics = async (id: string, token: string): Promise<number | IStatistics> => {
        const response = await fetch(`${this.users}/${id}/statistics`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    updateUserStatistics = async (id: string, body: IStatistics, token: string): Promise<number | IStatistics> => {
        const response = await fetch(`${this.users}/${id}/statistics`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    //User settings
    getUserSettings = async (id: string, token: string): Promise<number | ISettings> => {
        const response = await fetch(`${this.users}/${id}/settings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    updateUserSettings = async (id: string, body: ISettings, token: string): Promise<number | ISettings> => {
        const response = await fetch(`${this.users}/${id}/settings`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    //User aggregated words
    getUserAggregatedWords = async (
        id: string,
        group: string,
        page: string,
        wordsPerPage: string,
        filter: string,
        token: string
    ): Promise<number | Array<IWord>> => {
        const response = await fetch(
            `${this.users}/${id}/aggregatedWords/?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${filter}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    getUserAggregatedWord = async (id: string, wordId: string, token: string): Promise<number | IAggregatedWord> => {
        const response = await fetch(`${this.users}/${id}/aggregatedWords/${wordId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    //Authorization
    login = async (body: { email: string; password: string }): Promise<number | IAuth> => {
        const response = await fetch(this.sign, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };

    updateToken = async (id: string, refreshToken: string): Promise<number | IAuth> => {
        const response = await fetch(`${this.users}/${id}/tokens`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshToken}`,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.status;
            }
        });
        return response;
    };
}
