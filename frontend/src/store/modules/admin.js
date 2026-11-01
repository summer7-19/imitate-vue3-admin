import { defineStore } from 'pinia'

const pad = (value) => String(value).padStart(2, '0')

export function formatNow() {
  const date = new Date()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`
}

const GOODS_CATEGORIES = ['数码家电', '家居日用', '食品饮料', '服饰鞋包', '其他']

const usersSeed = [
  {
    id: '330000199807021249',
    username: 'admin',
    email: 'e.yjh@pkowt.pn',
    roles: ['admin'],
    updatedAt: '2009-05-25 01:45:14',
    enabled: true,
  },
  {
    id: '810000199301105108',
    username: 'editor',
    email: 'l.eeked@csrw.np',
    roles: ['editor'],
    updatedAt: '2015-04-15 08:39:14',
    enabled: true,
  },
  {
    id: '710000198507058484',
    username: 'test',
    email: 'a.cfw@bpedwuwn.pn',
    roles: ['admin', 'editor'],
    updatedAt: '1985-09-05 22:52:10',
    enabled: false,
  },
]

const goodsSeed = [
  {
    id: '42000019960',
    name: '星野降噪耳机',
    category: '数码家电',
    cover: 'https://picsum.photos/seed/vue012-headset/160/160',
    price: 256,
    sales: 42,
    stock: 5,
    status: '已下架',
    recommended: false,
    createdAt: '1993-11-01 11:42:03',
  },
  {
    id: '62000019961',
    name: '云杉加湿器',
    category: '家居日用',
    cover: 'https://picsum.photos/seed/vue012-humidifier/160/160',
    price: 675,
    sales: 72,
    stock: 70,
    status: '已下架',
    recommended: true,
    createdAt: '1980-08-21 09:55:09',
  },
  {
    id: '32000020140',
    name: '拾光机械键盘',
    category: '数码家电',
    cover: 'https://picsum.photos/seed/vue012-keyboard/160/160',
    price: 764,
    sales: 23,
    stock: 87,
    status: '待上架',
    recommended: true,
    createdAt: '2024-07-28 09:19:01',
  },
  {
    id: '63000020081',
    name: '森丘手冲咖啡',
    category: '食品饮料',
    cover: 'https://picsum.photos/seed/vue012-coffee/160/160',
    price: 109,
    sales: 57,
    stock: 65,
    status: '已下架',
    recommended: true,
    createdAt: '1998-09-25 02:20:13',
  },
  {
    id: '51000020315',
    name: '赤霞帆布鞋',
    category: '服饰鞋包',
    cover: 'https://picsum.photos/seed/vue012-shoes/160/160',
    price: 329,
    sales: 118,
    stock: 32,
    status: '在售',
    recommended: true,
    createdAt: '2023-03-14 16:08:22',
  },
  {
    id: '73000020047',
    name: '白露保温杯',
    category: '家居日用',
    cover: 'https://picsum.photos/seed/vue012-cup/160/160',
    price: 89,
    sales: 204,
    stock: 0,
    status: '在售',
    recommended: false,
    createdAt: '2022-11-02 10:31:45',
  },
  {
    id: '83000019933',
    name: '青屿蓝牙音箱',
    category: '数码家电',
    cover: 'https://picsum.photos/seed/vue012-speaker/160/160',
    price: 459,
    sales: 66,
    stock: 24,
    status: '在售',
    recommended: true,
    createdAt: '2021-06-18 08:12:33',
  },
  {
    id: '91000020208',
    name: '山月香薰蜡烛',
    category: '家居日用',
    cover: 'https://picsum.photos/seed/vue012-candle/160/160',
    price: 128,
    sales: 95,
    stock: 41,
    status: '待上架',
    recommended: false,
    createdAt: '2025-01-09 19:44:06',
  },
  {
    id: '12000020076',
    name: '北岛燕麦麦片',
    category: '食品饮料',
    cover: 'https://picsum.photos/seed/vue012-oat/160/160',
    price: 49,
    sales: 310,
    stock: 120,
    status: '在售',
    recommended: false,
    createdAt: '2024-04-22 07:25:18',
  },
  {
    id: '22000019904',
    name: '暮川针织外套',
    category: '服饰鞋包',
    cover: 'https://picsum.photos/seed/vue012-coat/160/160',
    price: 599,
    sales: 37,
    stock: 18,
    status: '已下架',
    recommended: true,
    createdAt: '2020-10-30 13:07:51',
  },
  {
    id: '32000020252',
    name: '拾叶桌面收纳盒',
    category: '其他',
    cover: 'https://picsum.photos/seed/vue012-box/160/160',
    price: 76,
    sales: 143,
    stock: 56,
    status: '在售',
    recommended: false,
    createdAt: '2025-08-15 11:03:39',
  },
  {
    id: '42000019988',
    name: '远山旅行背包',
    category: '服饰鞋包',
    cover: 'https://picsum.photos/seed/vue012-bag/160/160',
    price: 388,
    sales: 51,
    stock: 9,
    status: '待上架',
    recommended: true,
    createdAt: '2023-12-01 15:56:02',
  },
]

const commentsSeed = [
  {
    id: 'C-1001',
    goods: '星野降噪耳机',
    user: '林晓',
    rating: 5,
    content: '降噪效果很惊喜，通勤时戴一整天耳朵也不累。',
    time: '2026-10-28 14:20',
    status: '待审核',
  },
  {
    id: 'C-1002',
    goods: '云杉加湿器',
    user: '周予安',
    rating: 4,
    content: '容量足够，夜间模式几乎没有声音。',
    time: '2026-10-27 09:12',
    status: '已通过',
  },
  {
    id: 'C-1003',
    goods: '拾光机械键盘',
    user: '陈弈',
    rating: 5,
    content: '键帽手感很好，整体做工超出预期。',
    time: '2026-10-26 20:45',
    status: '已通过',
  },
  {
    id: 'C-1004',
    goods: '森丘手冲咖啡',
    user: '苏木',
    rating: 2,
    content: '包装有破损，联系客服后已经补发。',
    time: '2026-10-25 18:02',
    status: '已隐藏',
  },
  {
    id: 'C-1005',
    goods: '赤霞帆布鞋',
    user: '许清和',
    rating: 4,
    content: '尺码偏大半码，颜色比图片更好看。',
    time: '2026-10-24 11:37',
    status: '待审核',
  },
  {
    id: 'C-1006',
    goods: '白露保温杯',
    user: '沈知夏',
    rating: 5,
    content: '保温效果不错，放包里也不漏水。',
    time: '2026-10-23 08:16',
    status: '已通过',
  },
  {
    id: 'C-1007',
    goods: '青屿蓝牙音箱',
    user: '陆时',
    rating: 3,
    content: '低音一般，但这个价位可以接受。',
    time: '2026-10-22 21:09',
    status: '已隐藏',
  },
  {
    id: 'C-1008',
    goods: '北岛燕麦麦片',
    user: '顾言',
    rating: 5,
    content: '回购第三次了，早餐搭配牛奶很方便。',
    time: '2026-10-21 07:58',
    status: '待审核',
  },
]

const workOrdersSeed = [
  {
    id: 'WO-20261028001',
    type: '售后',
    user: '林晓',
    priority: '高',
    status: '待处理',
    content: '耳机左耳偶尔断连，希望换新。',
    time: '2026-10-28 14:32',
  },
  {
    id: 'WO-20261027002',
    type: '物流',
    user: '周予安',
    priority: '中',
    status: '处理中',
    content: '订单已签收但物流状态未更新。',
    time: '2026-10-27 10:05',
  },
  {
    id: 'WO-20261026003',
    type: '退款',
    user: '陈弈',
    priority: '高',
    status: '已完成',
    content: '重复下单，申请退款第二件商品。',
    time: '2026-10-26 19:41',
  },
  {
    id: 'WO-20261025004',
    type: '咨询',
    user: '苏木',
    priority: '低',
    status: '待处理',
    content: '想确认键盘是否支持 Mac 键位切换。',
    time: '2026-10-25 16:18',
  },
  {
    id: 'WO-20261024005',
    type: '售后',
    user: '许清和',
    priority: '中',
    status: '处理中',
    content: '帆布鞋尺码不合适，咨询换码流程。',
    time: '2026-10-24 12:26',
  },
  {
    id: 'WO-20261023006',
    type: '投诉',
    user: '沈知夏',
    priority: '高',
    status: '已关闭',
    content: '客服响应超时，要求回访。',
    time: '2026-10-23 09:03',
  },
  {
    id: 'WO-20261022007',
    type: '咨询',
    user: '陆时',
    priority: '低',
    status: '已完成',
    content: '音箱是否支持多设备连接？',
    time: '2026-10-22 22:11',
  },
]

const PERMISSION_OPTIONS = [
  { key: 'dashboard', label: '查看数据看板' },
  { key: 'goods', label: '商品管理' },
  { key: 'users', label: '用户管理' },
  { key: 'orders', label: '工单处理' },
  { key: 'settings', label: '系统设置' },
]

const ROLES = [
  { key: 'admin', name: '管理员', desc: '拥有全部模块的读写权限，不可被降级。' },
  { key: 'editor', name: '编辑', desc: '负责商品与评论的内容维护。' },
  { key: 'test', name: '测试', desc: '只读演示账号，用于验证页面展示。' },
]

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: usersSeed.map((user) => ({ ...user, roles: [...user.roles] })),
    goods: goodsSeed.map((item) => ({ ...item })),
    comments: commentsSeed.map((item) => ({ ...item })),
    workOrders: workOrdersSeed.map((item) => ({ ...item })),
    roles: ROLES.map((role) => ({ ...role })),
    permissionOptions: PERMISSION_OPTIONS.map((item) => ({ ...item })),
    rolePermissions: {
      admin: PERMISSION_OPTIONS.map((item) => item.key),
      editor: ['dashboard', 'goods', 'orders'],
      test: ['dashboard'],
    },
    categories: [...GOODS_CATEGORIES],
  }),
  actions: {
    addUser({ username, email, roles }) {
      this.users.unshift({
        id: `99${String(Date.now()).slice(-16)}`,
        username: username.trim(),
        email: email.trim(),
        roles: roles.length ? [...roles] : ['test'],
        updatedAt: formatNow(),
        enabled: true,
      })
    },
    updateUser(id, patch) {
      const user = this.users.find((item) => item.id === id)
      if (!user) return
      Object.assign(user, patch, { updatedAt: formatNow() })
    },
    removeUsers(ids) {
      const blocked = this.users.filter((user) => ids.includes(user.id) && user.username === 'admin')
      if (blocked.length) return false
      this.users = this.users.filter((user) => !ids.includes(user.id))
      return true
    },
    addGoods(payload) {
      this.goods.unshift({
        id: `42${String(Date.now()).slice(-9)}`,
        sales: 0,
        recommended: false,
        createdAt: formatNow(),
        ...payload,
        price: Number(payload.price) || 0,
        stock: Number(payload.stock) || 0,
      })
    },
    updateGoods(id, patch) {
      const goods = this.goods.find((item) => item.id === id)
      if (!goods) return
      Object.assign(goods, patch)
    },
    removeGoods(ids) {
      this.goods = this.goods.filter((item) => !ids.includes(item.id))
    },
    setCommentStatus(id, status) {
      const comment = this.comments.find((item) => item.id === id)
      if (comment) comment.status = status
    },
    removeComment(id) {
      this.comments = this.comments.filter((item) => item.id !== id)
    },
    setOrderStatus(id, status) {
      const order = this.workOrders.find((item) => item.id === id)
      if (order) order.status = status
    },
    addRole({ name, key, desc, permissions }) {
      const normalizedKey = key.trim()
      if (this.roles.some((role) => role.key === normalizedKey)) return false
      this.roles.push({
        key: normalizedKey,
        name: name.trim(),
        desc: desc.trim() || '自定义角色，权限可在本页调整。',
      })
      this.rolePermissions[normalizedKey] = [...permissions]
      return true
    },
    updateRole(key, { name, desc, permissions }) {
      const role = this.roles.find((item) => item.key === key)
      if (!role) return
      role.name = name.trim()
      role.desc = desc.trim() || role.desc
      if (permissions) this.rolePermissions[key] = [...permissions]
    },
    removeRoles(keys) {
      if (keys.includes('admin')) return false
      this.roles = this.roles.filter((role) => !keys.includes(role.key))
      keys.forEach((key) => {
        delete this.rolePermissions[key]
      })
      return true
    },
    setRolePermissions(role, keys) {
      if (role === 'admin') return
      if (!(role in this.rolePermissions)) return
      this.rolePermissions[role] = [...keys]
    },
    resetPermissions() {
      this.rolePermissions = {
        admin: PERMISSION_OPTIONS.map((item) => item.key),
        editor: ['dashboard', 'goods', 'orders'],
        test: ['dashboard'],
      }
    },
  },
})
