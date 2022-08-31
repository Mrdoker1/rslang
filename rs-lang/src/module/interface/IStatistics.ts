import IStatisticsDay from './IStatisticsDay';

export default interface IStatistics {
    id?: string;
    learnedWords: number;
    optional: { [key: string]: IStatisticsDay };
}
