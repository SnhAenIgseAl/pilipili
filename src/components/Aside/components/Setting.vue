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
                    <el-radio-button label="电脑端" value="PC" />
                    <el-radio-button label="移动端" value="APP" />
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
                    :step="1" 
                    :min="0"
                    :max="100"/>
            </div>
        </div>



        <div class="setting-item">
            <div class="setting-item_title">
                表情、言论过滤
            </div>

            <div class="setting-item_body">
                <el-tag v-for="tag in USER_FILTER_EMOJI" :key="tag" 
                    closable 
                    color="#FFF"
                    size="large"
                    type="info"
                    @close="emojiRemove(tag)"
                >
                    {{ tag }}
                </el-tag>
                <el-input
                    v-if="emojiInputVisible"
                    ref="emojiInputRef"
                    v-model="emojiInput"
                    size="large"
                    @keyup.enter="emojiInputConfirm"
                    @blur="emojiInputConfirm"
                />
                <el-button v-else text @click="showEmojiInput">
                    + 表情标签
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
    USER_FILTER_EMOJI
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



// 设置表情过滤
const emojiInputVisible = ref(false)
const emojiInput = ref('')
const emojiInputRef = ref<InstanceType<typeof ElInput>>()

const emojiRemove = (tag: string) => {
    USER_FILTER_EMOJI.value.splice(USER_FILTER_EMOJI.value.indexOf(tag), 1)
}

const showEmojiInput = () => {
    emojiInputVisible.value = true
    nextTick(() => {
        emojiInputRef.value!.input!.focus()
    })
}

const emojiInputConfirm = () => {
    if (emojiInput.value) {
        USER_FILTER_EMOJI.value.push(emojiInput.value)
        console.log(USER_FILTER_EMOJI.value)
    }

    emojiInputVisible.value = false
    emojiInput.value = ''
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
</style>