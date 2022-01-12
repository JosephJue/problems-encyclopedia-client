import Vue from 'vue'
import Router from 'vue-router'
import SearchIssue from '@/components/SearchIssue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SearchIssue',
      component: SearchIssue
    }
  ]
})