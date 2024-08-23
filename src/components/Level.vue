<template>

    <span v-if="props.level === 6" class="level lv6">
        Lv {{ props.level }}
    </span>

    <span v-if="props.level === 5" class="level lv5">
        Lv {{ props.level }}
    </span>

    <span v-if="props.level === 4" class="level lv4">
        Lv {{ props.level }}
    </span>

    <span v-if="props.level === 3" class="level lv3">
        Lv {{ props.level }}
    </span>

    <span v-if="props.level === 2" class="level lv2">
        Lv {{ props.level }}
    </span>

</template>

<script setup lang="ts">

const props = defineProps({
    level: Number
})

</script>

<style scoped>

.level {
    font-size: 12px;
    color: #FFF;
    padding: 1px 4px;
    margin-left: 8px;
    font-weight: 500;
}

.lv6 {
    background-color: #F04C49;
}

.lv5 {
    background-color: #EE672A;
}

.lv4 {
    background-color: #FEBB8B;
}

.lv3 {
    background-color: #7BCDEF;
}

.lv2 {
    background-color: #8BD29B;
}

</style>