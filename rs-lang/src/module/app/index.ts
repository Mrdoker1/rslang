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
import '../ui/styles/pageBook.scss';

//Router
import { createRouter } from 'routerjs';

//Styles
import '../../global.scss';

//State
import State from './state';

export default class App {
    data: Data;
    render: Render;

    constructor(base: string) {
        this.data = new Data(base);
        this.render = new Render();
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
                this.showBook(0);
                Render.currentLink(req.path);
            })
            .get('/book/:group/:page', (url, req) => {
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
        const sectionSplash = this.render.sectionSplash();
        const sectionDevelovers = this.render.sectionDevelovers();
        const sectionBenefits = this.render.sectionBenefits();
        const sectionGames = this.render.sectionGames();
        main.appendChild(sectionSplash);
        main.appendChild(sectionDevelovers);
        main.appendChild(sectionBenefits);
        main.appendChild(sectionGames);
        //this.createPage();
    }

    async showBook(group: number) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageBook = this.render.pageBook();

        const dataWords = await this.data.getWords(0);
        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const cardsArr = Object.values(dataWords).map((item) => {
                return this.render.cardWord(item);
            });
            console.log(dataWords);
            for (let i = 0; i <= 5; i++) {
                const wordLevels = this.render.wordLevels(i);
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += wordLevels;
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

    async showBookPage(group: number, page: number) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageBook = this.render.pageBook();

        const dataWords = await this.data.getWords(group, page);
        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const cardsArr = Object.values(dataWords).map((item) => {
                return this.render.cardWord(item);
            });
            console.log(dataWords);
            for (let i = 0; i <= 5; i++) {
                const wordLevels = this.render.wordLevels(i);
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += wordLevels;
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
}
