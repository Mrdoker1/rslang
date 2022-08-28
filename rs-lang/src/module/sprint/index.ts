//Utils
import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLInputElement from '../../utils/getHTMLInputElement';

//UI
import Render from '../ui';

export default class Sprint {
    group: number;
    page: number;
    multiplier: number;
    points: number;
    render: Render;
    constructor(group: number, page: number) {
        this.group = group;
        this.page = page;
        this.multiplier = 1;
        this.points = 0;
        this.render = new Render();
    }

    start() {
        console.log('Game Started!');
        const main = getHTMLElement(document.querySelector('main'));
        let counter = 100;
        const chart = this.render.chart(500, 8, counter, '#2B788B', '#C3DCE3');
        const sprint = this.render.gameSprint(2, 30, 2, 'genocide', 'потерять');
        main.appendChild(sprint);

        // const interval = window.setInterval(() => {
        //     const oldChart = getHTMLElement(document.querySelector('.chart'));
        //     const newChart = this.render.chart(500, 8, (counter -= 0.01), '#2B788B', '#C3DCE3');
        //     main.replaceChild(newChart, oldChart);
        // }, 10);
    }
}
