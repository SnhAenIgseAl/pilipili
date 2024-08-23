<template>
    <div class="dynamic-box">
        <el-input v-model="dynamicTxt" 
            :placeholder="dftTxt" 
            resize="none" 
            rows="3"
            type="textarea" />

        <div class="dynamic-control">
            <div>

                <el-button text size="small">
                    <i>&#xe64a;</i>
                </el-button>

                <el-upload
                    v-model:file-list="imgList"
                    list-type="picture-card"
                    action=""
                    :before-upload="checkFile"
                    :http-request="uploadImg"
                    :on-preview="previewImg"
                    :on-remove="removeImg"
                    :limit="9"
                    multiple>
                    <el-icon><Plus /></el-icon>
                </el-upload>

                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>

                <!-- 艾特人 -->
                <el-button text size="small">
                    <i>&#xe853;</i>
                </el-button>
            </div>

            <div>
                <el-text type="info"></el-text>
                <el-button text @click="reset">清空</el-button>
                <el-button type="primary" 
                    @click="addDynamic" 
                    :color="`var(--cl-${USER_THEME})`"
                    style="color: #FFF">
                    发布
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useSettingStore } from '../../../stores/setting'
import type { UploadProps, UploadUserFile, UploadRequestOptions } from 'element-plus'
import BiliResType from '../../../type/BiliResType';
import { toRefs } from 'vue'
// import { fetchData } from '../../../utils/fetchData'
import axios from 'axios'


const {
    USER_THEME
} = toRefs(useSettingStore())



const dynamicTxt = ref(null)
const imgList = ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)



// 检查上传的文件类型及大小
const checkFile: UploadProps['beforeUpload'] = (file) => {
	if (file.type !== 'image/jpg' &&
        file.type !== 'image/jpeg' &&
		file.type !== 'image/png'
	) {
		ElMessage({ message: '必须是jpg或png格式的图片', type: 'error' })
		return false
	} else if (file.size / 1024 / 1024 > 20) {
		ElMessage({ message: '图片需小于20MB', type: 'error' })
		return false
	}

    return true
}


// 上传图片
const uploadImg = async (data: UploadRequestOptions) => {
    let file = data.file

    let formData = new FormData()
    formData.append('file_up', file)
    formData.append('bili_jct', localStorage.getItem('bili_jct') || '')
    formData.append('sessdata', localStorage.getItem('SESSDATA') || '')

    console.log(formData.get('file_up'))
    console.log(localStorage.getItem('bili_jct'))
    console.log(localStorage.getItem('SESSDATA'))

    axios.post('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then(res => {
        console.log(res.data)
        if (res.data.code === 0) {
            ElMessage.success({message: '图片上传成功'})
        } else {
            ElMessage.error({message: res.data.message})
        }
    })
}



// 移除上传的图片
const removeImg: UploadProps['onRemove'] = (file, files) => {
    console.log(file, files)
}



// 预览图片
const previewImg: UploadProps['onPreview'] = async (file) => {
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
}



// 清空输入的内容
const reset = () => {
    dynamicTxt.value = null
}



// 发布动态
const addDynamic = async () => {
    try {
        let res = await fetch(`/api/dynamic/add`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dynamicTxt: dynamicTxt.value
            })
        })
        let data: BiliResType = await res.json()

        console.log(data)
    } catch (err) {
        ElMessage({message: '网络未连接', type: 'error'})
    }
}



// 默认提示文字
const dftTxt = ref('喜欢你所以我要发癫')

</script>

<style scoped>

.dynamic-box {
    padding: 10px;
    border-radius: 10px;
    background-color: #fff;
    margin-bottom: 10px;
}

.dynamic-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.preview-img {
    display: flex;
}

.preview-item {
    position: relative;
    width: 100px;
    height: 100px;
    margin-right: 5px;
    border-radius: 10px;
    overflow: hidden;

    &:hover {
        .remove-img_button {
            color: #fff;
            background: #333;
        }
    }
}

.preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-img_button {
    position: absolute;
    right: 5px;
    top: 5px;

    &:hover {
        color: #fff;
        background: #333;
    }
}


</style>