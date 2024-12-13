import { isObject } from 'lodash'

export function excludeField<T, K extends keyof T>(list: undefined, keys: K[]): undefined
export function excludeField<T, K extends keyof T>(list: T[], keys: K[]): Omit<T, K>[]
export function excludeField<T, K extends keyof T>(list: T, keys: K[]): Omit<T, K>
export function excludeField<T, K extends keyof T>(list: T | T[] | undefined, keys: K[]) {
    if (!isObject(list)) {
        return list as undefined
    }

    const isArray = Array.isArray(list)
    const arr = isArray ? (list as T[]) : [list]

    const res = arr.map((item) => {
        return Object.entries(item).reduce(
            (newObj, [key, value]) => {
                if (!keys.includes(key as K)) {
                    newObj[key as Exclude<keyof T, K>] = value
                }
                return newObj
            },
            {} as Omit<T, K>,
        )
    })

    return isArray ? res : res[0]
}
