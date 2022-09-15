//API
import Data from '../../module/api';

//UI
import Render from '../ui';

//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLInputElement from '../../utils/getHTMLInputElement';
import { gameType } from '../../utils/enums';
import { getRandom, createStsEntry, toggleMenu, closeMenu } from '../../utils/helpers';

//Interface
import IWord from '../interface/IWord';
import IUserWord from '../interface/IUserWord';
import ISettings from '../interface/ISettings';

//Style
import '../../global.scss';
import '../ui/styles/header.scss';
import '../ui/styles/sectionSplash.scss';
import '../ui/styles/sectionDevelopers.scss';
import '../ui/styles/sectionBenefits.scss';
import '../ui/styles/sectionGames.scss';
import '../ui/styles/footer.scss';
import '../ui/styles/login.scss';
import '../ui/styles/pageAbout.scss';
import '../ui/styles/pageBook.scss';
import '../ui/styles/games.scss';
import '../ui/styles/sprint.scss';
import '../ui/styles/chart.scss';
import '../ui/styles/gameResult.scss';
import '../ui/styles/gameResultWords.scss';
import '../ui/styles/statistics.scss';
import '../ui/styles/particles.scss';

//Pagination
import paginate from 'do-paginate';

//Router
import { createRouter, Router } from 'routerjs';

//Login
import ModalLogin from '../components/login';

//Games
import Sprint from '../components/sprint';
import AudioCall from '../components/audio-call';

//Animation
import Animation1 from '../../utils/animation-1';

//State
import State from './state';

export default class App {
    data: Data;
    render: Render;
    router: Router;
    login: ModalLogin;

    constructor(base: string) {
        this.data = new Data(base);
        this.render = new Render();
        this.router = createRouter();
        this.login = new ModalLogin(base, this.router);
    }

    async start() {
        this.initState();
        this.createPage();
        this.initRouter();
        this.createLogin();
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
        const state = new State();
        const userName = state.name;
        const header = render.header(userName);
        const main = render.main();
        const footer = render.footer();
        const body = getHTMLElement(document.body);

        body.appendChild(header);
        body.appendChild(main);
        body.appendChild(footer);

        this.avatarHandler();

        const burger = getHTMLElement(document.querySelector('.header__burger'));

        burger.addEventListener('click', toggleMenu);
    }

    initRouter() {
        this.router
            .get('/', (req) => {
                this.showMain();
                Render.currentLink(req.path);
                this.login.initSecondTrigger();
                closeMenu();
            })
            .get('/book', (req) => {
                this.router.navigate('/book/0/0');
                closeMenu();
            })
            .get('/book/:group/:page', (req) => {
                const state = new State();
                const loginStatus = state.token ? true : false;

                const group = Number(req.params.group);
                const page = Number(req.params.page);
                if (group === 6) {
                    this.showBookPageHard(group, page);
                } else if (!loginStatus) {
                    this.showBook(group, page);
                } else {
                    this.showBookPage(group, page);
                }
                Render.currentLink(req.path);
                closeMenu();
            })
            .get('/book/sprint/:group/:page', (req) => {
                const group = Number(req.params.group);
                const page = Number(req.params.page);
                if (new State().token === '') {
                    this.router.navigate(`/book/${group}/${page}`);
                    return;
                }
                this.showSprint(group, page, true);
                Render.currentLink(req.path);
                closeMenu();
            })
            .get('/book/audio-call/:group/:page', (req) => {
                const group = Number(req.params.group);
                const page = Number(req.params.page);
                if (new State().token === '') {
                    this.router.navigate(`/book/${group}/${page}`);
                    return;
                }
                this.showAudioCall(group, page, true);
                Render.currentLink(req.path);
                closeMenu();
            })
            .get('/games', (req) => {
                this.router.navigate('/games/sprint');
            })
            .get('/games/sprint', (req) => {
                this.showGameDifficulty(gameType.Sprint);
                Render.currentLink(req.path);
                closeMenu();
            })
            .get('/games/sprint/:group/:page', (req) => {
                const group = Number(req.params.group);
                const page = Number(req.params.page);
                this.showSprint(group, page);
                Render.currentLink(req.path);
                closeMenu();
            })
            .get('/games/audio-call', (req) => {
                this.showGameDifficulty(gameType.AudioCall);
                Render.currentLink(req.path);
                closeMenu();
            })
            .get('/games/audio-call/:group/:page', (req) => {
                const group = Number(req.params.group);
                const page = Number(req.params.page);
                this.showAudioCall(group, page);
                Render.currentLink(req.path);
                closeMenu();
            })
            .get('/stats', (req) => {
                this.showStatistics();
                Render.currentLink(req.path);
                this.login.initSecondTrigger();
                closeMenu();
            })
            .get('/about', (req) => {
                this.showPageAbout();
                Render.currentLink(req.path);
                closeMenu();
            })
            .error(404, () => {
                //this.show404();
                this.router.navigate('/');
            })
            .always(() => {
                document.onkeydown = null; //очистка клавиатуры игр
            })
            .run();
    }

