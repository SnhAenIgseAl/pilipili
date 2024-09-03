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
            </div>

            <div>
                <el-text type="info"></el-text>
                <el-button text @click="reset">清空</el-button>
                <el-button type="primary" 
                    @click="addDynamic" 
                    :loading="addDynamicLoading"
                    :color="`var(--cl-primary)`"
                    style="color: #FFF">
                    发布
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadUserFile, UploadRequestOptions } from 'element-plus'
import BiliResType from '../../../type/BiliResType';
import UploadImgType from '../../../type/UploadImgType';
import { fetchData } from '../../../utils/fetchData';
import axios from 'axios';



const dynamicTxt = ref(null)
const addDynamicLoading = ref(false)



// 检查上传的文件类型及大小
const imgList = ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
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
const uploadImgList: Ref<UploadImgType[]> = ref([])
const uploadImg = async (data: UploadRequestOptions) => {
    let file = data.file

    let fd = new FormData()
    fd.append('file_up', file)
    fd.append('csrf', localStorage.getItem('bili_jct') || '')
    fd.append('sessdata', localStorage.getItem('SESSDATA') || '')
    console.log(fd.get('file_up'))

    let imgSrc: UploadImgType = await new Promise<UploadImgType>((resolve) => {
        axios.post(`/api/upload`, fd, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(res => res.data)
        .then((res: BiliResType) => {
            console.log(res)
            if (res.code === 0) {
                ElMessage.success({ message: '图片上传成功' })
                resolve(res.data)
            } else {
                ElMessage.error({ message: '图片上传失败' })
            }
        })
    })

    uploadImgList.value.push(imgSrc)
    console.log(uploadImgList.value)
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
    addDynamicLoading.value = true

    await fetchData(`/api/dynamic/add`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dynamicTxt: dynamicTxt.value,
            pics: uploadImgList.value,
        })
    }, (data: BiliResType) => {
        if (data.code === 0) {
            ElMessage.success({message: '发表成功'})
        } else {
            ElMessage.error({ message: data.message })
        }
        addDynamicLoading.value = false
    })
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