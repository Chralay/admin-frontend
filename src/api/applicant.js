import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export function fetchList(params) {
  return request({
    params,
    url: `${baseURL}/applicant/list`,
    method: 'get'
  })
}

// 这个还没用到
export function fetchById(params) {
  return request({
    params,
    url: `${baseURL}/applicant/getById`,
    method: 'get'
  })
}

export function del(params) {
  return request({
    params,
    url: `${baseURL}/applicant/del`,
    method: 'get'
  })
}

export function fetchByName(params) {
  return request({
    params,
    url: `${baseURL}/applicant/getByName`,
    method: 'get'
  })
}
