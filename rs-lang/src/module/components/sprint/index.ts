//Utils
import getHTMLElement from '../../../utils/getHTMLElement';
import getHTMLButtonElement from '../../../utils/getHTMLButtonElement';
import getNotNil from '../../../utils/getNotNil';
import { shuffle, getRandom, createStsEntry } from '../../../utils/helpers';

//Router
import { Router } from 'routerjs';

//Interfaces
import IWord from '../../interface/IWord';
import ISprintState from '../../interface/ISprintState';
import IUserWord from '../../interface/IUserWord';

//API
import Data from '../../api';

//UI
import Render from '../../ui';

//Enums
import { gameChart, gameType } from '../../../utils/enums';

//State
import State from '../../app/state';

let interval: ReturnType<typeof setInterval>;

export default class Sprint {
    group: number;
    page: number;
    counter: number;
    speed: number;
    words: IWord[] = [];
    gameState: ISprintState;
    result: Record<string, IWord[]>;
    render: Render;
    state = new State();
    isBook: boolean;
    data: Data;
    router: Router;
    series = 0;
    record = 0;
    count = 0;
    constructor(base: string, group: number, page: number, isBook: boolean = false, router: Router) {
        this.group = group;
        this.page = page;
        this.counter = 100;
        this.speed = 0.1;
        this.result = {
            knowingWords: [],
            unknowingWords: [],
        };
        this.gameState = {
            word: null,
            wordEnglish: '',
            wordTranslation: '',
            possibleTranslation: '',
            points: 0,
            multiplier: 1,
            strike: 0,
        };
        this.render = new Render();
        this.isBook = isBook;
        this.data = new Data(base);
        this.router = router;
    }

    async start() {
        //console.log('Sprint Game Started!');
        this.words = await this.getWords();

        this.setNewWord();
        const playZone = this.setPlayZone();
        this.setHandlers(playZone);
        interval = setInterval(() => {
            try {
                if (this.counter <= 0) {
                    clearInterval(interval);
                    if (this.state.token) this.saveStatistics();
                    this.showResult();
                    //console.log('Sprint Game Finished!');
                }
                const oldChart = getHTMLElement(document.querySelector('.chart'));
                const newChart = this.render.chart(500, 8, (this.counter -= this.speed), '#2B788B', '#C3DCE3');
                playZone.replaceChild(newChart, oldChart);
            } catch {
                clearInterval(interval);
            }
        }, 10);
    }

    async getWords() {
        let words;
        if (this.isBook) {
            const filter = `{"$and" : [{"userWord.difficulty" : { "$ne" : "easy"} }, {"page": { "$lte" : ${this.page} } }, {"group" : ${this.group}}]}`;
            const aggregatedWords = await this.data.getUserAggregatedWords(
                this.state.userId,
                '',
                '',
                '1000',
                filter,
                this.state.token
            );

            if (typeof aggregatedWords === 'number') {
                console.log(`error aggregatedWords ${aggregatedWords}`);
                return;
            }

            const paginatedResults = Object.values(aggregatedWords)[0];
            const wordsTemp = Object.values(paginatedResults)[0];
            wordsTemp.sort((a: IWord, b: IWord) => b.page - a.page);
            words = wordsTemp.slice(0, 20);
        } else {
            const getWords = await this.data.getWords(this.group, this.page);
            if (typeof getWords === 'number') {
                console.log(`error getWords ${getWords}`);
                return;
            }
            words = getWords;
        }
        shuffle(words);
        return words;
    }

    setNewWord() {
        const word = this.words[this.count];
        this.count += 1;
        let possibleTranslation = word.wordTranslate;

        if (getRandom(0, 1)) {
            const qWords = this.words.slice();
            qWords.splice(this.count, 1);
            shuffle(qWords);
            possibleTranslation = qWords[0].wordTranslate;
        }

        this.gameState.word = word;
        this.gameState.wordEnglish = word.word;
        this.gameState.wordTranslation = word.wordTranslate;
        this.gameState.possibleTranslation = possibleTranslation;
    }

    renderNewGameBody(playZone: HTMLDivElement) {
        this.setNewWord();
        const oldSprintBody = getHTMLElement(document.querySelector('.sprint-game__body'));
        const newSprintBody = this.render.gameSprint(
            this.gameState.multiplier,
            this.gameState.points,
            this.gameState.strike,
            this.gameState.wordEnglish,
            this.gameState.possibleTranslation
        );
        playZone.replaceChild(newSprintBody, oldSprintBody);
        this.setHandlers(playZone);
    }

