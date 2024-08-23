<template>
    <div class="msg-item">

        <div class="msg-avatar-container">
            <img v-if="props.users" v-for="(user, user_index) in props.users" :key="user_index"
                :src="`https://images.weserv.nl/?url=${user.avatar}@120w.webp`" class="msg-avatar" />
            <img v-if="props.user"
                :src="`https://images.weserv.nl/?url=${props.user.avatar}@120w.webp`" class="msg-avatar" />
        </div>

        <div class="msg-info">
            <div class="msg-name">
                <span v-if="props.users" v-for="(user, user_index) in props.users" :key="user_index">
                    {{ user.nickname }}、
                </span>
                <span v-if="props.user">
                    {{ props.user.nickname }}
                </span>

                <el-text v-if="props.type === 'at'" type="info">
                    @了我
                </el-text>
                <el-text v-if="props.type === 'like'" type="info">
                    等{{ props.counts }}人赞了我的{{ props.business }}
                </el-text>
                <el-text v-if="props.type === 'reply'" type="info">
                    等{{ props.counts }}人回复了我的{{ props.business }}
                </el-text>

            </div>

            <div class="msg-content">
                {{ props.content }}
                <div class="root-reply">
                    {{ props.root }}
                </div>
             </div>
        </div>

        <div :style="{ backgroundImage: `url(https://images.weserv.nl/?url=${props.image}@120w.webp)` }"
            class="msg-img" />
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    type: String,
    users: {
        type: Array as any,
    },
    user: Object,
    counts: Number,
    business: String,
    content: String,
    root: String,
    image: String
})

</script>

<style scoped>

.msg-item {
    display: flex;
    position: relative;
    width: 100%;
    padding: 16px 0;
}

.msg-info {
    display: flex;
    margin: 0 16px;
    flex-flow: column;
    justify-content: space-between;
}

.msg-avatar-container {
    width: auto;
    margin-left: 40px;
    margin-right: 16px;
}

.msg-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-left: -40px;
}

.msg-content {
    margin: 16px 0;
}

.root-reply {
    border-left: 2px solid #eee;
    padding-left: 8px;
    margin-top: 8px;
    color: var(--cl-black-50);
}

.msg-img {
    position: absolute;
    right: 16px;
    width: 100px;
    height: 60px;
    background-size: cover;
    background-position: center;
    border-radius: 5px;
}

</style>