<template>
	<div class="main-box">
		<AddDynamic />

		<el-divider v-if="hasUpdate">
			<el-button color="var(--cl-primary)" @click="getNewDynamic" class="new-dyn_button">
				有新动态
			</el-button>
		</el-divider>

		<Card v-for="(item, index) in dynamicList" :key="index"
			:id_str="item.id_str"
			:basic="item.basic"
			:author="item.modules.module_author"
			:dynamic="item.modules.module_dynamic"
			:more="item.modules.module_more"
			:stat="item.modules.module_stat"
			:orig="item.orig"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref, Ref, toRefs, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import AddDynamic from './components/AddDynamic.vue';
import Card from '../../components/Card/Card.vue'
import { fetchData } from '../../utils/fetchData';
import BiliResType from '../../type/BiliResType';
import { wheelBottom } from '../../utils/wheelBottom'
import { useUserStore } from '../../stores/user';
import { debounce } from '../../utils/debounce';


const {
	baseline
} = toRefs(useUserStore())



const lastId: Ref<''> = ref('')
const dynamicList: Ref<Array<any>> = ref([])
const getDynamic = async (offset: string)  => {
	await fetchData(`/api/dynamic?offset=${offset}`, {
	}, (data: BiliResType) => {
		if (data.code === 0) {

			// 记录更新动态基线及最后一条动态的id
			baseline.value = data.data.items[0].id_str
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



// 判断是否有新动态
const hasUpdate: Ref<number> = ref(0)
const getUpdate = async ()  => {
	await fetchData(`/api/dynamic/update?baseline=${baseline.value}`, {
	}, (data: BiliResType) => {
		if (data.code === 0) {
			hasUpdate.value = data.data.update_num
		} else {
			ElMessage({message: data.message, type: 'error'})
		}
	})
}
setInterval(getUpdate, 60000)



// 加载新动态
const getNewDynamic = () => {
	window.location.reload()
}



const getMore = debounce(wheelBottom(2000, async () => {
	await getDynamic(lastId.value)
}), 400)



// 滚轮触底了加载更多动态
onMounted(() => {
	window.addEventListener('scroll', getMore)
})

onUnmounted(() => {
	window.removeEventListener('scroll', getMore)
})



</script>

<style scoped>

.new-dyn_button {
	color: #fff;
}

</style>