//API
import Data from '../../module/api';

export default class App {
    data: Data;
    constructor(base: string) {
        this.data = new Data();
    }

    start() {
        console.log('start!');
    }
}
