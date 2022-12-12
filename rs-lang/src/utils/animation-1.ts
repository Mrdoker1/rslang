const newspaperSpinning = [
    { transform: 'rotate(0) scale(1)' },
    { transform: 'rotate(0) scale(1.2)' },
    { transform: 'rotate(0) scale(1)' },
];
const newspaperTiming = {
    duration: 100,
    iterations: 1,
};
export default (target: Element) => {
    target.animate(newspaperSpinning, newspaperTiming);
};
