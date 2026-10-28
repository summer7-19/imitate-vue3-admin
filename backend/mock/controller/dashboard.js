export default [
  {
    url: '/dashboard/overview',
    method: 'get',
    response: () => ({
      code: 200,
      msg: 'success',
      data: {
        stats: [
          { key: 'sales', label: '总销量', value: 16677, prefix: '¥', trend: 12.5 },
          { key: 'users', label: '活跃用户', value: 1710, trend: 8.2 },
          { key: 'orders', label: '总成交', value: 18831, trend: -2.4 },
          { key: 'conversion', label: '转化率', value: 12.6, suffix: '%', trend: 3.1 },
        ],
        activities: [
          { id: 1, user: 'admin', action: '创建了商品「极光系列 降噪无线耳机」', time: '10:24' },
          { id: 2, user: 'editor', action: '更新了首页轮播内容', time: '09:58' },
          { id: 3, user: 'test', action: '导出了 10 月订单报表', time: '09:31' },
          { id: 4, user: 'admin', action: '处理了 3 条售后申请', time: '08:45' },
          { id: 5, user: 'editor', action: '发布了公告「系统维护通知」', time: '昨天 18:20' },
        ],
      },
    }),
  },
]
