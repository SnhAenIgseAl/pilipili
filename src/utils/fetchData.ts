import { ElMessage } from "element-plus"
import BiliResType from "../type/BiliResType"


export const fetchData = async (api: string, opition: RequestInit | undefined, callback: Function | undefined) => {
    try {
        api = api.replace('/api', 'https://pilipili-server.icu')
        opition!.mode = 'cors'
        opition!.credentials = 'include'

        let res = await fetch(api, opition)
        let data: BiliResType = await res.json()

        callback && callback(data)
    } catch (err) {
        ElMessage.warning({ message: '服务器未连接' + err})
    }
}