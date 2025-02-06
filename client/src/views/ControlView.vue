<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useWebSocketStore } from '../stores/websocket'

const store = useWebSocketStore()
const inputText = ref('')

onMounted(() => {
  store.init()
})

const sendUpdate = () => {
  store.socket.emit('textUpdated', inputText.value)
  console.log(store.socket)
}

onUnmounted(() => {
  store.socket?.disconnect()
})
</script>

<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <div class="max-w-2xl mx-auto">
      <textarea 
        v-model="inputText"
        class="w-full h-32 p-2 border rounded mb-4"
        placeholder="输入要显示的文字..."
      ></textarea>
      <button 
        @click="sendUpdate"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        更新文字
      </button>
    </div>
  </div>
</template>