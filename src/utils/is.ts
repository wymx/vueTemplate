const toString = Object.prototype.toString;
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
export const isFunction = <T extends () => void>(val: any): val is T => typeof val === 'function';
export const isNumbers = (val: any): val is number => typeof val === 'number';
export const isUndefined = (val: any): val is undefined => typeof val === 'undefined';
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isObject = (val: any): val is object => toString.call(val) === '[object Object]';
export const isArrays = (val: any): val is object => toString.call(val) === '[object Array]';
export const isEmpty = (val: any): val is boolean => !val && val !== 0;
