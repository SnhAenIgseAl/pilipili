export const debunce = function (callback: Function, wait: number) {
    let timeout: NodeJS.Timeout

    return function () {
        if (timeout) {
            clearTimeout(timeout)
        }

        timeout = setTimeout(() => {
            callback && callback()
        }, wait)
    }
}