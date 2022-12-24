export function assign<T = { new (): {} }>(
    target: T,
    k: keyof T,
    v: T[keyof T]
) {
    if (v === undefined || v === null) {
        return
    }
    target[k] = v
}
