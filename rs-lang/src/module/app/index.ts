//API
import Data from '../../module/api';

//UI
import Render from '../ui';

//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLInputElement from '../../utils/getHTMLInputElement';
import { getRandom } from '../../utils/helpers';

//Interface
import IUserBody from '../interface/IUserBody';
import IWord from '../interface/IWord';
import IAggregatedWord from '../interface/IAggregatedWord';

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
import '../ui/styles/games.scss';
import '../ui/styles/sprint.scss';
import '../ui/styles/chart.scss';
import '../ui/styles/gameResult.scss';
import '../ui/styles/gameResultWords.scss';

//Router
import { createRouter, Router } from 'routerjs';

//Login
import ModalLogin from '../components/login';

//Games
import Sprint from '../components/sprint';
import AudioCall from '../components/audio-call';

//State
import State from './state';

export default class App {
    data: Data;
    render: Render;
    router: Router;

    constructor(base: string) {
        this.data = new Data(base);
        this.render = new Render();
        this.router = createRouter();
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
        const header = render.header();
        const main = render.main();
        const footer = render.footer();
        const body = getHTMLElement(document.body);

        body.appendChild(header);
        body.appendChild(main);
        body.appendChild(footer);
    }

    initRouter() {
        this.router
            .get('/', (req) => {
                this.showMain();
                Render.currentLink(req.path);
            })
            .get('/book', (req) => {
                this.showBook(0);
                Render.currentLink(req.path);
            })
            .get('/book/:group/:page', (req) => {
                const group = Number(req.params.group);
                const page = Number(req.params.page);
                console.log(group);
                if (group === 6) {
                    this.showBookPageHard(group, page);
                }
                this.showBookPage(group, page);
                Render.currentLink(req.path);
            })
            .get('/games', (req) => {
                this.showGames();
                Render.currentLink(req.path);
            })
            .get('/games/sprint', (req) => {
                this.showGameDifficulty('sprint');
                Render.currentLink(req.path);
            })
            .get('/games/sprint/:group/:page', (req) => {
                const group = Number(req.params.group);
                const page = Number(req.params.page);
                this.showSprint(group, page);
                Render.currentLink(req.path);
            })
            .get('/games/audio-call', (req) => {
                this.showGameDifficulty('audio-call');
                Render.currentLink(req.path);
            })
            .get('/games/audio-call/:group/:page', (req) => {
                const group = Number(req.params.group);
                const page = Number(req.params.page);
                this.showAudioCall(group, page);
                Render.currentLink(req.path);
            })
            .get('/stats', (req) => {
                this.showStatistics();
                Render.currentLink(req.path);
            })
            .error(404, () => {
                //this.show404();
                this.router.navigate('/');
            })
            .run();
    }

    showMain() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const sectionSplash = this.render.sectionSplash();
        const sectionDevelopers = this.render.sectionDevelopers();
        const sectionBenefits = this.render.sectionBenefits();
        const sectionGames = this.render.sectionGames();
        main.appendChild(sectionSplash);
        main.appendChild(sectionDevelopers);
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
                return this.render.cardWord(item, loginStatus, item.id);
            });

            const wordLevels = this.render.wordLevels();
            getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
            }

            const pagination = this.render.bookPagination(group, 29);
            getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

            cardsArr.forEach((card) => {
                getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += card;
            });

            main.appendChild(pageBook);
        }
    }

    async showBookPageHard(group: number, page: number) {
        let state = new State();
        const userId = state.userId;
        const token = state.token;
        console.log(page);
        const dataWords = await this.data.getUserAggregatedWords(
            userId,
            '',
            `${page}`,
            '20',
            '%7B%22%24and%22%3A%5B%7B%22userWord.difficulty%22%3A%22hard%22%7D%5D%7D',
            token
        );
        // userId,`?page=${page - 1}&wordsPerPage=20&filter=%7B%22%24and%22%3A%5B%7B%22userWord.difficulty%22%3A%22hard%22%7D%5D%7D`,token
        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const main = getHTMLElement(document.querySelector('.main'));
            main.innerHTML = '';
            const pageBook = this.render.pageBook();
            const state = new State();
            const loginStatus = state.token ? true : false;

            const wordLevels = this.render.wordLevels();
            getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
            }

            let wordsCount = 0;
            Object.values(dataWords).map((item) => {
                const wordsArray = Object.values(item);
                wordsCount = Object.values(item)[1][0].count;

                wordsArray[0].forEach((item: IWord) => {
                    return (getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += this.render.cardWord(
                        item,
                        loginStatus,
                        item._id
                    ));
                });
            });

            const pagesCount = Math.ceil(wordsCount / 20);
            console.log(pagesCount, page);
            const pagination = this.render.bookPagination(6, pagesCount);
            getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

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
                return this.render.cardWord(item, loginStatus, item.id);
            });

            const wordLevels = this.render.wordLevels();
            getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageBook.querySelector('.word-levels__list')).innerHTML += hardWords;
            }

            const pagination = this.render.bookPagination(group, 29);
            getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

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

    showStatistics() {
        const main = getHTMLElement(document.querySelector('.main'));

        const date1 = new Date();
        date1.setHours(0, 0, 0, 0);

        const date2 = new Date(2022, 7, 10);
        date2.setHours(0, 0, 0, 0);

        const statisticsDay1 = {
            date: date1.toString(),
            sprint: {
                new: 10,
                total: 20,
                right: 5,
                record: 5,
                learned: 5,
            },
            audio: {
                new: 20,
                total: 30,
                right: 15,
                record: 5,
                learned: 10,
            },
            book: {
                new: 10,
                learned: 10,
            },
        };

        const statisticsDay2 = {
            date: date2.toString(),
            sprint: {
                new: 4,
                total: 30,
                right: 3,
                record: 10,
                learned: 5,
            },
            audio: {
                new: 9,
                total: 21,
                right: 5,
                record: 3,
                learned: 5,
            },
            book: {
                new: 5,
                learned: 10,
            },
        };

        const statistics = {
            learnedWords: 0,
            optional: {
                1: statisticsDay1,
                2: statisticsDay2,
            },
        };

        main.innerHTML = '';
        const pageStats = this.render.pageStatistics(statistics);
        main.appendChild(pageStats);
    }

    showGameDifficulty(type: string) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const game = this.render.gameDifficulty(type);
        main.append(game);

        const start = getHTMLElement(game.querySelector('.game__start'));
        start.addEventListener('click', (e) => {
            const checked = getHTMLInputElement(game.querySelector('[type="radio"]:checked'));
            const href = `/games/${type}/${checked.value}/${getRandom(0, 29)}`;
            this.router.navigate(href);
        });
    }

    async showSprint(group: number, page: number) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const words = await this.data.getWords(group, page);
        if (typeof words === 'number') {
            console.log(`error ${words}`);
            return;
        }
        const sprint = new Sprint(this.data.base, words, group, page);
        sprint.start();
        //const gameSprint = this.render.gameSprint(group, page);
        //main.appendChild(gameSprint);
    }

    async showAudioCall(group: number, page: number) {
        const audioCall = new AudioCall(this.data.base, group, page);
        audioCall.start();
    }

    createLogin() {
        const modal = this.render.modalLogin();
        document.body.append(modal);
        new ModalLogin(modal, this.data.base, this.router);
    }
}
