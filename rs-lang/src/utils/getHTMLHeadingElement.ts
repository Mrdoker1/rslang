const getElement = <E extends Element = Element>(target: EventTarget | null) => {
    if (target instanceof HTMLHeadingElement) {
        return target;
    }
    throw new Error(`${typeof target} is not instance of HTMLHeadingElement!`);
};

export default getElement;
