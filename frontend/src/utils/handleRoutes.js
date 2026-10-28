export function hasPermission(route, permissions) {
  const required = route.meta?.permissions
  if (!required || required.length === 0) return true
  return required.some((permission) => permissions.includes(permission))
}

function joinPath(basePath, path) {
  if (!path) return basePath
  if (path.startsWith('/')) return path
  return `${basePath}/${path}`.replace(/\/{2,}/g, '/')
}

export function buildMenuRoutes(routes, basePath = '') {
  const result = []

  routes.forEach((route) => {
    if (route.meta?.hidden) return

    const fullPath = joinPath(basePath, route.path)
    const children = buildMenuRoutes(route.children || [], fullPath)

    if (children.length === 1) {
      result.push({
        ...children[0],
        meta: {
          icon: route.meta?.icon,
          ...children[0].meta,
        },
      })
      return
    }

    if (children.length > 1) {
      result.push({ ...route, path: fullPath, children })
      return
    }

    result.push({ ...route, path: fullPath })
  })

  return result
}

export function filterAsyncRoutes(routes, permissions) {
  const result = []

  routes.forEach((route) => {
    if (!hasPermission(route, permissions)) return

    const filtered = { ...route }
    if (route.children?.length) {
      filtered.children = filterAsyncRoutes(route.children, permissions)
      if (filtered.children.length === 0) return

      if (typeof filtered.redirect === 'string') {
        const redirectExists = filtered.children.some((child) => {
          const childPath = joinPath(route.path, child.path)
          return filtered.redirect === childPath || filtered.redirect === child.path
        })
        if (!redirectExists) {
          filtered.redirect = joinPath(route.path, filtered.children[0].path)
        }
      }
    }
    result.push(filtered)
  })

  return result
}
