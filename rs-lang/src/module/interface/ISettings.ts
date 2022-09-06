export default interface ISettings {
    [key: string]: number | {};
    wordsPerDay: number;
    optional: {
        listView: boolean;
        showButtons: boolean;
        avatar: string;
    };
}
