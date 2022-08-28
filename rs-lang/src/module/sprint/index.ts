import getHTMLElement from '../../utils/getHTMLElement';
import getHTMLInputElement from '../../utils/getHTMLInputElement';

export default class Sprint {
    group: number;
    page: number;
    constructor(group: number, page: number) {
        this.group = group;
        this.page = page;
    }

    start() {
        console.log('Game Started!');
    }
}
