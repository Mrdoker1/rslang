//API
import Data from '../../module/api';

//UI
import Render from '../ui';

//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLInputElement from '../../utils/getHTMLInputElement';
import { getRandom } from '../../utils/helpers';

//Interface
import IUserBody from '../interface/IUserBody';

//Style
import '../../global.scss';
import '../ui/styles/header.scss';
import '../ui/styles/sectionSplash.scss';
import '../ui/styles/sectionDevelopers.scss';
import '../ui/styles/sectionBenefits.scss';
import '../ui/styles/sectionGames.scss';
import '../ui/styles/footer.scss';
import '../ui/styles/login.scss';
import '../ui/styles/pageBook.scss';
import '../ui/styles/games.scss';
import '../ui/styles/sprint.scss';
import '../ui/styles/chart.scss';
import '../ui/styles/gameResult.scss';
import '../ui/styles/gameResultWords.scss';
import '../ui/styles/statistics.scss';

//Router
import { createRouter, Router } from 'routerjs';

//Login
import ModalLogin from '../components/login';

//Games
import Sprint from '../components/sprint';
import AudioCall from '../components/audio-call';

//State
import State from './state';
import IWord from '../interface/IWord';
import IAggregatedWord from '../interface/IAggregatedWord';
import IUserWord from '../interface/IUserWord';

export default class App {
    data: Data;
    render: Render;
    router: Router;

    constructor(base: string) {
        this.data = new Data(base);
        this.render = new Render();
        this.router = createRouter();
    }

    async start() {
        this.initState();
        this.createPage();
        this.createLogin();
        this.initRouter();
    }

    initState() {
        const state = new State();
        const stateStorageStr = localStorage.getItem('state');
        if (stateStorageStr) {
            const stateStorage = JSON.parse(stateStorageStr);
            Object.assign(state, stateStorage);
        }
        window.addEventListener('beforeunload', () => localStorage.setItem('state', JSON.stringify(state)));
    }

    createPage() {
        const render = new Render();
        const header = render.header();
        const main = render.main();
        const footer = render.footer();
        const body = getHTMLElement(document.body);

        body.appendChild(header);
        body.appendChild(main);
        body.appendChild(footer);
    }

    initRouter() {
        this.router
            .get('/', (req) => {
                this.showMain();
                Render.currentLink(req.path);
            })
            .get('/book', (req) => {
                this.showBook(0, 0);
                Render.currentLink(req.path);
            })
            .get('/book/:group/:page', (req) => {
                const state = new State();
                const userId = state.userId;
                const token = state.token;
                const loginStatus = state.token ? true : false;

                const group = Number(req.params.group);
                const page = Number(req.params.page);
                if (group === 6) {
                    this.showBookPageHard(group, page);
                } else if (!loginStatus) {
                    this.showBook(group, page);
                } else {
                    this.showBookPage(group, page);
                }

                Render.currentLink(req.path);
            })
            .get('/games', (req) => {
                this.showGames();
                Render.currentLink(req.path);
            })
            .get('/games/sprint', (req) => {
                this.showGameDifficulty('sprint');
                Render.currentLink(req.path);
            })
            .get('/games/sprint/:group/:page', (req) => {
                const group = Number(req.params.group);
                const page = Number(req.params.page);
                this.showSprint(group, page);
                Render.currentLink(req.path);
            })
            .get('/games/audio-call', (req) => {
                this.showGameDifficulty('audio-call');
                Render.currentLink(req.path);
            })
            .get('/games/audio-call/:group/:page', (req) => {
                const group = Number(req.params.group);
                const page = Number(req.params.page);
                this.showAudioCall(group, page);
                Render.currentLink(req.path);
            })
            .get('/stats', (req) => {
                this.showStatistics();
                Render.currentLink(req.path);
            })
            .error(404, () => {
                //this.show404();
                this.router.navigate('/');
            })
            .run();
    }

