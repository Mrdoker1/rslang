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

//State
import State from './state';

export default class App {
    data: Data;
    constructor(base: string) {
        this.data = new Data(base);
    }

    async start() {
        this.initRouter();
        this.createPage();
        //State use example
        let obj1 = new State();
        let obj2 = new State();
        obj1.token = '12345678';
        obj2.token;
        console.log(obj1 === obj2);
        console.log(obj2.token);
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
        const router = createRouter()
            .get('/', (req) => {
                this.showMain();
                Render.currentLink(req.path);
            })
            .get('/book', (req) => {
                this.showBook();
                Render.currentLink(req.path);
            })
            .get('/book/:group/:page', (url) => {
                const group = Number(url.params.group);
                const page = Number(url.params.page);
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
        const render = new Render();
        const sectionSplash = render.sectionSplash();
        const sectionDevelovers = render.sectionDevelovers();
        const sectionBenefits = render.sectionBenefits();
        const sectionGames = render.sectionGames();
        main.appendChild(sectionSplash);
        main.appendChild(sectionDevelovers);
        main.appendChild(sectionBenefits);
        main.appendChild(sectionGames);
        //this.createPage();
    }

    showBook() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const render = new Render();
        const pageBook = render.pageBook();
        main.appendChild(pageBook);
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
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const render = new Render();
        const pageGames = render.pageGames();
        main.appendChild(pageGames);
    }

    showStats() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const render = new Render();
        const pageStats = render.pageStats();
        main.appendChild(pageStats);
    }

    showSprint() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const render = new Render();
        const gameSprint = render.gameSprint();
        main.appendChild(gameSprint);
    }

    showAudioCall() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const render = new Render();
        const gameAudioCall = render.gameAudioCall();
        main.appendChild(gameAudioCall);
    }
}
