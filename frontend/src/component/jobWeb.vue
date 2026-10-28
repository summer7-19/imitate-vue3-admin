<script setup>
import sideBar from './original/sideBar.vue'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useSidebarStore } from '../store/modules/sidebar'

const sidebarStore = useSidebarStore()

const PAGE_SIZE = 4

const isShow = ref(true)
const loading = ref(false)
const waitIsShow = computed(() => loading.value)
const jobWebRef = ref(null)
let loadTimer = null

const provinceOptions = ['北京', '上海', '广东', '浙江', '江苏', '四川']
const cityMap = {
  北京: ['北京城区', '海淀区', '朝阳区'],
  上海: ['浦东新区', '徐汇区', '静安区'],
  广东: ['深圳', '广州', '东莞'],
  浙江: ['杭州', '宁波'],
  江苏: ['南京', '苏州'],
  四川: ['成都', '绵阳'],
}

const list = ref([
  {
    id: 1,
    comment: '面试流程很规范，三轮技术面加一轮 HR 面，面试官会追问项目细节，建议提前把简历上的项目复盘一遍。整体体验不错，反馈也很快。',
    category: '推荐',
    province: '广东',
    city: '深圳',
    createdAt: new Date('2026-10-23T10:20:00').getTime(),
    lastReplyAt: new Date('2026-10-24T09:00:00').getTime(),
    seeNum: 1286,
    likeNum: 96,
    dislikeNum: 4,
    commentNum: 18,
    voted: null,
  },
  {
    id: 2,
    comment: '面试通过后 HR 说走流程，结果等了两周被告知岗位冻结。建议同时推进其他机会，不要把所有希望压在一家。',
    category: '避雷',
    province: '北京',
    city: '北京城区',
    createdAt: new Date('2026-10-22T18:40:00').getTime(),
    lastReplyAt: new Date('2026-10-23T21:15:00').getTime(),
    seeNum: 2431,
    likeNum: 152,
    dislikeNum: 32,
    commentNum: 41,
    voted: null,
  },
  {
    id: 3,
    comment: '团队氛围比较轻松，弹性上下班，周会不拖堂。技术栈是 Vue3 + TS，代码评审比较认真，适合想沉淀工程能力的同学。',
    category: '推荐',
    province: '浙江',
    city: '杭州',
    createdAt: new Date('2026-10-21T14:05:00').getTime(),
    lastReplyAt: new Date('2026-10-22T10:30:00').getTime(),
    seeNum: 987,
    likeNum: 78,
    dislikeNum: 6,
    commentNum: 12,
    voted: null,
  },
  {
    id: 4,
    comment: '试岗三天没有薪资，还要求自带电脑。入职前一定要问清楚试用期薪资、社保缴纳时间和加班调休规则。',
    category: '避雷',
    province: '上海',
    city: '浦东新区',
    createdAt: new Date('2026-10-20T09:15:00').getTime(),
    lastReplyAt: new Date('2026-10-21T19:05:00').getTime(),
    seeNum: 3120,
    likeNum: 210,
    dislikeNum: 21,
    commentNum: 57,
    voted: null,
  },
  {
    id: 5,
    comment: '校招面试偏基础，手写 Promise 和数组去重，二面聊项目。HR 很耐心，offer 发放也快，整体值得一试。',
    category: '推荐',
    province: '江苏',
    city: '南京',
    createdAt: new Date('2026-10-19T20:30:00').getTime(),
    lastReplyAt: new Date('2026-10-20T12:40:00').getTime(),
    seeNum: 645,
    likeNum: 41,
    dislikeNum: 2,
    commentNum: 9,
    voted: null,
  },
  {
    id: 6,
    comment: '招聘 JD 写的是双休，入职后才发现大小周，而且加班没有调休。面试时一定要直接问清楚作息和加班制度。',
    category: '避雷',
    province: '四川',
    city: '成都',
    createdAt: new Date('2026-10-18T11:50:00').getTime(),
    lastReplyAt: new Date('2026-10-19T09:10:00').getTime(),
    seeNum: 1876,
    likeNum: 168,
    dislikeNum: 14,
    commentNum: 38,
    voted: null,
  },
  {
    id: 7,
    comment: '实习转正流程透明，导师会带着做真实业务，每周有一次技术分享。适合想快速积累项目经验的同学。',
    category: '推荐',
    province: '北京',
    city: '海淀区',
    createdAt: new Date('2026-10-17T16:10:00').getTime(),
    lastReplyAt: new Date('2026-10-18T15:20:00').getTime(),
    seeNum: 823,
    likeNum: 65,
    dislikeNum: 3,
    commentNum: 15,
    voted: null,
  },
  {
    id: 8,
    comment: '外包岗位，面试时说项目稳定，实际两个月换一次项目组。签合同前确认好用工主体和项目周期。',
    category: '避雷',
    province: '广东',
    city: '广州',
    createdAt: new Date('2026-10-16T13:25:00').getTime(),
    lastReplyAt: new Date('2026-10-17T11:45:00').getTime(),
    seeNum: 1493,
    likeNum: 112,
    dislikeNum: 9,
    commentNum: 26,
    voted: null,
  },
  {
    id: 9,
    comment: '笔试题目不难，重点考察基础和业务理解。面试官很尊重候选人，会认真回答反问环节的问题。',
    category: '推荐',
    province: '上海',
    city: '徐汇区',
    createdAt: new Date('2026-10-15T10:00:00').getTime(),
    lastReplyAt: new Date('2026-10-16T08:35:00').getTime(),
    seeNum: 532,
    likeNum: 37,
    dislikeNum: 1,
    commentNum: 7,
    voted: null,
  },
  {
    id: 10,
    comment: '面试结束后一直不反馈，主动询问才说岗位已招满。建议面试完约定一个反馈时间，超过就继续投别家。',
    category: '避雷',
    province: '浙江',
    city: '宁波',
    createdAt: new Date('2026-10-14T19:45:00').getTime(),
    lastReplyAt: new Date('2026-10-15T17:25:00').getTime(),
    seeNum: 1102,
    likeNum: 84,
    dislikeNum: 12,
    commentNum: 22,
    voted: null,
  },
  {
    id: 11,
    comment: '制造业信息化岗位，节奏比互联网慢一些，但六点基本能下班。适合追求稳定和工作生活平衡的人。',
    category: '推荐',
    province: '广东',
    city: '东莞',
    createdAt: new Date('2026-10-13T08:30:00').getTime(),
    lastReplyAt: new Date('2026-10-13T20:10:00').getTime(),
    seeNum: 486,
    likeNum: 29,
    dislikeNum: 2,
    commentNum: 6,
    voted: null,
  },
  {
    id: 12,
    comment: '国企背景，流程正规，五险一金按实际工资缴纳。技术更新慢一些，需要自己保持学习。',
    category: '推荐',
    province: '四川',
    city: '绵阳',
    createdAt: new Date('2026-10-12T15:20:00').getTime(),
    lastReplyAt: new Date('2026-10-13T09:50:00').getTime(),
    seeNum: 704,
    likeNum: 52,
    dislikeNum: 5,
    commentNum: 11,
    voted: null,
  },
])

