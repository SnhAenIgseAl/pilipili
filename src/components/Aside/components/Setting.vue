<template>

    <div @click="settingVisible = true" class="aside-item">
        <i>&#xe68a;</i>
    </div>

    <el-drawer v-model="settingVisible" direction="ltr" size="600" title="设置">

        <el-scrollbar>
        <div class="setting-item">
            <div class="setting-item_title">
                主题色
            </div>

            <div class="setting-item_body">
                <el-row class="cl-list">
                    <div class="cl-button" style="background-color: var(--cl-pink);" @click="changeTheme('pink')"></div>
                    <div class="cl-button" style="background-color: var(--cl-red);" @click="changeTheme('red')"></div>
                    <div class="cl-button" style="background-color: var(--cl-blue);" @click="changeTheme('blue')"></div>
                    <div class="cl-button" style="background-color: var(--cl-green);" @click="changeTheme('green')"></div>
                    <div class="cl-button" style="background-color: var(--cl-yellow);" @click="changeTheme('yellow')"></div>
                    <div class="cl-button" style="background-color: var(--cl-purple);" @click="changeTheme('purple')"></div>
                    <div class="cl-button" style="background-color: var(--cl-black);" @click="changeTheme('black')"></div>
                </el-row>
            </div>
        </div>



        <div class="setting-item">
            <div class="setting-item_title">
                首页视频推荐平台
            </div>

            <div class="setting-item_body">
                <el-radio-group v-model="USER_RECOMMEND_VIDEO_PLATFORM" 
                    size="large"
                    @change="changeVideoPlatform">

                    <el-radio-button value="PC">
                        <template #default>
                            <div class="video-platform-radio">
                                <i>&#xe742;</i>电脑端
                            </div>
                        </template>
                    </el-radio-button>

                    <el-radio-button label="移动端" value="APP">
                        <template #default>
                            <div class="video-platform-radio">
                                <i>&#xe704;</i>移动端
                            </div>
                        </template>
                    </el-radio-button>

                </el-radio-group>
            </div>
        </div>



        <div class="setting-item">
            <div class="setting-item_title">
                首页视频推荐数量
            </div>

            <div class="setting-item_body">
                <el-slider v-model="USER_RECOMMEND_VIDEO_NUM" 
                    @change="changeVideoNum"
                    :disabled="USER_RECOMMEND_VIDEO_PLATFORM === 'APP'"
                    :step="1" 
                    :min="5"
                    :max="14"
                    show-stops />
            </div>
        </div>



        <div class="setting-item">
            <div class="setting-item_title">
                首页视频推荐关联性
                <el-text type="info">（值越大，推荐越相关）</el-text>
            </div>

            <div class="setting-item_body">
                <el-slider v-model="USER_RECOMMEND_VIDEO_FRESH" 
                    @change="changeVideoFresh"
                    :disabled="USER_RECOMMEND_VIDEO_PLATFORM === 'APP'"
                    :step="1" 
                    :min="0"
                    :max="100"/>
            </div>
        </div>



        <div class="setting-item">
            <div class="setting-item_title">
                表情、言论过滤
                <el-text type="info">（只屏蔽关键词，剩余的正常显示）</el-text>
            </div>

            <div class="setting-item_body">
                <el-tag v-for="tag in USER_FILTER_EMOJI" :key="tag" 
                    closable 
                    color="#FFF"
                    size="large"
                    type="info"
                    @close="tagRemove(tag, 'emoji')"
                >
                    {{ tag }}
                </el-tag>
                <el-input
                    v-if="emojiInputVisible"
                    ref="emojiInputRef"
                    v-model="emojiInput"
                    size="large"
                    @keyup.enter="tagInputConfirm('emoji')"
                    @blur="tagInputConfirm('emoji')"
                />
                <el-button v-else text @click="showTagInput('emoji')">
                    + 表情标签
                </el-button>
            </div>
        </div>



        <div class="setting-item">
            <div class="setting-item_title">
                弹幕屏蔽
                <el-text type="info">（含有关键词的弹幕不再显示）</el-text>
            </div>

            <div class="setting-item_body">
                <el-tag v-for="tag in USER_FILTER_DANMAKU" :key="tag" 
                    closable 
                    color="#FFF"
                    size="large"
                    type="info"
                    @close="tagRemove(tag, 'danmaku')"
                >
                    {{ tag }}
                </el-tag>
                <el-input
                    v-if="danmakuInputVisible"
                    ref="danmakuInputRef"
                    v-model="danmakuInput"
                    size="large"
                    @keyup.enter="tagInputConfirm('danmaku')"
                    @blur="tagInputConfirm('danmaku')"
                />
                <el-button v-else text @click="showTagInput('danmaku')">
                    + 弹幕关键词
                </el-button>
            </div>
        </div>



        <div class="setting-item">
            <div class="setting-item_title">
                查成分关键词
            </div>

            <div class="setting-item_body">
                <el-tag v-for="tag in USER_LABELLED_LIST" :key="tag" 
                    closable 
                    color="#FFF"
                    size="large"
                    type="info"
                    @close="tagRemove(tag, 'labelled')"
                >
                    {{ tag }}
                </el-tag>
                <el-input
                    v-if="labelledInputVisible"
                    ref="labelledInputRef"
                    v-model="labelledInput"
                    size="large"
                    @keyup.enter="tagInputConfirm('labelled')"
                    @blur="tagInputConfirm('labelled')"
                />
                <el-button v-else text @click="showTagInput('labelled')">
                    + 成分关键词
                </el-button>
            </div>
        </div>



        <div class="setting-item">
            <div class="setting-item_title">
                特别鸣谢
            </div>

            <div class="setting-item_body">
                <el-text>
                    <i>&#xe6bf;</i>
                    <a href="https://github.com/SocialSisterYi/bilibili-API-collect" target="_blank">
                        bilibili-API-collect
                    </a>
                </el-text>
            </div>

        </div>
        </el-scrollbar>

    </el-drawer>
    
