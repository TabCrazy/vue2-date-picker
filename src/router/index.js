import Vue from 'vue'
import Router from 'vue-router'
import Demo from '@/components/demo/index.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Demo',
            component: Demo
        }
    ]
})
