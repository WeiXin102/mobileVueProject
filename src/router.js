import Vue from 'vue'
import Router from 'vue-router'
import newViews from './views/newviews.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'newViews',
      component: newViews
    },
    {
      path: '/pdf',
      name: 'pdf',
      component: () => import('./components/pdf.vue')
    },
    {
      path: '/pdfPagination',
      name: 'pdfPagination',
      component: () => import('./components/pdfPagination.vue')
    }, 
    {
      path: '/echart',
      name: 'echart',
      component: () => import('./components/echart')
    }, 
  ]
})
