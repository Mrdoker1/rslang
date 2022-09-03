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
    element: HTMLElement;
    blocks: NodeListOf<HTMLElement>;
    switchers: NodeListOf<HTMLElement>;
    triggers: NodeListOf<HTMLElement>;
    hidePassword: NodeListOf<HTMLElement>;
    data: Data;
    router: Router;
    // period: number = 1000 * 60; //a minute;
    period: number = 1000 * 60 * 60 * 3; //three hours;

    constructor(element: HTMLElement, base: string, router: Router) {
        this.data = new Data(base);
        this.router = router;
        this.element = element;
        this.blocks = this.element.querySelectorAll('.js-signin-modal-block');
        this.switchers = this.element.querySelectorAll('.js-signin-modal-switcher a');
        this.triggers = document.querySelectorAll('.js-signin-modal-trigger');
        this.hidePassword = this.element.querySelectorAll('.js-hide-password');
        this.init();
    }

    init() {
        for (let i = 0; i < this.triggers.length; i++) {
            this.triggers[i].addEventListener('click', (e) => {
                const target = getHTMLElement(e.target);
                if (target.hasAttribute('data-signin')) {
                    e.preventDefault();
                    const type = target.getAttribute('data-signin');
                    if (type) this.showSigninForm(type);
                }
            });
        }
        //close modal
        this.element.addEventListener('click', (e) => {
            const target = getHTMLElement(e.target);
            const messages = this.element.querySelectorAll('.cd-signin-modal__message');
            if (target.classList.contains('js-signin-modal') || target.classList.contains('js-close')) {
                e.preventDefault();
                this.element.classList.remove('cd-signin-modal--is-visible');
                messages.forEach((mes) => {
                    mes.textContent = '';
                });
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.element.classList.remove('cd-signin-modal--is-visible');
        });

        //hide/show password
        for (let i = 0; i < this.hidePassword.length; i++) {
            this.hidePassword[i].addEventListener('click', () => {
                this.togglePassword(this.hidePassword[i]);
            });
        }

        let state = new State();
        const modal = this.element;
        const loginForm = getHTMLElement(modal.querySelector('[data-type="login"] form'));
        const loginMessage = getHTMLElement(loginForm.querySelector('.js-signin-modal__message'));
        const loginEmailBox = getHTMLInputElement(loginForm.querySelector('#signin-email'));
        const loginPasswordBox = getHTMLInputElement(loginForm.querySelector('#signin-password'));

        const signupForm = getHTMLElement(modal.querySelector('[data-type="signup"] form'));
        const signupMessage = getHTMLElement(signupForm.querySelector('.js-signin-modal__message'));

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
                    modal.classList.remove('cd-signin-modal--is-visible');
                    this.router.run();
                    tokenTimer = setTimeout(this.updateToken.bind(this), this.period);
                }
            } else {
                if (user === 422) signupMessage.textContent = 'Неверный пароль, имя или почта';
                else if (user === 417) signupMessage.textContent = 'Аккаунт уже существует';
            }
        });

        if (state.token) this.checkToken();
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
            //console.log('updToken working');
            const curTime = new Date();
            state.tokenTime = curTime.toString();
            state.token = updToken.token;
            state.refreshToken = updToken.refreshToken;
            tokenTimer = setTimeout(this.updateToken.bind(this), this.period);
        } else {
            console.log(`Ошибка ${updToken}`);
            state.name = '';
            state.userId = '';
            state.token = '';
            state.refreshToken = '';
            state.tokenTime = '';
            this.router.run();
        }
    }

    showSigninForm(type: string) {
        // show modal if not visible
        if (!this.element.classList.contains('cd-signin-modal--is-visible'))
            this.element.classList.add('cd-signin-modal--is-visible');
        // show selected form
        for (var i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            if (block.getAttribute('data-type') == type) block.classList.add('cd-signin-modal__block--is-selected');
            else block.classList.remove('cd-signin-modal__block--is-selected');
        }
        //update switcher appearance
        var switcherType = type == 'signup' ? 'signup' : 'login';
        for (var i = 0; i < this.switchers.length; i++) {
            const switcher = this.switchers[i];
            if (switcher.getAttribute('data-type') == switcherType) switcher.classList.add('cd-selected');
            else switcher.classList.remove('cd-selected');
        }
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
            var len = input.value.length * 2;
            input.focus();
            input.setSelectionRange(len, len);
        }
    }
}

export default ModalLogin;