    setHandlers(playZone: HTMLDivElement) {
        const buttonTrue = getHTMLButtonElement(document.querySelector('.sprint-game__true-button'));
        const buttonFalse = getHTMLButtonElement(document.querySelector('.sprint-game__false-button'));

        buttonTrue.addEventListener('click', () => {
            if (this.counter > 0) {
                if (this.gameState.possibleTranslation == this.gameState.wordTranslation) {
                    this.result.knowingWords.push(getNotNil(this.gameState.word));
                    //console.log('Right Answer!');
                    this.series += 1;
                    if (this.gameState.strike == 3) {
                        this.gameState.multiplier += 1;
                        this.gameState.strike = 0;
                    }
                    this.gameState.points += this.gameState.multiplier * 10;
                    this.gameState.strike += 1;
                } else {
                    // console.log('Wrong Answer!');
                    if (this.series > this.record) this.record = this.series;
                    this.series = 0;
                    this.result.unknowingWords.push(getNotNil(this.gameState.word));
                    this.gameState.strike = 0;
                    this.gameState.multiplier = 1;
                }
                //console.log(this.count);
                if (this.count > this.words.length - 1) {
                    clearInterval(interval);
                    if (this.state.token) this.saveStatistics();
                    this.showResult();
                } else this.renderNewGameBody(playZone);
            }
        });

        buttonFalse.addEventListener('click', () => {
            if (this.counter > 0) {
                if (this.gameState.possibleTranslation != this.gameState.wordTranslation) {
                    this.result.knowingWords.push(getNotNil(this.gameState.word));
                    this.series += 1;
                    //console.log('Right Answer!');
                    if (this.gameState.strike == 3) {
                        this.gameState.multiplier += 1;
                        this.gameState.strike = 0;
                    }
                    this.gameState.points += this.gameState.multiplier * 10;
                    this.gameState.strike += 1;
                } else {
                    //console.log('Wrong Answer!');
                    if (this.series > this.record) this.record = this.series;
                    this.series = 0;
                    this.result.unknowingWords.push(getNotNil(this.gameState.word));
                    this.gameState.strike = 0;
                    this.gameState.multiplier = 1;
                }
                if (this.count > this.words.length - 1) {
                    clearInterval(interval);
                    if (this.state.token) this.saveStatistics();
                    this.showResult();
                } else this.renderNewGameBody(playZone);
            }
        });
    }

    setPlayZone() {
        const main = getHTMLElement(document.querySelector('main'));
        main.innerHTML = '';

        const chart = this.render.chart(500, 8, this.counter, '#2B788B', '#C3DCE3');
        const sprintBody = this.render.gameSprint(
            this.gameState.multiplier,
            this.gameState.points,
            this.gameState.strike,
            this.gameState.wordEnglish,
            this.gameState.possibleTranslation
        );

        const wrapper = document.createElement('div');
        wrapper.classList.add('sprint-game-wrapper');

        const sprint = document.createElement('div');
        sprint.classList.add('sprint-game');

        sprint.appendChild(chart);
        sprint.appendChild(sprintBody);
        wrapper.appendChild(sprint);
        main.appendChild(wrapper);
        return sprint;
    }

    showResult() {
        const knowingWords = this.result.knowingWords;
        const unknowingWords = this.result.unknowingWords;

        const chart1 = {
            type: gameChart.Points,
            maxValue: 1500,
            currentValue: this.gameState.points,
        };

        const chart2 = {
            type: gameChart.Words,
            maxValue: knowingWords.length + unknowingWords.length,
            currentValue: knowingWords.length,
        };

        const main = getHTMLElement(document.querySelector('main'));
        main.innerHTML = '';

        main.append(
            this.render.gameResult(
                gameType.Sprint,
                'Вы неплохо справились!',
                [chart1, chart2],
                knowingWords,
                unknowingWords,
                this.data.base
            )
        );

        const playBtns: NodeListOf<HTMLElement> = main.querySelectorAll('.gameresultword__icon');
        playBtns.forEach((playBtn) => {
            playBtn.addEventListener('click', (e) => {
                let target = getHTMLElement(e.target);
                if (target.classList.contains('play-icon')) {
                    target = getHTMLElement(target.closest('.gameresultword__icon'));
                }
                const src = target.dataset.src;
                const audio = new Audio();
                audio.src = `${this.data.base}/${src}`;
                audio.autoplay = true;
            });
        });

        const btnReplay = getHTMLElement(main.querySelector('.gameresult__button-replay'));
        btnReplay.addEventListener('click', () => {
            this.router.run();
        });

        const btnToBook = getHTMLElement(main.querySelector('.gameresult__button-tobook'));
        btnToBook.addEventListener('click', () => {
            this.router.navigate(`/book/${this.group}/${this.page}`);
        });
    }

