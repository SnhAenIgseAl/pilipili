import { toRefs } from 'vue'
import emoji from './emoji'
import { useSettingStore } from '../stores/setting'



// 用户屏蔽的表情及言论关键词
const {
    USER_FILTER_EMOJI
} = toRefs(useSettingStore())



export const parseCommentTxt = (text: string, members: Array<any> | []) => {
    text = parseEmoji(text)
    text = parseAt(text, members)
    return text
}



// 解析表情
function parseEmoji(text: string) {
    for (let i = 0; i < emoji.length; i++) {
        // 过滤表情
        for (let j = 0; j < USER_FILTER_EMOJI.value.length; j++) {
            text = text.split(USER_FILTER_EMOJI.value[j].toString()).join('')
        }
        text = text.split(emoji[i].name).join(`<img class='comment-text_img' src='https://images.weserv.nl/?url=${emoji[i].src}@48w.webp' />`)
    }
    return text
}



// 解析@信息
function parseAt(text: string, members: Array<any> | []) {
    if (members.length === 0) {
        return text
    }
    for (let i = 0; i < members.length; i++) {
        text = text.split(`@${members[i].uname}`).join(`<a href="/space/${members[i].mid}/home" target="_blank" class="at-uname">@${members[i].uname}</a> `)
    }
    return text
}