<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import Footer from '@/component/shopviteChoices/footer/footer.vue'

const themes = [
    { name: '暮色森林', background: 'linear-gradient(135deg, #1f4037 0%, #2f7a5f 55%, #99f2c8 100%)' },
    { name: '深海蓝调', background: 'linear-gradient(135deg, #0f2027 0%, #203a43 55%, #2c5364 100%)' },
    { name: '紫霞夜色', background: 'linear-gradient(135deg, #41295a 0%, #5b2a86 55%, #2f0743 100%)' },
]

const tracks = [
    { title: 'Late Night Drive', artist: 'Ambient Lab', duration: 222, gradient: 'linear-gradient(135deg, #ffd3a5, #fd6585)' },
    { title: 'Glass Garden', artist: 'Mellow Waves', duration: 198, gradient: 'linear-gradient(135deg, #a8edea, #4facfe)' },
    { title: 'Soft Focus', artist: 'Night Shift', duration: 246, gradient: 'linear-gradient(135deg, #c3cfe2, #6a85b6)' },
    { title: 'Aurora Line', artist: 'Polar Lights', duration: 214, gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)' },
]

const activeTheme = ref(0)
const currentIndex = ref(0)
const playing = ref(false)
const progress = ref(36)

const currentTrack = computed(() => tracks[currentIndex.value])

const pad = (num) => String(num).padStart(2, '0')

function formatTime(percent) {
    const seconds = Math.round((currentTrack.value.duration * percent) / 100)
    return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}

function formatDuration(seconds) {
    return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}

function selectTrack(index) {
    currentIndex.value = index
    progress.value = 0
    playing.value = true
}

function prev() {
    selectTrack((currentIndex.value - 1 + tracks.length) % tracks.length)
}

function next() {
    selectTrack((currentIndex.value + 1) % tracks.length)
}

const playTimer = window.setInterval(() => {
    if (!playing.value) return
    progress.value = progress.value >= 100 ? 0 : Math.min(100, progress.value + 0.4)
}, 1000)

onBeforeUnmount(() => {
    window.clearInterval(playTimer)
})
</script>

<template>
    <div class="page" :style="{ background: themes[activeTheme].background }">
        <header class="pageHeader">
            <div>
                <h2>液态玻璃</h2>
                <p>用半透明模糊与高光描边营造层次感</p>
            </div>
            <div class="themeList">
                <button
                    v-for="(theme, index) in themes"
                    :key="theme.name"
                    :class="{ active: activeTheme === index }"
                    @click="activeTheme = index"
                >
                    {{ theme.name }}
                </button>
            </div>
        </header>

        <div class="layout">
            <section class="player glass">
                <div class="cover" :style="{ background: currentTrack.gradient }">
                    <span>PLAY</span>
                </div>
                <h3>{{ currentTrack.title }}</h3>
                <p>{{ currentTrack.artist }}</p>
                <el-slider v-model="progress" :show-tooltip="false" size="small" />
                <div class="timeRow">
                    <span>{{ formatTime(progress) }}</span>
                    <span>{{ formatDuration(currentTrack.duration) }}</span>
                </div>
                <div class="controls">
                    <button @click="prev">上一首</button>
                    <button class="play" @click="playing = !playing">{{ playing ? '暂停' : '播放' }}</button>
                    <button @click="next">下一首</button>
                </div>
            </section>

            <div class="side">
                <div class="statGrid">
                    <div class="stat glass">
                        <span>本月聆听</span>
                        <strong>32h</strong>
                    </div>
                    <div class="stat glass">
                        <span>收藏歌曲</span>
                        <strong>128</strong>
                    </div>
                    <div class="stat glass">
                        <span>连续打卡</span>
                        <strong>7 天</strong>
                    </div>
                </div>
                <section class="playlist glass">
                    <div class="playlistHeader">
                        <h3>播放列表</h3>
                        <span>{{ tracks.length }} 首</span>
                    </div>
                    <ul>
                        <li
                            v-for="(track, index) in tracks"
                            :key="track.title"
                            :class="{ active: currentIndex === index }"
                            @click="selectTrack(index)"
                        >
                            <span class="index">{{ index + 1 }}</span>
                            <div class="trackInfo">
                                <span class="name">{{ track.title }}</span>
                                <span class="artist">{{ track.artist }}</span>
                            </div>
                            <span class="duration">{{ formatDuration(track.duration) }}</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
        <Footer />
    </div>
