const getElement = <E extends Element = Element>(target: EventTarget | null) => {
    if (target instanceof SVGElement) {
        return target;
    }
    throw new Error(`${typeof target} is not instance of Element!`);
};

export default getElement;
