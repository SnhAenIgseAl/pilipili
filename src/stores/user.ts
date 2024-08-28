import { ref, Ref } from 'vue'
import { defineStore } from 'pinia'


// 用户信息状态
export const useUserStore = defineStore('user', () => {

    // 是否登录
    const isLogin: Ref<boolean> = ref(false)

    // 用户信息
    const info: Ref<any> = ref({})

    // 动态更新基线id
    const baseline: Ref<string> = ref('')

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