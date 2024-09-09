import { ref, Ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchData } from '../utils/fetchData'
import BiliResType from '../type/BiliResType'


// 用户信息状态
export const useUserStore = defineStore('user', () => {

    // 是否登录
    const isLogin: Ref<boolean> = ref(false)

    // 用户信息
    const info: Ref<any> = ref({})

    // 动态更新基线id
    const baseline: Ref<string> = ref('')

    // 评论内容
    const USER_COMMENT_TXT: Ref<string> = ref('')

    // 子评论内容
    const USER_COMMENT_CHILD_TXT: Ref<string> = ref('')

    // 动态内容
    const USER_DYNAMIC_TXT: Ref<string> = ref('')

    // 视频跳转时间点
    const JUMP_VIDEO_TIME: Ref<number> = ref(0)

    // 获取用户状态
    async function getInfo() {
        await fetchData(`/api/nav`, {
        }, (data: BiliResType) => {
            info.value = data.data
            isLogin.value = data.data.isLogin
        })
    }

    return { 
        isLogin,
        info,
        baseline,
        getInfo,
        USER_COMMENT_TXT,
        USER_COMMENT_CHILD_TXT,
        USER_DYNAMIC_TXT,
        JUMP_VIDEO_TIME
    }
}, {
    persist: true
})