import IStatisticsDay from './IStatisticsDay';

export default interface IStatistics {
    learnedWords: number;
    optional: IStatisticsDay[];
}
