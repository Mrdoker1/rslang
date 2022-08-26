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

//Router
import { createRouter } from 'routerjs';

//Login
import ModalLogin from '../login';

//State
import State from './state';
import IWord from '../interface/IWord';

export default class App {
    data: Data;
    render: Render;
    state: State;

    constructor(base: string) {
        this.data = new Data(base);
        this.render = new Render();
        this.state = new State();
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
        const header = render.header(this.state.name);
        const main = render.main();
        const footer = render.footer();
        const body = getHTMLElement(document.body);
        console.log(this.state.name);
        body.appendChild(header);
        body.appendChild(main);
        body.appendChild(footer);
    }

    initRouter() {
        const router = createRouter()
            .get('/', (req) => {
                this.showMain();
                Render.currentLink(req.path);
            })
            .get('/book', (req) => {
                this.showBook(0);
                Render.currentLink(req.path);
            })
            .get('/book/:group/:page', (url, req) => {
                const group = Number(url.params.group);
                const page = Number(url.params.page);
                console.log(group);
                if (group === 7) {
                    this.showBookPageHard();
                }
                this.showBookPage(group, page);
            })
            .get('/games', (req) => {
                this.showGames();
                Render.currentLink(req.path);
            })
            .get('/games/sprint', (req) => {
                this.showSprint();
                const render = new Render();
                Render.currentLink(req.path);
            })
            .get('/games/audio-call', (req) => {
                this.showAudioCall();
                Render.currentLink(req.path);
            })
            .get('/stats', (req) => {
                this.showStats();
                Render.currentLink(req.path);
            })
            .error(404, () => {
                //this.show404();
                router.navigate('/');
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
                return this.render.cardWord(item, loginStatus);
            });

            for (let i = 0; i <= 5; i++) {
                const wordLevels = this.render.wordLevels(i);
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += wordLevels;
            }

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
            }

            for (let i = 0; i <= 29; i++) {
                const pagination = this.render.bookPagination(group, i);
                getHTMLElement(pageBook.querySelector('.pagination')).innerHTML += pagination;
            }

            cardsArr.forEach((card) => {
                getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += card;
            });

            main.appendChild(pageBook);
        }
    }

    async showBookPageHard() {
        let state = new State();
        const userId = state.userId;
        const token = state.token;
        const dataWords = await this.data.getUserAggregatedWord(
            userId,
            '?filter=%7B%22%24and%22%3A%5B%7B%22userWord.difficulty%22%3A%22hard%22%7D%5D%7D',
            token
        );
        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const main = getHTMLElement(document.querySelector('.main'));
            main.innerHTML = '';
            const pageBook = this.render.pageBook();
            const state = new State();
            const loginStatus = state.token ? true : false;

            const cardsArr = Object.values(dataWords).map((item) => {
                return item.paginatedResults.map((item: IWord) => {
                    getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += this.render.cardWord(
                        item,
                        loginStatus
                    );
                });
            });

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
                return this.render.cardWord(item, loginStatus);
            });

            for (let i = 0; i <= 5; i++) {
                const wordLevels = this.render.wordLevels(i);
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += wordLevels;
            }

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
            }

            for (let i = 0; i <= 29; i++) {
                const pagination = this.render.bookPagination(group, i);
                getHTMLElement(pageBook.querySelector('.pagination')).innerHTML += pagination;
            }

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

    showSprint() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const gameSprint = this.render.gameSprint();
        main.appendChild(gameSprint);
    }

    showAudioCall() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const gameAudioCall = this.render.gameAudioCall();
        main.appendChild(gameAudioCall);
    }

    createLogin() {
        const render = new Render();
        const modal = render.modalLogin();
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
        logoutLink.addEventListener('click', () => {
            state.token = '';
            localStorage.setItem('state', JSON.stringify(state));
            logoutLink.classList.add('hidden');
            loginLink.classList.remove('hidden');
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
                state.name = login.name;
                loginLink.classList.add('hidden');
                logoutLink.classList.remove('hidden');
                modal.classList.remove('cd-signin-modal--is-visible');
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
                    state.name = login.name;
                    loginLink.classList.add('hidden');
                    logoutLink.classList.remove('hidden');
                    modal.classList.remove('cd-signin-modal--is-visible');
                }
            } else {
                if (user === 422) signupMessage.textContent = 'Неверный пароль, имя или почта';
                else if (user === 417) signupMessage.textContent = 'Аккаунт уже существует';
            }
        });
    }
}
