//Utils
import getHTMLElement from '../../../utils/getHTMLElement';
import getHTMLImageElement from '../../../utils/getHTMLImageElement';
import { shuffle, createStsEntry } from '../../../utils/helpers';
import Particles from '../../../utils/particles';

//Router
import { Router } from 'routerjs';

//Enums
import { gameChart, gameType } from '../../../utils/enums';

//Interfaces
import IWord from '../../interface/IWord';
import IStatistics from '../../interface/IStatistics';

//API
import Data from '../../api';

//UI
import Render from '../../ui';

//State
import State from '../../app/state';
import IUserWord from '../../interface/IUserWord';
import getNotNil from '../../../utils/getNotNil';

export default class AudioCall {
    group: number;
    page: number;
    data: Data;
    render: Render;
    result: Record<string, IWord[]>;
    series: number = 0;
    record: number = 0;
    state = new State();
    isBook: boolean;
    router: Router;
    learned = 0;
    constructor(base: string, group: number, page: number, isBook: boolean = false, router: Router) {
        this.group = group;
        this.page = page;
        this.data = new Data(base);
        this.render = new Render();
        this.result = {
            knowingWords: [],
            unknowingWords: [],
        };
        this.isBook = isBook;
        this.router = router;
    }

    async start() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const game = this.render.gameAudioCall();
        main.append(game);

        //gameWindow audio
        let count = 0;
        let attempt: number = 5;

        const words = await this.getWords();
        if (words.length < 5) {
            this.showResult(attempt, words);
            return;
        }
        this.showQuestion(words, count);

        const answerBtns = document.querySelectorAll('.audio__choice, .audio__know-btn');
        answerBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const target = getHTMLElement(e.target);
                this.showAnswer(target);
                const answer = target.dataset.answer;