</template>

<style scoped>
.page {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 18px clamp(12px, 2vw, 24px);
    box-sizing: border-box;
    color: #fff;
    transition: background 0.6s ease;
}

.pageHeader {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 20px;
}

.pageHeader h2 {
    margin: 0;
    font-size: 20px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.pageHeader p {
    margin: 4px 0 0;
    color: rgba(255, 255, 255, 0.75);
    font-size: 13px;
}

.pageHeader .themeList {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.pageHeader .themeList button {
    height: 32px;
    padding: 0 16px;
    border: none;
    border-radius: 16px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 13px;
    background: transparent;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22), 0 8px 20px rgba(0, 0, 0, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.35);
    cursor: pointer;
    transition: color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.pageHeader .themeList button:hover {
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.26), 0 12px 26px rgba(0, 0, 0, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.pageHeader .themeList button.active {
    color: #fff;
    font-weight: 500;
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
}

.glass {
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.16);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
}

.layout {
    display: grid;
    grid-template-columns: minmax(280px, 1fr) minmax(280px, 1.2fr);
    gap: 20px;
    max-width: 1000px;
}

.player {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 28px 24px;
}

.player .cover {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180px;
    height: 180px;
    border-radius: 18px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28);
}

.player .cover span {
    color: rgba(255, 255, 255, 0.9);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 6px;
}

.player h3 {
    margin: 20px 0 6px;
    font-size: 18px;
    font-weight: 600;
}

.player p {
    margin: 0 0 18px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 13px;
}

.player :deep(.el-slider) {
    width: 100%;
}

.player :deep(.el-slider__runway) {
    background-color: rgba(255, 255, 255, 0.28);
}

.player :deep(.el-slider__bar) {
    background-color: var(--app-surface);
}

.player :deep(.el-slider__button) {
    border-color: #fff;
    background-color: var(--app-surface);
}

.player .timeRow {
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: rgba(255, 255, 255, 0.75);
    font-size: 12px;
}

.player .controls {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 20px;
}

.player .controls button {
    height: 36px;
    padding: 0 18px;
    border: none;
    border-radius: 18px;
    color: #fff;
    font-size: 13px;
    background: transparent;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22), 0 8px 20px rgba(0, 0, 0, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.35);
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.2s;
}

.player .controls button.play {
    font-weight: 600;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.28), 0 12px 26px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.player .controls button:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.26), 0 12px 26px rgba(0, 0, 0, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.player .controls button:active {
    transform: translateY(0);
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
}

.side {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.statGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.stat {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 18px;
}

.stat span {
    color: rgba(255, 255, 255, 0.72);
    font-size: 12px;
}

.stat strong {
    font-size: 22px;
    font-weight: 600;
}

.playlist {
    flex: 1;
    padding: 18px 20px;
}

.playlistHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
}

.playlistHeader h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
}

.playlistHeader span {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
}

.playlist ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

.playlist li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s;
}

.playlist li:hover,
.playlist li.active {
    background: rgba(255, 255, 255, 0.2);
}

.playlist .index {
    width: 18px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 12px;
    text-align: center;
}

.playlist .trackInfo {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.playlist .name {
    overflow: hidden;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.playlist .artist {
    color: rgba(255, 255, 255, 0.65);
    font-size: 12px;
}

.playlist .duration {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
}

@media (max-width: 992px) {
    .layout {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 576px) {
    .player .cover {
        width: 140px;
        height: 140px;
    }

    .statGrid {
        gap: 12px;
    }

    .stat {
        padding: 14px;
    }

    .stat strong {
        font-size: 18px;
    }
}
</style>
