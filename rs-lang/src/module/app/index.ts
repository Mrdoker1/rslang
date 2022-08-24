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
        //this.createPage();
        this.initRouter();
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
    }

    showBook() {
        document.body.innerHTML = '';
        const render = new Render();
        const header = render.header();
        const footer = render.footer();
        const pageBook = render.pageBook();
        const main = render.main();
        const body = getHTMLElement(document.body);
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
        const body = getHTMLElement(document.body);
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
        const body = getHTMLElement(document.body);
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
        const body = getHTMLElement(document.body);
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
        const body = getHTMLElement(document.body);
        body.appendChild(header);
        body.appendChild(main);
        main.appendChild(gameAudioCall);
        body.appendChild(footer);
    }
}
