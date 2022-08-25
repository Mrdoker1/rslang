import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLInputElement from '../../utils/getHTMLInputElement';

class ModalLogin {
    element: HTMLElement;
    blocks: NodeListOf<HTMLElement>;
    switchers: NodeListOf<HTMLElement>;
    triggers: NodeListOf<HTMLElement>;
    hidePassword: NodeListOf<HTMLElement>;

    constructor(element: HTMLElement) {
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
            if (target.classList.contains('js-signin-modal') || target.classList.contains('js-close')) {
                e.preventDefault();
                this.element.classList.remove('cd-signin-modal--is-visible');
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
