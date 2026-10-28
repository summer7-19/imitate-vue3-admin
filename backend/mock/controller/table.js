const names = ['Tom', 'Jerry', 'Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank']
const states = ['California', 'Texas', 'Florida', 'Washington', 'Nevada']
const cities = ['Los Angeles', 'Houston', 'Miami', 'Seattle', 'Las Vegas']
const addresses = [
  'No. 189, Grove St',
  'No. 42, Oak Ave',
  'No. 7, Maple Rd',
  'No. 300, Pine St',
  'No. 16, Cedar Blvd',
]

const allRows = Array.from({ length: 57 }, (_, index) => ({
  id: index + 1,
  date: `2026-10-${String((index % 28) + 1).padStart(2, '0')}`,
  name: names[index % names.length],
  state: states[index % states.length],
  city: cities[index % cities.length],
  address: addresses[index % addresses.length],
  zip: `CA ${90000 + index}`,
}))

export default [
  {
    url: '/table/list',
    method: 'get',
    response({ query }) {
      const page = Math.max(Number(query.page) || 1, 1)
      const pageSize = Math.max(Number(query.pageSize) || 10, 1)
      const keyword = String(query.keyword || '').trim().toLowerCase()
      const filtered = keyword
        ? allRows.filter((item) =>
            [item.name, item.state, item.city, item.address].some((value) =>
              value.toLowerCase().includes(keyword)
            )
          )
        : allRows

      const start = (page - 1) * pageSize
      return {
        code: 200,
        msg: 'success',
        data: {
          list: filtered.slice(start, start + pageSize),
          total: filtered.length,
          page,
          pageSize,
        },
      }
    },
  },
]
