<script setup>
import Footer from '../footer/footer.vue'

const tiles = [
    { title: '销售统计', desc: '今日销售额 ￥12,860', color: 'rgb(90, 208, 244)' },
    { title: '订单中心', desc: '待处理订单 128 笔', color: 'rgb(149, 222, 100)' },
    { title: '商品管理', desc: '在售商品 1,204 件', color: 'rgb(255, 192, 105)' },
    { title: '会员增长', desc: '本周新增 356 人', color: 'rgb(179, 127, 235)' },
    { title: '流量分析', desc: '访问量较昨日上升 12.5%', color: 'rgb(255, 133, 192)' },
    { title: '系统状态', desc: '所有服务运行正常', color: 'rgb(105, 192, 255)' },
]
</script>

<template>
    <div class="content">
        <div v-for="tile in tiles" :key="tile.title" class="tile" :style="{ backgroundColor: tile.color }">
            <h3>{{ tile.title }}</h3>
            <p>{{ tile.desc }}</p>
        </div>
        <Footer />
    </div>
</template>

<style scoped>
.content {
    box-sizing: border-box;
    padding: 18px;
    width: 100%;
    height: 88%;
    overflow-y: auto;
    background-color: #f3f5f7;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-auto-rows: minmax(120px, 1fr);
    gap: 16px;
}

.tile {
    padding: 18px;
    border-radius: 10px;
    color: #fff;
    box-shadow: 0 2px 8px rgba(47, 58, 74, 0.08);
    transition: transform 0.2s ease;
    overflow: hidden;
}

.tile:hover {
    transform: translateY(-4px);
}

.tile h3 {
    margin: 0 0 8px;
    font-size: 18px;
}

.tile p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
}

@media (max-width: 992px) {
    .content {
        height: auto;
        min-height: 60vh;
    }
}

@media (max-width: 576px) {
    .content {
        padding: 12px;
        gap: 12px;
    }

    .tile {
        padding: 16px;
    }
}
</style>
