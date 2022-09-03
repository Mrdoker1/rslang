import getHTMLElement from '../../../utils/getHTMLElement';
import getHTMLInputElement from '../../../utils/getHTMLInputElement';

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

        //let state = new State();
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
        const registerLink = getHTMLElement(document.querySelector('[data-signin="register"]'));
        const userAvatar = getHTMLElement(document.querySelector('.user__avatar'));
        const userName = getHTMLElement(document.querySelector('.user__name'));
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
            registerLink.classList.remove('hidden');
            userAvatar.parentElement!.classList.add('hidden');
            this.router.run();
        });

        if (state.token) {
            loginLink.classList.add('hidden');
            registerLink.classList.add('hidden');
            userAvatar.innerHTML = state.name.charAt(0);
            userName.innerHTML = state.name;
        } else {
            logoutLink.classList.add('hidden');
            userAvatar.parentElement!.classList.add('hidden');
        }

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
                registerLink.classList.add('hidden');
                userAvatar.innerHTML = state.name.charAt(0);
                userName.innerHTML = state.name;
                userAvatar.parentElement!.classList.remove('hidden');
                signupLink.classList.add('hidden');
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

            const user = await this.data.createUser({ name, email, password });
            if (typeof user != 'number') {
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
                    modal.classList.remove('cd-signin-modal--is-visible');
                    this.router.run();
                    tokenTimer = setTimeout(this.updateToken.bind(this), this.period);
                }
            } else {
                if (user === 422) signupMessage.textContent = 'Неверный пароль, имя или почта';
                else if (user === 417) signupMessage.textContent = 'Аккаунт уже существует';
            }
        });

        if (state.token) {
            this.checkToken();
            loginLink.classList.add('hidden');
            signupLink.classList.add('hidden');
        } else {
            signupLink.classList.remove('hidden');
            logoutLink.classList.add('hidden');
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
            password.addEventListener('click', () => {
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
        const trigger = getHTMLElement(document.querySelector('main .js-signin-modal-trigger'));
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
            state.name = '';
            const loginLink = getHTMLElement(document.querySelector('[data-signin="login"]'));
            const logoutLink = getHTMLElement(document.querySelector('[data-signin="logout"]'));
            logoutLink.classList.add('hidden');
            loginLink.classList.remove('hidden');

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
}

export default ModalLogin;
