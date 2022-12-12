//Utils
import getHTMLElement from '../../../utils/getHTMLElement';
import getHTMLButtonElement from '../../../utils/getHTMLButtonElement';
import getHTMLImageElement from '../../../utils/getHTMLImageElement';
import { shuffle, createStsEntry } from '../../../utils/helpers';
import Particles from '../../../utils/particles';

//Router
import { Router } from 'routerjs';

//Enums
import { gameChart, gameType, gameStatus } from '../../../utils/enums';

//Interfaces
import IWord from '../../interface/IWord';
import IStatistics from '../../interface/IStatistics';

//API
import Data from '../../api';

//UI
import Render from '../../ui';

//Animation
import Animation1 from '../../../utils/animation-1';

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
    gameStatus: gameStatus;
    wordAudio: HTMLAudioElement;
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
        this.gameStatus = gameStatus.Started;
        this.wordAudio = new Audio();
    }

    async start() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const game = this.render.gameAudioCall();
        main.append(game);

        let count = 0;
        let attempt: number = 5;

        const words = await this.getWords();
        if (words.length < 5) {
            this.showResult(attempt, words);
            return;
        }
        this.showQuestion(words, count);

        const nextBtn = getHTMLElement(document.querySelector('.audio__next-btn'));
        nextBtn.addEventListener('click', (e) => {
            if (!nextBtn.classList.contains('show-next')) {
                const target = getHTMLElement(e.target);
                buttonPressHandler(target);
            } else {
                nextBtnHandler();
            }
        });

        const answerBtns = document.querySelectorAll('.audio__choice');
        answerBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const target = getHTMLElement(e.target);
                buttonPressHandler(target);
            });
        });

        const nextBtnHandler = () => {
            nextBtn.classList.remove('show-next');
            nextBtn.textContent = 'Не знаю';
            const len = words.length - 1;

            if (count === len || attempt === 0) {
                if (this.series > this.record) this.record = this.series;
                if (this.state.token) this.saveStatistics();

                this.showResult(attempt, words);
                this.playEndSound();
                this.gameStatus = gameStatus.Ended;
                return;
            }
            count += 1;
            this.showQuestion(words, count);
            this.hideAnswer();
            this.gameStatus = gameStatus.Started;
        };

        const playBtn = document.querySelectorAll('.js-play-word');
        playBtn.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                Animation1(btn);
                let target = getHTMLElement(e.target);
                if (!target.classList.contains('js-play-word')) {
                    target = getHTMLElement(target.closest('.js-play-word'));
                }
                const path = target.dataset.src;
                if (!path) return false;
                this.sayWord(path);
            });
        });

        const buttonPressHandler = (target: HTMLElement) => {
            nextBtn.classList.add('show-next');
            nextBtn.textContent = 'Дальше';
            this.showAnswer(target);
            this.gameStatus = gameStatus.Paused;
            const answer = target.dataset.answer;

            if (answer === undefined) {
                this.playBadSound();
                attempt -= 1;
                const hearts = document.querySelectorAll('.audio__icon-heart');
                hearts[attempt].classList.add('audio__icon-heart_miss');
                this.result.unknowingWords.push(words[count]);
                if (this.series > this.record) this.record = this.series;
                this.series = 0;
                const heartBody = getHTMLElement(document.querySelector('.audio__icon-heart_miss'));
                const particles = new Particles();
                particles.create(
                    particles.getOffset(heartBody).x,
                    particles.getOffset(heartBody).y,
                    `♥`,
                    '',
                    'audiocall-heart'
                );
            } else {
                this.playGoodSound();
                this.result.knowingWords.push(words[count]);
                this.series += 1;

                for (let i = 0; i < 5; i++) {
                    const heartBody = getHTMLElement(document.querySelector('.active-answer'));
                    const particles = new Particles();
                    particles.create(
                        particles.getOffset(heartBody).x,
                        particles.getOffset(heartBody).y,
                        `👍`,
                        '',
                        'audiocall-rightAnswer'
                    );
                }
            }
        };

        const playBtns = document.querySelectorAll('.js-play-word');
        playBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this.wordAudio.play();
            });
        });

        const keyPressHandler = () => {
            document.onkeydown = (e) => {
                e = e || window.event;
                if (e.code === 'Digit1' && this.gameStatus == gameStatus.Started) {
                    const choices: NodeListOf<HTMLElement> = document.querySelectorAll('.audio__choice');
                    const target = choices[0];
                    buttonPressHandler(target);
                    Animation1(target);
                } else if (e.code === 'Digit2' && this.gameStatus == gameStatus.Started) {
                    const choices: NodeListOf<HTMLElement> = document.querySelectorAll('.audio__choice');
                    const target = choices[1];
                    buttonPressHandler(target);
                    Animation1(target);
                } else if (e.code === 'Digit3' && this.gameStatus == gameStatus.Started) {
                    const choices: NodeListOf<HTMLElement> = document.querySelectorAll('.audio__choice');
                    const target = choices[2];
                    buttonPressHandler(target);
                    Animation1(target);
                } else if (e.code === 'Digit4' && this.gameStatus == gameStatus.Started) {
                    const choices: NodeListOf<HTMLElement> = document.querySelectorAll('.audio__choice');
                    const target = choices[3];
                    buttonPressHandler(target);
                    Animation1(target);
                } else if (e.code === 'Digit5' && this.gameStatus == gameStatus.Started) {
                    const choices: NodeListOf<HTMLElement> = document.querySelectorAll('.audio__choice');
                    const target = choices[4];
                    buttonPressHandler(target);
                    Animation1(target);
                } else if (e.code === 'Space' && this.gameStatus != gameStatus.Ended) {
                    e.preventDefault();
                    this.wordAudio.play();
                } else if (e.code === 'Enter' && this.gameStatus != gameStatus.Ended) {
                    e.preventDefault();
                    if (!nextBtn.classList.contains('show-next')) {
                        buttonPressHandler(nextBtn);
                    } else {
                        nextBtnHandler();
                    }
                    Animation1(nextBtn);
                }
            };
        };

        keyPressHandler();
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

    showQuestion(words: IWord[], count: number) {
        const word = words[count];
        const qWords = words.slice();

        qWords.splice(count, 1);
        shuffle(qWords);
        qWords.splice(4, qWords.length, word);
        shuffle(qWords);

        const choices = document.querySelectorAll('.audio__choice');
        choices.forEach((choice, i) => {
            choice.classList.remove('.active-answer');
            choice.textContent = qWords[i].wordTranslate;
            if (qWords[i] === word) choice.setAttribute('data-answer', '');
            else choice.removeAttribute('data-answer');
        });

        const answerPhoto = getHTMLImageElement(document.querySelector('.answer__photo'));
        answerPhoto.src = `${this.data.base}/${word.image}`;

        const answerText = getHTMLElement(document.querySelector('.answer__text'));
        answerText.innerHTML = `<b>${word.word}</b> - ${word.wordTranslate}`;

        this.wordAudio.src = `${this.data.base}/${word.audio}`;
        this.wordAudio.autoplay = true;
    }

    showAnswer(el: HTMLElement) {
        el.classList.add('active-answer');
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
            choice.classList.remove('active-answer', 'disabled');
        });
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

                const src = getNotNil(target.dataset.src);
                this.sayWord(src);
                Animation1(playBtn);
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

    sayWord(path: string) {
        const audio = new Audio();
        audio.loop = false;
        audio.src = `${this.data.base}/${path}`;
        audio.autoplay = true;
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