    async saveStatistics() {
        const knowingWords = this.result.knowingWords;
        const unknowingWords = this.result.unknowingWords;

        const userWords = await this.data.getUserWords(this.state.userId, this.state.token);
        if (typeof userWords === 'number') {
            console.log(`Ошибка getUserWords ${userWords}`);
            return;
        }

        let stsAll = await this.data.getUserStatistics(this.state.userId, this.state.token);
        if (stsAll === 404) {
            stsAll = {
                learnedWords: 0,
                optional: {},
            };
        } else if (typeof stsAll === 'number') {
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

        let newCount = sts.sprint.new;
        let total = sts.sprint.total;
        let right = sts.sprint.right;
        let learned = sts.sprint.learned;
        let record = sts.sprint.record;
        if (!record || this.record > record) record = this.record;

        knowingWords.forEach(async (word) => {
            let learnedInGame = 0;

            const matchedUserWord = userWords.find(
                (userWord) => userWord.wordId === word.id || userWord.wordId === word._id
            );
            if (matchedUserWord) {
                learnedInGame = (await this.updateUserWord(word, matchedUserWord, true)) || 0;
            } else {
                this.createUserWord(word, true);
                newCount += 1;
            }
            total += 1;
            right += 1;
            learned += learnedInGame;
        });

        unknowingWords.forEach((word) => {
            const matchedUserWord = userWords.find(
                (userWord) => userWord.wordId === word.id || userWord.wordId === word._id
            );
            if (matchedUserWord) {
                this.updateUserWord(word, matchedUserWord, false);
            } else {
                this.createUserWord(word, false);
                newCount += 1;
            }
            total += 1;
        });

        sts.sprint.new = newCount;
        sts.sprint.total = total;
        sts.sprint.right = right;
        sts.sprint.learned = learned;
        sts.sprint.record = record;

        if (isNewEntry) stsAll.optional[lastKey + 1] = sts;
        else stsAll.optional[lastKey] = sts;

        // console.log(stsAll);
        delete stsAll.id;
        const updateUserStatistics = await this.data.updateUserStatistics(this.state.userId, stsAll, this.state.token);
        if (typeof updateUserStatistics === 'number') {
            console.log(`Ошибка updateUserStatistics ${updateUserStatistics}`);
            return;
        }
    }

    isNewDay(date: string): boolean {
        const prevDate = new Date(date);
        const currDate = new Date();
        // return true; //Тест
        return (
            currDate.getDate() !== prevDate.getDate() ||
            currDate.getMonth() !== prevDate.getMonth() ||
            currDate.getFullYear() !== prevDate.getFullYear()
        );
    }

    async createUserWord(word: IWord, isRight: boolean) {
        let newUserWord;
        if (isRight) {
            newUserWord = {
                difficulty: 'normal',
                optional: {
                    total: 1,
                    right: 1,
                    series: 1,
                },
            };
        } else {
            newUserWord = {
                difficulty: 'normal',
                optional: {
                    total: 1,
                    right: 0,
                    series: 0,
                },
            };
        }

        let wordId;
        if (this.isBook) wordId = word._id;
        else wordId = word.id;
        //console.log(this.state.userId, wordId, newUserWord, this.state.token);
        const resp = await this.data.createUserWord(this.state.userId, wordId, newUserWord, this.state.token);
        if (typeof resp != 'number') {
        } else {
            console.log(`Ошибка createUserWord ${resp}`);
        }
    }

    async updateUserWord(word: IWord, userWord: IUserWord, isRight: boolean) {
        let isLearned;
        let updUserWord;
        let difficulty;
        let total;
        let right;
        let series;

        if (isRight) {
            difficulty = userWord.difficulty;
            total = userWord.optional?.total ? userWord.optional?.total + 1 : 1;
            right = userWord.optional?.right ? userWord.optional?.right + 1 : 1;
            series = userWord.optional?.series ? userWord.optional?.series + 1 : 1;

            if ((series === 3 && difficulty === 'normal') || (series === 5 && difficulty === 'hard')) {
                difficulty = 'easy';
                isLearned = 1;
            } else isLearned = 0;
        } else {
            difficulty = userWord.difficulty === 'easy' ? 'normal' : difficulty;
            if (!difficulty) difficulty = 'normal';
            total = userWord.optional?.total ? userWord.optional?.total + 1 : 1;
            right = userWord.optional?.right ? userWord.optional?.right : 0;
            series = 0;
        }

        updUserWord = {
            difficulty,
            optional: {
                total,
                right,
                series,
            },
        };

        let wordId;
        if (this.isBook) wordId = word._id;
        else wordId = word.id;

        const resp = await this.data.updateUserWord(this.state.userId, wordId, updUserWord, this.state.token);
        if (typeof resp !== 'number') {
            return isLearned;
        } else {
            console.log(`Ошибка updateUserWord ${resp}`);
        }
    }

    sayWord(path: string) {
        const audio = new Audio();
        audio.loop = false;
        audio.src = `${this.data.base}/${path}`;
        audio.autoplay = true;
    }
}
