import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


// 用户信息状态
export const useUserStore = defineStore('user', () => {

    // 是否登录
    const isLogin = ref(Boolean)

    // 用户信息
    const info = ref(Object)

    // 动态更新基线id
    const baseline = ref(String)

    // 获取用户状态
    function getInfo() {
        try {
            fetch(`/api/nav`)
            .then(res => res.json())
            .then(res => {
                info.value = res.data
                isLogin.value = res.data.isLogin
            }) 
        } catch (err) {
            console.error('[Pinia user error]' + err)
        }
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