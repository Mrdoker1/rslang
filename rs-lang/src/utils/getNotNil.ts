const getNotNil = <T>(node: T | null | undefined, errorMessage = `${node} is Nil`) => {
    if (node === undefined || node === null) {
        throw new Error(errorMessage);
    }

    return node;
};

export default getNotNil;
