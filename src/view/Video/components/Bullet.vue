<template>

    <el-input v-model="bulletInput" 
        size="small"
        class="bullet-input"
        @focus="videoPause"
        @blur="videoPlay">

        <!-- 弹幕样式设置 -->
        <template #prepend>
            <el-popover trigger="click" :width="200">

                <template #reference>
                    <el-button>A</el-button>
                </template>

                <template #default>
                    <el-text>弹幕颜色</el-text>
                    <el-color-picker v-model="bulletColor"></el-color-picker><br />
                    <el-text>弹幕字号</el-text>
                    <el-select v-model="bulletFontSize"
                        placeholder="">
                        <el-option
                            v-for="item in bulletFontSizeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                    </el-select>
                    <el-text>弹幕位置</el-text>
                    <el-select v-model="bulletMode"
                        placeholder="">
                        <el-option
                            v-for="item in bulletModeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                    </el-select>
                </template>

            </el-popover>
        </template>

        <template #append>
            <el-button @click="sendBullet" type="primary">发送</el-button>
        </template>

    </el-input>

</template>

<script setup lang="ts">
import { ref, Ref, toRaw } from 'vue'
import { fetchData } from '../../../utils/fetchData';
import BiliResType from '../../../type/BiliResType';
import { ElNotification } from 'element-plus';

const props = defineProps({
    bvid: String,
    cid: Number,
    videoRef: Object
})

const videoRef: any = toRaw(props.videoRef)

// 鼠标点击弹幕输入框时暂停视频
const videoPause = () => {
    // if (props.videoRef) {
        // if (!props.videoRef.value.paused) {
        //     props.videoRef.value.pause()
        // }
        console.log(videoRef)
    // }
}

const videoPlay = () => {
    if (props.videoRef) {
        if (props.videoRef.paused) {
            props.videoRef.play()
        }
    }
}


const bulletInput: Ref<string> = ref('')
const bulletColor: Ref<string> = ref('#ffffff')
const bulletFontSize: Ref<number> = ref(18)
const bulletFontSizeOptions = [{
    value: 18,
    label: '小'
}, {
    value: 25,
    label: '标准'
}, {
    value: 36,
    label: '大'
}]
const bulletMode: Ref<number> = ref(1)
const bulletModeOptions = [{
    value: 1,
    label: '普通弹幕'
}, {
    value: 4,
    label: '底部弹幕'
}, {
    value: 5,
    label: '顶部弹幕'
}]


// 发送弹幕
const sendBullet = async () => {
    await fetchData(`/api/bullet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bvid: props.bvid,
            cid: props.cid,
            fontSize: bulletFontSize.value,
            color: bulletColor.value,
            mode: bulletMode.value,
            msg: bulletInput.value,
            progress: 0
        })
    }, (data: BiliResType) => {
        if (data.code === 0) {
            bulletInput.value = ''
            ElNotification.success('发送成功')
        } else {
            ElNotification.error('发送失败' + data.message)
        }
    })
}

</script>

<style scoped>

.bullet-input {
    position: absolute;
    z-index: 2;
    /* left: 180px; */
    /* bottom: 4px; */
    width: 300px;
    margin-left: 32px;
    bottom: -46px;
    left: 660px;
}

</style>