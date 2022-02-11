import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/base/router/index'
import { store, key } from '@/base/store/index'
import registeredDirective from '@/framework/utils/directive'
import svgIconRegistered from '@/base/utils/svg-component'
import '@/assets/style/index.scss'
import BIM from '@/BIM'

// BIM3D: 初始化
BIM.init();

// VUE:UI
const app = createApp(App);
// 注册指令
registeredDirective(app)
// svg Sprites图
svgIconRegistered(app)

// 使用插件
// app.use(router)
app.use(store, key)
app.mount('#app')

