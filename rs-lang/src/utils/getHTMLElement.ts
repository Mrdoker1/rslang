const getElement = <E extends Element = Element>(target: EventTarget | null) => {
    if (target instanceof HTMLElement) {
        return target;
    }
    throw new Error(`${typeof target} is not instance of HTMLElement!`);
};

export default getElement;