    async avatarHandler() {
        const clearStatsButton = getHTMLElement(document.querySelector('.clear-statistics-button'));

        clearStatsButton.addEventListener('click', async () => {
            await clearStatistics(this.data);
        });

        async function clearStatistics(data: Data) {
            const stsAll = {
                learnedWords: 0,
                optional: {
                    1: createStsEntry(),
                },
            };

            const state = new State();

            const updateUserStatistics = await data.updateUserStatistics(state.userId, stsAll, state.token);
            if (typeof updateUserStatistics === 'number') {
                console.log(`Ошибка updateUserStatistics ${updateUserStatistics}`);
                return;
            } else {
                console.log(`Cтатистика успешно очищена!`);
            }
        }

        const inputButton = getHTMLElement(document.querySelector('.image-input-button'));
        const input = getHTMLInputElement(document.querySelector('#img-input'));

        inputButton.addEventListener('click', (e) => {
            e.stopPropagation();
            input.click();
        });

        const settings = await this.getUserSettings();
        updateAvatarImage(settings);

        function updateAvatarImage(settings: ISettings | false) {
            if (settings) {
                const image = new Image();
                if (settings.optional.avatar !== 'empty') {
                    image.src = settings.optional.avatar;
                    const userAvatar = getHTMLElement(document.querySelector('.user__avatar'));
                    userAvatar.innerHTML = '';
                    userAvatar.appendChild(image);
                }
            }
        }

        input.addEventListener('change', async () => {
            const [file] = input.files!;
            if (file) {
                const imageCode = await imageToSting(URL.createObjectURL(file));
                const image = new Image();
                if (typeof imageCode === 'string') {
                    image.src = imageCode;
                    if (settings) {
                        if (imageCode.length > 40000) {
                            console.log('Too big');
                        } else {
                            settings.optional.avatar = imageCode;
                            this.setUserSettings(settings);
                            updateAvatarImage(settings);
                        }
                    }
                }
            }
        });

        function splitString(str: string) {
            let string = str;
            let size = 5000;
            let obj: { [key: string]: string } = {};
            let arr = [];
            while (string.length) {
                if (string.length > size) {
                    arr.push(string.slice(0, size));
                    string = string.slice(size, string.length);
                } else {
                    arr.push(string.slice(0, string.length));
                    string = '';
                }
            }
            return obj;
        }

        const getBase64StringFromDataURL = (dataURL: string) => dataURL.replace('data:', '').replace(/^.+,/, '');

        async function imageToSting(image: string): Promise<string | ArrayBuffer | null> {
            return await fetch(image)
                .then((res) => res.blob())
                .then((blob) => {
                    return new Promise((resolve, reject) => {
                        var reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                });
        }
    }

    showPageAbout() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        main.classList.remove('main-page');
        const pageAbout = this.render.pageAbout();
        main.append(pageAbout);
    }

    showMain() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.classList.add('main-page');
        main.innerHTML = '';
        const sectionSplash = this.render.sectionSplash();
        const sectionBenefits = this.render.sectionBenefits();
        const sectionGames = this.render.sectionGames(`/games/sprint`, `/games/audio-call`);
        main.appendChild(sectionSplash);
        main.appendChild(sectionBenefits);

        document.addEventListener('mousemove', parallax);
        const elem = getHTMLElement(document.querySelector('.parallax'));
        function parallax(e: MouseEvent) {
            let _w = window.innerWidth / 2;
            let _h = window.innerHeight / 2;
            let _mouseX = e.clientX;
            let _mouseY = e.clientY;
            let _depth1 = `${55 - (_mouseX - _w) * 0.002}% ${50 - (_mouseY - _h) * 0.02}%`;
            let _depth2 = `${75 - (_mouseX - _w) * 0.002}% ${45 - (_mouseY - _h) * 0.01}%`;
            let _depth3 = `${100 - (_mouseX - _w) * 0.007}% ${25 - (_mouseY - _h) * 0.03}%`;
            let x = `${_depth3}, ${_depth2}, ${_depth1}`;
            elem.style.backgroundPosition = x;
        }
    }

