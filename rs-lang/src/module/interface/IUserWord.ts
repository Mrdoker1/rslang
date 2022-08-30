export default interface IUserWord {
    id?: string;
    wordId?: string;
    difficulty: string;
    optional?: {
        total?: number;
        right?: number;
        series?: number;
    };
}
