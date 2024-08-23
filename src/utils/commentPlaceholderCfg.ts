export const commentPlaceholderTxt: Array<String> = [
    '你在装饰谁的评论区',
    '少讲道理，多点攻击',
    '直接扣问号，TA受不了的'
]

export const getPlaceholderTxt = () => {
    let index = Math.floor(Math.random() * 10)
    return commentPlaceholderTxt[index]
}