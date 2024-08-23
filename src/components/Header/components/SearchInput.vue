<template>
	<el-popover v-model="historyVisible" placement="bottom" :show-arrow="false" width="400" :offset="0" trigger="click">

		<template #reference>
			<el-input size="large" 
				v-model="searchForm.keyword" 
				placeholder="搜索" 
				:suffix-icon="Search"
				@focus="historyVisible = true" 
				@blur="historyVisible = false" 
				@keyup.enter="search(searchForm.keyword)"
				class="search-box">
			</el-input>
		</template>

		<template #default>
			<el-divider v-if="searchHistory" content-position="left">搜索历史</el-divider>
			<el-tag v-for="tag in searchHistory" :key="tag" closable type="info" size="large" @close="historyRemove(tag)">
				{{ tag }}
			</el-tag>

			<el-divider content-position="left">pilipili热搜</el-divider>
			<div class="hot-list">
				<div v-for="(item, index) in hotwordList" :key="index" @click="search(item.keyword)" class="hot-item">
					<i>{{ index + 1 }}</i>
					{{ item.keyword }}
					<img v-if="item.icon" :src="`https://images.weserv.nl/?url=${item.icon}`" class="hot-icon" />
				</div>
			</div>
		</template>

	</el-popover>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue';
import type { FormInstance } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useSearchHistoryStore } from '../../../stores/searchHistory'
import { fetchData } from '../../../utils/fetchData';



const {
	searchHistory
} = toRefs(useSearchHistoryStore())



const formRef = ref<FormInstance>()
const searchForm = reactive({
	keyword: ''
})



// 搜索
const search = async (keyword: String) => {
	// console.log(searchForm.keyword)
	searchHistory.value.push(keyword)
	window.location.href = `/search?keyword=${keyword}&type=video`
}



// 删除搜索历史
const historyVisible = ref(false)
const historyRemove = (tag: string) => {
	searchHistory.value.splice(searchHistory.value.indexOf(tag), 1)
}



// 获取热搜
const hotwordList = ref(null)
const getHotword = async () => {
	await fetchData(`/api/hotword`, {
	}, (data: any) => {
		console.log(data.list)
		if (data.code === 0) {
			hotwordList.value = data.list
		} else {
			ElMessage.success({ message: data.message })
		}
	})
}
getHotword()

</script>

<style scoped>
.search-box {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
	width: 400px;
	height: 100%;

	.el-form-item {
		margin-top: 16px;
	}

	.search-input {
		width: 100%;
	}
}

.hot-list {
	width: 100%;
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	/* justify-content: flex-start; */

	.hot-item {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 8px 16px;
		border-radius: 5px;

		i {
			margin-right: 16px;
		}

		&:hover {
			cursor: pointer;
			background-color: #f4f4f4;
		}
	}

	.hot-icon {
		margin-left: 8px;
		height: 16px;
	}
}
</style>