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
        const div = document.createElement('div');
        div.innerHTML = `<div>counter = ${this.multiplier}</div>`;
        const chart = this.render.chart(500, 8, 96, '#2B788B', '#C3DCE3');
        main.appendChild(chart);
    }
}
