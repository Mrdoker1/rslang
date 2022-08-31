import IStatisticsDay from './IStatisticsDay';

export default interface IStatistics {
    id?: string;
    learnedWords: number;
    optional: Record<string, IStatisticsDay>;
}
