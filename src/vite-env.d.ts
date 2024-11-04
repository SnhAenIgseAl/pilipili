/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}


declare module 'echarts';
declare module 'vue3-video-play';
declare module 'vue3-danmaku';
declare module 'longze-vue3-video-player';