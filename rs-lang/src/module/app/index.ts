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
import IWord from '../interface/IWord';
import IAggregatedWord from '../interface/IAggregatedWord';

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

//Router
import { createRouter, Router } from 'routerjs';

//Login
import ModalLogin from '../login';

//Games
import Sprint from '../sprint';
import AudioCall from '../audio-call';

//State
import State from './state';

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
                this.showBook(0);
                Render.currentLink(req.path);
            })
            .get('/book/:group/:page', (req) => {
                const group = Number(req.params.group);
                const page = Number(req.params.page);
                console.log(group);
                if (group === 6) {
                    this.showBookPageHard(group, page);
                }
                this.showBookPage(group, page);
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
        const sectionDevelopers = this.render.sectionDevelopers();
        const sectionBenefits = this.render.sectionBenefits();
        const sectionGames = this.render.sectionGames();
        main.appendChild(sectionSplash);
        main.appendChild(sectionDevelopers);
        main.appendChild(sectionBenefits);
        main.appendChild(sectionGames);
    }

    async showBook(group: number) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageBook = this.render.pageBook();

        const dataWords = await this.data.getWords(0);
        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const state = new State();
            const loginStatus = state.token ? true : false;
            const cardsArr = Object.values(dataWords).map((item) => {
                return this.render.cardWord(item, loginStatus, item.id);
            });

            const wordLevels = this.render.wordLevels();
            getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
            }

            const pagination = this.render.bookPagination(group, 29);
            getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

            cardsArr.forEach((card) => {
                getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += card;
            });

            main.appendChild(pageBook);
        }
    }

    async showBookPageHard(group: number, page: number) {
        let state = new State();
        const userId = state.userId;
        const token = state.token;
        console.log(page);
        const dataWords = await this.data.getUserAggregatedWords(
            userId,
            '',
            `${page}`,
            '20',
            '%7B%22%24and%22%3A%5B%7B%22userWord.difficulty%22%3A%22hard%22%7D%5D%7D',
            token
        );
        // userId,`?page=${page - 1}&wordsPerPage=20&filter=%7B%22%24and%22%3A%5B%7B%22userWord.difficulty%22%3A%22hard%22%7D%5D%7D`,token
        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const main = getHTMLElement(document.querySelector('.main'));
            main.innerHTML = '';
            const pageBook = this.render.pageBook();
            const state = new State();
            const loginStatus = state.token ? true : false;

            const wordLevels = this.render.wordLevels();
            getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
            }

            let wordsCount = 0;
            Object.values(dataWords).map((item) => {
                const wordsArray = Object.values(item);
                wordsCount = Object.values(item)[1][0].count;

                wordsArray[0].forEach((item: IWord) => {
                    return (getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += this.render.cardWord(
                        item,
                        loginStatus,
                        item._id
                    ));
                });
            });

            const pagesCount = Math.ceil(wordsCount / 20);
            console.log(pagesCount, page);
            const pagination = this.render.bookPagination(6, pagesCount);
            getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

            main.appendChild(pageBook);
        }
    }

    async showBookPage(group: number, page: number) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageBook = this.render.pageBook();

        const dataWords = await this.data.getWords(group, page);
        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const state = new State();
            const loginStatus = state.token ? true : false;

            const cardsArr = Object.values(dataWords).map((item) => {
                return this.render.cardWord(item, loginStatus, item.id);
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
            cardsArr.forEach((card) => {
                getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += card;
            });

            const bttn = pageBook.querySelectorAll('[data-handle="add-to-hard"]');
            bttn.forEach((item) => {
                item.addEventListener('click', async (e) => {
                    const target = getHTMLElement(e.target);
                    const wordId = target.getAttribute('data-id');
                    console.log(wordId);
                    const dataWords = await this.data.createUserWord(
                        state.userId,
                        wordId!,
                        { difficulty: 'hard' },
                        state.token
                    );
                    if (typeof dataWords === 'number') {
                        console.log('error');
                    } else {
                        console.log('ok');
                    }
                });
            });

            main.appendChild(pageBook);
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
        const game = this.render.gameDifficulty(type);
        main.append(game);

        const start = getHTMLElement(game.querySelector('.game__start'));
        start.addEventListener('click', (e) => {
            const checked = getHTMLInputElement(game.querySelector('[type="radio"]:checked'));
            const href = `/games/${type}/${checked.value}/${getRandom(1, 30)}`;
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
