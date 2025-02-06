<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useWebSocketStore } from "../stores/websocket";

const store = useWebSocketStore();
const typewriterText = ref("");
const isFadingOut = ref(false);

onMounted(() => {
  store.init();
  store.socket.on("textUpdated", (text) => {
    isFadingOut.value = true;
    setTimeout(() => {
      typewriterText.value = "";
      isFadingOut.value = false;
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          typewriterText.value += text[index];
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
    }, 500);
  });
});

onUnmounted(() => {
  store.socket?.disconnect();
});
</script>

<template>
  <div class="h-screen w-full bg-transparent p-4 flex flex-col">
    <!-- 上部区域 -->
    <div class="flex flex-1 flex-row">
      <!-- 屏幕录制占位 -->
      <div
        class="flex-1 border-2 border-dashed border-gray-400"
        style="aspect-ratio: 16 / 9"
      ></div>

      <!-- 直播间介绍文本 -->
      <div class="w-1/4 bg-black bg-opacity-50 p-4 rounded-lg ml-4">
        <p class="text-white">直播间介绍文字</p>
      </div>
    </div>

    <!-- 下部打字机区域 -->
    <div
      class="bg-black bg-opacity-70 p-4 rounded-lg mt-4 w-full"
      style="height: 150px"
    >
      <div class="text-white font-mono text-xl" style="white-space: pre-wrap">
        <div class="typewriter">
            <span :class="{ 'fade-out': isFadingOut }">
			  {{ 
				typewriterText 
			  }}<span class="animate-pulse">_</span>
			</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-out {
  animation: fadeOut 0.5s forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}

.typewriter span {
  display: inline-block;
  opacity: 1;
}
</style>
