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
        getInfo
    }
}, {
    persist: true
})