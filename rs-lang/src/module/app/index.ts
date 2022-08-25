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

//Router
import { createRouter } from 'routerjs';

//Login
import ModalLogin from '../login';

//State
import State from './state';

export default class App {
    data: Data;
    constructor(base: string) {
        this.data = new Data(base);
    }

    async start() {
        this.initRouter();
        this.initState();
        //State use example
        // let obj1 = new State();
        // let obj2 = new State();
        // obj1.token = '12345678';
        // obj2.token;
        // console.log(obj1 === obj2);
        // console.log(obj2.token);
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
        const sectionSplash = render.sectionSplash();
        const sectionDevelovers = render.sectionDevelovers();
        const sectionBenefits = render.sectionBenefits();
        const sectionGames = render.sectionGames();
        const footer = render.footer();
        const body = getHTMLElement(document.querySelector('body'));

        body.appendChild(header);
        body.appendChild(main);
        main.appendChild(sectionSplash);
        main.appendChild(sectionDevelovers);
        main.appendChild(sectionBenefits);
        main.appendChild(sectionGames);
        body.appendChild(footer);
    }

    initRouter() {
        const router = createRouter()
            .get('/', () => {
                this.showMain();
            })
            .get('/book', () => {
                this.showBook();
            })
            .get('/book/:group/:page', (url) => {
                const group = Number(url.params.group);
                const page = Number(url.params.page);
                this.showBookPage(group, page);
            })
            .get('/games', () => {
                this.showGames();
            })
            .get('/games/sprint', () => {
                this.showSprint();
            })
            .get('/games/audio-call', () => {
                this.showAudioCall();
            })
            .get('/stats', () => {
                this.showStats();
            })
            .error(404, () => {
                //this.show404();
                router.navigate('/');
            })
            .run();
    }

    showMain() {
        document.body.innerHTML = '';
        this.createPage();
        this.createLogin();
    }

    showBook() {
        document.body.innerHTML = '';
        const render = new Render();
        const header = render.header();
        const footer = render.footer();
        const pageBook = render.pageBook();
        const main = render.main();
        const body = getHTMLElement(document.querySelector('body'));
        body.appendChild(header);
        body.appendChild(main);
        main.appendChild(pageBook);
        body.appendChild(footer);
    }

    showBookPage(group: number, page: number) {
        const body = getHTMLElement(document.body);
        let nextPage;
        let nextDisabled;
        if (page >= 30) {
            nextPage = 30;
            nextDisabled = 'no-link';
        } else {
            nextPage = page + 1;
            nextDisabled = '';
        }

        let prevPage;
        let prevDisabled;
        if (page <= 1) {
            prevPage = 1;
            prevDisabled = 'no-link';
        } else {
            prevPage = page - 1;
            prevDisabled = '';
        }

        body.innerHTML = `
            <h2>Страницы учебника</h2>
            <a href="/">Главная</a>
            <a href="/book/${group}/${prevPage}" class="${prevDisabled}">Назад</a>
            <a href="/book/${group}/${nextPage}" class="${nextDisabled}">Вперед</a>   
        `;
    }

    showGames() {
        document.body.innerHTML = '';
        const render = new Render();
        const header = render.header();
        const footer = render.footer();
        const pageGames = render.pageGames();
        const main = render.main();
        const body = getHTMLElement(document.querySelector('body'));
        body.appendChild(header);
        body.appendChild(main);
        main.appendChild(pageGames);
        body.appendChild(footer);
    }

    showStats() {
        document.body.innerHTML = '';
        const render = new Render();
        const header = render.header();
        const footer = render.footer();
        const pageStats = render.pageStats();
        const main = render.main();
        const body = getHTMLElement(document.querySelector('body'));
        body.appendChild(header);
        body.appendChild(main);
        main.appendChild(pageStats);
        body.appendChild(footer);
    }

    showSprint() {
        document.body.innerHTML = '';
        const render = new Render();
        const header = render.header();
        const footer = render.footer();
        const gameSprint = render.gameSprint();
        const main = render.main();
        const body = getHTMLElement(document.querySelector('body'));
        body.appendChild(header);
        body.appendChild(main);
        main.appendChild(gameSprint);
        body.appendChild(footer);
    }

    showAudioCall() {
        document.body.innerHTML = '';
        const render = new Render();
        const header = render.header();
        const footer = render.footer();
        const gameAudioCall = render.gameAudioCall();
        const main = render.main();
        const body = getHTMLElement(document.querySelector('body'));
        body.appendChild(header);
        body.appendChild(main);
        main.appendChild(gameAudioCall);
        body.appendChild(footer);
    }

    createLogin() {
        const render = new Render();
        const modal = render.modalLogin();
        document.body.append(modal);
        new ModalLogin(modal);

        let state = new State();
        const loginForm = getHTMLElement(modal.querySelector('[data-type="login"] form'));
        const loginMessage = getHTMLElement(loginForm.querySelector('.js-signin-modal__message'));
        const loginBtn = getHTMLInputElement(loginForm.querySelector('[type="submit"]'));
        const loginEmailBox = getHTMLInputElement(loginForm.querySelector('#signin-email'));
        const loginPasswordBox = getHTMLInputElement(loginForm.querySelector('#signin-password'));

        const signupForm = getHTMLElement(modal.querySelector('[data-type="signup"] form'));
        const signupMessage = getHTMLElement(signupForm.querySelector('.js-signin-modal__message'));
        const signupBtn = getHTMLInputElement(signupForm.querySelector('[type="submit"]'));

        if (state.token) {
            loginBtn.value = 'Выйти';
            loginEmailBox.disabled = true;
            loginPasswordBox.disabled = true;
            signupBtn.disabled = true;
            loginMessage.textContent = 'Вы авторизованы';
        } else loginMessage.textContent = 'Вы неавторизованы';

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!state.token) {
                //Войти
                const email = loginEmailBox.value;
                const password = loginPasswordBox.value;

                const login = await this.data.login({ email, password });
                if (typeof login != 'number') {
                    state.token = login.token;
                    loginBtn.value = 'Выйти';
                    loginEmailBox.disabled = true;
                    loginPasswordBox.disabled = true;
                    signupBtn.disabled = true;
                    loginMessage.textContent = 'Вы авторизованы';
                } else {
                    loginMessage.textContent = 'Неверный пароль или почта';
                    //console.log('Incorrect e-mail or password'); //only 403
                }
            } else {
                //Нажали "Выйти"
                state.token = '';
                localStorage.setItem('state', JSON.stringify(state));
                loginBtn.value = 'Войти';
                signupBtn.disabled = false;
                loginEmailBox.disabled = false;
                loginPasswordBox.disabled = false;
                loginMessage.textContent = 'Вы неавторизованы';
            }
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = getHTMLInputElement(signupForm.querySelector('#signup-username')).value;
            const email = getHTMLInputElement(signupForm.querySelector('#signup-email')).value;
            const password = getHTMLInputElement(signupForm.querySelector('#signup-password')).value;

            const user = await this.data.createUser({ name, email, password });
            if (typeof user != 'number') {
                signupMessage.textContent = 'Аккаунт создан';
                // const login = await this.data.login({ email, password });
                // if (typeof login != 'number') {
                //     console.log(login);
                //     state.token = login.token;
                //     loginBtn.value = 'Выйти';
                //     signupBtn.disabled = true;
                // } else {
                //     console.log('ошибка авто логирования после регистрации');
                // }
            } else {
                if (user === 422) signupMessage.textContent = 'Неверный пароль, имя или почта';
                else if (user === 417) signupMessage.textContent = 'Аккаунт уже существует';
            }
        });
    }
}
