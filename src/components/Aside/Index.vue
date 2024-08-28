<template>

    <div class="aside">

        <div v-if="isLogin">
            
            <RouterLink to="/index">
                <div class="aside-item">
                    <i>&#xe6b8;</i>
                </div>
            </RouterLink>

            <el-Badge v-if="msgUnread"
                :value="msgUnread.at + msgUnread.like + msgUnread.reply" 
                type="primary" 
                :show-zero="false">

                <RouterLink to="/message/at">
                    <div class="aside-item">
                        <i>&#xe7bd;</i>
                    </div>
                </RouterLink>

            </el-Badge>

            <el-Badge :value="hasUpdate"
                type="primary" 
                :show-zero="false">

                <RouterLink to="/dynamic">
                    <div class="aside-item">
                        <i>&#xe672;</i>
                    </div>
                </RouterLink>

            </el-Badge>
            

            <RouterLink to="/history">
                <div class="aside-item">
                    <i>&#xe65f;</i>
                </div>
            </RouterLink>

            <!-- <RouterLink to="/upload">
                <div class="aside-item">
                    <i>&#xe75d;</i>
                </div>
            </RouterLink> -->
        </div>
        
        <div v-else>
            <RouterLink to="/login">
                <div class="aside-item">
                    <i>&#xe736;</i>
                </div>
            </RouterLink>
        </div>

        <div class="aside-bottom">
            <RouterLink v-if="isLogin" :to="`/space/${info.mid}/home`">
                <img :src="`https://images.weserv.nl/?url=${info.face}@80h.webp`" class="aside-face"/>
            </RouterLink>

            <Setting />
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useUserStore } from '../../stores/user'
import { ElMessage } from 'element-plus'
import { fetchData } from '../../utils/fetchData';
import type BiliResType from '../../type/BiliResType';
import Setting from './components/Setting.vue'



// 检查登录状态
const user = useUserStore()
const {
    isLogin,
    info,
    baseline
} = toRefs(user)
const { getInfo } = user
getInfo()



// 检测未读消息
const msgUnread: any = ref(null)
const getMsgUnread = async () => {
    await fetchData(`/api/message/unread`, undefined, (data: BiliResType) => {
        console.log(data)
        msgUnread.value = data.data
    })
}
getMsgUnread()



// 检测是否有新动态
const hasUpdate = ref(0)
const getUpdate = async ()  => {
    await fetchData(`/api/dynamic/update?baseline=${baseline.value}`, {
        headers: {
            'Cookies': localStorage.getItem('SESSDATA')
        }
    }, (data: BiliResType) => {
		if (data.code === 0) {
			hasUpdate.value = data.data.update_num
		} else {
			ElMessage({message: data.message, type: 'error'})
		}
	})
}
setInterval(getUpdate, 60000)

</script>

<style scoped>

.aside {
    display: flex;
    flex-flow: column nowrap;
    position: fixed;
    justify-content: space-between;
    z-index: 9;
    left: 0px;
    top: 0px;
    width: 70px;
    padding: 10px;
    height: calc(100%);
    /* border-right: 2px solid #eee; */
    background: var(--cl-white);
    box-shadow: var(--el-box-shadow-lighter);
}

.aside-bottom {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-between;
}

.aside-face {
	height: 40px;
    margin-bottom: 10px;
	border-radius: 50%;
}

.aside-item {
    width: 50px;
    height: 50px;
    text-align: center;
    align-content: center;
    margin-bottom: 10px;
    /* border: 1px solid #ddd; */
    border-radius: 10px;
    background-color: var(--cl-white);

    i {
        font-size: 24px;
        margin-right: unset;
    }

    &:hover {
        color: #fff;
        background: var(--cl-primary);
        cursor: pointer;
    }
}

</style>