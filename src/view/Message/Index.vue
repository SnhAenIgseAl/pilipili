<template>

    <div class="msg">
        <div v-if="msgUnread" class="msg-list" >
            <el-Badge :value="msgUnread.at" type="primary" :show-zero="false">
                <RouterLink to='/message/at'>
                    <div class="msg-item">
                        <i>&#xe853;</i>
                    </div>
                </RouterLink>
            </el-Badge>
            <el-Badge :value="msgUnread.like" type="primary" :show-zero="false">
                <RouterLink to='/message/like'>
                    <div class="msg-item">
                        <i>&#xe669;</i>
                    </div>
                </RouterLink>
            </el-Badge>
            <el-Badge :value="msgUnread.reply" type="primary" :show-zero="false">
                <RouterLink to='/message/reply'>
                    <div class="msg-item">
                        <i>&#xe667;</i>
                    </div>
                </RouterLink>
            </el-Badge>
            <!-- <el-Badge :value="msgUnread.sys_msg" type="primary" :show-zero="false">
                <RouterLink to='/message/reply'>
                    <div class="msg-item">
                        <i>&#xe7bd;</i>
                    </div>
                </RouterLink>
            </el-Badge> -->
        </div>

        <div class="msg-content">
            <RouterView />
        </div>

    </div>

</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { fetchData } from '../../utils/fetchData'
import type BiliResType from '../../type/BiliResType'

const msgUnread: Ref<any> = ref(null)
const getMsgUnread = async () => {
    await fetchData(`/api/message/unread`, { 
    }, (data: BiliResType) => {
        // console.log(data)
        msgUnread.value = data.data
    })
}
getMsgUnread()

</script>

<style scoped>

.msg {
    display: flex;
    padding-top: 60px;
    padding-left: 70px;
    height: 100%;
}

.msg-list {
    position: sticky;
    top: 60px;
    left: 80px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    /* margin-top: 30px; */
    padding: 10px;
    width: 70px;
    height: 100%;
}

.msg-item {
    width: 50px;
    height: 50px;
    text-align: center;
    align-content: center;
    margin-bottom: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;

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

.msg-content {
    flex: 1;
    min-width: 960px;
    padding: 20px;
}

</style>