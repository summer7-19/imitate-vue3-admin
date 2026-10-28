import userRoutes from './controller/user.js'
import routerRoutes from './controller/router.js'
import tableRoutes from './controller/table.js'
import dashboardRoutes from './controller/dashboard.js'
import formRoutes from './controller/form.js'

export const mockRoutes = [
  ...userRoutes,
  ...routerRoutes,
  ...tableRoutes,
  ...dashboardRoutes,
  ...formRoutes,
]

export default mockRoutes
