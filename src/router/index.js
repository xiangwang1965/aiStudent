import Vue from 'vue'
import Router from 'vue-router'
import authUtils from '@/services/auth/utils'
import { LOGIN_URL, WB_MAIN_URL } from '@/config'

const home = () => import('@/views/home')
const notFound = () => import('@/views/notFound')

const auth = () => import('@/views/auth')
const thirdPartAuth = () => import('@/views/auth/thirdpartauth')
const forget = () =>import('@/views/auth/forget')
//班级管理
const classroom = () => import('@/views/classroom')
const practice  = () => import('@/views/classroom/practice')
const classroomWrap = () => import('@/views/classroom/classWrap')
//教师档案
const teacher = () => import('@/views/teacher')
const teacherWrap = () => import('@/views/teacher/teacherWrap')
// 购买激活码
const buy = () => import('@/views/buy')
const buyWrap = () => import('@/views/buy/buyWrap')
const payOrder = () => import('@/views/buy/payOrder')
const success = () => import('@/views/buy/success')
// 课程订单
const course = () => import('@/views/course')
const courseWrap = () => import('@/views/course/courseWrap')






Vue.use(Router)

function requireAuth(to, from, next) {
    var firstPage = '/';
    if (!authUtils.loggedIn()) {
        firstPage = '/auth'
    } else {
        firstPage = '/class'

    // redirect中没有next则不执行
    typeof next === 'function' && next()
    }
    return firstPage
}

const router = new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '*',
            name: 'notFound',
            component: notFound,
            redirect: '/'
        },
        {
            path: '/auth',
            name: 'auth',
            component: auth,

        },
        {
            path: '/forget',
            name: 'forget',
            component: forget,

        },
        {
            path: '/thirdPartAuth',
            name: 'thirdPartAuth',
            component: thirdPartAuth
        },
        {
            path: '/practice',
            name: 'practice',
            component: practice
        },

        {
            path: '/',
            component: home,
            redirect:requireAuth,
            beforeEnter: requireAuth,
            children: [
                {
                    path: '/class',
                    component: classroomWrap,
                    beforeEnter: requireAuth,
                    redirect: requireAuth,
                    children: [
                        { path: '/', name: 'classroom', component: classroom }
                    ]
                },
                {
                    path: '/teacher',
                    component: teacherWrap,
                    beforeEnter: requireAuth,
                    children: [
                        { path: '/', name: 'teacher', component: teacher }
                    ]
                },
                {
                    path: '/buy',
                    component: buyWrap,
                    beforeEnter: requireAuth,
                    children: [
                        {path: '/', name: 'buy', component: buy},
                        {path: 'payOrder',name:'payorder',component: payOrder},
                        {path: 'success' ,name:'success', component:success}
                    ]
                },
                {
                    path: '/course',
                    component: courseWrap,
                    beforeEnter: requireAuth,
                    children: [
                        { path: '/', name: 'course', component: course }
                    ]
                }
            ]
        }
    ]
})

export default router
