<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useWebSocketStore } from '../stores/websocket'
import { PaperAirplaneIcon, BookmarkSquareIcon, PlusIcon, XMarkIcon, ArrowUpIcon, CheckIcon } from '@heroicons/vue/24/solid'

const store = useWebSocketStore()
const ttyText = ref('')
const introText = ref('')

// Add history arrays and active index
const ttyHistory = ref([])
const introHistory = ref([])
const activeTtyIndex = ref(null)
const activeIntroIndex = ref(null)

const showTtySavedMessage = ref(false)
const showIntroSavedMessage = ref(false)

const loadFromLocalStorage = () => {
  const savedTtyHistory = JSON.parse(localStorage.getItem('control_ttyHistory') || '[]')
  const savedIntroHistory = JSON.parse(localStorage.getItem('control_introHistory') || '[]')
  const savedActiveTtyIndex = JSON.parse(localStorage.getItem('control_activeTtyIndex'))
  const savedActiveIntroIndex = JSON.parse(localStorage.getItem('control_activeIntroIndex'))

  if (savedTtyHistory.length) {
    ttyHistory.value = savedTtyHistory
    activeTtyIndex.value = savedActiveTtyIndex
    ttyText.value = ttyHistory.value[activeTtyIndex.value]?.content || ''
  } else {
    const initTtyRecord = { content: '', timestamp: new Date() }
    ttyHistory.value.push(initTtyRecord)
    activeTtyIndex.value = 0
    ttyText.value = initTtyRecord.content
  }

  if (savedIntroHistory.length) {
    introHistory.value = savedIntroHistory
    activeIntroIndex.value = savedActiveIntroIndex
    introText.value = introHistory.value[activeIntroIndex.value]?.content || ''
  } else {
    const initIntroRecord = { content: '', timestamp: new Date() }
    introHistory.value.push(initIntroRecord)
    activeIntroIndex.value = 0
    introText.value = initIntroRecord.content
  }
}

const saveToLocalStorage = () => {
  localStorage.setItem('control_ttyHistory', JSON.stringify(ttyHistory.value))
  localStorage.setItem('control_introHistory', JSON.stringify(introHistory.value))
  localStorage.setItem('control_activeTtyIndex', JSON.stringify(activeTtyIndex.value))
  localStorage.setItem('control_activeIntroIndex', JSON.stringify(activeIntroIndex.value))
}

onMounted(() => {
  store.init()
  loadFromLocalStorage()
  // 启动时发送一次
  sendTtyUpdate()
  sendIntroUpdate()
  window.addEventListener('keydown', handleSave)
})

onUnmounted(() => {
  store.socket?.disconnect()
  window.removeEventListener('keydown', handleSave)
})

watch([ttyHistory, introHistory, activeTtyIndex, activeIntroIndex], saveToLocalStorage, { deep: true })

const sendTtyUpdate = () => {
  if (activeTtyIndex.value !== null) {
    ttyHistory.value[activeTtyIndex.value].content = ttyText.value
  }
  store.socket.emit('ttyUpdated', ttyText.value)
}

const sendIntroUpdate = () => {
  if (activeIntroIndex.value !== null) {
    introHistory.value[activeIntroIndex.value].content = introText.value
  }
  store.socket.emit('introUpdated', introText.value)
}

const newTtyRecord = () => {
  const newRecord = { content: '', timestamp: new Date() }
  ttyHistory.value.unshift(newRecord)
  activeTtyIndex.value = 0
  ttyText.value = ''
}

const saveTtyRecord = () => {
  if (activeTtyIndex.value !== null) {
    ttyHistory.value[activeTtyIndex.value].content = ttyText.value
    showTtySavedMessage.value = true
    setTimeout(() => {
      showTtySavedMessage.value = false
    }, 2000)
  }
}

const newIntroRecord = () => {
  const newRecord = { content: '', timestamp: new Date() }
  introHistory.value.unshift(newRecord)
  activeIntroIndex.value = 0
  introText.value = ''
}

