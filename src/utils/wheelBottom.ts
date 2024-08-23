import { debunce } from "./debunce"

/**
 * 滚轮触底判断及执行事件
 * 
 * @param distance 滚轮距离底部多少像素距离触发事件
 * @param callback 回调
 */

let flag = true

export const wheelBottom = (distance: number, callback: Function | undefined) => {
	return function () {
		let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
		let scrollTop = document.documentElement.scrollTop || document.body.scrollTop

		if (scrollHeight - scrollTop < distance) {
			callback && callback()
		}
	}
}