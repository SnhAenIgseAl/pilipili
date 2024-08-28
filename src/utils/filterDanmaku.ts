import { toRefs } from 'vue';
import { useSettingStore } from '../stores/setting';
import type danmakuType from '../type/danmakuType';



const {
    USER_FILTER_DANMAKU
} = toRefs(useSettingStore())



/**
 * 过滤弹幕
 * 
 * @param list 弹幕列表
 * @returns 
 */
export const filterDanmaku = (list: danmakuType[]) => {
    list = list.filter((item) => {
        for (let i = 0; i < USER_FILTER_DANMAKU.value.length; i++) {
            if (item.content.includes(USER_FILTER_DANMAKU.value[i].toString())) {
                return null
            }
        }
        return item.content
    })
    return list
}