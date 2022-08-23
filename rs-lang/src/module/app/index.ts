//API
import Data from '../../module/api';

//UI
import Render from '../ui';

//Utils
import getHTMLElement from '../../utils/getHTMLElement';

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

//Router
import { createRouter } from 'routerjs';

//Styles
import '../../global.scss';

export default class App {
    data: Data;
    constructor(base: string) {
        this.data = new Data(base);
    }

    async start() {
        this.createPage();
        this.initRouter();
    }

    createPage() {
        const render = new Render();
        const header = render.header();
        const body = getHTMLElement(document.body);
        body.appendChild(header);
        header.innerHTML += `<h1>RSLang</h1>`;
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
        const body = getHTMLElement(document.body);
        body.innerHTML = `
            <h2>Главная</h2>
            <a href="/">Главная</a>
            <a href="/book">Учебник</a>
            <a href="/games">Игры</a>
            <a href="/stats">Статистика</a>
        `;
    }

    showBook() {
        const body = getHTMLElement(document.body);
        body.innerHTML = `
            <h2>Учебник</h2>
            <a href="/">Главная</a>
            <a href="/book/1/1">Первый раздел</a>
            <a href="/book/2/1">Второй раздел</a>
            <a href="/book/3/1>Третий раздел</a>
        `;
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
        const body = getHTMLElement(document.body);
        body.innerHTML = `
            <h2>Игры</h2>
            <a href="/">Главная</a>
            <a href="/games/sprint">Играть в Спринт</a>
            <a href="/games/audio-call">Играть в Аудио-вызов</a>
        `;
    }

    showStats() {
        const body = getHTMLElement(document.body);
        body.innerHTML = `
            <h2>Статистика</h2>
            <a href="/">Главная</a>
        `;
    }

    showSprint() {
        const body = getHTMLElement(document.body);
        body.innerHTML = `
            <h2>Игра Спринт</h2>
            <a href="/">Главная</a>
        `;
    }

    showAudioCall() {
        const body = getHTMLElement(document.body);
        body.innerHTML = `
            <h2>Игра Аудио-вызов</h2>
            <a href="/">Главная</a>
        `;
    }
}
