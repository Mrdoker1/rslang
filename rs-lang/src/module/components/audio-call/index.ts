//Utils
import getHTMLElement from '../../../utils/getHTMLElement';
import getHTMLImageElement from '../../../utils/getHTMLImageElement';
import { shuffle } from '../../../utils/helpers';

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

export default class AudioCall {
    group: number;
    page: number;
    data: Data;
    render: Render;
    result: Record<string, IWord[]>;
    series: number = 0;
    record: number = 0;
    state = new State();
    constructor(base: string, group: number, page: number) {
        this.group = group;
        this.page = page;
        this.data = new Data(base);
        this.render = new Render();
        this.result = {
            knowingWords: [],
            unknowingWords: [],
        };
    }

    async start() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        const game = this.render.gameAudioCall();
        main.append(game);

        let count = 0;
        let attempt = 4;

        const words = await this.data.getWords(this.group, this.page);
        if (typeof words === 'number') {
            console.log(`error ${words}`);
            return;
        }
        shuffle(words);
        this.showQuestion(words, count);

        const answerBtns = document.querySelectorAll('.audio__choice, .audio__know-btn');
        answerBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const target = getHTMLElement(e.target);

                this.showAnswer(target);
                const answer = target.dataset.answer;

                if (answer === undefined) {
                    const hearts = document.querySelectorAll('.audio__icon-heart');
                    hearts[attempt].classList.add('audio__icon-heart_miss');
                    attempt -= 1;
                    this.result.unknowingWords.push(words[count]);
                    if (this.series > this.record) this.record = this.series;
                    this.series = 0;
                } else {
                    this.result.knowingWords.push(words[count]);
                    this.series += 1;
                    //console.log(this.series);
                }
            });
        });

        const nextBtn = getHTMLElement(document.querySelector('.audio__next-btn'));
        nextBtn.addEventListener('click', () => {
            const len = words.length - 1;
            if (count === len || attempt === -1) {
                if (this.series > this.record) this.record = this.series;
                //console.log(this.state.token);
                if (this.state.token) this.saveStatistics();
                this.showResult();
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

    showResult() {
        const main = getHTMLElement(document.querySelector('.main'));
        main.innerHTML = '';
        main.innerHTML = '<h2>Результаты игры</h2>';
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
            sts = this.createEntry();
        }

        let newCount = sts.audio.new;
        let total = sts.audio.total;
        let right = sts.audio.right;
        let learned = sts.audio.learned;
        let record = sts.audio.record;
        if (!record || this.record > record) record = this.record;

        knowingWords.forEach(async (word, i) => {
            let learnedInGame = 0;

            const matchedUserWord = userWords.find((userWord) => userWord.wordId === word.id);
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
            const matchedUserWord = userWords.find((userWord) => userWord.wordId === word.id);
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

        // console.log(stsAll);
        delete stsAll.id;
        const updateUserStatistics = await this.data.updateUserStatistics(this.state.userId, stsAll, this.state.token);
        if (typeof updateUserStatistics === 'number') {
            console.log(`Ошибка updateUserStatistics ${updateUserStatistics}`);
            return;
        }
    }

    createEntry() {
        const curDate = new Date();
        const date = curDate.toString();
        return {
            date,
            sprint: {
                new: 0,
                total: 0,
                right: 0,
                record: 0,
                learned: 0,
            },
            audio: {
                new: 0,
                total: 0,
                right: 0,
                record: 0,
                learned: 0,
            },
            book: {
                new: 0,
                learned: 0,
            },
        };
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
        const resp = await this.data.createUserWord(this.state.userId, word.id, newUserWord, this.state.token);
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

        const resp = await this.data.updateUserWord(this.state.userId, word.id, updUserWord, this.state.token);
        if (typeof resp !== 'number') {
            return isLearned;
        } else {
            console.log(`Ошибка ${resp}`);
        }
    }
}
