import router from './router'
// eslint-disable-next-line no-unused-vars
import store from './store'
// eslint-disable-next-line no-unused-vars
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// eslint-disable-next-line no-unused-vars
import { getToken } from '@/utils/auth' // get token from cookie
// eslint-disable-next-line no-unused-vars
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// eslint-disable-next-line no-unused-vars
const whiteList = ['/', '/home', '/home/index', '/problem/index', '/status/index', '/rank/index',
  '/contest/index', '/record/index', '/editor', '/help/index', '/login/index', '/register/index'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login/index') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
      NProgress.done()
    }
    /* else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login/index?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }*/
  } else {
    /!* has no token*!/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login/index?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
