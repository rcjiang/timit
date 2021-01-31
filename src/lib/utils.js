export function positiveInt(value) {
    let int = parseInt(value);
    return int > 0  ? int : undefined;
}

export function isInt(value) {
    return parseInt(value) === value
}

export function isPositiveInt(value) {
    return isInt(value) && value > 0
}

export function isObject(value) {
    return Object.prototype.toString.call(value).slice(8, -1) === 'Object'
}

export function pipe(initVal, ...fns) {
    return fns.reduce((value, fn) => fn(value), initVal);
}

export function round(num, digits = 0) {
    const scale = 10 ** digits
    return Math.round(num * scale) / scale
}