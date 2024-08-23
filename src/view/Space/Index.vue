<template>

	<div v-if="spaceInfo" class="space-top">
		<div class="top-photo" :style="{backgroundImage: `url(https://images.weserv.nl/?url=${spaceInfo.space.l_img})`}"></div>
	
		<div class="space-info">
			<div class="face" 
				:style="{backgroundImage: `url(https://images.weserv.nl/?url=${spaceInfo.card.face}@160w.webp)`}">
				<img v-if="spaceInfo.card.pendant.image" 
					:src="`https://images.weserv.nl/?url=${spaceInfo.card.pendant.image}@160w.webp`" class="pendant" />
			</div>
			

			<div>
				<div class="name">
					{{ spaceInfo.card.name }}

					<Level :level="spaceInfo.card.level_info.current_level" />

					<img :src="`https://images.weserv.nl/?url=${spaceInfo.card.nameplate.image}@60w.webp`" class="nameplate-image"/>
				</div>

				<div class="sign">
					{{ spaceInfo.card.sign }}
				</div>
			</div>
		</div>

		<!-- 用户基本信息 -->
		<BasicInfo :info="spaceInfo" />
		
	</div>

	<div class="tabs">
		<RouterLink :to="`/space/${route.params.mid}/home`">
			<i style="color: var(--cl-green);">&#xe6bb;</i>主页
		</RouterLink>
		<RouterLink :to="`/space/${route.params.mid}/dynamic`">
			<i style="color: var(--cl-pink);">&#xe6ba;</i>动态
		</RouterLink>
		<RouterLink :to="`/space/${route.params.mid}/video`">
			<i style="color: var(--cl-pink);">&#xe6ba;</i>
			视频 
			<el-text type="info">{{ spaceInfo?.archive_count }}</el-text>
		</RouterLink>
		<RouterLink :to="`/space/${route.params.mid}/favlist`">
			<i style="color: var(--cl-yellow);">&#xe64b;</i>收藏夹
		</RouterLink>
		<RouterLink :to="`/space/${route.params.mid}/fans`">
			<i style="color: var(--cl-blue);">&#xe82c;</i>
			粉丝列表
			<el-text type="info">{{ spaceInfo?.card.fans }}</el-text>
		</RouterLink>
		<RouterLink :to="`/space/${route.params.mid}/follow`">
			<i style="color: var(--cl-blue);">&#xe830;</i>
			关注列表
			<el-text type="info">{{ spaceInfo?.card.friend }}</el-text>
		</RouterLink>
	</div>

	<div class="space-body">

		<RouterView />

	</div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type BiliResType from '../../type/BiliResType';
import Level from '../../components/Level.vue';
import BasicInfo from './components/BasicInfo.vue'
import { fetchData } from '../../utils/fetchData';


// 获取空间信息
const spaceInfo: any = ref(null)
const getSpaceInfo = async (mid: any) => {
	await fetchData(`/api/space/info?mid=${mid}`, {
	}, (data: BiliResType) => {
		console.log(data)

		if (data.code == 0) {
			spaceInfo.value = data.data
		} else {
			ElMessage({message: data.message, type: 'error'})
		}
	})
}



const route = useRoute()
// console.log(route.params.mid, typeof(route.params.mid))
watch(() => route.params.mid, async (newVal) => {
	await getSpaceInfo(newVal)
	// getUserVideoList(newVal)
}, {
	immediate: true,
})

</script>

<style scoped>

.space-top {
	position: relative;
	width: 1280px;
	height: 600px;
	margin: 60px auto 0;
}

.top-photo {
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
}

.space-info {
	position: absolute;
	display: flex;
	align-items: center;
	width: 100%;
	bottom: 0;
	padding: 16px 32px;
	/* backdrop-filter: blur(10px); */

	.face {
		width: 80px;
		height: 80px;
		margin-right: 32px;
		border-radius: 50%;
		border: 4px solid #fff;
		background-size: cover;
		background-position: center;
	}

	.pendant{
		position: absolute;
		width: 120px;
		height: 120px;
		left: 12.5px;
		top: -2.5px;
	}

	.name {
		display: flex;
		align-items: center;
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 8px;
		color: #fff;
	}

	.nameplate-image {
		margin-left: 16px;
		width: 30px;
	}

	.sign {
		font-size: 14px;
		color: var(--cl-white-75);
	}
}

.tabs {
	width: 1280px;
	margin: 0 auto 32px;
	padding: 0 32px;
	border-bottom: 1px solid var(--cl-black-25);

	a {
		line-height: 60px;
		padding: 18px 16px;
		margin-right: 16px;
		color: var(--cl-black);
		/* border-bottom: 2px solid var(--cl-primary); */

		&:hover {
			color: var(--cl-primary);
			border-bottom: 2px solid var(--cl-primary);
		}
	}

}

.space-body {
	width: 1280px;
	margin: 0 auto 30px;
	height: auto;
}

</style>