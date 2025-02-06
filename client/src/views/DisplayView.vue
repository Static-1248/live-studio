<script setup>
import { useWebSocketStore } from '../stores/websocket'
import { onMounted, onUnmounted } from 'vue'

const store = useWebSocketStore()

onMounted(() => {
  store.init()
  store.socket.on('textUpdated', text => {
    // 更新显示逻辑
  })
})

onUnmounted(() => {
  store.socket?.disconnect()
})
</script>

<template>
  <div class="h-screen w-full bg-transparent p-4 flex flex-col">
    <!-- 上部区域 -->
    <div class="flex flex-1">
      <!-- 屏幕录制占位 -->
      <div class="flex-1 aspect-w-16 aspect-h-9 border-2 border-dashed border-gray-400"></div>
      
      <!-- 直播间介绍文本 -->
      <div class="w-1/4 bg-black bg-opacity-50 p-4 rounded-lg ml-4">
        <p class="text-white">直播间介绍文字</p>
      </div>
    </div>

    <!-- 下部打字机区域 -->
    <div class="bg-black bg-opacity-70 p-4 rounded-lg mt-4 w-full">
      <div class="text-white font-mono text-xl">
        {{ store.typewriterText }}
        <span class="animate-pulse">|</span>
      </div>
    </div>
  </div>
</template>