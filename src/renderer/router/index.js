import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/view/Index')
    },
    {
      path: '/MyFavorite',
      name: 'myfavorite',
      component: () => import('@/view/MyFavorite')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
