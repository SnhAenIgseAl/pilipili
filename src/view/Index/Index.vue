<template>
	<div ref="wrapperRef" v-if="videoList" class="main-box">

		<!-- PC端首页推荐 -->
		<div v-if="USER_RECOMMEND_VIDEO_PLATFORM === 'PC'" 
			v-for="(item, index) in videoList" :key="index"
			class="list-item">

			<RouterLink :to="`/video/${item.bvid}`">

				<!-- 视频封面 -->
				<div class="pic"
					:style="{ backgroundImage: `url(https://images.weserv.nl/?url=${item.pic}@360w_288h.webp)` }">
					<div class="stat">
						<span><i>&#xe81a;</i>{{ item.stat.view }}</span>
						<span><i>&#xe644;</i>{{ item.stat.like }}</span>
						<span><i>&#xe6ee;</i>{{ item.stat.danmaku }}</span>
						<div style="float: right;">{{ item.duration }}</div>
					</div>
				</div>

				<!-- 视频标题及作者信息 -->
				<div class="info">
					<div class="info-title" v-html="item.title"></div>
					<RouterLink :to="`/space/${item.owner.mid}/home`">
						<div class="info-author">
							<img :src="`https://images.weserv.nl/?url=${item.owner.face}@30w.webp`" class="upic" />
							<el-text type="info">{{ item.owner.name }} · {{ item.pubdate }}</el-text>
						</div>
					</RouterLink>
				</div>

			</RouterLink>

		</div>



		<!-- APP端首页推荐 -->
		<div v-if="USER_RECOMMEND_VIDEO_PLATFORM === 'APP'" 
			v-for="(item, index) in videoList" :key="index"
			class="list-item">

			<RouterLink :to="`/video/${item.bvid}`">

				<!-- 视频封面 -->
				<div class="pic"
					:style="{ backgroundImage: `url(https://images.weserv.nl/?url=${item.cover}@360w_288h.webp)` }">
					<div class="stat">
						<span><i>&#xe81a;</i>{{ item.cover_left_1_content_description }}</span>
						<span><i>&#xe6ee;</i>{{ item.cover_left_2_content_description }}</span>
						<div style="float: right;">{{ item.cover_right_text }}</div>
					</div>
				</div>

				<!-- 视频标题及作者信息 -->
				<div class="info">
					<div class="info-title" v-html="item.title"></div>
					<div class="info-author">
						<!-- <img :src="`https://images.weserv.nl/?url=${item.owner.face}@60w_60h.webp`" class="upic" /> -->
						<el-text type="info">{{ item.args.up_name }}</el-text>
					</div>
				</div>

			</RouterLink>

		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingStore } from '../../stores/setting';
import type BiliResType from '../../type/BiliResType';
import { wheelBottom } from '../../utils/wheelBottom';
import { debounce } from '../../utils/debounce';
import { ElMessage } from 'element-plus';
import { fetchData } from '../../utils/fetchData';

const {
	USER_RECOMMEND_VIDEO_PLATFORM,
	USER_RECOMMEND_VIDEO_NUM,
	USER_RECOMMEND_VIDEO_FRESH
} = useSettingStore()

const videoList: any = ref([])

const getVideo = async () => {

	let platform = USER_RECOMMEND_VIDEO_PLATFORM
	let num = USER_RECOMMEND_VIDEO_NUM
	let fresh = USER_RECOMMEND_VIDEO_FRESH

	await fetchData(`/api/index/top?num=${num}&fresh=${fresh}&platform=${platform}`, {
	}, (data: BiliResType) => {
		if (data.code === 0) {

			if (platform === 'PC') {
				// 对播放流点赞数除以1万保留一位小数及转换时间戳、转换视频时长
				for (let i = 0; i < data.data.item.length; i++) {
					if (data.data.item[i].stat.view > 10000) {
						data.data.item[i].stat.view = (data.data.item[i].stat.view / 10000).toFixed(1) + '万'
					}
					if (data.data.item[i].stat.like > 10000) {
						data.data.item[i].stat.like = (data.data.item[i].stat.like / 10000).toFixed(1) + '万'
					}
					if (data.data.item[i].stat.danmaku > 10000) {
						data.data.item[i].stat.danmaku = (data.data.item[i].stat.danmaku / 10000).toFixed(1) + '万'
					}

					data.data.item[i].pubdate = new Date(data.data.item[i].pubdate * 1000).toLocaleString()
					data.data.item[i].duration = `${Math.floor(data.data.item[i].duration / 60)}:${data.data.item[i].duration % 60}`
				}

				let newList = [...videoList.value, ...data.data.item]
				videoList.value = newList
			}

			if (platform === 'APP') {
				let newList = [...videoList.value, ...data.data.items]
				videoList.value = newList
			}
		} else {
			ElMessage.warning({message: '尚未登录' + data.message})
		}
	})
}
getVideo()
setTimeout(() => {
	getVideo()
}, 500);



// 滚轮触底了加载更多视频
onMounted(() => {
	window.addEventListener('scroll',
		debounce(wheelBottom(2000, async () => {
			await getVideo()
		}), 300))
})


</script>

<style scoped>
.main-box {
	display: flex;
	flex-flow: row wrap;
	min-width: 960px;
	max-width: 1660px;
	padding-top: 60px;
	/* padding-left: 86px; */
	margin: 16px auto;
	height: auto;
	background: unset !important;
}

.list-item {
	flex: 1;
	min-width: 300px;
	height: 240px;
	margin: 0px 5px 30px;
	border-radius: 10px;
	overflow: hidden;
	transition: all 0.3s;

	&:hover {
		cursor: pointer;
		box-shadow: var(--el-box-shadow);
	}
}

.pic {
	display: flex;
	align-items: end;
	width: 100%;
	height: 60%;
	border-radius: 10px;
	overflow: hidden;
	background-size: cover;
	background-position: center;
}

.stat {
	width: 100%;
	padding: 12px;
	color: #fff;
	font-size: 14px;
	background: linear-gradient(to top, #111, var(--cl-lucency));

	span {
		margin-right: 12px;
	}
}

.info {
	display: flex;
	flex-flow: column;
	justify-content: space-between;
	height: 40%;
	padding: 12px;

	.info-title {
		line-height: 1.8;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.info-author {
		display: flex;

		.upic {
			width: 30;
			height: 30px;
			border-radius: 50%;
			margin-right: 10px;
		}
	}
}
</style>