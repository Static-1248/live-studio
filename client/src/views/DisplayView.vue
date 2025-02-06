<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useWebSocketStore } from "../stores/websocket";
import BackgroundEffect from "../components/BackgroundEffect.vue";

const store = useWebSocketStore();
const ttyText = ref(localStorage.getItem("display_ttyText") || "");
const introText = ref(localStorage.getItem("display_introText") || "");
const isFadingOut = ref(false);

onMounted(() => {
  document.title = "web直播间";
  store.init();
  store.socket.on("ttyUpdated", (text) => {
    isFadingOut.value = true;
    setTimeout(() => {
      ttyText.value = "";
      isFadingOut.value = false;
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          ttyText.value += text[index];
          index++;
        } else {
          clearInterval(interval);
          localStorage.setItem("display_ttyText", ttyText.value);
        }
      }, 50);
    }, 500);
  });

  store.socket.on("introUpdated", (description) => {
    introText.value = description;
    localStorage.setItem("display_introText", introText.value);
  });
});

onUnmounted(() => {
  store.socket?.disconnect();
});
</script>

<template>
  <div class="h-screen w-full p-4 flex flex-col">
    <BackgroundEffect /> <!-- Starfield background Effect -->
    <!-- 上部区域 -->
    <div class="flex flex-1 flex-row">
      <!-- 屏幕录制占位 -->
      <div
        class="flex-1 border-2 border-dashed border-gray-600" 
        style="aspect-ratio: 16 / 9; background-color: rgba(255, 255, 255, 0.05);"
      ></div>

      <!-- 直播间介绍文本 -->
      <div class="w-1/1 bg-gray-800/50 p-4 rounded-lg ml-4">
        <p class="text-white text-2xl modern-font" style="white-space: pre-wrap;">{{ introText }}</p>
      </div>
    </div>

    <!-- 下部打字机区域 -->
    <div
      class="bg-gray-800/50 p-4 rounded-lg mt-4 w-full"
      style="height: 250px"
    >
      <div class="text-white font-mono text-4xl modern-font" style="white-space: pre-wrap">
        <div class="tty">
            <span :class="{ 'fade-out': isFadingOut }">
              {{ 
                ttyText 
              }}<span class="animate-pulse">_</span>
            </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap');

.modern-font {
  font-family: 'Noto Sans SC', sans-serif;
}

.fade-out {
  animation: fadeOut 0.5s forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}

.tty span {
  display: inline-block;
  opacity: 1;
}
</style>
