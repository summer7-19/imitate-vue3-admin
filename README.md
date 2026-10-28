# vue012-admin

一个以「复刻 [`zxwk1998/vue3-admin-better`](https://github.com/zxwk1998/vue3-admin-better)」为学习目标逐步搭建起来的后台管理练习项目：前端 Vue 3 + Vite + Pinia + Element Plus + D3，后端 Express + Mock.js，两者通过 npm workspaces 统一管理。

本文档按项目真实的演进顺序记录：初始形态 → 分层改造 → 双版面 → 前后端分离 → 本轮 Shop Vite 版面补全（图表 / 侧栏 / footer / header / 主题系统）。

---

## 1. 快速开始

```sh
npm install          # workspaces 会同时装好 frontend / backend 依赖
npm run dev          # 并发起后端 (8090) 与前端 (8091)
```

| 地址 | 说明 |
| --- | --- |
| http://127.0.0.1:8091 | 前端（Vite dev server） |
| http://127.0.0.1:8090/api | 后端 Mock 接口 |

其余脚本（均在仓库根目录执行）：

```sh
npm run dev:frontend   # 只起前端
npm run dev:backend    # 只起后端（node --watch）
npm run build          # 构建前端产物 frontend/dist
npm run preview        # 预览构建产物（同样带 /api 代理）
npm run start:backend  # 非 watch 方式启动后端
```

环境要求：Node `^20.19.0 || >=22.12.0`（Vite 8 的硬性要求）。

演示账号：`admin` / `editor` / `test`，密码均为 `123456`。

---

## 2. 技术栈

| 层 | 选型 | 版本 |
| --- | --- | --- |
| 构建 | Vite + `@vitejs/plugin-vue` + `vite-plugin-vue-devtools` | Vite ^8.0.8 |
| 视图 | Vue（全部使用 `<script setup>` 单文件组件） | ^3.5.32 |
| 路由 | Vue Router（`createWebHistory`） | ^5.0.4 |
| 状态 | Pinia | ^3.0.4 |
| 组件库 | Element Plus + `@element-plus/icons-vue` | ^2.14.3 |
| 图表 | D3（手写 SVG，不依赖 ECharts） | ^7.9.0 |
| 请求 | axios + qs | ^1.20.0 |
| 进度条 | nprogress | ^0.2.0 |
| Mock 服务 | Express + mockjs | ^4.21.2 / ^1.1.0 |

---

## 3. 目录结构

```text
.
├── frontend/                      # Vue 3 前端
│   ├── src/
│   │   ├── api/                   # 接口声明（user/router/table/dashboard/form）
│   │   ├── component/             # 两个版面的页面级组件（见 §5）
│   │   │   ├── original/          # 「复刻版面」：header / sideBar / dashboard / svgShowData ...
│   │   │   ├── header/            # Shop Vite 版面共享的 InitHeader.vue + LockScreen.vue
│   │   │   ├── sideBar/           # InitSideBar.vue
│   │   │   └── shopviteChoices/   # newHomePage 壳层 + homepage/* + footer/footer.vue
│   │   ├── composables/           # useGreeting / useUserMenu / useUserProfile / useNotifications
│   │   ├── config/                # setting/net/theme 配置 + permission.js 守卫（见 §9）
│   │   ├── router/index.js        # 实际生效的路由表
│   │   ├── store/                 # pinia 实例 + modules/{user,sidebar,settings,theme,lock,routes}
│   │   ├── styles/index.css       # 设计令牌 + html.dark 暗色变量 + 全局 popper 样式
│   │   ├── utils/                 # request / accessToken / pageTitle / validate / handleRoutes
│   │   ├── views/                 # login / profile / settings / vab/* / shopvite/* / 401 / 404
│   │   ├── App.vue                # el-config-provider(locale) + RouterView + LockScreen
│   │   └── main.js                # 挂载前套用主题，避免首屏闪皮
│   ├── vite.config.js             # 8091 端口、/api → 8090 代理、__BUILD_TIME__ define
│   └── index.html
├── backend/                       # Express Mock 服务
│   ├── index.js                   # 统一挂载 mockRoutes，补 /health 与 404 兜底
│   └── mock/controller/*.js       # 按模块拆分的接口定义（url/method/response）
└── package.json                   # npm workspaces + 根脚本
```

`@` 别名指向 `frontend/src`。

---

## 4. 前后端分离是怎么来的

**初始形态**：所有假数据都写死在组件里，`vite-plugin-mock` 之类都没接。改造第一步是补上 `api / utils / config` 分层，把「数据从哪来」和「数据长什么样」拆开。

**当前形态**：Mock 从前端插件里彻底拔出，做成独立的 Express 进程：

- `backend/mock/controller/*.js` 每个模块导出 `{ url, method, response }` 数组，`response` 可以是对象（走 Mock.js 模板）也可以是函数（按 `body/query/headers` 现算）。
- `backend/index.js` 遍历这些路由注册到 `express.Router()`，统一加 `/api` 前缀，附带请求日志中间件、`/api/health` 健康检查和 404 兜底 JSON。
- `frontend/vite.config.js` 的 `server.proxy` / `preview.proxy` 把 `/api` 转给 `http://127.0.0.1:8090`，所以前端代码里只写相对路径，切换真实后端时不需要改调用点。

接口清单：

| Method | Path | 用途 |
| --- | --- | --- |
| POST | `/api/login` | 校验账号，返回 `accessToken` |
| POST | `/api/userInfo` | 按 token 返回 username / avatar / email / permissions |
| POST | `/api/logout` | 登出 |
| GET | `/api/router/list` | 动态菜单数据 |
| GET | `/api/table/list` | 表格分页数据 |
| GET | `/api/dashboard/overview` | 原始首页仪表盘统计 |
| POST | `/api/form/submit` | 表单提交回显 |
| GET | `/api/health` | 后端存活 / uptime |

---

## 5. 两套版面与路由地图

项目刻意保留了**两个并列的版面**，因为学习重点不同，且要求「新版面只能增量接入，不能替换旧版面的样式和默认入口」。

### 5.1 复刻版面（默认入口 `/`）

以 `component/HomePage.vue` 为壳，`component/original/*`（header、sideBar、dashboard、svgShowData、changeText、chooseOptions、versionInfo）复刻 vue3-admin-better 的原始观感。

| Path | Name | 页面 |
| --- | --- | --- |
| `/login` | Login | `views/login/index.vue` |
| `/` | home | `component/original/dashboard.vue` |
| `/components/button` `form` `table` | ButtonDemo / FormDemo / TableDemo | `views/vab/*.vue` |
| `/profile` | Profile | `views/profile/index.vue` 个人中心 |
| `/settings` | Settings | `views/settings/index.vue` 系统设置 |
| `/error/401` `/error/404` | Unauthorized / NotFound | `views/40*.vue` |

### 5.2 独立页面

| Path | 组件 | 说明 |
| --- | --- | --- |
| `/job` | `component/jobWeb.vue` | 就业网：本地搜索 / 省份城市筛选 / 排序 / 发帖 |
| `/thank` | `component/Thanking.vue` | 致谢页 |
| `/shop` | `component/ShopVite.vue` | 模板市场：分类图标、筛选、购买交互 |

### 5.3 Shop Vite 版面（`/shop-vite`）

`component/shopviteChoices/newHomePage.vue` 为壳层，组装 `InitHeader` + `InitSideBar` + `<RouterView>` + `footer.vue`。

| Path | Name | 页面 |
| --- | --- | --- |
| `/shop-vite` | ShopViteHomePage | 首页：统计卡、图表、系统信息、版本说明 |
| `/shop-vite/panel` | Panel | 看板 |
| `/shop-vite/create-center` | CreateCenter | 创作中心（模板市场） |
| `/shop-vite/monitor` | RealTimeMonitor | 实时监控 |
| `/shop-vite/tiles` | Tiles | 磁贴 |
| `/shop-vite/independent-layout` | IndependentLayout | 独立布局 |
| `/shop-vite/data-screen` | DataScreen | 数据大屏 |
| `/shop-vite/workbench` | WorkBench | 工作台（待办） |
| `/shop-vite/liquid-glass` | LiquidGlass | 液态玻璃 |
| `/shop-vite/customer-service` | CustomerService | 客服端 |
| `/shop-vite/update-log` | UpdateLog | 更新日志 |
| `/:pathMatch(.*)*` | — | 重定向到 `/error/404` |

侧栏分类项与 header 的应用宫格、搜索面板都直接跳这些真实路由，不做假链接。

---

## 6. 状态管理与用户数据互通

`store/modules/user.js` 是唯一用户源：`accessToken`（从 `utils/accessToken.js` 读取本地存储）、`username`、`avatar`、`email`、`permissions`，动作 `login / getUserInfo / logout / resetAccessToken` 全部走 `api/user.js`。

两个版面的 header 共用 `composables/useUserProfile.js` 与 `useUserMenu.js`：登录状态、头像、下拉菜单项来自同一个 store，因此在 `/shop` 与 `/shop-vite` 之间切换时个人信息保持一致，选中「个人信息」即跳 `/profile`。`main.js` 挂载后 `InitHeader` 在 `onMounted` 里补拉一次 `getUserInfo()`，刷新页面也不会丢用户名。

其余模块：

- `sidebar.js` —— `useSidebarStore`（复刻版面抽屉侧栏）与 `useSideBarContent`（Shop Vite 折叠态）。
- `settings.js` —— 标题、版权、侧栏默认折叠，来自 `config/setting.config.js`。
- `theme.js` / `lock.js` —— 本轮新增，见 §7、§8。

---

## 7. 主题系统：设计令牌 + 暗色模式

这是本轮改动里影响面最大的一块，做法是**先把散落的硬编码颜色收敛成 CSS 变量，再让暗色模式只改变量**。

`styles/index.css` 的 `:root` 定义了 `--app-bg`、`--app-surface*`（`hi / raised / quiet / mute / line / plain / sunken / bright`）、`--app-text*`（`title / base / body / secondary / subtle / muted / soft / warm / faint / ghost / deep / placeholder / ep`）、`--app-border-*`、`--app-primary*` 和 `--app-color-scheme`。`html.dark` 用同名变量整套翻反。

两条关键约束：

1. **亮色渲染必须逐字节不变**。迁移时每个令牌都取原来那个字面量的值（`--app-surface: #fff`、`--app-text: #2f3a4a` …），26 个组件的 `#fff`、`#fbfcfe`、`color:#3c3c3c`、`border:1px solid #e4ecf7` 等被批量替换成 `var(--app-*)`，所以只换皮肤不改版。
2. **内联 style 的优先级高于 `html.dark`**。主题色不能写成预先算好的字面量挂在 `:root` 上，否则暗色下不会跟随。因此派生色统一用 `color-mix(in srgb, var(--app-primary) X%, var(--app-surface))` 表达，切主色和切暗色都能自然重算。

`store/modules/theme.js` 负责落地与持久化（`localStorage['shop-vite:theme']`）：

- 暗色开关：`html.dark` 类 + Element Plus 的 `theme-chalk/dark/css-vars.css`。
- 主色预设：海蓝 `#4e88f3`、紫罗兰 `#7c6ff3`、松绿 `#2fa96a`、琥珀 `#e6934a`、珊瑚 `#e35d6a`；`apply()` 同时刷新 `--el-color-primary-light-1..9` 与 `-dark-2`。
- 界面字号：小 `0.9` / 标准 `1` / 大 `1.12`，作用在 `#app { zoom }` 上，并把宽高按 `100/scale %` 反向收缩避免出现滚动条。
- 语言：`zh-cn` / `en`，通过 `App.vue` 的 `el-config-provider :locale` 切换。

`main.js` 在 `app.mount()` **之前**调用 `useThemeStore(pinia).apply()`，避免首屏先亮后暗闪一下。

弹层因为被 teleport 到 `body`，作用域样式管不到，所以 `.header-popper.el-popper`（含 `.is-dark` 与箭头）写在全局 `styles/index.css` 里。

---

## 8. 本轮 Shop Vite 版面补全

### 8.1 四张统计卡（`component/original/svgShowData.vue`）

按参考图重做了渲染层，四张卡分别是：

| 卡 | 图型 | X 轴 | 数据 |
| --- | --- | --- | --- |
| 访问量 | 折线（带渐变面积） | 最近 7 天的日期 | 每天一个点 |
| 授权数 | 柱状 | `0时 … 24时` | 分时段计数 |
| 用户活跃度 | 面积图 | `周一 … 周日` | 一周节奏 |
| 系统性能 | 横向百分比条 | — | CPU 45 / 内存 62 / 磁盘 38 / 网络 28 |

原先「访问量」是不断随机跳动的月份回顾，现在固定成**一周趋势**，和参考图的第一张卡行为一致。

实现要点：`scaleBand` / `scalePoint` / `scaleLinear().nice()`；`y.ticks(4)` 画网格线 + Y 轴刻度（≥1000 显示为 `xk`）+ 基线 + X 轴标签；`line` / `area` 配 `curveMonotoneX`；入场用 dash-offset 描线动画；`ResizeObserver` 带尺寸差值守卫，避免无意义重绘。

交互约定（所有数值/图表统一）：**加载时数字从 0 增长**（`requestAnimationFrame` + `easeCubicOut`，1s），**hover 时显示真实值** —— 覆盖式 hit-layer rect + 竖向 reference line + marker 圆点 + 跟随定位的 `.chartTip` 提示框；百分比条用 `attrTween` 计数。

### 8.2 侧栏

菜单项默认**无背景**，只有 hover 与 `router-link` 激活项有背景色，窄屏下折叠为纯图标。

### 8.3 底部 footer / 版本说明

`component/shopviteChoices/footer/footer.vue` 挂在 Shop Vite 版面全部 11 个页面底部，数据全部来自真实来源：`package.json` 版本、Vite `define` 注入的 `__BUILD_TIME__`、`import.meta.env.MODE`、当前 `route.path`，依赖版本从 `dependencies + devDependencies` 实读（vue / vue-router / pinia / element-plus / axios / d3 / vite）。「版本说明」按钮弹 popover 展示依赖表。首页的系统信息块同样改为读真实包版本，不再是写死的 `V40.0.1`。

### 8.4 Header 功能（`component/header/InitHeader.vue`）

按参考图逐项做实，没有占位控件：

- **侧栏开合**按钮 + 当前页标题。
- **应用宫格**：popover 内是真实路由九宫格，点击直达。
- **面包屑**：`/shop-vite/*` 以「首页」为根，逐级可点。
- **页面搜索**：本地全量路由标题模糊匹配，结果列表点击跳转，回车执行；命中不到会明确提示（不是假链接）。
- **暗色切换** + **主题色 / 字号** popover（§7）。
- **锁屏**：`LockScreen.vue` 全屏遮罩，实时时钟，首次使用设置 4–8 位解锁码，之后校验解锁，密码错误抖动，解锁写入通知。状态存 `sessionStorage['shop-vite:lock']`。
- **通知中心**：`useNotifications.js` 模块级单例，`sessionStorage` 持久化，上限 20 条，只记录本次会话真实发生的事件（刷新、锁屏、切全屏、清空历史、解锁等），带 `el-badge` 未读数，关闭 popover 时自动标已读，支持全部已读 / 清空。
- **语言切换**、**刷新当前页**（带旋转反馈）、**全屏**（监听 `fullscreenchange` 同步图标）、**AI 助手 / 联系客服**（跳 `/shop-vite/customer-service`，已在该页则提示）。
- **账号菜单**：头像 + 下拉，项与复刻版面一致并改为真实页面跳转。
- **浏览路径**（底部历史条）：记录最近访问，点击可回跳，支持清空。

图标全部来自 `@element-plus/icons-vue`，逐个核对过导出名。

### 8.5 个人中心与系统设置

`/profile`、`/settings` 两个页面读取同一个 `useUserProfile`，两个版面的用户菜单都指向它们；`/shop` 与 `/shop-vite` 的账号菜单也复用同一套数据与跳转。

---

## 9. 尚未接入 / 已知边界

如实记录，避免误以为已经完成：

- **登录守卫未挂载**。`config/permission.js`（token 校验、白名单、nprogress 进度条、动态标题）以及 `router/routes.js` → `layouts/` → `store/modules/routes.js` → `utils/handleRoutes.js` → `views/index/index.vue` 这条链路目前**没有被入口引用**：`router/index.js` 使用的是自己的静态路由表，也没有 `beforeEach`。这是复刻 vue3-admin-better 时的骨架，等重新接通动态权限路由时再接上。`config/permission.js` 依赖的 `store/modules/routes.js` 同样处于未激活状态。
- **`useGreeting.js`、`views/placeholder/index.vue`、`src/components/`（空目录）、`font/` 下的 iconfont demo 文件**当前未被应用入口引用，属于历史遗留，删除前需确认。
- 图表里的轴色 / 网格色仍是常量（`#b4bac6`、`#eef1f6`），暗色下不会自动反转；少数历史内联蓝色也未收敛。
- `el-config-provider` 的 locale 只翻译 Element Plus 内置文案（分页、日期选择等），自写文案需要另做 i18n。
- 页面搜索是本地路由匹配，背后没有 LLM；「AI 助手」入口只是跳客服页。
- 本轮改动只做了 `npm run build` 与代码层验证。浏览器可视化核验被当前会话的策略阻止（无法导航），因此暗色翻面、字号缩放、锁屏遮罩等**未做人工截图确认**，请本地 `npm run dev` 目测。

---

## 10. 推荐 IDE

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
