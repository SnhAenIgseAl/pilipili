export * from './debounce'
export * from './emoji'
export * from './BiliMidCrc'
export * from './commentPlaceholderCfg'
export * from './fetchData'
export * from './filterDanmaku'
export * from './labelled'
export * from './parseAtUser'
export * from './parseCommentTxt'
export * from './parseTime'
export * from './wheelBottom'

export const sleep = async (time: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

