interface IStatisticsDay {
    date: string;
    sprint: {
        new: number;
        total: number;
        right: number;
        record: number;
        learned: number;
    };
    audio: {
        new: number;
        total: number;
        right: number;
        record: number;
        learned: number;
    };
    book: {
        new: number;
        learned: number;
    };
}

export default IStatisticsDay;
