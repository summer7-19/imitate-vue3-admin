export const network = {
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  contentType: 'application/json;charset=UTF-8',
  messageDuration: 3000,
  requestTimeout: 15000,
  successCode: [200, 0],
  invalidCode: 402,
  noPermissionCode: 401,
}
