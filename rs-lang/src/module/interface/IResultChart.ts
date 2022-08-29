//Enums
import { gameChart } from '../../utils/enums';

export default interface IResultChart {
    type: gameChart;
    maxValue: number;
    currentValue: number;
}
