/**
 * 检测评论中是否有时间点
 */
export function hasJumpTime(text: string) {
    let reg: RegExp = /\d+[:：]\d+/g
    let match: RegExpMatchArray = text.match(reg)!

    return match && match.length > 0
}