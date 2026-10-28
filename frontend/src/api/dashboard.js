import request from '@/utils/request'

export function getOverview() {
  return request({
    url: '/dashboard/overview',
    method: 'get',
  })
}
