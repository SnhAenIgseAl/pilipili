import { ElMessage } from "element-plus"
import BiliResType from "../type/BiliResType"


export const fetchData = async (api: any, opition: Object | undefined, callback: Function | undefined) => {
    try {
        let res = await fetch(api, opition)
        let data: BiliResType = await res.json()

        callback && callback(data)
    } catch (err) {
        ElMessage.error({ message: '服务器未连接' + err})
    }
}