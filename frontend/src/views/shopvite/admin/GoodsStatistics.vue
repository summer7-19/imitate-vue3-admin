<script setup>
import { computed } from 'vue'
import { Histogram } from '@element-plus/icons-vue'
import { useAdminStore } from '@/store/modules/admin'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const admin = useAdminStore()

const rows = computed(() =>
  admin.goods
    .map((item) => ({
      ...item,
      amount: item.price * item.sales,
    }))
    .sort((a, b) => b.amount - a.amount)
)

const totalSales = computed(() => admin.goods.reduce((sum, item) => sum + item.sales, 0))
const totalAmount = computed(() => admin.goods.reduce((sum, item) => sum + item.price * item.sales, 0))

function formatAmount(value) {
  return `¥ ${Number(value).toLocaleString('zh-CN')}`
}
</script>

<template>
  <div class="adminPage tablePage">
    <el-alert
      class="adminHint"
      type="info"
      show-icon
      :closable="false"
      title="统计模块暂未开放"
      description="当前页面仅接入商品基础表格，趋势分析、渠道对比与报表导出将在后续版本开放。"
    />

    <section class="adminCard tableCard">
      <div class="statsSummary">
        <div class="summaryItem">
          <span class="summaryIcon"><el-icon><Histogram /></el-icon></span>
          <span class="summaryText">
            <span>在库商品</span>
            <strong>{{ admin.goods.length }}</strong>
          </span>
        </div>
        <div class="summaryItem">
          <span class="summaryText">
            <span>累计销量</span>
            <strong>{{ totalSales }}</strong>
          </span>
        </div>
        <div class="summaryItem">
          <span class="summaryText">
            <span>累计销售额</span>
            <strong>{{ formatAmount(totalAmount) }}</strong>
          </span>
        </div>
      </div>

      <div class="tableWrap">
        <el-table
          :data="rows"
          row-key="id"
          height="100%"
          default-sort="{ prop: 'amount', order: 'descending' }"
        >
          <el-table-column label="排名" width="70" align="center">
            <template #default="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="name" label="商品名称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="category" label="商品分类" min-width="100" />
          <el-table-column prop="sales" label="销量" width="100" align="center" sortable />
          <el-table-column label="销售额" width="140" align="center" prop="amount" sortable>
            <template #default="{ row }">
              <span class="adminPrice">{{ formatAmount(row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="100" align="center" sortable />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                size="small"
                effect="plain"
                :type="row.status === '在售' ? 'success' : row.status === '待上架' ? 'warning' : 'info'"
              >
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="暂无商品数据" :image-size="72" />
          </template>
        </el-table>
      </div>
    </section>
  </div>
  <Footer />
</template>

<style scoped>
.statsSummary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.adminHint {
  flex-shrink: 0;
}

.summaryItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--app-border-light);
  border-radius: 10px;
  background-color: var(--app-surface-plain);
}

.summaryIcon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  color: var(--app-primary);
  font-size: 17px;
  border-radius: 9px;
  background-color: var(--app-primary-soft);
}

.summaryText {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.summaryText span {
  color: var(--app-text-soft);
  font-size: 11px;
}

.summaryText strong {
  color: var(--app-text);
  font-size: 18px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
</style>
