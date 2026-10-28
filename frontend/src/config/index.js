import { setting } from './setting.config.js'
import { theme } from './theme.config.js'
import { network } from './net.config.js'

const config = { ...setting, ...theme, ...network }

export const title = config.title
export const abbreviation = config.abbreviation
export const copyright = config.copyright
export const tokenName = config.tokenName
export const tokenTableName = config.tokenTableName
export const storage = config.storage
export const routesWhiteList = config.routesWhiteList
export const loginInterception = config.loginInterception
export const authentication = config.authentication
export const progressBar = config.progressBar
export const sidebarCollapsed = config.sidebarCollapsed
export const primaryColor = config.primaryColor
export const baseURL = config.baseURL
export const contentType = config.contentType
export const messageDuration = config.messageDuration
export const requestTimeout = config.requestTimeout
export const successCode = config.successCode
export const invalidCode = config.invalidCode
export const noPermissionCode = config.noPermissionCode

export default config
