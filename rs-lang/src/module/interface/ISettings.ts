export default interface ISettings {
    [key: string]: number | {} | string;
    wordsPerDay: number;
    optional: {
        listView: boolean;
        showButtons: boolean;
        avatar: { [key: string]: string };
    };
}
