import { toRefs } from 'vue'
import emoji from './emoji'
import { useSettingStore } from '../stores/setting'



const {
    USER_FILTER_EMOJI
} = toRefs(useSettingStore())



const parseEmoji = (text: string) => {

    for (let i = 0; i < emoji.length; i++) {
        for (let j = 0; j < USER_FILTER_EMOJI.value.length; j++) {
            text = text.split(USER_FILTER_EMOJI.value[j]).join('')
        }
        text = text.split(emoji[i].name).join(`<img class='comment-text_img' src='https://images.weserv.nl/?url=${emoji[i].src}@48w.webp' />`)
    }

    // console.log(text)
    return text
}



export default parseEmoji