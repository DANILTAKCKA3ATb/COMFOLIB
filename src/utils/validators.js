export const maxLengthCreator = length => value => {
    if (value && value.length > length) return `Max length is ${length}`;
    return undefined;
};

export const minLengthCreator = length => value => {
    if (value && value.length <= length) return `Min length is ${length}`;
    return undefined;
};
