import request from '@/utils/request'

export function validateCode(params) {
  return request({
    url: '/user/user/userEmail',
    method: 'post',
    data: params
  })
}

export function register(data) {
  return request({
    url: '/user/user/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
