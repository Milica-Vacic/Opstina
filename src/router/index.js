import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import AdminPage from '../views/AdminPage.vue'
import AdminHome from '../views/AdminHome.vue'
import AdminCreateProject from '../views/AdminCreateProject.vue'
import AdminActiveProjects from '../views/AdminActiveProjects.vue'
import AdminAllUsersView from '../views/AdminAllUsersView.vue'
import AdminArchivedProjects from '../views/AdminArchivedProjects.vue'
import UserPage from '../views/UserPage.vue'
import UserHome from '../views/UserHome.vue'
import UserHistory from '../views/UserHistory.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    component: AdminPage,
    children:[
      {
        path: '',
        name: 'AdminHome',
        component: AdminHome
      },
      {
        path: 'novi-projekat',
        name: 'AdminCreateProject',
        component: AdminCreateProject
      },
      {
        path: 'projekti',
        name: 'AdminActiveProjects',
        component: AdminActiveProjects
      },
      {
        path: 'udruzenja',
        name: 'AdminAllUsersView',
        component: AdminAllUsersView
      },
      {
        path: 'arhiva',
        name: 'AdminArchivedProjects',
        component: AdminArchivedProjects
      }
    ],
    beforeEnter (to, from, next) {
      if (sessionStorage.getItem("sid") && JSON.parse(sessionStorage.getItem("admin"))) {
          next()
      } else {
          next(from)
      }
    }
  },
  {
    path: '/korisnik',
    component: UserPage,
    children:[
      {
        path: '',
        name: 'UserHome',
        component: UserHome
      },
      {
        path: 'istorijat',
        name: 'UserHistory',
        component: UserHistory
      }
    ],
    beforeEnter (to, from, next) {
      if (sessionStorage.getItem("sid") && !JSON.parse(sessionStorage.getItem("admin"))) {
          next()
      } else {
          next(from)
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
