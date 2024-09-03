interface danmakuType {
    time: number,           // 出现时间
    content: string,        // 文本
    hash: string,           // 发送人mid的hash值
    showId: false | true,   // 是否解析mid
    mid: string             // 解析后mid
}



export default danmakuType