<template>
    <div class="qrcode-box">
		<el-text type="info">{{ QrCodeStat }}</el-text>
		
		<div class="qrcode">
			<img :src="QrUrl">
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { ElMessage } from 'element-plus'
import { useUserStore } from '../../stores/user';
import { fetchData } from '../../utils/fetchData';
import type BiliResType from '../../type/BiliResType';
import { ElMessage } from 'element-plus';
import { onUnmounted } from 'vue';

const userStore = useUserStore()
const { getInfo } = userStore


// 获取二维码
const QrUrl = ref('')
const QrCodeStat: any = ref(null)
const auth_code = ref(null)

const getQrCode = async () => {
	await fetchData('/api/getQrCode', {
		method: 'POST'
	}, (data: BiliResType) => {
		QrUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://passport.bilibili.com/x/passport-tv-login/h5/qrcode/auth?auth_code=${data.data.auth_code}`
		auth_code.value = data.data.auth_code
	})
}
getQrCode()



// 每3秒检测二维码状态
const login = async () => {
	await fetchData(`/api/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			auth_code: auth_code.value
		})
	}, async (data: BiliResType) => {
		QrCodeStat.value = data.message

		if (data.code === 0) {
			clearInterval(doLogin)
			await getInfo()
			ElMessage.success('登录成功')
			window.location.href = '/index'
		}
	})
}
const doLogin = setInterval(login, 2000)

onUnmounted(() => {
	clearInterval(doLogin)
})

</script>

<style scoped>

.qrcode-box {
	position: absolute;
	display: flex;
	flex-flow: column;
	align-items: center;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
}

.qrcode {
	margin-top: 20px;
}
</style>