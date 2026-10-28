import express from 'express'
import Mock from 'mockjs'
import mockRoutes from './mock/index.js'

const { mock: mockjs } = Mock

const app = express()
const port = Number(process.env.PORT) || 8090
const host = process.env.HOST || '127.0.0.1'
const prefix = process.env.API_PREFIX || '/api'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[backend] ${req.method} ${req.originalUrl} ${res.statusCode}`)
  })
  next()
})

const router = express.Router()

router.get('/health', (req, res) => {
  res.json({ code: 200, msg: 'success', data: { uptime: process.uptime() } })
})

for (const route of mockRoutes) {
  const method = (route.method || 'get').toLowerCase()
  router[method](route.url, (req, res) => {
    try {
      const result =
        typeof route.response === 'function'
          ? route.response({ body: req.body, query: req.query, headers: req.headers })
          : route.response
      res.json(mockjs(result))
    } catch (error) {
      res.status(500).json({ code: 500, msg: `接口执行异常：${error.message}` })
    }
  })
}

router.use((req, res) => {
  res.status(404).json({
    code: 404,
    msg: `接口不存在：${req.method} ${req.originalUrl}`,
  })
})

app.use(prefix, router)

app.listen(port, host, () => {
  console.log(`[backend] http://${host}:${port}${prefix}`)
})
