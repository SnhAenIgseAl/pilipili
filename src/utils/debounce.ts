export const debounce = function (callback: Function, wait: number) {
    let timeout: NodeJS.Timeout | null = null

    return function (this: unknown, ...args: any[]) {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            callback.apply(this, ...args)
            timeout = null
        }, wait)
    }
}