//API
import Data from '../../module/api';

//UI
import Render from '../ui';

//Utils
import getHTMLElement from '../../utils/getHTMLElement';

//Interface
import IUserBody from '../interface/IUserBody';

//Style
import '../../global.scss';
import '../ui/styles/header.scss';
import '../ui/styles/sectionSplash.scss';
import '../ui/styles/sectionDevelopers.scss';
import '../ui/styles/sectionBenefits.scss';
import '../ui/styles/sectionGames.scss';
import '../ui/styles/footer.scss';

export default class App {
    data: Data;
    constructor(base: string) {
        this.data = new Data(base);
    }

    async start() {
        let user = {
            name: 'test_2',
            email: 'test_2@gmail.com',
            password: '12345678',
        };
        this.createPage();
        // let a = await this.data.createUser(user);

        // if (typeof a == 'number') {
        //     console.log('error');
        // } else {
        //     console.log(a.id);
        // }

        // const login = await this.data.login({ email: 'test_2@gmail.com', password: '12345678' });

        // if (typeof login != 'number') {
        //     console.log(
        //         await this.data.updateUser(
        //             '63026adf900d1f0016796405',
        //             {
        //                 email: 'test_2@gmail.com',
        //                 password: '12345678',
        //             },
        //             login.token
        //         )
        //     );
        // } else {
        //     console.log(login);
        // }

        // const login = await this.data.login({ email: 'test_2@gmail.com', password: '12345678' });

        // if (typeof login != 'number') {
        //     console.log(await this.data.deleteUser('63027dad900d1f0016796408', login.token));
        // } else {
        //     console.log(login);
        // }

        // const login = await this.data.login({ email: 'test_2@gmail.com', password: '12345678' });

        // if (typeof login != 'number') {
        //     console.log(login);
        //     console.log(await this.data.updateToken('63027fb4900d1f001679640c', login.refreshToken));
        // } else {
        //     console.log(login);
        // }

        // const login = await this.data.login({ email: 'test_2@gmail.com', password: '12345678' });

        // if (typeof login != 'number') {
        //     console.log(await this.data.getUserWords('63027fb4900d1f001679640c', login.token));
        // } else {
        //     console.log(login);
        // }
    }

    createPage() {
        const render = new Render();
        const header = render.header();
        const main = render.main();
        const sectionSplash = render.sectionSplash();
        const sectionDevelovers = render.sectionDevelovers();
        const sectionBenefits = render.sectionBenefits();
        const sectionGames = render.sectionGames();
        const footer = render.footer();
        const body = getHTMLElement(document.querySelector('body'));

        body.appendChild(header);
        body.appendChild(main);
        main.appendChild(sectionSplash);
        main.appendChild(sectionDevelovers);
        main.appendChild(sectionBenefits);
        main.appendChild(sectionGames);
        body.appendChild(footer);
    }
}