const filters = reactive({
  keyword: '',
  province: '',
  city: '',
  category: '全部',
  sort: 'time',
})

const cityOptions = computed(() => cityMap[filters.province] || [])

const sorters = {
  time: (a, b) => b.createdAt - a.createdAt,
  like: (a, b) => b.likeNum - a.likeNum,
  see: (a, b) => b.seeNum - a.seeNum,
  reply: (a, b) => b.lastReplyAt - a.lastReplyAt,
}

const filteredList = computed(() => {
  const keyword = filters.keyword.trim().toLowerCase()
  return list.value
    .filter((post) => {
      if (filters.province && post.province !== filters.province) return false
      if (filters.city && post.city !== filters.city) return false
      if (filters.category !== '全部' && post.category !== filters.category) return false
      if (keyword) {
        const text = `${post.comment}${post.province}${post.city}${post.category}`.toLowerCase()
        if (!text.includes(keyword)) return false
      }
      return true
    })
    .sort(sorters[filters.sort])
})

const visibleCount = ref(PAGE_SIZE)
const visibleList = computed(() => filteredList.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredList.value.length)

watch(
  () => [filters.keyword, filters.province, filters.city, filters.category, filters.sort],
  () => {
    visibleCount.value = PAGE_SIZE
  }
)

watch(
  () => filters.province,
  () => {
    filters.city = ''
  }
)

function loadMore() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  loadTimer = window.setTimeout(() => {
    visibleCount.value += PAGE_SIZE
    loading.value = false
    loadTimer = null
  }, 400)
}

