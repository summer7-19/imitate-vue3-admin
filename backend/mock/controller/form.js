export default [
  {
    url: '/form/submit',
    method: 'post',
    response({ body }) {
      return {
        code: 200,
        msg: '提交成功',
        data: body,
      }
    },
  },
]
