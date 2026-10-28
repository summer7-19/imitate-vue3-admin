import request from '@/utils/request'

export function getRouterList() {
  return request({
    url: '/router/list',
    method: 'get',
  })
}
