import { useUserStore } from "@/stores/user"
import BiliResType from "../type/BiliResType"

const getUserStore = async () => {
    return useUserStore()
}


export const fetchData = async (api: string, option: RequestInit | undefined, callback: Function | undefined) => {
    
    const userStore = await getUserStore()

    // 为什么我一年前写的代码会这么烂 😭😭😭
    try {
        api = api.replace('/api', 'https://pilipili.api.snhaenigseal.cn')
        // api = api.replace('/api', 'http://127.0.0.1:18848')

        const time = new Date().getTime()
        if (api.includes('?')) {
            api += `&t=${time}`
        } else {
            api += `?t=${time}`
        }
        
        option.mode = 'cors'

        if (userStore.isLogin) {
            option.credentials = 'include'
        } else {
            option.credentials= 'omit'
        }

        let res = await fetch(api, option)
        let data: BiliResType = await res.json()

        callback && callback(data)
    } catch (err) {
        throw new Error(err as string)
    }
}