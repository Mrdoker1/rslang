//Utils
import getHTMLElement from '../../../utils/getHTMLElement';
import getHTMLInputElement from '../../../utils/getHTMLInputElement';
import { createStsEntry } from '../../../utils/helpers';

//Interface
import ISettings from '../../interface/ISettings';

//Router
import { Router } from 'routerjs';

//State
import State from '../../app/state';

//API
import Data from '../../api';

let tokenTimer: ReturnType<typeof setTimeout>;

class ModalLogin {
    data: Data;
    router: Router;
    // period: number = 1000 * 60; //a minute;
    period: number = 1000 * 60 * 60 * 3; //three hours;
    state = new State();

    constructor(base: string, router: Router) {
        this.data = new Data(base);
        this.router = router;
    }

    init() {
        this.initTriggers();
        this.initModalBtns();

        let state = this.state;
        const modal = getHTMLElement(document.querySelector('.cd-signin-modal'));
        const loginForm = getHTMLElement(modal.querySelector('[data-type="login"] form'));
        const loginMessage = getHTMLElement(loginForm.querySelector('.js-signin-modal__message'));
        const loginEmailBox = getHTMLInputElement(loginForm.querySelector('#signin-email'));
        const loginPasswordBox = getHTMLInputElement(loginForm.querySelector('#signin-password'));

        const signupForm = getHTMLElement(modal.querySelector('[data-type="signup"] form'));
        const signupMessage = getHTMLElement(signupForm.querySelector('.js-signin-modal__message'));

        const signupLink = getHTMLElement(document.querySelector('[data-signin="signup"]'));
        const loginLink = getHTMLElement(document.querySelector('[data-signin="login"]'));
        const logoutLink = getHTMLElement(document.querySelector('[data-signin="logout"]'));

        const user = getHTMLElement(document.querySelector('.user'));
        const userAvatar = getHTMLElement(user.querySelector('.user__avatar'));
        const userName = getHTMLElement(user.querySelector('.user__name'));
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            state.token = '';
            state.userId = '';
            state.name = '';
            state.refreshToken = '';
            state.tokenTime = '';
            clearTimeout(tokenTimer);

            logoutLink.classList.add('hidden');
            loginLink.classList.remove('hidden');
            signupLink.classList.remove('hidden');

            user.classList.add('hidden');
            this.router.run();
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginEmailBox.value;
            const password = loginPasswordBox.value;

            const login = await this.data.login({ email, password });
            if (typeof login != 'number') {
                state.token = login.token;
                state.userId = login.userId;
                state.name = login.name;
                state.refreshToken = login.refreshToken;
                state.tokenTime = new Date().toString();

                loginLink.classList.add('hidden');
                logoutLink.classList.remove('hidden');
                signupLink.classList.add('hidden');

                userAvatar.innerHTML = state.name.charAt(0);
                userName.innerHTML = state.name;
                user.classList.remove('hidden');

                modal.classList.remove('cd-signin-modal--is-visible');

                this.router.run();
                tokenTimer = setTimeout(this.updateToken.bind(this), this.period);
            } else {
                loginMessage.textContent = 'Неверный пароль или почта';
            }
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = getHTMLInputElement(signupForm.querySelector('#signup-username')).value;
            const email = getHTMLInputElement(signupForm.querySelector('#signup-email')).value;
            const password = getHTMLInputElement(signupForm.querySelector('#signup-password')).value;

            const createUser = await this.data.createUser({ name, email, password });
            if (typeof createUser != 'number') {
                const login = await this.data.login({ email, password });
                if (typeof login != 'number') {
                    state.token = login.token;
                    state.name = login.name;
                    state.userId = login.userId;
                    state.refreshToken = login.refreshToken;
                    state.tokenTime = new Date().toString();

                    loginLink.classList.add('hidden');
                    logoutLink.classList.remove('hidden');
                    signupLink.classList.add('hidden');

                    userAvatar.innerHTML = state.name.charAt(0);
                    userName.innerHTML = state.name;
                    user.classList.remove('hidden');

                    modal.classList.remove('cd-signin-modal--is-visible');

                    tokenTimer = setTimeout(this.updateToken.bind(this), this.period);
                    await this.addFirstStatistics();
                    await this.userSettings();
                    this.router.run();
                }
            } else {
                if (createUser === 422) signupMessage.textContent = 'Неверный пароль, имя или почта';
                else if (createUser === 417) signupMessage.textContent = 'Аккаунт уже существует';
            }
        });

        if (state.token) {
            this.checkToken();
            loginLink.classList.add('hidden');
            signupLink.classList.add('hidden');
            userAvatar.innerHTML = state.name.charAt(0);
            userName.innerHTML = state.name;
        } else {
            signupLink.classList.remove('hidden');
            logoutLink.classList.add('hidden');
            user.classList.add('hidden');
        }
    }

    async addFirstStatistics() {
        const stsAll = {
            learnedWords: 0,
            optional: {
                1: createStsEntry(),
            },
        };

        const updateUserStatistics = await this.data.updateUserStatistics(this.state.userId, stsAll, this.state.token);
        if (typeof updateUserStatistics === 'number') {
            console.log(`Ошибка updateUserStatistics ${updateUserStatistics}`);
            return;
        }
    }

    initModalBtns() {
        const modal = getHTMLElement(document.querySelector('.cd-signin-modal'));
        modal.addEventListener('click', (e) => {
            const target = getHTMLElement(e.target);
            const messages = modal.querySelectorAll('.cd-signin-modal__message');
            if (target.classList.contains('js-signin-modal') || target.classList.contains('js-close')) {
                e.preventDefault();
                modal.classList.remove('cd-signin-modal--is-visible');
                messages.forEach((mes) => {
                    mes.textContent = '';
                });
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.classList.remove('cd-signin-modal--is-visible');
        });

        //hide password
        const hidePassword: NodeListOf<HTMLElement> = modal.querySelectorAll('.js-hide-password');
        hidePassword.forEach((password) => {
            password.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePassword(password);
            });
        });
    }

    initTriggers() {
        const triggers = document.querySelectorAll('.js-signin-modal-trigger');
        triggers.forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                const target = getHTMLElement(e.target);
                if (target.hasAttribute('data-signin')) {
                    e.preventDefault();
                    const type = target.getAttribute('data-signin');
                    if (type) this.showSigninForm(type);
                }
            });
        });
    }

    //main page
    initSecondTrigger() {
        const triggers: NodeListOf<HTMLElement> = document.querySelectorAll('main .js-signin-modal-trigger');
        triggers.forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                const target = getHTMLElement(e.target);
                if (target.hasAttribute('data-signin')) {
                    e.preventDefault();
                    const type = target.getAttribute('data-signin');
                    if (type) this.showSigninForm(type);
                }
            });
            if (this.state.token) trigger.classList.add('hidden');
            else trigger.classList.remove('hidden');
        });
    }

    checkToken() {
        const state = new State();
        const lastUpdate = new Date(state.tokenTime);
        const curTime = new Date();
        const diff = curTime.getTime() - lastUpdate.getTime();

        if (diff > this.period) {
            this.updateToken();
        } else {
            const remainingTime = this.period - diff;
            tokenTimer = setTimeout(this.updateToken.bind(this), remainingTime);
        }
    }

    async updateToken() {
        const state = new State();

        const updToken = await this.data.updateToken(state.userId, state.refreshToken);
        if (typeof updToken !== 'number') {
            console.log('updToken working');

            const curTime = new Date();
            state.tokenTime = curTime.toString();
            state.token = updToken.token;
            state.refreshToken = updToken.refreshToken;

            tokenTimer = setTimeout(this.updateToken.bind(this), this.period);
        } else {
            console.log(`Не могу обновить токен: ${updToken}`);

            const loginLink = getHTMLElement(document.querySelector('[data-signin="login"]'));
            const logoutLink = getHTMLElement(document.querySelector('[data-signin="logout"]'));
            const signupLink = getHTMLElement(document.querySelector('[data-signin="signup"]'));
            const user = getHTMLElement(document.querySelector('.user'));
            logoutLink.classList.add('hidden');
            loginLink.classList.remove('hidden');
            signupLink.classList.remove('hidden');
            user.classList.add('hidden');

            state.name = '';
            state.userId = '';
            state.token = '';
            state.refreshToken = '';
            state.tokenTime = '';
            this.router.run();
        }
    }

    showSigninForm(type: string) {
        const modal = getHTMLElement(document.querySelector('.cd-signin-modal'));
        const blocks = modal.querySelectorAll('.js-signin-modal-block');
        const switchers = modal.querySelectorAll('.js-signin-modal-switcher a');

        if (!modal.classList.contains('cd-signin-modal--is-visible')) {
            modal.classList.add('cd-signin-modal--is-visible');
        }

        blocks.forEach((block) => {
            if (block.getAttribute('data-type') === type) block.classList.add('cd-signin-modal__block--is-selected');
            else block.classList.remove('cd-signin-modal__block--is-selected');
        });

        const switcherType = type == 'signup' ? 'signup' : 'login';
        switchers.forEach((switcher) => {
            if (switcher.getAttribute('data-type') === switcherType) switcher.classList.add('cd-selected');
            else switcher.classList.remove('cd-selected');
        });
    }

    togglePassword(target: HTMLElement) {
        const password = getHTMLInputElement(target.previousElementSibling);
        if ('password' == password.getAttribute('type')) password.setAttribute('type', 'text');
        else password.setAttribute('type', 'password');

        target.textContent = 'Скрыть' == target.textContent ? 'Показать' : 'Скрыть';
        this.putCursorAtEnd(password);
    }

    putCursorAtEnd(input: HTMLInputElement) {
        if (input.setSelectionRange) {
            const len = input.value.length * 2;
            input.focus();
            input.setSelectionRange(len, len);
        }
    }

    async userSettings(userSettings?: ISettings) {
        const state = new State();

        const defaultSettings = {
            wordsPerDay: 1,
            optional: {
                listView: false,
                showButtons: true,
                avatar: 'empty',
            },
        };

        if (state.token) {
            const settings = await this.data.getUserSettings(state.userId, state.token);
            if (typeof settings === 'number') {
                //Если настроек нет
                if (userSettings) {
                    // Хотим отправить
                    await this.data.updateUserSettings(state.userId, userSettings, state.token);
                    return true;
                } else {
                    // Хотим получить
                    await this.data.updateUserSettings(state.userId, defaultSettings, state.token);
                    return defaultSettings;
                }
            } else {
                //Если настройки есть
                if (userSettings) {
                    // Хотим отправить
                    await this.data.updateUserSettings(state.userId, userSettings, state.token);
                    return true;
                } else {
                    // Хотим получить
                    //console.log(settings);
                    return settings;
                }
            }
        } else return false;
    }
}

export default ModalLogin;
