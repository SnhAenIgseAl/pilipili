export const parseAtUser = (text: string, members: Array<any>) => {

    // console.log(members)

    if (members) {
        for (let i = 0; i <= members!.length; i++) {
            text = text.split(`@${members![i].uname}`).join(`<span class="at-uname">@${members![i].uname}</span>`)
        }
    }
    
    return text
}