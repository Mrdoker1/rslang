import IWord from '../module/interface/IWord';

const getRandom = (min: number, max: number): number => {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
};

const shuffle = (arr: IWord[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
};

const createStsEntry = () => {
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
};

export { getRandom, shuffle, createStsEntry };
