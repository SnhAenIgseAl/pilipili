import { createWebHistory, createRouter } from 'vue-router'

const routes = [
	{
		path: '/',
		redirect: '/index'
	},
	{
		path: '/index',
		component: () => import('@/view/Index/Index.vue')
	},
	{
		path: '/login',
		component: () => import('@/view/Login/Index.vue')
	},
	{
		path: '/search',
		component: () => import('@/view/Search/Index.vue')
	},
	{
		path: '/dynamic',
		component: () => import('@/view/Dynamic/Index.vue')
	},
	{
		path: '/opus/:id',
		component: () => import('@/view/Opus/Index.vue')
	},
	{
		path: '/message',
		component: () => import('@/view/Message/Index.vue'),
		children: [
			{
				path: 'at',
				component: () => import('@/view/Message/view/AtMe.vue')
			},
			{
				path: 'like',
				component: () => import('@/view/Message/view/LikeMe.vue')
			},
			{
				path: 'reply',
				component: () => import('@/view/Message/view/ReplyMe.vue')
			},
		]
	},
	{
		path: '/space/:mid',
		component: () => import('@/view/Space/Index.vue'),
		children: [
			{
				path: 'home',
				component: () => import('@/view/Space/view/Home.vue')
			},
			{
				path: 'dynamic',
				component: () => import('@/view/Space/view/Dynamic.vue')
			},
			{
				path: 'video',
				component: () => import('@/view/Space/view/Video.vue')
			},
			{
				path: 'favlist',
				component: () => import('@/view/Space/view/Favlist.vue')
			},
			{
				path: 'fans',
				component: () => import('@/view/Space/view/Fans.vue')
			},
			{
				path: 'follow',
				component: () => import('@/view/Space/view/Follow.vue')
			},
		]
	},
	{
		path: '/history',
		component: () => import('@/view/History/Index.vue')
	},
	{
		path: '/labelled',
		component: () => import('@/view/Labelled/Index.vue')
	},
	{
		path: '/data-up',
		component: () => import('@/view/DataUp/Index.vue')
	},
	{
		path: '/video/:bvid',
		query: 'p',
		component: () => import('@/view/Video/Index.vue')
	},
	{
		path: '/:pathMatch(.*)*',
		component: () => import('@/view/404/Index.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior() {
		// 切换页面时回到顶部
		return { top: 0 }
	},
})



export default router