import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'



// 用户定义设置
export const useSettingStore = defineStore('setting', () => {

    // 主题色
    const USER_THEME: Ref<string> = ref('pink')

    // 首页视频推荐数量
    const USER_RECOMMEND_VIDEO_NUM: Ref<number> = ref(10)

    // 首页视频推荐平台
    const USER_RECOMMEND_VIDEO_PLATFORM: Ref<string> = ref('PC')

    // 首页视频推荐关联性
    const USER_RECOMMEND_VIDEO_FRESH: Ref<number> = ref(100)

    // 表情屏蔽，我看见唐氏表情就会死
    const USER_FILTER_EMOJI: Ref<string[]> = ref([])

    // 弹幕屏蔽
    const USER_FILTER_DANMAKU: Ref<string[]> = ref([])

    // 查成分关键词
    const USER_LABELLED_LIST: Ref<string[]> = ref([])

    return {
        USER_THEME,
        USER_RECOMMEND_VIDEO_NUM,
        USER_RECOMMEND_VIDEO_PLATFORM,
        USER_RECOMMEND_VIDEO_FRESH,
        USER_FILTER_EMOJI,
        USER_FILTER_DANMAKU,
        USER_LABELLED_LIST
    }
},{
    persist: true
})