const saveIntroRecord = () => {
  if (activeIntroIndex.value !== null) {
    introHistory.value[activeIntroIndex.value].content = introText.value
    showIntroSavedMessage.value = true
    setTimeout(() => {
      showIntroSavedMessage.value = false
    }, 2000)
  }
}

const setActiveTtyRecord = (index) => {
  activeTtyIndex.value = index
  ttyText.value = ttyHistory.value[index].content
}

const setActiveIntroRecord = (index) => {
  activeIntroIndex.value = index
  introText.value = introHistory.value[index].content
}

const deleteTtyRecord = (index) => {
  ttyHistory.value.splice(index, 1)
  if (ttyHistory.value.length === 0) {
    const initTtyRecord = { content: '', timestamp: new Date() }
    ttyHistory.value.push(initTtyRecord)
    activeTtyIndex.value = 0
    ttyText.value = initTtyRecord.content
  } else if (activeTtyIndex.value === index) {
    if (index < ttyHistory.value.length) {
      activeTtyIndex.value = index
    } else {
      activeTtyIndex.value = ttyHistory.value.length - 1
    }
    ttyText.value = ttyHistory.value[activeTtyIndex.value].content
  }
}

const deleteIntroRecord = (index) => {
  introHistory.value.splice(index, 1)
  if (introHistory.value.length === 0) {
    const initIntroRecord = { content: '', timestamp: new Date() }
    introHistory.value.push(initIntroRecord)
    activeIntroIndex.value = 0
    introText.value = initIntroRecord.content
  } else if (activeIntroIndex.value === index) {
    if (index < introHistory.value.length) {
      activeIntroIndex.value = index
    } else {
      activeIntroIndex.value = introHistory.value.length - 1
    }
    introText.value = introHistory.value[activeIntroIndex.value].content
  }
}

const moveTtyRecordToTop = (index) => {
  const [record] = ttyHistory.value.splice(index, 1)
  ttyHistory.value.unshift(record)
  if (activeTtyIndex.value === index) {
    activeTtyIndex.value = 0
  } else if (activeTtyIndex.value < index) {
    activeTtyIndex.value += 1
  }
}

const moveIntroRecordToTop = (index) => {
  const [record] = introHistory.value.splice(index, 1)
  introHistory.value.unshift(record)
  if (activeIntroIndex.value === index) {
    activeIntroIndex.value = 0
  } else if (activeIntroIndex.value < index) {
    activeIntroIndex.value += 1
  }
}

const handleSave = (event) => {
  if (event.ctrlKey && event.key === 's') {
    console.log('ctrl+s')
    event.preventDefault()
    if (document.activeElement === document.querySelector('.tty-container textarea')) {
      saveTtyRecord()
    } else if (document.activeElement === document.querySelector('.intro-container textarea')) {
      saveIntroRecord()
    } else {
      saveTtyRecord()
      saveIntroRecord()
    }
  }
}

const detailMax = 10
</script>

