<template>
	
	<Card v-if="dynamicList" v-for="(item, index) in dynamicList" :key="index"
		:basic="item.basic"
		:author="item.modules.module_author"
		:dynamic="item.modules.module_dynamic"
		:more="item.modules.module_more"
		:stat="item.modules.module_stat"
		:orig="item.orig"
	/>

	<el-empty v-else description="该用户暂无动态" />

</template>

<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import Card from '../../../components/Card/Card.vue'
import BiliResType from '../../../type/BiliResType';
import { useRoute } from 'vue-router';
import { fetchData } from '../../../utils/fetchData';
import { wheelBottom } from '../../../utils/wheelBottom';
import { debounce } from '../../../utils/debounce';



const route = useRoute()



const dynamicList: Ref<any> = ref(null)
const lastId = ref(String)
const getDynamic = async (offset: any) => {
	await fetchData(`/api/space/dynamic?mid=${route.params.mid}&offset=${offset}`, {
	}, (data: BiliResType) => {
		if (data.code === 0) {

		// 记录最后一条动态的id
		lastId.value = data.data.items[data.data.items.length - 1].id_str

		if (offset === '') {
			dynamicList.value = data.data.items
		} else {
			dynamicList.value = dynamicList.value.concat(data.data.items)
		}
		} else {
		ElMessage({message: data.message, type: 'error'})
		}
	})
}
getDynamic('')



// 加载更多动态
const getMore = debounce(wheelBottom(2000, async () => {
	await getDynamic(lastId.value)
}), 400)



// 触底加载更多动态
onMounted(() => {
	window.addEventListener('scroll', getMore)
})

onUnmounted(() => {
	window.removeEventListener('scroll', getMore)
})


</script>

<style scoped>
.main-box {
	max-width: 1280px;
	padding-left: 86px;
}
</style>