function onScroll(e) {
  const { scrollTop, clientHeight, scrollHeight } = e.target
  if (scrollTop + clientHeight >= scrollHeight - 80) {
    loadMore()
  }
}

function applySearch() {
  visibleCount.value = PAGE_SIZE
  jobWebRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleReaction(post, type) {
  const field = type === 'like' ? 'likeNum' : 'dislikeNum'
  if (post.voted === type) {
    post[field] = Math.max(0, post[field] - 1)
    post.voted = null
    return
  }
  if (post.voted) {
    const prevField = post.voted === 'like' ? 'likeNum' : 'dislikeNum'
    post[prevField] = Math.max(0, post[prevField] - 1)
  }
  post[field] += 1
  post.voted = type
}

function showCommentTip() {
  ElMessage.info('评论功能正在开发中，敬请期待')
}

function showAccountTip(action) {
  ElMessage.info(`${action}功能为演示，暂未接入账号系统`)
}

const regionText = (post) => (post.province ? `${post.province} · ${post.city}` : '全国')

const pad = (num) => String(num).padStart(2, '0')
function formatTime(timestamp) {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function formatNum(num) {
  return num >= 10000 ? `${(num / 10000).toFixed(1)}w` : String(num)
}

const postVisible = ref(false)
const draft = reactive({
  category: '推荐',
  province: '',
  city: '',
  comment: '',
})
const draftCityOptions = computed(() => cityMap[draft.province] || [])

watch(
  () => draft.province,
  () => {
    draft.city = ''
  }
)

function openPostDialog() {
  postVisible.value = true
}

function submitPost() {
  const comment = draft.comment.trim()
  if (!comment) {
    ElMessage.warning('请先填写帖子内容')
    return
  }
  const now = Date.now()
  list.value.unshift({
    id: now,
    comment,
    category: draft.category,
    province: draft.province,
    city: draft.city || (draft.province ? '城区' : ''),
    createdAt: now,
    lastReplyAt: now,
    seeNum: 0,
    likeNum: 0,
    dislikeNum: 0,
    commentNum: 0,
    voted: null,
  })
  filters.keyword = ''
  filters.province = ''
  filters.city = ''
  filters.category = '全部'
  filters.sort = 'time'
  visibleCount.value = PAGE_SIZE
  postVisible.value = false
  draft.comment = ''
  draft.category = '推荐'
  draft.province = ''
  draft.city = ''
  ElMessage.success('发布成功，已展示在列表顶部')
  jobWebRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

onBeforeUnmount(() => {
  if (loadTimer) {
    window.clearTimeout(loadTimer)
    loadTimer = null
  }
})
</script>

<template>
  <sideBar></sideBar>
  <div ref="jobWebRef" class="jobWeb" :class="{ sideOpen: sidebarStore.openSidebar }" @scroll="onScroll">
    <div class="header">
      <span class="brand">好工作就业参考网</span>
      <div class="account">
        <button @click="showAccountTip('登录')">登录</button>
        <button class="primary" @click="showAccountTip('注册')">注册</button>
      </div>
    </div>
    <div class="mainBox">
      <div class="input">
        <div class="left">
          <input
            v-model="filters.keyword"
            type="text"
            placeholder="公司 / 内容关键字"
            @keyup.enter="applySearch"
          >
        </div>
        <div class="right">
          <button @click="applySearch">查询</button>
        </div>
      </div>
      <div v-show="isShow" class="tooltip">
        <p>温馨提示：请文明发言，不得触犯国家法律法规，希望每一个发帖人都可以为后来者提供真实的就业经验与公司参考，在这里你可以分享求职路上的点滴经历，写下你的求职日记，吐槽那些防不胜防的求职陷阱；聊聊不同公司的真实工作体验，给应届生和求职者提点建议，帮大家避开弯路。
          要是想帮公司招人，或者需要找短期兼职，直接发帖即可。</p>
        <button aria-label="关闭提示" @click="isShow = false">X</button>
      </div>
      <div class="comment">
        <div class="commentHeader">
          <select v-model="filters.province" aria-label="选择省份">
            <option value="">全国</option>
            <option v-for="province in provinceOptions" :key="province" :value="province">{{ province }}</option>
          </select>
          <select v-model="filters.city" aria-label="选择城市" :disabled="!filters.province">
            <option value="">{{ filters.province ? '所有城市' : '请先选择省份' }}</option>
            <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
          </select>
          <select v-model="filters.sort" aria-label="选择排序方式">
            <option value="time">时间倒序</option>
            <option value="like">点赞量倒序</option>
            <option value="see">访问量倒序</option>
            <option value="reply">最后回复倒序</option>
          </select>
          <select v-model="filters.category" aria-label="选择分类">
            <option value="全部">全部分类</option>
            <option value="推荐">推荐</option>
            <option value="避雷">避雷</option>
          </select>
          <button class="post" @click="openPostDialog">发送新帖</button>
        </div>
        <div class="resultInfo">
          <span>共 {{ filteredList.length }} 条帖子</span>
          <span>已展示 {{ visibleList.length }} 条</span>
        </div>
        <div class="commentContent">
          <ul v-if="visibleList.length">
            <li v-for="value in visibleList" :key="value.id">
              <div class="commentPic">匿</div>
              <div class="commentMsg">
                <div class="commentTop">
                  <span class="tag" :class="value.category === '推荐' ? 'recommend' : 'warning'">{{ value.category }}</span>
                  <span class="region">{{ regionText(value) }}</span>
                  <span>{{ formatTime(value.createdAt) }}</span>
                </div>
                <p class="commentText">{{ value.comment }}</p>
                <div class="commentMeta">
                  <span class="author">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    匿名
                  </span>
                  <button type="button" @click="showCommentTip">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>{{ formatNum(value.seeNum) }}</span>
                  </button>
                  <button type="button" @click="showCommentTip">
                    <svg class="icon" viewBox="0 0 24 24">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    <span>{{ value.commentNum }}评论</span>
                  </button>
                  <button
                    type="button"
                    :class="{ active: value.voted === 'like' }"
                    @click="toggleReaction(value, 'like')"
                  >
                    <svg class="icon" viewBox="0 0 24 24">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    <span>赞 {{ value.likeNum }}</span>
                  </button>
                  <button
                    type="button"
                    :class="{ active: value.voted === 'dislike' }"
                    @click="toggleReaction(value, 'dislike')"
                  >
                    <svg class="icon" viewBox="0 0 24 24">
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path>
                    </svg>
                    <span>踩 {{ value.dislikeNum }}</span>
                  </button>
                </div>
              </div>
            </li>
          </ul>
          <el-empty v-else description="没有找到相关帖子，换个条件试试" :image-size="80" />
        </div>
        <div v-show="waitIsShow" class="wait">
          <svg class="spinner" viewBox="0 0 50 50">
            <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
          </svg>
          <span>加载中…</span>
        </div>
        <p v-if="!hasMore && filteredList.length" class="endTip">已经到底啦，去发个新帖吧～</p>
      </div>
    </div>

    <el-dialog v-model="postVisible" title="发送新帖" width="min(520px, 92vw)" append-to-body>
      <div class="postForm">
        <div class="field">
          <label>分类</label>
          <el-radio-group v-model="draft.category">
            <el-radio-button value="推荐">推荐</el-radio-button>
            <el-radio-button value="避雷">避雷</el-radio-button>
          </el-radio-group>
        </div>
        <div class="field">
          <label>地区</label>
          <div class="regionSelect">
            <el-select v-model="draft.province" placeholder="省份（选填）" style="width: 48%">
              <el-option v-for="province in provinceOptions" :key="province" :label="province" :value="province" />
            </el-select>
            <el-select v-model="draft.city" placeholder="城市（选填）" style="width: 48%" :disabled="!draft.province">
              <el-option v-for="city in draftCityOptions" :key="city" :label="city" :value="city" />
            </el-select>
          </div>
        </div>
        <div class="field">
          <label>内容</label>
          <el-input
            v-model="draft.comment"
            type="textarea"
            :rows="5"
            maxlength="500"
            show-word-limit
            placeholder="分享你的求职经历、公司体验或避坑提醒…"
          />
        </div>
      </div>
      <template #footer>
        <button class="dialogBtn ghost" @click="postVisible = false">取消</button>
        <button class="dialogBtn" @click="submitPost">发布</button>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
.jobWeb {
    flex: 1;
    min-width: 0;
    height: 100%;
    margin-left: clamp(64px, 4.5vw, 96px);
    background-color: rgb(245, 247, 248);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    transition: margin-left 0.3s ease;
}

.jobWeb.sideOpen {
    margin-left: min(250px, 84vw);
}

.jobWeb .header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px clamp(16px, 3vw, 40px);
    flex-shrink: 0;
    background-color: var(--app-surface);
    box-shadow: 0 2px 2px #e8e6e6;
}

.jobWeb .header .brand {
    margin-right: auto;
    color: #2fa96a;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 1px;
}

.jobWeb .header .account {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.jobWeb .header .account button {
    height: 32px;
    padding: 0 18px;
    border: none;
    border-radius: 10px;
    color: #1f7a4d;
    font-size: 14px;
    background-color: #f2fbf6;
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;
}

.jobWeb .header .account button.primary {
    color: #1f5c3e;
    background-color: #91f9b9;
}

.jobWeb .header .account button:hover {
    box-shadow: 0 2px 8px rgba(145, 249, 185, 0.6);
}

.jobWeb .mainBox {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: min(1100px, 92%);
    margin: 0 auto;
    padding: 18px 0 40px;
}

.jobWeb .mainBox .input {
    display: flex;
    align-items: center;
    width: min(560px, 100%);
    height: 44px;
    margin: 4px auto 0;
    overflow: hidden;
    border-radius: 25px;
    background-color: var(--app-surface);
    box-shadow: 0 4px 10px #e8fcda, 0 4px 10px #e8fcda;
}

.jobWeb .mainBox .input .left {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 18px;
}

.jobWeb .mainBox .input .left input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 14px;
    letter-spacing: 1px;
}

.jobWeb .mainBox .input .right {
    flex-shrink: 0;
    width: 96px;
    height: 100%;
}

.jobWeb .mainBox .input .right button {
    width: 100%;
    height: 100%;
    border: none;
    color: #175c3a;
    font-size: 15px;
    background-color: #91f9b9;
    cursor: pointer;
    transition: filter 0.2s;
}

.jobWeb .mainBox .input .right button:hover {
    filter: brightness(0.96);
}

.jobWeb .mainBox .tooltip {
    position: relative;
    padding: 12px 42px 12px 14px;
    border: 1px solid #e99c4a;
    border-radius: 10px;
    color: #b9772f;
    font-size: 13px;
    line-height: 1.7;
    background-color: #faf8d7;
}

.jobWeb .mainBox .tooltip p {
    margin: 0;
}

.jobWeb .mainBox .tooltip button {
    position: absolute;
    top: 8px;
    right: 10px;
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 50%;
    color: #b9a06a;
    font-size: 13px;
    line-height: 1;
    background-color: transparent;
    cursor: pointer;
}

.jobWeb .mainBox .tooltip button:hover {
    color: #8a6b2f;
    background-color: #f2ecc0;
}

.jobWeb .mainBox .comment {
    width: 100%;
}

.jobWeb .mainBox .comment .commentHeader {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
}

.jobWeb .mainBox .comment .commentHeader select {
    min-width: 96px;
    height: 34px;
    padding: 0 10px;
    border: 1px solid #e6e8ea;
    border-radius: 10px;
    outline: none;
    color: #313131;
    font-size: 13px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    cursor: pointer;
}

.jobWeb .mainBox .comment .commentHeader select:disabled {
    color: #b6bcc2;
    cursor: not-allowed;
}

.jobWeb .mainBox .comment .commentHeader .post {
    margin-left: auto;
    height: 36px;
    padding: 0 18px;
    border: none;
    border-radius: 10px;
    color: #1f6b45;
    font-size: 14px;
    background-color: #91f9b9;
    box-shadow: 0 2px 6px rgba(145, 249, 185, 0.6);
    cursor: pointer;
    transition: filter 0.2s;
}

.jobWeb .mainBox .comment .commentHeader .post:hover {
    filter: brightness(0.96);
}

.jobWeb .mainBox .comment .resultInfo {
    display: flex;
    justify-content: space-between;
    margin: 8px 4px;
    color: #8a9096;
    font-size: 13px;
}

.jobWeb .mainBox .comment .commentContent {
    width: 100%;
}

.jobWeb .mainBox .comment .commentContent ul {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.jobWeb .mainBox .comment .commentContent ul li {
    display: flex;
    gap: 14px;
    padding: 16px 18px;
    border-radius: 15px;
    background-color: var(--app-surface);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.2s, transform 0.2s;
}

.jobWeb .mainBox .comment .commentContent ul li:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(145, 249, 185, 0.55);
}

.jobWeb .mainBox .comment .commentContent ul li .commentPic {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: #8a6b2f;
    font-size: 15px;
    font-weight: 600;
    background-color: #f6e2b8;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .commentTop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: #9aa0a6;
    font-size: 12px;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .tag {
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 12px;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .tag.recommend {
    color: #1f7a4d;
    background-color: #e6fbef;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .tag.warning {
    color: #c05621;
    background-color: #fff1e6;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .region {
    padding: 2px 8px;
    border-radius: 6px;
    color: #6b7280;
    background-color: #f3f5f6;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .commentText {
    margin: 0;
    color: #3b4046;
    font-size: 15px;
    line-height: 1.7;
    word-break: break-word;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .commentText:hover {
    color: #2fa96a;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .commentMeta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .author {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-right: 4px;
    color: #8a9096;
    font-size: 12px;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .commentMeta button {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 26px;
    padding: 0 10px;
    border: none;
    border-radius: 6px;
    color: #878585;
    font-size: 12px;
    background-color: #f7f8f8;
    box-shadow: 0 1px 1px #e3e5e7;
    cursor: pointer;
    transition: transform 0.15s, color 0.15s, background-color 0.15s;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .commentMeta button:hover {
    transform: translateY(-1px);
    color: #2fa96a;
    background-color: #f0fbf4;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .commentMeta button.active {
    color: #2fa96a;
    background-color: #e6fbef;
}

.jobWeb .mainBox .comment .commentContent ul li .commentMsg .icon {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.jobWeb .mainBox .comment .wait {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px 0 4px;
    color: #9aa0a6;
    font-size: 13px;
}

.jobWeb .mainBox .comment .wait .spinner {
    width: 26px;
    height: 26px;
    animation: rotate 2s linear infinite;
}

.jobWeb .mainBox .comment .wait .spinner .path {
    fill: none;
    stroke: #c1c3c6;
    stroke-linecap: round;
    stroke-dasharray: 40, 110;
    animation: dash-fixed 1.5s linear infinite;
}

.jobWeb .mainBox .comment .endTip {
    margin: 0;
    padding: 14px 0 0;
    color: #b0b6bb;
    font-size: 13px;
    text-align: center;
}

.jobWeb .postForm {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.jobWeb .postForm .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.jobWeb .postForm .field > label {
    color: #4b5157;
    font-size: 13px;
}

.jobWeb .postForm .regionSelect {
    display: flex;
    gap: 8px;
}

.jobWeb .dialogBtn {
    height: 34px;
    padding: 0 20px;
    border: none;
    border-radius: 8px;
    color: #1f6b45;
    font-size: 14px;
    background-color: #91f9b9;
    cursor: pointer;
}

.jobWeb .dialogBtn.ghost {
    margin-right: 8px;
    color: #5c636a;
    background-color: #f2f4f5;
}

@keyframes rotate {
    to {
        transform: rotate(360deg);
    }
}

@keyframes dash-fixed {
    0% {
        stroke-dashoffset: 0;
    }

    100% {
        stroke-dashoffset: -150;
    }
}

@media (max-width: 768px) {
    .jobWeb {
        margin-left: 64px;
    }

    .jobWeb.sideOpen {
        margin-left: min(84vw, 250px);
    }
}

@media (max-width: 992px) {
    .jobWeb .mainBox {
        width: 94%;
    }

    .jobWeb .mainBox .comment .commentHeader select {
        flex: 1 1 calc(50% - 5px);
        min-width: 0;
    }

    .jobWeb .mainBox .comment .commentHeader .post {
        flex: 1 1 100%;
        margin-left: 0;
    }
}

@media (max-width: 576px) {
    .jobWeb .header .brand {
        font-size: 16px;
    }

    .jobWeb .header .account button {
        padding: 0 12px;
        font-size: 13px;
    }

    .jobWeb .mainBox {
        gap: 12px;
        padding: 14px 0 28px;
    }

    .jobWeb .mainBox .comment .commentContent ul li {
        padding: 12px;
        gap: 10px;
    }

    .jobWeb .mainBox .comment .commentContent ul li .commentPic {
        width: 38px;
        height: 38px;
        font-size: 14px;
    }

    .jobWeb .mainBox .comment .commentContent ul li .commentMsg .commentText {
        font-size: 14px;
    }

    .jobWeb .postForm .regionSelect {
        flex-direction: column;
    }

    .jobWeb .postForm .regionSelect :deep(.el-select) {
        width: 100% !important;
    }
}
</style>