<template>
  <div class="p-4 bg-gray-900 text-white min-h-screen overflow-y-auto">
    <div class="max-w-2xl mx-auto" style="height: 300px;">
      <div class="relative mb-4 flex h-full tty-container">
        <div class="flex-1 flex flex-col">
          <h2 class="text-lg font-semibold mb-2">打字机文本</h2>
          <textarea 
            v-model="ttyText"
            class="w-full h-32 p-2 border border-gray-700 rounded bg-gray-800 text-white flex-grow"
            placeholder="输入要显示的文字..."
          ></textarea>
          <div class="flex space-x-2 mt-2">
            <button 
              @click="sendTtyUpdate"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-1 transition-colors duration-300"
            >
              <PaperAirplaneIcon class="w-5 h-5" />
              <span>更新</span>
            </button>
            <button 
              @click="newTtyRecord"
              class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center space-x-1 transition-colors duration-300"
            >
              <PlusIcon class="w-5 h-5" />
              <span>新建</span>
            </button>
            <button 
              @click="saveTtyRecord"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-1 transition-colors duration-300"
            >
              <BookmarkSquareIcon class="w-5 h-5" />
              <span>保存</span>
            </button>
            <transition name="fade">
              <span v-if="showTtySavedMessage" class="flex items-center space-x-1 text-white">
                <CheckIcon class="w-5 h-5 text-green-400" />
                <span>已保存！</span>
              </span>
            </transition>
          </div>
        </div>
        <div class="w-64 ml-4 overflow-y-auto" style="height: 100%;">
          <h2 class="text-lg font-semibold mb-2">历史记录</h2>
          <ul>
            <li 
              v-for="(record, index) in ttyHistory" 
              :key="index" 
              :class="{'bg-gray-700': activeTtyIndex === index, 'bg-gray-800': activeTtyIndex !== index}"
              class="flex justify-between items-center p-2 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors duration-300" 
              @click="setActiveTtyRecord(index)"
            >
              <span>{{ record.content.length > detailMax ? record.content.slice(0, detailMax - 3) + '...' : record.content }}</span>
              <div class="flex space-x-2">
                <button @click.stop="deleteTtyRecord(index)" class=" flex items-center space-x-1">
                  <XMarkIcon class="w-5 h-5" />
                  <!-- <span>删除</span> -->
                </button>
                <button @click.stop="moveTtyRecordToTop(index)" class=" flex items-center space-x-1">
                  <ArrowUpIcon class="w-5 h-5" />
                  <!-- <span>置顶</span> -->
				</button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="relative mb-4 mt-4 flex h-full intro-container">
        <div class="flex-1 flex flex-col">
          <h2 class="text-lg font-semibold mb-2">介绍文本</h2>
          <textarea 
            v-model="introText"
            class="w-full h-32 p-2 border border-gray-700 rounded bg-gray-800 text-white flex-grow"
            placeholder="输入直播间介绍文字..."
          ></textarea>
          <div class="flex space-x-2 mt-2">
            <button 
              @click="sendIntroUpdate"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-1 transition-colors duration-300"
            >
              <PaperAirplaneIcon class="w-5 h-5" />
              <span>更新</span>
            </button>
            <button 
              @click="newIntroRecord"
              class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center space-x-1 transition-colors duration-300"
            >
              <PlusIcon class="w-5 h-5" />
              <span>新建</span>
            </button>
            <button 
              @click="saveIntroRecord"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-1 transition-colors duration-300"
            >
              <BookmarkSquareIcon class="w-5 h-5" />
              <span>保存</span>
            </button>
            <transition name="fade">
              <span v-if="showIntroSavedMessage" class="flex items-center space-x-1 text-white">
                <CheckIcon class="w-5 h-5 text-green-400" />
                <span>已保存！</span>
              </span>
            </transition>
          </div>
        </div>
        <div class="w-64 ml-4 overflow-y-auto" style="height: 100%;">
          <h2 class="text-lg font-semibold mb-2">历史记录</h2>
          <ul>
            <li 
              v-for="(record, index) in introHistory" 
              :key="index" 
              :class="{'bg-gray-700': activeIntroIndex === index, 'bg-gray-800': activeIntroIndex !== index}"
              class="flex justify-between items-center p-2 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors duration-300" 
              @click="setActiveIntroRecord(index)"
            >
              <span>{{ record.content.length > detailMax ? record.content.slice(0, detailMax - 3) + '...' : record.content }}</span>
              <div class="flex space-x-2">
                <button @click.stop="deleteIntroRecord(index)" class="flex items-center space-x-1">
                  <XMarkIcon class="w-5 h-5" />
                  <!-- <span>删除</span> -->
                </button>
                <button @click.stop="moveIntroRecordToTop(index)" class="flex items-center space-x-1">
                  <ArrowUpIcon class="w-5 h-5" />
                  <!-- <span>置顶</span> -->
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>