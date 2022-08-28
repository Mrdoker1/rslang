//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLImageElement from '../../utils/getHTMLImageElement';
import { shuffle } from '../../utils/helpers';

//Interfaces
import IWord from '../interface/IWord';

//API
import Data from '../../module/api';

//UI
import Render from '../ui';

export default class AudioCall {
    group: number;
    page: number;
    data: Data;
    render: Render;
    constructor(base: string, group: number, page: number) {
        this.group = group;
        this.page = page;
        this.data = new Data(base);
        this.render = new Render();
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
                }
            });
        });

        const nextBtn = getHTMLElement(document.querySelector('.audio__next-btn'));
        nextBtn.addEventListener('click', () => {
            const len = words.length - 1;
            if (count === len || attempt === -1) {
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
}
