const getElement = <E extends Element = Element>(target: EventTarget | null) => {
    if (target instanceof HTMLSelectElement) {
        return target;
    }
    throw new Error(`${typeof target} is not instance of HTMLSelectElement!`);
};

export default getElement;
