const getElement = <E extends Element = Element>(target: EventTarget | null) => {
    if (target instanceof HTMLMetaElement) {
        return target;
    }
    throw new Error(`${typeof target} is not instance of HTMLMetaElement!`);
};

export default getElement;
