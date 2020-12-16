import request from '@/utils/request'

export function getProblemList(params) {
  return request({
    url: '/practice/problem/listProblem',
    method: 'get',
    params
  })
}

export function getProblemById(params) {
  return request({
    url: '/practice/problem/problem',
    method: 'get',
    params
  })
}

export function getClassifyListCascader() {
  return request({
    url: '/practice/classify/listCascader',
    method: 'get'
  })
}