                if (answer === undefined) {
                    this.playBadSound();
                    attempt -= 1;
                    const hearts = document.querySelectorAll('.audio__icon-heart');
                    hearts[attempt].classList.add('audio__icon-heart_miss');
                    this.result.unknowingWords.push(words[count]);
                    if (this.series > this.record) this.record = this.series;
                    this.series = 0;

                    // const particles = new Particles();
                    // particles.create(
                    //     particles.getOffset(pointsBody).x,
                    //     particles.getOffset(pointsBody).y,
                    //     `${this.gameState.points}`,
                    //     '#2B788B',
                    //     'sprint-points'
                    // );
                } else {
                    this.playGoodSound();
                    this.result.knowingWords.push(words[count]);
                    this.series += 1;
                }
            });
        });

        const nextBtn = getHTMLElement(document.querySelector('.audio__next-btn'));
        nextBtn.addEventListener('click', () => {
            //if (typeof words === 'number') return;
            const len = words.length - 1;
            if (count === len || attempt === 0) {
                if (this.series > this.record) this.record = this.series;
                if (this.state.token) this.saveStatistics();
                this.showResult(attempt, words);
                this.playEndSound();
                return;
            }
            count += 1;
            this.showQuestion(words, count);
            this.hideAnswer();
        });

        const playBtn = document.querySelectorAll('.js-play-word');
        playBtn.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                let target = getHTMLElement(e.target);
                if (!target.classList.contains('js-play-word')) {
                    target = getHTMLElement(target.closest('.js-play-word'));
                }
                const path = target.dataset.src;
                if (!path) return false;
                this.sayWord(path);
            });
        });
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

    sayWord(path: string) {
        const audio = new Audio();
        audio.loop = false;
        audio.src = `${this.data.base}/${path}`;
        audio.autoplay = true;
    }

    showQuestion(words: IWord[], count: number) {
        const word = words[count];
        const qWords = words.slice();

        qWords.splice(count, 1);
        shuffle(qWords);
        qWords.splice(4, qWords.length, word);
        shuffle(qWords);

        const choices = document.querySelectorAll('.audio__choice');
        choices.forEach((choice, i) => {
            choice.classList.remove('.active');
            choice.textContent = qWords[i].wordTranslate;
            if (qWords[i] === word) choice.setAttribute('data-answer', '');
            else choice.removeAttribute('data-answer');
        });

        const answerPhoto = getHTMLImageElement(document.querySelector('.answer__photo'));
        answerPhoto.src = `${this.data.base}/${word.image}`;

        const answerText = getHTMLElement(document.querySelector('.answer__text'));
        answerText.innerHTML = `<b>${word.word}</b> - ${word.wordTranslate}`;

        const playBtns = document.querySelectorAll('.js-play-word');
        playBtns.forEach((btn) => {
            btn.setAttribute('data-src', word.audio);
        });
        this.sayWord(word.audio);
    }

    showAnswer(el: HTMLElement) {
        el.classList.add('active');
        document.querySelector('.audio__know-btn')?.classList.add('hidden');
        document.querySelector('.audio__next-btn')?.classList.remove('hidden');
        document.querySelector('.audio__question')?.classList.add('hidden');
        document.querySelector('.audio__answer')?.classList.remove('hidden');

        const choices = document.querySelectorAll('.audio__choice');
        choices.forEach((choice) => {
            const btn = getHTMLElement(choice);
            btn.classList.add('disabled');
        });
    }

    hideAnswer() {
        const choices = document.querySelectorAll('.audio__choice');
        choices.forEach((choice) => {
            choice.classList.remove('active', 'disabled');
        });
        document.querySelector('.audio__know-btn')?.classList.remove('hidden');
        document.querySelector('.audio__next-btn')?.classList.add('hidden');
        document.querySelector('.audio__question')?.classList.remove('hidden');
        document.querySelector('.audio__answer')?.classList.add('hidden');
    }

    showResult(attempt: number, words: IWord[]) {
        const knowingWords = this.result.knowingWords;
        const unknowingWords = this.result.unknowingWords;

        const chart1 = {
            type: gameChart.Healths,
            maxValue: 5,
            currentValue: attempt,
        };

        const chart2 = {
            type: gameChart.Words,
            maxValue: unknowingWords.length + knowingWords.length,
            currentValue: knowingWords.length,
        };

        let charts = [chart1, chart2];
        const message: string = this.getResultMessage(knowingWords, unknowingWords);

        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        main.append(
            this.render.gameResult(gameType.AudioCall, message, charts, knowingWords, unknowingWords, this.data.base)
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

    getResultMessage(rightWords: IWord[], wrongWords: IWord[]) {
        const result: number = rightWords.length / (wrongWords.length + rightWords.length);

        let message: string;

        if (result >= 0.8) {
            message = 'Отличный результат!';
        } else if (result >= 0.5 && result < 0.8) {
            message = 'Вы неплохо справились!';
        } else if (result > 0.2 && result < 0.5) {
            message = 'Вы можете лучше!';
        } else {
            message = 'Продолжайте учиться!'; //NaN
        }
        return message;
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

        let newCount = sts.audio.new;
        let total = sts.audio.total;
        let right = sts.audio.right;
        let learned = sts.audio.learned;
        let record = sts.audio.record;
        if (!record || this.record > record) record = this.record;

        knowingWords.forEach(async (word, i) => {
            const matchedUserWord = userWords.find(
                (userWord) => userWord.wordId === word.id || userWord.wordId === word._id
            );
            if (matchedUserWord) {
                this.updateUserWord(word, matchedUserWord, true);
            } else {
                this.createUserWord(word, true);
                newCount += 1;
            }

            total += 1;
            right += 1;
            learned += this.learned;
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

        sts.audio.new = newCount;
        sts.audio.total = total;
        sts.audio.right = right;
        sts.audio.learned = learned;
        sts.audio.record = record;

        if (isNewEntry) stsAll.optional[lastKey + 1] = sts;
        else stsAll.optional[lastKey] = sts;

        delete stsAll.id;
        const updateUserStatistics = await this.data.updateUserStatistics(this.state.userId, stsAll, this.state.token);
        if (typeof updateUserStatistics === 'number') {
            console.log(`Ошибка updateUserStatistics ${updateUserStatistics}`);
            return;
        }
    }

    playGoodSound() {
        const audio = new Audio();
        audio.volume = 0.2;
        audio.loop = false;
        audio.src = `../../../assets/music/good.mp3`;
        audio.autoplay = true;
    }

    playBadSound() {
        const audio = new Audio();
        audio.volume = 0.2;
        audio.loop = false;
        audio.src = `../../../assets/music/bad1.mp3`;
        audio.autoplay = true;
    }

    playEndSound() {
        const audio = new Audio();
        audio.volume = 0.2;
        audio.loop = false;
        audio.src = `../../../assets/music/lucky.mp3`;
        audio.autoplay = true;
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

        const resp = await this.data.createUserWord(this.state.userId, wordId, newUserWord, this.state.token);
        if (typeof resp != 'number') {
        } else {
            console.log(`Ошибка createUserWord ${resp}`);
        }
    }

    async updateUserWord(word: IWord, userWord: IUserWord, isRight: boolean) {
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
                this.learned = 1;
            } else this.learned = 0;
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
        } else {
            console.log(`Ошибка ${resp}`);
        }
    }
}
