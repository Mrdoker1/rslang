//API
import Data from '../../module/api';

//Interface
import IUserBody from '../interface/IUserBody';

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
}
