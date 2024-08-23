import { toRefs } from 'vue'
import emoji from './emoji'
import { useSettingStore } from '../stores/setting'



// 用户屏蔽表情
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
        for (let j = 0; j < USER_FILTER_EMOJI.value.length; j++) {
            text = text.split(USER_FILTER_EMOJI.value[j]).join('')
        }
        text = text.split(emoji[i].name).join(`<img class='comment-text_img' src='https://images.weserv.nl/?url=${emoji[i].src}@48w.webp' />`)
    }
    return text
}



// 解析@信息
function parseAt(text: string, members: Array<any> | []) {
    if (members.length === 0) {
        return text
    } else {
        for (let i = 0; i < members.length; i++) {
            text = text.split(`@${members[i].uname}`).join(`<span class="at-uname">@${members[i].uname}</span> `)
        }
        return text
    }

}