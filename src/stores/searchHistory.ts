import { ref } from 'vue'
import { defineStore } from 'pinia'



export const useSearchHistoryStore = defineStore('seachHistory', () => {

    // 历史搜索记录
    const searchHistory: any = ref([])

    return {
        searchHistory
    }
}, {
    persist: true
})
