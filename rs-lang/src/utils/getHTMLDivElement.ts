const getElement = <E extends Element = Element>(target: EventTarget | null) => {
    if (target instanceof HTMLDivElement) {
        return target;
    }
    throw new Error(`${typeof target} is not instance of HTMLDivElement!`);
};

export default getElement;
