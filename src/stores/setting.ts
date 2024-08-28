import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'



// 用户定义设置
export const useSettingStore = defineStore('setting', () => {

    // 主题色
    const USER_THEME: Ref<String> = ref('pink')

    // 首页视频推荐数量
    const USER_RECOMMEND_VIDEO_NUM: Ref<Number> = ref(10)

    // 首页视频推荐平台
    const USER_RECOMMEND_VIDEO_PLATFORM: Ref<String> = ref('PC')

    // 首页视频推荐关联性
    const USER_RECOMMEND_VIDEO_FRESH: Ref<Number> = ref(100)

    // 表情屏蔽，我看见唐氏表情就会死
    const USER_FILTER_EMOJI: Ref<String[]> = ref([])

    // 弹幕屏蔽
    const USER_FILTER_DANMAKU: Ref<String[]> = ref([])

    return {
        USER_THEME,
        USER_RECOMMEND_VIDEO_NUM,
        USER_RECOMMEND_VIDEO_PLATFORM,
        USER_RECOMMEND_VIDEO_FRESH,
        USER_FILTER_EMOJI,
        USER_FILTER_DANMAKU
    }
},{
    persist: true
})