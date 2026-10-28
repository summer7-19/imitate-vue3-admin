const accessTokens = {
  admin: 'admin-accessToken',
  editor: 'editor-accessToken',
  test: 'test-accessToken',
}

const profiles = {
  'admin-accessToken': {
    username: 'admin',
    permissions: ['admin'],
    avatar: 'https://picsum.photos/seed/vue012-admin/200/200',
    email: 'admin@vue012.dev',
  },
  'editor-accessToken': {
    username: 'editor',
    permissions: ['editor'],
    avatar: 'https://picsum.photos/seed/vue012-editor/200/200',
    email: 'editor@vue012.dev',
  },
  'test-accessToken': {
    username: 'test',
    permissions: ['admin', 'editor'],
    avatar: 'https://picsum.photos/seed/vue012-test/200/200',
    email: 'test@vue012.dev',
  },
}

export default [
  {
    url: '/login',
    method: 'post',
    response({ body }) {
      const { username, password } = body || {}
      const accessToken = accessTokens[username]
      if (!accessToken || password !== '123456') {
        return { code: 500, msg: '账号或密码不正确（演示密码为 123456）' }
      }
      return {
        code: 200,
        msg: 'success',
        data: { accessToken },
      }
    },
  },
  {
    url: '/userInfo',
    method: 'post',
    response({ body, headers }) {
      const accessToken =
        body?.accessToken || headers?.accesstoken || headers?.accessToken
      const profile = profiles[accessToken]
      if (!profile) {
        return { code: 402, msg: '登录状态已失效，请重新登录' }
      }
      return {
        code: 200,
        msg: 'success',
        data: profile,
      }
    },
  },
  {
    url: '/logout',
    method: 'post',
    response: () => ({ code: 200, msg: 'success' }),
  },
]
