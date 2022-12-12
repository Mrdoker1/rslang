const getElement = <E extends Element = Element>(target: EventTarget | null) => {
    if (target instanceof HTMLImageElement) {
        return target;
    }
    throw new Error(`${typeof target} is not instance of HTMLImageElement!`);
};

export default getElement;
