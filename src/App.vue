<template>

    <Header />
    <Aside />

    <RouterView />
    
</template>

<script setup lang="ts">
import Header from '@/components/Header/Header.vue'
import Aside from './components/Aside/Index.vue';

</script>

<style scoped>

.wallper {
    display: flex;
    width: 100%;
}

</style>
