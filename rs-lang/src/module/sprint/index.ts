//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLInputElement from '../../utils/getHTMLInputElement';

//UI
import Render from '../ui';

export default class Sprint {
    group: number;
    page: number;
    multiplier: number;
    counter: number;
    points: number;
    render: Render;
    constructor(group: number, page: number) {
        this.group = group;
        this.page = page;
        this.multiplier = 1;
        this.counter = 100;
        this.points = 0;
        this.render = new Render();
    }

    start() {
        console.log('Sprint Game Started!');
        const playZone = this.setPlayZone();

        const interval = window.setInterval(() => {
            try {
                const oldChart = getHTMLElement(document.querySelector('.chart'));
                const newChart = this.render.chart(500, 8, (this.counter -= 0.01), '#2B788B', '#C3DCE3');
                playZone.replaceChild(newChart, oldChart);
            } catch {
                window.clearInterval(interval);
            }
        }, 10);
    }

    setPlayZone() {
        const main = getHTMLElement(document.querySelector('main'));
        const chart = this.render.chart(500, 8, this.counter, '#2B788B', '#C3DCE3');
        const sprintBody = this.render.gameSprint(2, 30, 2, 'English Word', 'Перевод');

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
