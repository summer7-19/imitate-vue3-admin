export const setting = {
  title: import.meta.env.VITE_APP_TITLE || 'Vue012 Admin',
  abbreviation: 'vue012',
  copyright: '© 2026 Vue012 Admin',
  tokenName: 'accessToken',
  tokenTableName: 'vue012-admin-token',
  storage: 'localStorage',
  routesWhiteList: ['/login', '/401', '/404'],
  loginInterception: true,
  authentication: 'intelligence',
  progressBar: true,
  sidebarCollapsed: false,
}
