<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { useWebSocketStore } from "../stores/websocket";
// import BackgroundEffect3D from "../components/BackgroundEffect3D.vue";
import BackgroundEffect1 from "../components/BackgroundEffect1.vue";

const store = useWebSocketStore();
const ttyText = ref(localStorage.getItem("display_ttyText") || "");
const isTtyFading = ref(false);
const bannerText = ref(localStorage.getItem("display_bannerText") || "欢迎来到直播间");
const introText = ref(localStorage.getItem("display_introText") || "");

// 分页相关
const pages = ref([]);
const currentPage = ref(0);
const isPageFading = ref(false);
const pagingTimeout = ref(null);
const pagingConfig = {
  interval: 10000,  // 基础间隔10秒
  maxSpeed: 1000,   // 最大滚动速度1000px/秒
};
const scrollDuration = ref(1);
const needScroll = ref(false);

// 横幅文字宽度和容器宽度
const bannerWidth = ref(0);
const containerWidth = ref(0);

function updatePages(text) {
  // “---”独占一行，表示分页
  const lines = text.split('\n');
  let newPages = [];
  let newPage = "";
  for (let line of lines) {
    if (line == "---") {
      newPages.push(newPage);
      newPage = "";
    } else {
      newPage += line + "\n";
    }
  }
  newPages.push(newPage.replace(/\n$/, ""))
  pages.value = newPages;
  currentPage.value = 0;
}

function updateWidth() {
  const bannerElement = document.querySelector(".banner-text");
  const containerElement = document.querySelector(".banner-container");
  if (bannerElement && containerElement) {
	bannerWidth.value = bannerElement.offsetWidth;
	containerWidth.value = containerElement.offsetWidth;
  }
}

onMounted(() => {
  document.title = "web直播间";
  store.init();

  updateWidth();

  // 打字机文字
  store.socket.on("ttyUpdated", (text) => {
    isTtyFading.value = true;
    setTimeout(() => {
      ttyText.value = "";
      isTtyFading.value = false;
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

  // 横幅文字
  store.socket.on("bannerUpdated", (text) => {
	// \n 会导致文字换行，这里替换为4空格(类似缩进)
    bannerText.value = text;
	updateWidth();
    localStorage.setItem("display_bannerText", text);
  });

  // 介绍文字
  updatePages(introText.value);
  store.socket.on("introUpdated", (description) => {
    introText.value = description;
    localStorage.setItem("display_introText", introText.value);
    updatePages(description);
  });

  // 滚动参数，每次翻新页时计算
  const getPagingParam = () => {
    const scrollContainer = document.querySelector(".scroll-container");

    // default
    if (!scrollContainer) return { needScroll: false, interval: pagingConfig.interval };

    const contentHeight = scrollContainer.scrollHeight;
    const containerHeight = scrollContainer.clientHeight;
    const needScroll = contentHeight > containerHeight;
    let scrollDuration = 0;

    if (needScroll) {
      const scrollDistance = contentHeight - containerHeight;
      const minDuration = scrollDistance / pagingConfig.maxSpeed * 1000; // 毫秒
      scrollDuration = Math.max(minDuration, pagingConfig.interval);
    }
    return {
      needScroll,
      interval: Math.max(scrollDuration, pagingConfig.interval),
    }
  };

  // 时序图：[C] 淡入 [A] 显示+滚动 [B] 淡出
  // 主函数执行于[A]时刻
  const pagingFn = () => {														// [A]
    const { needScroll: _needScroll, interval } = getPagingParam();				// 计算新的滚动参数
    const needFade = pages.value.length > 1 || needScroll;
    scrollDuration.value = interval / 1000;
    needScroll.value = _needScroll;

    pagingTimeout.value = setTimeout(() => {									// [B]
      if (needFade) isPageFading.value = true; 								// 淡出
      pagingTimeout.value = setTimeout(() => {								// [C]
        currentPage.value = (currentPage.value + 1) % pages.value.length;  	// 翻页
        if (needFade) isPageFading.value = false; 							// 淡入
		needScroll.value = false;
        setTimeout(pagingFn, 500);											// 递归
      }, 500);
    }, interval);
  };
  pagingFn();
});

onUnmounted(() => {
  store.socket?.disconnect();
  clearTimeout(pagingTimeout.value);
});

// 动态更新 CSS 变量
watchEffect(() => {
  document.documentElement.style.setProperty('--banner-width', `${bannerWidth.value}px`);
  document.documentElement.style.setProperty('--container-width', `${containerWidth.value}px`);
});
</script>

<template>
  <div class="h-screen w-full flex flex-row">
	<!-- Starfield background Effect -->
    <BackgroundEffect1 /> 
    <!-- 左区 -->
    <div class="flex flex-1 flex-col relative">
      <!-- 顶部横幅（占位） -->
      <div class="w-full banner-container flex items-center overflow-x-hidden" style="height: 60px; background-color: rgba(30, 41, 57, 0.8);">
        <span class="banner-text text-white text-3xl font-bold modern-font whitespace-pre" 
             :style="{ animationDuration: `${bannerText.length * 0.5}s` }">
          {{ bannerText.replace(/\n/g, "    ") }}
	  	</span>
      </div>

      <!-- 屏幕录制占位 -->
      <div class="w-full" style="padding-top: 56.25%; position: relative;">
        <div class="custom-dashed-border absolute inset-0" style="background-color: rgba(255, 255, 255, 0.05);"></div>
      </div>

      <!-- 底部打字机 -->
      <div class="custom-bg rounded-lg flex-1 flex items-center pl-5">
        <div class="text-white font-mono text-4xl modern-font tty whitespace-pre-wrap">
            <span :class="{ 'fade-out': isTtyFading }">
              <span class="pr-4" style="font-family: Consolas; color: #85D663">></span>{{ ttyText }}<span class="animate-pulse">_</span>
            </span>
        </div>
      </div>
    </div>

    <!-- 右区 -->
    <div class="flex flex-col" style="width: 261px;">
      <!-- 介绍区 -->
      <div class="custom-bg p-4 rounded-lg mb-4" style="height: 340px;">
        <transition name="fade">
          <div v-if="!isPageFading" 
               class="scroll-container h-full">
            <p class="text-white text-s modern-font" 
			   :class="{ 'need-scroll': needScroll }"
			   style="white-space: pre-wrap;"
               :style="{ animationDuration: `${scrollDuration}s` }">
              {{ pages[currentPage] || introText }}
            </p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap');

:root {
  --banner-width: 0px;
  --container-width: 0px;
}

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

@keyframes scroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(calc(-100% + 340px - 2rem)); /* 340px容器高度 - 2rem padding */
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tty span {
  display: inline-block;
  opacity: 1;
}

.custom-dashed-border {
  border: 2px dashed #4B5563;
}

.custom-bg {
  background-color: rgba(30, 41, 57, 0.5);
}

.scroll-container {
  height: calc(340px - 2rem); /* 总高度340px - padding 2rem */
  overflow: hidden;
}
.scroll-container p.need-scroll {
  animation: scroll linear 1 forwards;
}

.banner-text {
  animation: banner-scroll linear infinite;
}

@keyframes banner-scroll {
  from { transform: translateX(var(--container-width)); }
  to { transform: translateX(calc(-1 * var(--banner-width))); }
}

</style>