</template>

<script setup lang="ts">
import { ref, toRefs, nextTick } from 'vue'
import { ElInput } from 'element-plus'
import { useSettingStore } from '../../../stores/setting';

const { 
    USER_THEME,
    USER_RECOMMEND_VIDEO_NUM,
    USER_RECOMMEND_VIDEO_PLATFORM,
    USER_RECOMMEND_VIDEO_FRESH,
    USER_FILTER_EMOJI,
    USER_FILTER_DANMAKU,
    USER_LABELLED_LIST
} = toRefs(useSettingStore())



const settingVisible = ref(false)



// 设置主题色
const changeTheme = (theme: string) => {
    document.querySelector('html')!.className = theme
    USER_THEME.value = theme
}



// 设置首页视频推荐平台
const changeVideoPlatform = (platform: string) => {
    USER_RECOMMEND_VIDEO_PLATFORM.value = platform
    console.log(USER_RECOMMEND_VIDEO_PLATFORM.value)
}




// 设置首页视频推荐数量
const changeVideoNum = (num: any) => {
    USER_RECOMMEND_VIDEO_NUM.value = num
}



// 设置首页视频推荐关联性
const changeVideoFresh = (num: any) => {
    USER_RECOMMEND_VIDEO_FRESH.value = num
}



// 标签（表情过滤、弹幕屏蔽、查成分关键词
const emojiInputVisible = ref(false)
const emojiInput = ref('')
const emojiInputRef = ref<InstanceType<typeof ElInput>>()

const danmakuInputVisible = ref(false)
const danmakuInput = ref('')
const danmakuInputRef = ref<InstanceType<typeof ElInput>>()

const labelledInputVisible = ref(false)
const labelledInput = ref('')
const labelledInputRef = ref<InstanceType<typeof ElInput>>()


const tagRemove = (tag: string, type: string) => {
    if (type === 'emoji') {
        USER_FILTER_EMOJI.value.splice(USER_FILTER_EMOJI.value.indexOf(tag), 1)
    }
    if (type === 'danmaku') {
        USER_FILTER_DANMAKU.value.splice(USER_FILTER_DANMAKU.value.indexOf(tag), 1)
    }
    if (type === 'labelled') {
        USER_LABELLED_LIST.value.splice(USER_LABELLED_LIST.value.indexOf(tag), 1)
    }
}

const showTagInput = (type: string) => {
    if (type === 'emoji') {
        emojiInputVisible.value = true
        nextTick(() => {
            emojiInputRef.value!.input!.focus()
        })
    }
    if (type === 'danmaku') {
        danmakuInputVisible.value = true
        nextTick(() => {
            danmakuInputRef.value!.input!.focus()
        })
    }
    if (type === 'labelled') {
        labelledInputVisible.value = true
        nextTick(() => {
            labelledInputRef.value!.input!.focus()
        })
    }
}

const tagInputConfirm = (type: string) => {
    if (type === 'emoji') {
        if (emojiInput.value) {
            USER_FILTER_EMOJI.value.push(emojiInput.value)
            USER_FILTER_EMOJI.value = Array.from(new Set(USER_FILTER_EMOJI.value))
        }

        emojiInputVisible.value = false
        emojiInput.value = ''
    }
    if (type === 'danmaku') {
        if (danmakuInput.value) {
            USER_FILTER_DANMAKU.value.push(danmakuInput.value)
            USER_FILTER_DANMAKU.value = Array.from(new Set(USER_FILTER_DANMAKU.value))
        }

        danmakuInputVisible.value = false
        danmakuInput.value = ''
    }
    if (type === 'labelled') {
        if (labelledInput.value) {
            USER_LABELLED_LIST.value.push(labelledInput.value)
            USER_LABELLED_LIST.value = Array.from(new Set(USER_LABELLED_LIST.value))
        }

        labelledInputVisible.value = false
        labelledInput.value = ''
    }
}

</script>

<style scoped>

.aside-item {
    width: 50px;
    height: 50px;
    text-align: center;
    align-content: center;
    margin-bottom: 10px;
    /* border: 1px solid #ddd; */
    border-radius: 10px;
    background-color: var(--cl-white);

    i {
        font-size: 24px;
        margin-right: unset;
    }

    &:hover {
        color: #fff;
        background: var(--cl-primary);
        cursor: pointer;
    }
}
.setting-item {
    padding: 16px;

    .setting-item_title {
        font-size: 18px;
        line-height: 30px;
    }

    .setting-item_body {
        margin: 16px 0;
    }
}

.cl-list {
    justify-content: space-between;
    align-items: center;
}

.cl-button {
    width: 30px;
    height: 30px;
    border-radius: 6px;

    &:hover {
        cursor: pointer;
    }
}

.video-platform-radio {
    width: 234px;
    height: 30px;
    align-content: center;
}
</style>