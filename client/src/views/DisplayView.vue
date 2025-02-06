<script setup>
import { useWebSocketStore } from '../stores/websocket'
import { onMounted, onUnmounted } from 'vue'

const store = useWebSocketStore()

onMounted(() => {
  store.initDisplay()
  store.displaySocket.on('textUpdated', text => {
    // 更新显示逻辑
  })
})

onUnmounted(() => {
  store.displaySocket?.disconnect()
})
</script>

<template>
  <div class="h-screen w-full bg-transparent p-4">
    <!-- 屏幕录制占位 -->
    <div class="w-3/4 h-96 border-2 border-dashed border-gray-400"></div>
    
    <!-- 右上介绍文本 -->
    <div class="absolute top-4 right-4 w-64 bg-black bg-opacity-50 p-4 rounded-lg">
      <p class="text-white">直播间介绍文字</p>
    </div>

    <!-- 打字机区域 -->
    <div class="absolute bottom-4 left-4 bg-black bg-opacity-70 p-4 rounded-lg w-1/2">
      <div class="text-white font-mono text-xl">
        {{ store.typewriterText }}
        <span class="animate-pulse">|</span>
      </div>
    </div>
  </div>
</template>