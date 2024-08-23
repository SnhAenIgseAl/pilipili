export const debunce = function (callback: Function, wait: number) {
    let timeout: number | null = null

    return function () {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            callback && callback()
        }, wait)
    }
}