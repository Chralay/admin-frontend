import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export function fetchList(params) {
  return request({
    params,
    url: `${baseURL}/interviewer/list`,
    method: 'get'
  })
}

export function del(params) {
  return request({
    params,
    url: `${baseURL}/interviewer/del`,
    method: 'get'
  })
}
