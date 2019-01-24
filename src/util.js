export const isArray = x => Array.isArray(x)
export const isObject = x => !Array.isArray(x) && typeof x === 'object' && x !== null