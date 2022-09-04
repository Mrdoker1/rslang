//Interfaces
import IWord from '../interface/IWord';

//Enums
import { gameStatus } from '../../utils/enums';

export default interface ISprintState {
    word: IWord | null;
    wordEnglish: string;
    wordTranslation: string;
    possibleTranslation: string;
    points: number;
    multiplier: number;
    strike: number;
    status: gameStatus;
}
