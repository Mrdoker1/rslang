const getElement = <E extends Element = Element>(target: EventTarget | null) => {
    if (target instanceof HTMLInputElement) {
        return target;
    }
    throw new Error(`${typeof target} is not instance of HTMLInputElement!`);
};

export default getElement;
