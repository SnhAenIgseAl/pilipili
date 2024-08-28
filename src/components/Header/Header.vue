<template>
	<div class="header">

		<SearchInput />

	</div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useUserStore } from '../../stores/user'
import SearchInput from './components/SearchInput.vue';
import { useSettingStore } from '../../stores/setting';

let {
	USER_THEME
} = toRefs(useSettingStore())



// 设置默认主题色
document.querySelector('html')!.className = USER_THEME.value.toString()



// 检查登录状态
const user = useUserStore()
const { getInfo } = user
getInfo()

</script>

<style scoped>
.header {
	position: fixed;
	z-index: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
	min-width: 600px;
	width: 100%;
	height: 60px;
	padding: 0 10px;
	top: 0;
	background-color: var(--cl-white);
	border-bottom: 2px solid #f0f0f0;
	/* box-shadow: var(--el-box-shadow-lighter); */
}

.header-face {
	height: 40px;
	border-radius: 50%;
}
</style>