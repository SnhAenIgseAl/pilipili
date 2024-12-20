import { ElMessage } from "element-plus"
import BiliResType from "../type/BiliResType"


export const fetchData = async (api: string, opition: RequestInit | undefined, callback: Function | undefined) => {
    try {
        api = api.replace('/api', 'https://pilipili-server.icu')

        if (opition) {
            opition.mode = 'cors'
            opition.credentials = 'include'
        }
        
        // api = api.replace('/api', 'http://127.0.0.1:18848')

        let res = await fetch(api, opition)
        let data: BiliResType = await res.json()

        callback && callback(data)
    } catch (err) {
        ElMessage.warning({ message: '服务器未连接' + err})
    }
}