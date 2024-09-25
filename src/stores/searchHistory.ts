import { ref, Ref } from 'vue'
import { defineStore } from 'pinia'



export const useSearchHistoryStore = defineStore('seachHistory', () => {

    // 历史搜索记录
    const searchHistory: Ref<Array<string>> = ref([])

    return {
        searchHistory
    }
}, {
    persist: true
})