    async showBook(group: number, page: number) {
        const state = new State();
        const settings = await this.getUserSettings();
        const loginStatus = state.token ? true : false;
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        main.classList.remove('main-page');
        const pageBook = this.render.pageBook(settings || this.defaultSettings());
        const pageHeader = getHTMLElement(pageBook.querySelector('.page-header'));
        getHTMLElement(pageHeader.querySelectorAll('.menu__item')[0]).classList.add('active');
        const sectionGames = this.render.sectionGames(`/games/sprint`, `/games/audio-call`);
        pageHeader.appendChild(sectionGames);
        const dataWords = await this.data.getWords(group, page);

        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const arr = [...dataWords];
            const audioArr: HTMLAudioElement[][] = [];

            const cards = arr.map((item) => {
                audioArr.push([
                    new Audio(`https://rslang-learnwords-app.herokuapp.com/${item.audio}`),
                    new Audio(`https://rslang-learnwords-app.herokuapp.com/${item.audioExample}`),
                    new Audio(`https://rslang-learnwords-app.herokuapp.com/${item.audioMeaning}`),
                ]);

                if (item.difficulty === 'hard') {
                    return this.render.cardWord(item, loginStatus, item.id, settings || this.defaultSettings(), true);
                } else {
                    return this.render.cardWord(item, loginStatus, item.id, settings || this.defaultSettings(), false);
                }
            });

            const wordLevels = this.render.wordLevels();
            getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageHeader.querySelector('.page__menu')).innerHTML += hardWords;
            }

            //const pagination = this.render.bookPagination(group, 29);
            const pagesCount = 30;
            const index: number = page + 1;
            const items_per_page: number = 20;
            const items_total: number = 600;
            const offset: number = 3;
            const sequence: number[] = paginate(index, items_per_page, items_total, offset);

            const pagination = this.render.pagination(group, sequence, pagesCount);
            getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

            const paginationLinkActive = pagination.querySelectorAll(`a[href='/book/${group}/${page}']`);
            paginationLinkActive[0].classList.add('active');

            cards.forEach((card) => {
                getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += card;
            });

            const bttnPlay = pageBook.querySelectorAll('.card-word__audio');
            bttnPlay.forEach((button, i) => {
                button.addEventListener('click', () => {
                    const audio1 = Object.values(audioArr[i])[0];
                    const audio2 = Object.values(audioArr[i])[1];
                    const audio3 = Object.values(audioArr[i])[2];

                    audio1.play();
                    audio1.addEventListener('ended', function () {
                        audio1.currentTime = 0;
                        audio2.play();
                    });
                    audio2.addEventListener('ended', function () {
                        audio2.currentTime = 0;
                        audio3.play();
                    });
                    Animation1(button);
                });
            });

            const linkActive = pageBook.querySelectorAll(`a[href='/book/${group}/${page}']`);
            linkActive[0].classList.add('active');

            const linkActiveLevel = wordLevels.querySelectorAll(`a[href='/book/${group}/0']`);
            getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);
            if (linkActiveLevel[0] !== undefined) {
                linkActiveLevel[0].children[0]!.classList.add('active');
                linkActiveLevel[0].classList.add('active');
            }
            pageBook.children[0].classList.add(`A${group}`);

            main.appendChild(pageBook);
        }
    }

    async showBookPageHard(group: number, page: number) {
        const state = new State();
        const settings = await this.getUserSettings();
        const loginStatus = state.token ? true : false;
        const userId = state.userId;
        const token = state.token;
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        main.classList.remove('main-page');
        const pageBook = this.render.pageBook(settings || this.defaultSettings());
        const pageHeader = getHTMLElement(pageBook.querySelector('.page-header'));

        if (!loginStatus) {
            const emptyMessage = this.render.pageHardWordsDenied();
            main.append(emptyMessage);
            this.login.initSecondTrigger();
            return;
        }
        const dataWords = await this.data.getUserAggregatedWords(
            userId,
            '',
            `${page}`,
            '20',
            '{"$and":[{"userWord.difficulty":"hard"}]}',
            token
        );

        if (typeof dataWords === 'number') {
            console.log('error');
        } else {
            const userWords = await this.data.getUserWords(userId, token);

            const wordLevels = this.render.wordLevels();
            getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);

            if (state.token) {
                const hardWords = this.render.hardWords();
                getHTMLElement(pageHeader.querySelector('.page__menu')).innerHTML += hardWords;
            }

            let wordsCount = 0;
            let paginatedResults = 0;
            let totalLength = 0;

            let itemOptional: IUserWord[] = [];
            const audioArr: HTMLAudioElement[][] = [];

            Object.values(dataWords).forEach((item) => {
                const wordsArray = Object.values(item);

                paginatedResults = Object.values(item)[0].length;
                totalLength = Object.values(item)[1].length;

                if (totalLength > 0) {
                    wordsCount = Object.values(item)[1][0].count;
                    if (typeof userWords === 'number') {
                        console.log('error');
                    } else {
                        wordsArray[0].forEach((item: IWord) => {
                            const user = userWords.findIndex((x) => x.wordId === item._id);
                            let optional;
                            if (userWords[user].optional !== undefined) {
                                optional = userWords[user];
                            }
                            audioArr.push([
                                new Audio(`https://rslang-learnwords-app.herokuapp.com/${item.audio}`),
                                new Audio(`https://rslang-learnwords-app.herokuapp.com/${item.audioExample}`),
                                new Audio(`https://rslang-learnwords-app.herokuapp.com/${item.audioMeaning}`),
                            ]);
                            getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += this.render.cardWord(
                                item,
                                loginStatus,
                                item._id,
                                settings || this.defaultSettings(),
                                true,
                                false,
                                optional
                            );
                        });
                    }
                }
            });

            if (totalLength > 0) {
                const pagesCount = Math.ceil(wordsCount / 20);
                const index: number = page + 1;
                const items_per_page: number = 20;
                const items_total: number = wordsCount;
                const offset: number = 3;
                const sequence: number[] = paginate(index, items_per_page, items_total, offset);
                const pagination = this.render.pagination(group, sequence, pagesCount);
                getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);
                getHTMLElement(pageBook.querySelectorAll('.menu__item')[1]).classList.add('active');
                const bttn = pageBook.querySelectorAll('[data-handle]');

                bttn.forEach((item) => {
                    item.addEventListener('click', async (e) => {
                        const target = getHTMLElement(e.target);

                        const wordId = target.getAttribute('data-id');

                        if (target.getAttribute('data-handle') === 'delete-from-hard') {
                            const dataWords = await this.data.updateUserWord(
                                state.userId,
                                wordId!,
                                { difficulty: 'normal' },
                                state.token
                            );
                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                parent!.remove();
                                this.showBookPageHard(group, page);
                            }
                        } else if (target.getAttribute('data-handle') === 'add-to-easy') {
                            const dataWords = await this.data.updateUserWord(
                                state.userId,
                                wordId!,
                                { difficulty: 'easy' },
                                state.token
                            );
                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                let stsAll = await this.data.getUserStatistics(state.userId, state.token);
                                if (stsAll === 404)
                                    stsAll = {
                                        learnedWords: 0,
                                        optional: {},
                                    };
                                else if (typeof stsAll === 'number') {
                                    console.log(`Ошибка getUserStatistics ${stsAll}`);
                                    return;
                                }

                                let sts;
                                let isNewEntry = true;
                                const keys = Object.keys(stsAll.optional);
                                let lastKey = 0;

                                if (keys.length) {
                                    lastKey = Number(keys[keys.length - 1]);
                                    const lastSts = stsAll.optional[lastKey];
                                    if (!this.isNewDay(lastSts.date)) {
                                        sts = lastSts; //key?
                                        isNewEntry = false;
                                    }
                                }
                                if (!sts || isNewEntry) {
                                    sts = createStsEntry();
                                }
                                if (sts.book.learned < 0) {
                                    sts.book.learned = 0;
                                }
                                sts.book.learned += 1;
                                if (isNewEntry) stsAll.optional[lastKey + 1] = sts;
                                else stsAll.optional[lastKey] = sts;

                                delete stsAll.id;
                                const updateUserStatistics = await this.data.updateUserStatistics(
                                    state.userId,
                                    stsAll,
                                    state.token
                                );
                                if (typeof updateUserStatistics === 'number') {
                                    console.log(`Ошибка updateUserStatistics ${updateUserStatistics}`);
                                    return;
                                }
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                parent!.remove();
                                this.showBookPageHard(group, page);
                            }
                        }
                    });
                });
                if (paginatedResults === 0 && page != 0) {
                    this.router.navigate(`/book/${group}/${page - 1}`);
                }

                const bttnPlay = pageBook.querySelectorAll('.card-word__audio');
                bttnPlay.forEach((button, i) => {
                    button.addEventListener('click', () => {
                        const audio1 = Object.values(audioArr[i])[0];
                        const audio2 = Object.values(audioArr[i])[1];
                        const audio3 = Object.values(audioArr[i])[2];

                        audio1.play();
                        audio1.addEventListener('ended', function () {
                            audio1.currentTime = 0;
                            audio2.play();
                        });
                        audio2.addEventListener('ended', function () {
                            audio2.currentTime = 0;
                            audio3.play();
                        });
                        Animation1(button);
                    });
                });

                const linkActive = pagination.querySelectorAll(`a[href='/book/${group}/${page}']`);
                if (linkActive[1] !== undefined) linkActive[1].className = 'pagination__item active';
                if (linkActive[0] !== undefined) linkActive[0].className = 'pagination__item active';

                main.appendChild(pageBook);
            } else {
                const emptyMessage = this.render.hardWordsEmpty();
                main.innerHTML = emptyMessage;
            }
        }
    }

    async showBookPage(group: number, page: number) {
        const state = new State();
        const settings = await this.getUserSettings();
        const userId = state.userId;
        const token = state.token;
        const loginStatus = state.token ? true : false;
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        main.classList.remove('main-page');
        const pageBook = await this.render.pageBook(settings || this.defaultSettings());
        const pageHeader = getHTMLElement(pageBook.querySelector('.page-header'));
        const userWords = await this.data.getUserWords(userId, token);
        getHTMLElement(pageHeader.querySelectorAll('.menu__item')[0]).classList.add('active');

        let pageSettings;
        if (settings) {
            pageSettings = this.render.bookSettings(settings);
            getHTMLElement(pageHeader.querySelector('.page-header__right')).innerHTML += pageSettings;

            const settingsView = getHTMLElement(pageHeader.querySelector('#grid'));
            const settingsButtonsView = getHTMLElement(pageHeader.querySelector('#hide-buttons'));

            settingsView.addEventListener('click', (e) => {
                const checkbox = getHTMLInputElement(e.target);
                if (checkbox.checked) {
                    settings.optional.listView = true;
                    this.setUserSettings(settings);
                    getHTMLElement(pageBook.querySelector('.words__list')).classList.remove('grid');
                } else {
                    settings.optional.listView = false;
                    this.setUserSettings(settings);
                    getHTMLElement(pageBook.querySelector('.words__list')).classList.add('grid');
                }
            });

            settingsButtonsView.addEventListener('click', (e) => {
                const checkbox = getHTMLInputElement(e.target);

                if (checkbox.checked) {
                    settings.optional.showButtons = true;
                    this.setUserSettings(settings);
                    pageBook.querySelectorAll('.card__bottom').forEach((item) => {
                        item.classList.remove('hidden');
                    });
                } else {
                    settings.optional.showButtons = false;
                    this.setUserSettings(settings);
                    pageBook.querySelectorAll('.card__bottom').forEach((item) => {
                        item.classList.add('hidden');
                    });
                }
            });
        }

        const easyWords = await this.data.getUserAggregatedWordsTest(
            userId,
            '20',
            `{"$and":[{"userWord.difficulty":"easy"}, {"page": ${page}}, {"group": ${group}}]}`,
            token
        );

        const hardWords = await this.data.getUserAggregatedWordsTest(
            userId,
            '20',
            `{"$and":[{"userWord.difficulty":"hard"}, {"page": ${page}}, {"group": ${group}}]}`,
            token
        );
        if (typeof hardWords === 'number' || typeof easyWords === 'number' || typeof userWords === 'number') {
            console.log('error');
        } else {
            const dataWords = await this.data.getWords(group, page);

            let hardWordsArr: IWord[] = [];
            let easyWordsArr: IWord[] = [];

            hardWords.forEach((hardWord) => {
                easyWords.forEach((easyWord) => {
                    const hardWordsArray = Object.values(hardWord);
                    const easyWordsArray = Object.values(easyWord);

                    hardWordsArr = [...hardWordsArray[0]];
                    easyWordsArr = [...easyWordsArray[0]];
                });
            });

            if (typeof dataWords === 'number') {
            } else {
                const arr = [...dataWords];
                const uWrods = [...userWords];
                const audioArr: HTMLAudioElement[][] = [];

                let cards: string[] = [];

                cards = arr.map((item, i) => {
                    const user = uWrods.findIndex((x) => x.wordId === item.id);
                    const hard = hardWordsArr.findIndex((x) => x._id === item.id);
                    const easy = easyWordsArr.findIndex((x) => x._id === item.id);
                    const hardWord: IWord = hardWordsArr[hard];
                    const easyWord: IWord = easyWordsArr[easy];
                    const userWord: IUserWord = uWrods[user];
                    audioArr.push([
                        new Audio(`https://rslang-learnwords-app.herokuapp.com/${item.audio}`),
                        new Audio(`https://rslang-learnwords-app.herokuapp.com/${item.audioExample}`),
                        new Audio(`https://rslang-learnwords-app.herokuapp.com/${item.audioMeaning}`),
                    ]);

                    if (userWord !== undefined && hardWord !== undefined) {
                        return this.render.cardWord(
                            item,
                            loginStatus,
                            item.id,
                            settings || this.defaultSettings(),
                            true,
                            false,
                            userWord
                        );
                    } else if (userWord !== undefined && easyWord !== undefined) {
                        return this.render.cardWord(
                            item,
                            loginStatus,
                            item.id,
                            settings || this.defaultSettings(),
                            false,
                            true,
                            userWord
                        );
                    } else {
                        return this.render.cardWord(
                            item,
                            loginStatus,
                            item.id,
                            settings || this.defaultSettings(),
                            false,
                            false,
                            userWord
                        );
                    }
                });

                cards.forEach((card) => {
                    getHTMLElement(pageBook.querySelector('.words__list')).innerHTML += card;
                });

                const bttn = pageBook.querySelectorAll('[data-handle]');
                const bttnPlay = pageBook.querySelectorAll('.card-word__audio');
                bttnPlay.forEach((button, i) => {
                    button.addEventListener('click', () => {
                        const audio1 = Object.values(audioArr[i])[0];
                        const audio2 = Object.values(audioArr[i])[1];
                        const audio3 = Object.values(audioArr[i])[2];

                        audio1.play();
                        audio1.addEventListener('ended', function () {
                            audio1.currentTime = 0;
                            audio2.play();
                        });
                        audio2.addEventListener('ended', function () {
                            audio2.currentTime = 0;
                            audio3.play();
                        });
                        Animation1(button);
                    });
                });

                bttn.forEach((item) => {
                    item.addEventListener('click', async (e) => {
                        const target = getHTMLElement(e.target);
                        const wordId = target.getAttribute('data-id');
                        const dataWordsArr = await this.data.getWords(group, page);
                        const userWords = await this.data.getUserWords(userId, token);

                        if (target.getAttribute('data-handle') === 'delete-from-hard') {
                            const dataWords = await this.data.updateUserWord(
                                state.userId,
                                wordId!,
                                { difficulty: 'normal' },
                                state.token
                            );

                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                target.innerHTML = 'Добавить в словарь';
                                parent!.className = 'card card-word';
                                target.setAttribute('data-handle', 'add-to-hard');
                                const userWords = await this.data.getUserWords(userId, token);
                                if (typeof userWords === 'number') {
                                    console.log('error');
                                } else {
                                }
                            }
                        } else if (target.getAttribute('data-handle') === 'add-to-hard') {
                            let checkUserWord;
                            const userWords = await this.data.getUserWords(userId, token);

                            if (typeof userWords === 'number') {
                                console.log('error');
                            } else {
                                checkUserWord = userWords.findIndex((x) => x.wordId === wordId);

                                if (Object.values(easyWords[0])[0].length === 20) {
                                    if (linkActive[0] !== undefined)
                                        linkActive[0].className = 'pagination__item active learned';
                                    pageBook.children[0].classList.add('learned');
                                    const sectionGames = this.render.sectionGames(
                                        `/book/sprint/${group}/${page}`,
                                        `/book/audio-call/${group}/${page}`,
                                        'disabled'
                                    );
                                    //pageHeader.querySelector('.games')?.remove();
                                    //pageHeader.appendChild(sectionGames);
                                } else {
                                    if (linkActive[0] !== undefined)
                                        linkActive[0].className = 'pagination__item active';
                                    pageBook.children[0].classList.remove('learned');
                                    const sectionGames = this.render.sectionGames(
                                        `/book/sprint/${group}/${page}`,
                                        `/book/audio-call/${group}/${page}`
                                    );

                                    pageHeader.querySelector('.games')?.remove();
                                    getHTMLElement(pageHeader.querySelector('.page-header__right')).appendChild(
                                        sectionGames
                                    );
                                }
                            }

                            if (checkUserWord === -1) {
                                const dataWords = await this.data.createUserWord(
                                    state.userId,
                                    wordId!,
                                    { difficulty: 'hard' },
                                    state.token
                                );

                                let checkUserWord;
                                const userWords = await this.data.getUserWords(userId, token);

                                if (typeof userWords === 'number') {
                                    console.log('error');
                                } else {
                                    checkUserWord = userWords.findIndex((x) => x.wordId === wordId);
                                }

                                let stsAll = await this.data.getUserStatistics(state.userId, state.token);
                                if (stsAll === 404)
                                    stsAll = {
                                        learnedWords: 0,
                                        optional: {},
                                    };
                                else if (typeof stsAll === 'number') {
                                    console.log(`Ошибка getUserStatistics ${stsAll}`);
                                    return;
                                }

                                let sts;
                                let isNewEntry = true;
                                const keys = Object.keys(stsAll.optional);
                                let lastKey = 0;

                                if (keys.length) {
                                    lastKey = Number(keys[keys.length - 1]);
                                    const lastSts = stsAll.optional[lastKey];
                                    if (!this.isNewDay(lastSts.date)) {
                                        sts = lastSts; //key?
                                        isNewEntry = false;
                                    }
                                }

                                if (!sts || isNewEntry) {
                                    sts = createStsEntry();
                                }

                                sts.book.new += 1;

                                if (isNewEntry) stsAll.optional[lastKey + 1] = sts;
                                else stsAll.optional[lastKey] = sts;

                                delete stsAll.id;
                                const updateUserStatistics = await this.data.updateUserStatistics(
                                    state.userId,
                                    stsAll,
                                    state.token
                                );
                                if (typeof updateUserStatistics === 'number') {
                                    console.log(`Ошибка updateUserStatistics ${updateUserStatistics}`);
                                    return;
                                }

                                console.log('Word not in user words, add to User Words');
                            } else {
                                const dataWords = await this.data.updateUserWord(
                                    state.userId,
                                    wordId!,
                                    { difficulty: 'hard' },
                                    state.token
                                );
                                console.log('Word IN user words, UPDATE word');
                            }

                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                getHTMLElement(parent!.querySelector('.card-word__status')).innerHTML = 'сложное';
                                target.innerHTML = 'Удалить из словаря';
                                target.setAttribute('data-handle', 'delete-from-hard');
                                parent!.className = 'card card-word hard';

                                const bttn = target.parentElement;
                                if (bttn!.querySelector('[data-handle="delete-from-easy"]')) {
                                    bttn!.querySelector('[data-handle="delete-from-easy"]')!.innerHTML =
                                        'Добавить в изученные';
                                    bttn!
                                        .querySelector('[data-handle="delete-from-easy"]')!
                                        .setAttribute('data-handle', 'add-to-easy');
                                }

                                const userWords = await this.data.getUserWords(userId, token);
                                if (typeof userWords === 'number') {
                                    console.log('error');
                                } else {
                                }
                            }
                        } else if (target.getAttribute('data-handle') === 'add-to-easy') {
                            let checkUserWord;
                            const userWords = await this.data.getUserWords(userId, token);

                            if (typeof userWords === 'number') {
                                console.log('error');
                            } else {
                                checkUserWord = userWords.findIndex((x) => x.wordId === wordId);
                            }

                            if (checkUserWord === -1) {
                                const dataWords = await this.data.createUserWord(
                                    state.userId,
                                    wordId!,
                                    { difficulty: 'easy' },
                                    state.token
                                );

                                let stsAll = await this.data.getUserStatistics(state.userId, state.token);
                                if (stsAll === 404)
                                    stsAll = {
                                        learnedWords: 0,
                                        optional: {},
                                    };
                                else if (typeof stsAll === 'number') {
                                    console.log(`Ошибка getUserStatistics ${stsAll}`);
                                    return;
                                }

                                let sts;
                                let isNewEntry = true;
                                const keys = Object.keys(stsAll.optional);
                                let lastKey = 0;

                                if (keys.length) {
                                    lastKey = Number(keys[keys.length - 1]);
                                    const lastSts = stsAll.optional[lastKey];
                                    if (!this.isNewDay(lastSts.date)) {
                                        sts = lastSts; //key?
                                        isNewEntry = false;
                                    }
                                }

                                if (!sts || isNewEntry) {
                                    sts = createStsEntry();
                                }

                                sts.book.learned += 1;
                                sts.book.new += 1;

                                if (isNewEntry) stsAll.optional[lastKey + 1] = sts;
                                else stsAll.optional[lastKey] = sts;

                                delete stsAll.id;
                                const updateUserStatistics = await this.data.updateUserStatistics(
                                    state.userId,
                                    stsAll,
                                    state.token
                                );
                                if (typeof updateUserStatistics === 'number') {
                                    console.log(`Ошибка updateUserStatistics ${updateUserStatistics}`);
                                    return;
                                }

                                console.log('Word not in user words, add to User Words');
                            } else {
                                const dataWords = await this.data.updateUserWord(
                                    state.userId,
                                    wordId!,
                                    { difficulty: 'easy' },
                                    state.token
                                );

                                let stsAll = await this.data.getUserStatistics(state.userId, state.token);
                                if (stsAll === 404)
                                    stsAll = {
                                        learnedWords: 0,
                                        optional: {},
                                    };
                                else if (typeof stsAll === 'number') {
                                    console.log(`Ошибка getUserStatistics ${stsAll}`);
                                    return;
                                }

                                let sts;
                                let isNewEntry = true;
                                const keys = Object.keys(stsAll.optional);
                                let lastKey = 0;
                                if (keys.length) {
                                    lastKey = Number(keys[keys.length - 1]);
                                    const lastSts = stsAll.optional[lastKey];
                                    if (!this.isNewDay(lastSts.date)) {
                                        sts = lastSts; //key?
                                        isNewEntry = false;
                                    }
                                }
                                if (!sts || isNewEntry) {
                                    sts = createStsEntry();
                                }
                                if (sts.book.learned < 0) {
                                    sts.book.learned = 0;
                                }
                                sts.book.learned += 1;
                                if (isNewEntry) stsAll.optional[lastKey + 1] = sts;
                                else stsAll.optional[lastKey] = sts;

                                delete stsAll.id;
                                const updateUserStatistics = await this.data.updateUserStatistics(
                                    state.userId,
                                    stsAll,
                                    state.token
                                );
                                if (typeof updateUserStatistics === 'number') {
                                    console.log(`Ошибка updateUserStatistics ${updateUserStatistics}`);
                                    return;
                                }
                            }
                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                getHTMLElement(parent!.querySelector('.card-word__status')).innerHTML = 'изученное';
                                target.innerHTML = 'Удалить из изученных';
                                target.setAttribute('data-handle', 'delete-from-easy');
                                parent!.classList.remove('hard');
                                parent!.classList.add('easy');

                                const bttn = target.parentElement;
                                if (bttn!.querySelector('[data-handle="delete-from-hard"]')) {
                                    bttn!
                                        .querySelector('[data-handle="delete-from-hard"]')!
                                        .setAttribute('data-handle', 'add-to-hard');
                                    bttn!.querySelector('[data-handle="add-to-hard"]')!.innerHTML =
                                        'Добавить в словарь';
                                }
                                const easyWords = await this.data.getUserAggregatedWordsTest(
                                    userId,
                                    '20',
                                    `{"$and":[{"userWord.difficulty":"easy"}, {"page": ${page}}, {"group": ${group}}]}`,
                                    token
                                );
                                if (typeof easyWords === 'number') {
                                    console.log('error');
                                } else {
                                    const linkActive = pagination.querySelectorAll(`a[href='/book/${group}/${page}']`);
                                    linkActive[0].classList.add('active');
                                    if (Object.values(easyWords[0])[0].length === 20) {
                                        if (linkActive[0] !== undefined)
                                            linkActive[0].className = 'pagination__item active learned';
                                        pageBook.children[0].classList.add('learned');
                                        const sectionGames = this.render.sectionGames(
                                            `/book/sprint/${group}/${page}`,
                                            `/book/audio-call/${group}/${page}`,
                                            'disabled'
                                        );
                                        pageHeader.querySelector('.games')?.remove();
                                        getHTMLElement(pageHeader.querySelector('.page-header__right')).appendChild(
                                            sectionGames
                                        );
                                    } else {
                                        pageBook.children[0].classList.remove('learned');
                                        const sectionGames = this.render.sectionGames(
                                            `/book/sprint/${group}/${page}`,
                                            `/book/audio-call/${group}/${page}`
                                        );
                                        pageHeader.querySelector('.games')?.remove();
                                        getHTMLElement(pageHeader.querySelector('.page-header__right')).appendChild(
                                            sectionGames
                                        );
                                    }
                                }
                            }
                        } else if (target.getAttribute('data-handle') === 'delete-from-easy') {
                            const dataWords = await this.data.updateUserWord(
                                state.userId,
                                wordId!,
                                { difficulty: 'normal' },
                                state.token
                            );

                            if (typeof dataWords === 'number') {
                                console.log('error');
                            } else {
                                const parent = target.parentElement!.parentElement!.closest('.card-word');
                                target.innerHTML = 'Добавить в изученные';
                                parent!.className = 'card card-word';
                                target.setAttribute('data-handle', 'add-to-easy');
                            }
                            const easyWords = await this.data.getUserAggregatedWordsTest(
                                userId,
                                '20',
                                `{"$and":[{"userWord.difficulty":"easy"}, {"page": ${page}}, {"group": ${group}}]}`,
                                token
                            );
                            if (typeof easyWords === 'number') {
                                console.log('error');
                            } else {
                                const linkActive = pagination.querySelectorAll(`a[href='/book/${group}/${page}']`);
                                linkActive[0].classList.add('active');
                                if (Object.values(easyWords[0])[0].length === 20) {
                                    if (linkActive[0] !== undefined)
                                        linkActive[0].className = 'pagination__item active learned';
                                    pageBook.children[0].classList.add('learned');
                                    const sectionGames = this.render.sectionGames(
                                        `/book/sprint/${group}/${page}`,
                                        `/book/audio-call/${group}/${page}`,
                                        'disabled'
                                    );
                                    //pageHeader.querySelector('.games')?.remove();
                                    //pageHeader.appendChild(sectionGames);
                                } else {
                                    if (linkActive[0] !== undefined)
                                        linkActive[0].className = 'pagination__item active';
                                    pageBook.children[0].classList.remove('learned');
                                    const sectionGames = this.render.sectionGames(
                                        `/book/sprint/${group}/${page}`,
                                        `/book/audio-call/${group}/${page}`
                                    );
                                    pageHeader.querySelector('.games')?.remove();
                                    getHTMLElement(pageHeader.querySelector('.page-header__right')).appendChild(
                                        sectionGames
                                    );
                                }
                            }
                        }
                    });
                });
                const wordLevels = this.render.wordLevels();
                const linkActiveLevel = wordLevels.querySelectorAll(`a[href='/book/${group}/0']`);
                getHTMLElement(pageBook.querySelector('.page__book')).append(wordLevels);
                if (linkActiveLevel[0] !== undefined) {
                    linkActiveLevel[0].children[0]!.classList.add('active');
                    linkActiveLevel[0].classList.add('active');
                }
                pageBook.children[0].classList.add(`A${group}`);

                if (state.token) {
                    const hardWords = this.render.hardWords();
                    getHTMLElement(pageHeader.querySelector('.page__menu')).innerHTML += hardWords;
                }

                const pagesCount = 30;
                const index: number = page + 1;
                const items_per_page: number = 20;
                const items_total: number = 600;
                const offset: number = 3;
                const sequence: number[] = paginate(index, items_per_page, items_total, offset);

                const pagination = this.render.pagination(group, sequence, pagesCount);
                getHTMLElement(pageBook.querySelector('.page__book')).append(pagination);

                const linkActive = pagination.querySelectorAll(`a[href='/book/${group}/${page}']`);
                if (easyWordsArr.length === 20) {
                    if (linkActive[0] !== undefined) linkActive[0].className = 'pagination__item active learned';
                    pageBook.children[0].classList.add('learned');
                    linkActive[0].classList.add('learned');
                    const sectionGames = this.render.sectionGames(
                        `/book/sprint/${group}/${page}`,
                        `/book/audio-call/${group}/${page}`,
                        'disabled'
                    );
                    getHTMLElement(pageHeader.querySelector('.page-header__right')).appendChild(sectionGames);
                } else {
                    if (linkActive[0] !== undefined) linkActive[0].className = 'pagination__item active';
                    if (linkActive[1] !== undefined) linkActive[1].className = 'pagination__item active';
                    const sectionGames = this.render.sectionGames(
                        `/book/sprint/${group}/${page}`,
                        `/book/audio-call/${group}/${page}`
                    );
                    getHTMLElement(pageHeader.querySelector('.page-header__right')).appendChild(sectionGames);
                }

                main.appendChild(pageBook);
            }
        }
    }

    isNewDay(date: string): boolean {
        const prevDate = new Date(date);
        let currDate = new Date();
        currDate.setHours(0, 0, 0, 0);
        // return true; //Тест
        return (
            currDate.getDate() !== prevDate.getDate() ||
            currDate.getMonth() !== prevDate.getMonth() ||
            currDate.getFullYear() !== prevDate.getFullYear()
        );
    }

    showGames() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const pageGames = this.render.pageGames();
        main.appendChild(pageGames);
    }

    async showStatistics() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        main.classList.remove('main-page');
        const state = new State();

        if (state.token) {
            const statistics = await this.data.getUserStatistics(state.userId, state.token);
            if (typeof statistics === 'number') {
                console.log('error');
            } else {
                main.appendChild(this.render.pageStatistics(statistics));
            }
        } else {
            main.appendChild(this.render.pageStatisticsDenied());
        }
    }

    showGameDifficulty(type: gameType) {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        main.classList.remove('main-page');
        const gameDifficulty = this.render.gameDifficulty(type);
        let root = '';
        main.append(gameDifficulty);
        switch (type) {
            case gameType.AudioCall:
                root = 'audio-call';
                break;
            case gameType.Sprint:
                root = 'sprint';
                break;
        }

        const start = getHTMLElement(gameDifficulty.querySelector('.game__start'));
        start.addEventListener('click', (e) => {
            const checked = getHTMLInputElement(gameDifficulty.querySelector('[type="radio"]:checked'));
            const href = `/games/${root}/${checked.value}/${getRandom(0, 29)}`;
            this.router.navigate(href);
        });
    }

    showSprint(group: number, page: number, isBook: boolean = false) {
        const sprint = new Sprint(this.data.base, group, page, isBook, this.router);
        sprint.start();
    }

    async showAudioCall(group: number, page: number, isBook: boolean = false) {
        const audioCall = new AudioCall(this.data.base, group, page, isBook, this.router);
        audioCall.start();
    }

    createLogin() {
        const modal = this.render.modalLogin();
        document.body.append(modal);
        //new ModalLogin(modal, this.data.base, this.router);
        //console.log(this.router);
        this.login.init();
    }

    async getUserSettings() {
        const state = new State();

        if (state.token) {
            const settings = await this.data.getUserSettings(state.userId, state.token);
            if (typeof settings === 'number') {
                await this.data.updateUserSettings(state.userId, this.defaultSettings(), state.token);
                return this.defaultSettings();
            } else {
                delete settings['id'];
                return settings;
            }
        } else return false;
    }

    async setUserSettings(userSettings?: ISettings) {
        const state = new State();

        if (state.token) {
            if (userSettings) {
                await this.data.updateUserSettings(state.userId, userSettings, state.token);
                return true;
            } else {
                await this.data.updateUserSettings(state.userId, this.defaultSettings(), state.token);
                return true;
            }
        } else return false;
    }

    defaultSettings() {
        return {
            wordsPerDay: 1,
            optional: {
                listView: false,
                showButtons: true,
                avatar: 'empty',
            },
        };
    }
}
