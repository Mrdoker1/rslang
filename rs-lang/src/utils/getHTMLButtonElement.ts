const getElement = <E extends Element = Element>(target: EventTarget | null) => {
    if (target instanceof HTMLButtonElement) {
        return target;
    }
    throw new Error(`${typeof target} is not instance of HTMLButtonElement!`);
};

export default getElement;
