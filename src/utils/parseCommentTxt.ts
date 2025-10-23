import { toRefs } from 'vue'
// import emoji from './emoji'
import { useSettingStore } from '../stores/setting'



// 用户屏蔽的表情及言论关键词
const {
    USER_FILTER_EMOJI
} = toRefs(useSettingStore())



interface EmoteType {
    [key: string]: {
        url: string
    }
}



export const parseCommentTxt = (text: string, emote: EmoteType, members: Array<any> | []) => {
    text = parseHtml(text)
    text = parseEmoji(text, emote)
    text = parseAt(text, members)
    return text
}



// 转义HTML
function parseHtml(text: string) {
    return text
        .split('<').join('&lt;')
        .split('>').join('&gt;')
}



// 解析表情
function parseEmoji(text: string, emote: EmoteType) {

    // 过滤表情
    for (let i = 0; i < USER_FILTER_EMOJI.value.length; i++) {
        text = text.split(USER_FILTER_EMOJI.value[i].toString()).join('')
    }
    
    if (emote) {
        const emoteList = Object.keys(emote)
        console.log(emoteList)
        for (let i = 0; i < emoteList.length; i++) {
            let url = emote[emoteList[i]].url
            text = text.split(emoteList[i]).join(`<img class='comment-text_img' src='${url}@48w.webp' />`)
        }
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