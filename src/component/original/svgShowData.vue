<script setup>
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
const list = ref([
    {
        title: '访问量',
        content: '今日访问趋势',
        num: 46076,
        name: '总访问量',
        increase: '较昨日增长12.5%',
        userNum: '活跃用户2.3k'
    },
    {
        title: '授权数',
        content: '授权统计',
        num: 5614,
        name: '总授权数',
        increase: '较昨日增长8.3%',
        userNum: '今日新增156'
    },
    {
        title: '用户活跃度',
        content: '用户活跃统计',
        num: 16319,
        name: '活跃用户',
        increase: '较昨日增长15.2%',
        userNum: '在线时长2.5h'
    },
    {
        title: '系统性能',
        content: '性能监控',
        num: '98.5%',
        name: '系统可用性',
        increase: '运行正常',
        userNum: '响应时间120ms'
    }
])
function drawRect(data) {
    const svgDiv = d3.select('.svg_0')
    console.log(svgDiv)
    svgDiv.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 100 100')
    const width=svgDiv.node().clientWidth-20
    const height=svgDiv.node().clientHeight-20
    
        const XScale = d3.scaleLinear()
            .domain([0, data.chart.num])
            .range([0, width])
        const yScale = d3.scaleLinear()
            .domain([0, data.chart.yNum])
            .range([0, height])
        const xAxis= d3.axisBottom(XScale).tickSize(5)
        const yAxis= d3.axisLeft(yScale).tickSize(5)
        svg.append('g')
            .attr('transform', `translate(10,${height-10})`)
            .call(xAxis)
        svg.append('g')
            .attr('transform', `translate(10,10)`)
            .call(yAxis)
        svg.append('rect')
            .data(data.chart)
            .attr('x', 10)
            .attr('y', height-10)
            .attr('width', 10)
            .attr('height', d=>yScale(d.yNum))
            .attr('fill', 'wheelblue')
    } 
    function drawLine(data) {
        const svgDiv = d3.select('.svg_1')
    console.log(svgDiv)
    svgDiv.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 100 100')
    const width=svgDiv.node().clientWidth-20
    const height=svgDiv.node().clientHeight-20
        const XScale = d3.scaleLinear()
            .domain([0, data.chart.num])
            .range([0, width])
        const YScale = d3.scaleLinear()
            .domain([0, data.chart.yNum])
            .range([0, height])
        const xAxis= d3.axisBottom(XScale).tickSize(5)
        const yAxis= d3.axisLeft(YScale).tickSize(5)
        svg.append('g')
            .attr('transform', `translate(10,${height-10})`)
            .call(xAxis)
        svg.append('g')
            .attr('transform', `translate(10,10)`)
            .call(yAxis)
        svg.append('line')
            .data(data.chart)
            .attr('x1', 10)
            .attr('y1', height-10)
            .attr('x2', d=>XScale(d.num))
            .attr('y2', d=>YScale(d.yNum))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
    }    
 onMounted(() => {
    // drawLine()
    // drawRect()
      
})
</script>
<template>
    <div class="svgShowData">
        <ul>
            <li>
                <div class="title">{{ list[0].title }}</div>
                <div class="content">
                    <div class="left">{{ list[0].content }}</div>
                    <div class="right">
                        <div class="num">{{ list[0].num }}</div>
                        <div class="name">{{ list[0].name }}</div>
                    </div>
                </div>
                <div class="svg_0"></div>
                <div class="bottom">
                    <div class="left">{{ list[0].increase }}</div>
                    <div class="right">{{ list[0].userNum }}</div>
                </div>
            </li>
            <li>
                <div class="title">{{ list[1].title }}</div>
                <div class="content">
                    <div class="left">{{ list[1].content }}</div>
                    <div class="right">
                        <div class="num">{{ list[1].num }}</div>
                        <div class="name">{{ list[1].name }}</div>
                    </div>
                </div>
                <div class="svg_1"></div>
                <div class="bottom">
                    <div class="left">{{ list[1].increase }}</div>
                    <div class="right">{{ list[1].userNum }}</div>
                </div>
            </li>
            <li>
                <div class="title">{{ list[2].title }}</div>
                <div class="content">
                    <div class="left">{{ list[2].content }}</div>
                    <div class="right">
                        <div class="num">{{ list[2].num }}</div>
                        <div class="name">{{ list[2].name }}</div>
                    </div>
                </div>
                <div class="svg_2"></div>
                <div class="bottom">
                    <div class="left">{{ list[2].increase }}</div>
                    <div class="right">{{ list[2].userNum }}</div>
                </div>
            </li>
            <li>
                <div class="title">{{ list[3].title }}</div>
                <div class="content">
                    <div class="left">{{ list[3].content }}</div>
                    <div class="right">
                        <div class="num">{{ list[3].num }}</div>
                        <div class="name">{{ list[3].name }}</div>
                    </div>
                </div>
                <div class="svg_3"></div>
                <div class="bottom">
                    <div class="left">{{ list[3].increase }}</div>
                    <div class="right">{{ list[3].userNum }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>
<style scoped>
.svgShowData {
    margin-top: 1%;
    height: 30%;
}

.svgShowData ul {
    margin: 0;
    padding: 0;
    list-style: none;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.svgShowData ul li {
    margin-right: 2%;
    padding: 1%;
    flex: 1;
    /* border: 1px solid #000; */
    border-radius: 10px;
    background-color: #fff;
    color-scheme:light ;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 
                0 4px 10px rgba(0, 0, 0, 0.1);
}

.svgShowData ul li:last-child {
    margin-right: 0;
}

.svgShowData ul li .title {
    height: 15%;
    font-size: 16px;
    color: #3c3c3c;
    border-bottom: 1px solid #c4c3c3;
}

.svgShowData ul li .content {
    display: flex;
    flex-direction: row;
    height: 25%;
    line-height: 2.5;
    border-bottom: 1px solid #d8d5d5;
    position: relative;
}

.svgShowData ul li .content .left {
    padding-top: 1%;
    float: left;
    width: 50%;
    font-size: 18px;
}

.svgShowData ul li .content .right {
    position: absolute;
    right: 0%;
    top: -20%;
    height: 100%;
    font-size: 24px;
}

.svgShowData ul li .content .right .num {
    padding-bottom: 10px;
    height: 50%;
}

.svgShowData ul li .content .right .name {
    height: 30%;
    color: #736d6d;
    font-size: 12px;
    text-align: right;
}

.svgShowData ul li [class*="svg_"] {
    height: 55%;
}

.svgShowData ul li .bottom {
    height: 5%;
    color: #9b9898;
    font-size: 12px;
}

.svgShowData ul li .bottom .left {
    float: left;
}

.svgShowData ul li .bottom .right {
    float: right;
}
</style>