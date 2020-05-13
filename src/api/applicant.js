import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export function fetchList(params) {
  return request({
    params,
    url: `${baseURL}/applicant/list`,
    method: 'get'
  })
}

export function fetchById(params) {
  return request({
    params,
    url: `${baseURL}/applicant/getById`,
    method: 'get'
  })
}
