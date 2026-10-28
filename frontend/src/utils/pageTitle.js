import { title } from '@/config'

export default function getPageTitle(pageTitle) {
  return pageTitle ? `${pageTitle} - ${title}` : title
}