    showMain() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const sectionSplash = this.render.sectionSplash();
        const sectionBenefits = this.render.sectionBenefits();
        const sectionGames = this.render.sectionGames(`/games/sprint`, `/games/audio-call`);
        main.appendChild(sectionSplash);
        main.appendChild(sectionBenefits);
    }

    async showBook(group: number, page: number) {
        const state = new State();
        const userId = state.userId;
        const token = state.token;
        const loginStatus = state.token ? true : false;
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageBook = this.render.pageBook();
        const sectionGames = this.render.sectionGames(
            `/book/sprint/${group}/${page}`,
            `/book/audio-call/${group}/${page}`
        );
        pageBook.appendChild(sectionGames);
        const dataWords = await this.data.getWords(group, page);

        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const arr = [...dataWords];
            const cards = arr.map((item) => {
                if (item.difficulty === 'hard') {
                    return this.render.cardWord(item, loginStatus, item.id, true);
                } else {
                    return this.render.cardWord(item, loginStatus, item.id, false);
                }
            });

            const wordLevels = this.render.wordLevels();
            getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
            }

            const pagination = this.render.bookPagination(group, 29);
            getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

            cards.forEach((card) => {
                getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += card;
            });

            const linkActive = pageBook.querySelectorAll(`a[href='/book/${group}/${page}']`);
            linkActive[0].classList.add('active');

            main.appendChild(pageBook);
        }
    }

    async showBookPageHard(group: number, page: number) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageBook = this.render.pageBook();

        let state = new State();
        const userId = state.userId;
        const token = state.token;

        const dataWords = await this.data.getUserAggregatedWords(
            userId,
            '',
            `${page}`,
            '20',
            '{"$and":[{"userWord.difficulty":"hard"}]}',
            token
        );

        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const userWords = await this.data.getUserWords(userId, token);
            const state = new State();
            const loginStatus = state.token ? true : false;

            const wordLevels = this.render.wordLevels();
            getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
            }

            let wordsCount = 0;
            let paginatedResults = 0;
            let totalLength = 0;

            let itemOptional: IUserWord[] = [];

            Object.values(dataWords).forEach((item) => {
                const wordsArray = Object.values(item);

                paginatedResults = Object.values(item)[0].length;
                totalLength = Object.values(item)[1].length;

                if (totalLength > 0) {
                    wordsCount = Object.values(item)[1][0].count;
                    if (typeof userWords === 'number') {
                        console.log('error');
                    } else {
                        wordsArray[0].forEach((item: IWord) => {
                            const user = userWords.findIndex((x) => x.wordId === item._id);
                            let optional;
                            if (userWords[user].optional !== undefined) {
                                optional = userWords[user];
                            }

                            getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += this.render.cardWord(
                                item,
                                loginStatus,
                                item._id,
                                true,
                                false,
                                optional
                            );
                        });
                    }
                }
            });

            if (totalLength > 0) {
                const pagesCount = Math.ceil(wordsCount / 20);
                const pagination = this.render.bookPagination(6, pagesCount);
                getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

                const bttn = pageBook.querySelectorAll('[data-handle]');

                bttn.forEach((item) => {
                    item.addEventListener('click', async (e) => {
                        const target = getHTMLElement(e.target);

                        const wordId = target.getAttribute('data-id');

                        if (target.getAttribute('data-handle') === 'delete-from-hard') {
                            const dataWords = await this.data.updateUserWord(
                                state.userId,
                                wordId!,
                                { difficulty: 'normal' },
                                state.token
                            );
                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                parent!.remove();
                                this.showBookPageHard(group, page);
                            }
                        } else if (target.getAttribute('data-handle') === 'add-to-easy') {
                            const dataWords = await this.data.updateUserWord(
                                state.userId,
                                wordId!,
                                { difficulty: 'easy' },
                                state.token
                            );
                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                parent!.remove();
                                this.showBookPageHard(group, page);
                            }
                        }
                    });
                });
                if (paginatedResults === 0 && page != 0) {
                    this.router.navigate(`/book/${group}/${page - 1}`);
                }
                main.appendChild(pageBook);
            } else {
                main.innerHTML = '<div class="container">Пусто</div>';
            }
        }
    }

    async showBookPage(group: number, page: number) {
        const state = new State();
        const userId = state.userId;
        const token = state.token;
        const loginStatus = state.token ? true : false;

        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageBook = this.render.pageBook();

        const dataWords = await this.data.getWords(group, page);
        const userWords = await this.data.getUserWords(userId, token);

        const easyWords = await this.data.getUserAggregatedWordsTest(
            userId,
            '20',
            `{"$and":[{"userWord.difficulty":"easy"}, {"page": ${page}}, {"group": ${group}}]}`,
            token
        );

        const hardWords = await this.data.getUserAggregatedWordsTest(
            userId,
            '20',
            `{"$and":[{"userWord.difficulty":"hard"}, {"page": ${page}}, {"group": ${group}}]}`,
            token
        );
        if (typeof hardWords === 'number' || typeof easyWords === 'number' || typeof userWords === 'number') {
            console.log('error');
        } else {
            const dataWords = await this.data.getWords(group, page);

            let hardWordsArr: IWord[] = [];
            let easyWordsArr: IWord[] = [];

            hardWords.forEach((hardWord) => {
                easyWords.forEach((easyWord) => {
                    const hardWordsArray = Object.values(hardWord);
                    const easyWordsArray = Object.values(easyWord);

                    hardWordsArr = [...hardWordsArray[0]];
                    easyWordsArr = [...easyWordsArray[0]];
                });
            });

            if (typeof dataWords === 'number') {
            } else {
                const arr = [...dataWords];
                const uWrods = [...userWords];
                let cards: string[] = [];

                cards = arr.map((item) => {
                    const user = uWrods.findIndex((x) => x.wordId === item.id);
                    const hard = hardWordsArr.findIndex((x) => x._id === item.id);
                    const easy = easyWordsArr.findIndex((x) => x._id === item.id);
                    const hardWord: IWord = hardWordsArr[hard];
                    const easyWord: IWord = easyWordsArr[easy];
                    const userWord: IUserWord = uWrods[user];

                    if (userWord !== undefined && hardWord !== undefined) {
                        return this.render.cardWord(item, loginStatus, item.id, true, false, userWord);
                    } else if (userWord !== undefined && easyWord !== undefined) {
                        return this.render.cardWord(item, loginStatus, item.id, false, true, userWord);
                    } else {
                        return this.render.cardWord(item, loginStatus, item.id, false, false, userWord);
                    }
                });

                cards.forEach((card) => {
                    getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += card;
                });

                const bttn = pageBook.querySelectorAll('[data-handle]');

                bttn.forEach((item) => {
                    item.addEventListener('click', async (e) => {
                        const target = getHTMLElement(e.target);
                        const wordId = target.getAttribute('data-id');
                        const dataWordsArr = await this.data.getWords(group, page);
                        const userWords = await this.data.getUserWords(userId, token);

                        if (target.getAttribute('data-handle') === 'delete-from-hard') {
                            const dataWords = await this.data.updateUserWord(
                                state.userId,
                                wordId!,
                                { difficulty: 'normal' },
                                state.token
                            );

                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                target.innerHTML = 'Добавить в сложные';
                                parent!.className = 'card card-word';
                                target.setAttribute('data-handle', 'add-to-hard');
                                console.log('delete from hard');
                                const userWords = await this.data.getUserWords(userId, token);
                                if (typeof userWords === 'number') {
                                    console.log('error');
                                } else {
                                    console.log(userWords);
                                }
                            }
                        } else if (target.getAttribute('data-handle') === 'add-to-hard') {
                            let checkUserWord;
                            const userWords = await this.data.getUserWords(userId, token);

                            if (typeof userWords === 'number') {
                                console.log('error');
                            } else {
                                checkUserWord = userWords.findIndex((x) => x.wordId === wordId);
                            }

                            if (checkUserWord === -1) {
                                const dataWords = await this.data.createUserWord(
                                    state.userId,
                                    wordId!,
                                    { difficulty: 'hard' },
                                    state.token
                                );
                                console.log('Word not in user words, add to User Words');
                            } else {
                                const dataWords = await this.data.updateUserWord(
                                    state.userId,
                                    wordId!,
                                    { difficulty: 'hard' },
                                    state.token
                                );
                                console.log('Word IN user words, UPDATE word');
                            }

                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                target.innerHTML = 'Удалить из сложных';
                                target.setAttribute('data-handle', 'delete-from-hard');
                                parent!.className = 'card card-word hard';

                                const bttn = target.parentElement;
                                if (bttn!.querySelector('[data-handle="delete-from-easy"]')) {
                                    bttn!.querySelector('[data-handle="delete-from-easy"]')!.innerHTML =
                                        'Добавить в изученные';
                                    bttn!
                                        .querySelector('[data-handle="delete-from-easy"]')!
                                        .setAttribute('data-handle', 'add-to-easy');
                                }

                                console.log('add to hard');
                                const userWords = await this.data.getUserWords(userId, token);
                                if (typeof userWords === 'number') {
                                    console.log('error');
                                } else {
                                    console.log(userWords);
                                }
                            }
                        } else if (target.getAttribute('data-handle') === 'add-to-easy') {
                            let checkUserWord;
                            const userWords = await this.data.getUserWords(userId, token);

                            if (typeof userWords === 'number') {
                                console.log('error');
                            } else {
                                checkUserWord = userWords.findIndex((x) => x.wordId === wordId);
                            }

                            if (checkUserWord === -1) {
                                const dataWords = await this.data.createUserWord(
                                    state.userId,
                                    wordId!,
                                    { difficulty: 'easy' },
                                    state.token
                                );
                                console.log('Word not in user words, add to User Words');
                            } else {
                                const dataWords = await this.data.updateUserWord(
                                    state.userId,
                                    wordId!,
                                    { difficulty: 'easy' },
                                    state.token
                                );
                                console.log('Word IN user words, UPDATE word');
                            }
                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                target.innerHTML = 'Удалить из изученных';
                                target.setAttribute('data-handle', 'delete-from-easy');
                                parent!.classList.add('easy');

                                const bttn = target.parentElement;
                                if (bttn!.querySelector('[data-handle="delete-from-hard"]')) {
                                    bttn!
                                        .querySelector('[data-handle="delete-from-hard"]')!
                                        .setAttribute('data-handle', 'add-to-hard');
                                    bttn!.querySelector('[data-handle="add-to-hard"]')!.innerHTML =
                                        'Добавить в сложные';
                                }
                                const easyWords = await this.data.getUserAggregatedWordsTest(
                                    userId,
                                    '20',
                                    `{"$and":[{"userWord.difficulty":"easy"}, {"page": ${page}}, {"group": ${group}}]}`,
                                    token
                                );
                                if (typeof easyWords === 'number') {
                                    console.log('error');
                                } else {
                                    const linkActive = pagination.querySelectorAll(`a[href='/book/${group}/${page}']`);
                                    linkActive[0].classList.add('active');
                                    if (Object.values(easyWords[0])[0].length === 20) {
                                        if (linkActive[0] !== undefined)
                                            linkActive[0].className = 'pagination__item active learned';
                                        pageBook.children[0].classList.add('learned');
                                        const sectionGames = this.render.sectionGames(
                                            `/book/sprint/${group}/${page}`,
                                            `/book/audio-call/${group}/${page}`,
                                            'disabled'
                                        );
                                        pageBook.querySelector('.games')?.remove();
                                        pageBook.appendChild(sectionGames);
                                    } else {
                                        pageBook.children[0].classList.remove('learned');
                                        const sectionGames = this.render.sectionGames(
                                            `/book/sprint/${group}/${page}`,
                                            `/book/audio-call/${group}/${page}`
                                        );
                                        pageBook.querySelector('.games')?.remove();
                                        pageBook.appendChild(sectionGames);
                                    }
                                }
                            }
                        } else if (target.getAttribute('data-handle') === 'delete-from-easy') {
                            const dataWords = await this.data.updateUserWord(
                                state.userId,
                                wordId!,
                                { difficulty: 'normal' },
                                state.token
                            );

                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                target.innerHTML = 'Добавить в изученные';
                                parent!.className = 'card card-word';
                                target.setAttribute('data-handle', 'add-to-easy');
                                console.log('delete from easy');
                            }
                            const easyWords = await this.data.getUserAggregatedWordsTest(
                                userId,
                                '20',
                                `{"$and":[{"userWord.difficulty":"easy"}, {"page": ${page}}, {"group": ${group}}]}`,
                                token
                            );
                            if (typeof easyWords === 'number') {
                                console.log('error');
                            } else {
                                const linkActive = pagination.querySelectorAll(`a[href='/book/${group}/${page}']`);
                                linkActive[0].classList.add('active');
                                if (Object.values(easyWords[0])[0].length === 20) {
                                    if (linkActive[0] !== undefined)
                                        linkActive[0].className = 'pagination__item active learned';
                                    pageBook.children[0].classList.add('learned');
                                    const sectionGames = this.render.sectionGames(
                                        `/book/sprint/${group}/${page}`,
                                        `/book/audio-call/${group}/${page}`,
                                        'disabled'
                                    );
                                    pageBook.querySelector('.games')?.remove();
                                    pageBook.appendChild(sectionGames);
                                } else {
                                    if (linkActive[0] !== undefined)
                                        linkActive[0].className = 'pagination__item active';
                                    pageBook.children[0].classList.remove('learned');
                                    const sectionGames = this.render.sectionGames(
                                        `/book/sprint/${group}/${page}`,
                                        `/book/audio-call/${group}/${page}`
                                    );
                                    pageBook.querySelector('.games')?.remove();
                                    pageBook.appendChild(sectionGames);
                                }
                            }
                        }
                    });
                });
                const wordLevels = this.render.wordLevels();
                const linkActiveLevel = wordLevels.querySelectorAll(`a[href='/book/${group}/${page}']`);
                getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);
                if (linkActiveLevel[0] !== undefined) linkActiveLevel[0].classList.add('active');

                pageBook.children[0].classList.add(`A${group}`);

                if (state.token) {
                    const hardWords = this.render.hardWords();
                    getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
                }

                const pagination = this.render.bookPagination(group, 29);
                getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

                const linkActive = pagination.querySelectorAll(`a[href='/book/${group}/${page}']`);

                if (easyWordsArr.length === 20) {
                    if (linkActive[0] !== undefined) linkActive[0].className = 'pagination__item active learned';
                    pageBook.children[0].classList.add('learned');
                    const sectionGames = this.render.sectionGames(
                        `/book/sprint/${group}/${page}`,
                        `/book/audio-call/${group}/${page}`,
                        'disabled'
                    );
                    pageBook.appendChild(sectionGames);
                } else {
                    linkActive[0].classList.add('active');
                    const sectionGames = this.render.sectionGames(
                        `/book/sprint/${group}/${page}`,
                        `/book/audio-call/${group}/${page}`
                    );
                    pageBook.appendChild(sectionGames);
                }
                main.appendChild(pageBook);
            }
        }
    }

    showGames() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageGames = this.render.pageGames();
        main.appendChild(pageGames);
    }

    showStatistics() {
        const main = getHTMLElement(document.querySelector('.main'));

        const date1 = new Date();
        date1.setHours(0, 0, 0, 0);

        // const date1 = new Date(2022, 7, 30);
        // date1.setHours(0, 0, 0, 0);

        const date2 = new Date(2022, 7, 10);
        date2.setHours(0, 0, 0, 0);

        const date3 = new Date(2022, 7, 9);
        date3.setHours(0, 0, 0, 0);

        const statisticsDay1 = {
            date: date1.toString(),
            sprint: {
                new: 10,
                total: 20,
                right: 5,
                record: 5,
                learned: 5,
            },
            audio: {
                new: 20,
                total: 30,
                right: 15,
                record: 5,
                learned: 10,
            },
            book: {
                new: 10,
                learned: 10,
            },
        };

        const statisticsDay2 = {
            date: date2.toString(),
            sprint: {
                new: 4,
                total: 30,
                right: 3,
                record: 10,
                learned: 5,
            },
            audio: {
                new: 9,
                total: 21,
                right: 5,
                record: 3,
                learned: 5,
            },
            book: {
                new: 5,
                learned: 10,
            },
        };

        const statisticsDay3 = {
            date: date3.toString(),
            sprint: {
                new: 4,
                total: 30,
                right: 3,
                record: 10,
                learned: 5,
            },
            audio: {
                new: 9,
                total: 21,
                right: 5,
                record: 3,
                learned: 5,
            },
            book: {
                new: 5,
                learned: 10,
            },
        };

        const statistics = {
            learnedWords: 0,
            optional: {
                1: statisticsDay1,
                2: statisticsDay2,
                3: statisticsDay3,
            },
        };

        main.innerHTML = '';
        // const pageStats = this.render.pageStatistics(statistics);
        // main.appendChild(pageStats);
        const pageStatsDenied = this.render.pageStatisticsDenied();
        main.appendChild(pageStatsDenied);
    }

    showGameDifficulty(type: string) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const game = this.render.gameDifficulty(type);
        main.append(game);

        const start = getHTMLElement(game.querySelector('.game__start'));
        start.addEventListener('click', (e) => {
            const checked = getHTMLInputElement(game.querySelector('[type="radio"]:checked'));
            const href = `/games/${type}/${checked.value}/${getRandom(0, 29)}`;
            this.router.navigate(href);
        });
    }

    async showSprint(group: number, page: number) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const words = await this.data.getWords(group, page);
        if (typeof words === 'number') {
            console.log(`error ${words}`);
            return;
        }
        const sprint = new Sprint(this.data.base, words, group, page);
        sprint.start();
        //const gameSprint = this.render.gameSprint(group, page);
        //main.appendChild(gameSprint);
    }

    async showAudioCall(group: number, page: number) {
        const audioCall = new AudioCall(this.data.base, group, page);
        audioCall.start();
    }

    createLogin() {
        const modal = this.render.modalLogin();
        document.body.append(modal);
        new ModalLogin(modal, this.data.base, this.router);
    }
}
