//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLButtonElement from '../../utils/getHTMLButtonElement';
import { shuffle, getRandom } from '../../utils/helpers';

//Interfaces
import IWord from '../interface/IWord';
import ISprintState from '../interface/ISprintState';

//UI
import Render from '../ui';

export default class Sprint {
    group: number;
    page: number;
    counter: number;
    speed: number;
    words: IWord[];
    gameState: ISprintState;
    result: {};
    render: Render;
    constructor(words: IWord[], group: number, page: number) {
        this.group = group;
        this.page = page;
        this.counter = 100;
        this.speed = 0.1;
        this.words = words;
        shuffle(this.words);
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
    }

    start() {
        console.log('Sprint Game Started!');
        this.setNewWord();
        const playZone = this.setPlayZone();
        this.setHandlers(playZone);

        const interval = window.setInterval(() => {
            try {
                if (this.counter <= 0) {
                    window.clearInterval(interval);
                    console.log('Sprint Game Finished!');
                }
                const oldChart = getHTMLElement(document.querySelector('.chart'));
                const newChart = this.render.chart(500, 8, (this.counter -= this.speed), '#2B788B', '#C3DCE3');
                playZone.replaceChild(newChart, oldChart);
            } catch {
                window.clearInterval(interval);
            }
        }, 10);
    }

    setNewWord() {
        const word = this.words[getRandom(0, this.words.length - 1)];
        const possibleTranslation = this.words[getRandom(0, this.words.length - 1)].wordTranslate;

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
                    console.log('Right Answer!');
                    if (this.gameState.strike == 3) {
                        this.gameState.multiplier += 1;
                        this.gameState.strike = 0;
                    }
                    this.gameState.points += this.gameState.multiplier * 10;
                    this.gameState.strike += 1;
                } else {
                    console.log('Wrong Answer!');
                    this.gameState.strike = 0;
                    this.gameState.multiplier = 1;
                }
                this.renderNewGameBody(playZone);
            }
        });

        buttonFalse.addEventListener('click', () => {
            if (this.counter > 0) {
                if (this.gameState.possibleTranslation != this.gameState.wordTranslation) {
                    console.log('Right Answer!');
                    if (this.gameState.strike == 3) {
                        this.gameState.multiplier += 1;
                        this.gameState.strike = 0;
                    }
                    this.gameState.points += this.gameState.multiplier * 10;
                    this.gameState.strike += 1;
                } else {
                    console.log('Wrong Answer!');
                    this.gameState.strike = 0;
                    this.gameState.multiplier = 1;
                }
                this.renderNewGameBody(playZone);
            }
        });
    }

    setPlayZone() {
        const main = getHTMLElement(document.querySelector('main'));
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
}
