import request from '@/utils/request'

export function submitForm(data) {
  return request({
    url: '/form/submit',
    method: 'post',
    data,
  })
}
