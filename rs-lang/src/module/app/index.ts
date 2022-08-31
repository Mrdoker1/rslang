//API
import Data from '../../module/api';

//UI
import Render from '../ui';

//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLInputElement from '../../utils/getHTMLInputElement';

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

//Router
import { createRouter, Router } from 'routerjs';

//Login
import ModalLogin from '../login';

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
                //console.log(req.path.split('/').reverse());
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
                this.showStats();
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
        const sectionDevelovers = this.render.sectionDevelovers();
        const sectionBenefits = this.render.sectionBenefits();
        const sectionGames = this.render.sectionGames();
        main.appendChild(sectionSplash);
        main.appendChild(sectionDevelovers);
        main.appendChild(sectionBenefits);
        main.appendChild(sectionGames);
    }

    async showBook(group: number, page: number) {
        const state = new State();
        const userId = state.userId;
        const token = state.token;
        const loginStatus = state.token ? true : false;
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageBook = this.render.pageBook();
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

            Object.values(dataWords).map((item) => {
                paginatedResults = Object.values(item)[0].length;
                const wordsArray = Object.values(item);
                totalLength = Object.values(item)[1].length;

                if (totalLength > 0) {
                    wordsCount = Object.values(item)[1][0].count;
                    wordsArray[0].forEach((item: IWord) => {
                        getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += this.render.cardWord(
                            item,
                            loginStatus,
                            item._id,
                            true
                        );
                    });
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
                        const dataWords = await this.data.deleteUserWord(state.userId, wordId!, state.token);

                        if (typeof dataWords === 'number') {
                            console.log('error');
                        } else {
                            if (target.getAttribute('data-handle') === 'delete-from-hard') {
                                const dataWords = await this.data.deleteUserWord(state.userId, wordId!, token);
                                if (typeof dataWords === 'number') {
                                    console.log('error');
                                } else {
                                    const parent = target.parentElement!.parentElement!.closest('.card-word');
                                    parent!.remove();
                                    this.showBookPageHard(group, page);
                                }
                            } else if (target.getAttribute('data-handle') === 'add-to-easy') {
                                const dataWords = await this.data.createUserWord(
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
        if (typeof hardWords === 'number' || typeof easyWords === 'number') {
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
                let cards: string[] = [];

                cards = arr.map((item) => {
                    const hard = hardWordsArr.findIndex((x) => x._id === item.id);
                    const easy = easyWordsArr.findIndex((x) => x._id === item.id);
                    const hardWord: IWord = hardWordsArr[hard];
                    const easyWord: IWord = easyWordsArr[easy];
                    if (
                        hardWord !== undefined &&
                        hardWord._id === item.id &&
                        Object.values(hardWord.userWord!).join() === 'hard'
                    ) {
                        return this.render.cardWord(item, loginStatus, item.id, true, false);
                    } else if (
                        easyWord !== undefined &&
                        easyWord._id === item.id &&
                        Object.values(easyWord.userWord!).join() === 'easy'
                    ) {
                        return this.render.cardWord(item, loginStatus, item.id, false, true);
                    } else {
                        return this.render.cardWord(item, loginStatus, item.id, false);
                    }
                });

                cards.forEach((card) => {
                    getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += card;
                });

                const bttn = pageBook.querySelectorAll('[data-handle]');
                bttn.forEach((item) => {
                    item.addEventListener('click', async (e) => {
                        const userWords = await this.data.getUserWords(userId, token);
                        const target = getHTMLElement(e.target);

                        const wordId = target.getAttribute('data-id');
                        const dataWords = await this.data.deleteUserWord(state.userId, wordId!, state.token);

                        if (typeof dataWords === 'number') {
                            console.log('error');
                        } else {
                            if (target.getAttribute('data-handle') === 'delete-from-hard') {
                                const dataWords = await this.data.deleteUserWord(state.userId, wordId!, state.token);

                                if (typeof dataWords === 'number') {
                                    console.log('error');
                                } else {
                                    const parent = target.parentElement!.parentElement!.closest('.card-word');
                                    target.innerHTML = 'Добавить в сложные';
                                    parent!.className = 'card card-word';
                                    target.setAttribute('data-handle', 'add-to-hard');
                                    console.log('delete from hard');
                                }
                            } else if (target.getAttribute('data-handle') === 'add-to-hard') {
                                const dataWords = await this.data.createUserWord(
                                    state.userId,
                                    wordId!,
                                    { difficulty: 'hard' },
                                    state.token
                                );

                                if (typeof dataWords === 'number') {
                                    console.log(userWords);
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
                                }
                            } else if (target.getAttribute('data-handle') === 'add-to-easy') {
                                const dataWords = await this.data.createUserWord(
                                    state.userId,
                                    wordId!,
                                    { difficulty: 'easy' },
                                    state.token
                                );
                                if (typeof dataWords === 'number') {
                                    console.log('error');
                                } else {
                                    const parent = target.parentElement!.parentElement!.closest('.card-word');
                                    target.innerHTML = 'Удалить из изученных';
                                    target.setAttribute('data-handle', 'delete-from-easy');
                                    parent!.classList.add('easy');
                                    console.log('add to easy');

                                    const bttn = target.parentElement;
                                    if (bttn!.querySelector('[data-handle="delete-from-hard"]')) {
                                        bttn!
                                            .querySelector('[data-handle="delete-from-hard"]')!
                                            .setAttribute('data-handle', 'add-to-hard');
                                        bttn!.querySelector('[data-handle="add-to-hard"]')!.innerHTML =
                                            'Добавить в сложные';
                                    }
                                }
                            } else if (target.getAttribute('data-handle') === 'delete-from-easy') {
                                const dataWords = await this.data.deleteUserWord(state.userId, wordId!, state.token);

                                if (typeof dataWords === 'number') {
                                    console.log('error');
                                } else {
                                    const parent = target.parentElement!.parentElement!.closest('.card-word');
                                    target.innerHTML = 'Добавить в изученные';
                                    parent!.className = 'card card-word';
                                    target.setAttribute('data-handle', 'add-to-easy');

                                    console.log('delete from easy');
                                }
                            }
                        }
                    });
                });
                const wordLevels = this.render.wordLevels();
                getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);

                if (state.token) {
                    const hardWords = this.render.hardWords();
                    getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
                }

                const pagination = this.render.bookPagination(group, 29);
                getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

                const linkActive = pageBook.querySelectorAll(`a[href='/book/${group}/${page}']`);
                linkActive[0].classList.add('active');
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

    showStats() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageStats = this.render.pageStats();
        main.appendChild(pageStats);
    }

    showGameDifficulty(type: string) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const gameDifficulty = this.render.gameDifficulty(type);
        main.append(gameDifficulty);
    }

    showSprint(group: number, page: number) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const gameSprint = this.render.gameSprint(group, page);
        main.appendChild(gameSprint);
    }

    showAudioCall(group: number, page: number) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const gameAudioCall = this.render.gameAudioCall(group, page);
        main.appendChild(gameAudioCall);
    }

    createLogin() {
        const modal = this.render.modalLogin();
        document.body.append(modal);
        new ModalLogin(modal);

        let state = new State();
        const loginForm = getHTMLElement(modal.querySelector('[data-type="login"] form'));
        const loginMessage = getHTMLElement(loginForm.querySelector('.js-signin-modal__message'));
        const loginEmailBox = getHTMLInputElement(loginForm.querySelector('#signin-email'));
        const loginPasswordBox = getHTMLInputElement(loginForm.querySelector('#signin-password'));

        const signupForm = getHTMLElement(modal.querySelector('[data-type="signup"] form'));
        const signupMessage = getHTMLElement(signupForm.querySelector('.js-signin-modal__message'));

        const loginLink = getHTMLElement(document.querySelector('[data-signin="login"]'));
        const logoutLink = getHTMLElement(document.querySelector('[data-signin="logout"]'));
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            state.token = '';
            localStorage.setItem('state', JSON.stringify(state));
            logoutLink.classList.add('hidden');
            loginLink.classList.remove('hidden');
            this.router.run();
        });

        if (state.token) {
            loginLink.classList.add('hidden');
        } else logoutLink.classList.add('hidden');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginEmailBox.value;
            const password = loginPasswordBox.value;

            const login = await this.data.login({ email, password });
            if (typeof login != 'number') {
                state.token = login.token;
                state.userId = login.userId;
                loginLink.classList.add('hidden');
                logoutLink.classList.remove('hidden');
                modal.classList.remove('cd-signin-modal--is-visible');
                this.router.run();
            } else {
                loginMessage.textContent = 'Неверный пароль или почта';
            }
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = getHTMLInputElement(signupForm.querySelector('#signup-username')).value;
            const email = getHTMLInputElement(signupForm.querySelector('#signup-email')).value;
            const password = getHTMLInputElement(signupForm.querySelector('#signup-password')).value;

            const user = await this.data.createUser({ name, email, password });
            if (typeof user != 'number') {
                const login = await this.data.login({ email, password });
                if (typeof login != 'number') {
                    state.token = login.token;
                    state.userId = login.userId;
                    loginLink.classList.add('hidden');
                    logoutLink.classList.remove('hidden');
                    modal.classList.remove('cd-signin-modal--is-visible');
                    this.router.run();
                }
            } else {
                if (user === 422) signupMessage.textContent = 'Неверный пароль, имя или почта';
                else if (user === 417) signupMessage.textContent = 'Аккаунт уже существует';
            }
        });
    }
}
