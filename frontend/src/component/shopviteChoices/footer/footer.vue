<script setup>
const year = new Date().getFullYear()
</script>

<template>
    <div class="chooseFun footer">
        <span class="copy">Copyright © {{ year }} Vue Shop Vite</span>
        <span class="divider" aria-hidden="true"></span>
    </div>
</template>

<style scoped>
.chooseFun {
    grid-column: 1 / -1;
    margin: 14px auto 24px;
    width: 100%;
    min-height: 40px;
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 8px 14px;
    box-sizing: border-box;
    color: #767575;
    font-size: 12px;
    text-align: center;
    border: 1px solid var(--app-border);
    background-color: var(--app-surface);
    border-radius: 8px;
}

.copy {
    flex-shrink: 0;
    font-weight: 600;
    color: #5b6472;
}

.divider {
    width: 1px;
    height: 14px;
    background-color: var(--app-border-strong);
}
</style>
