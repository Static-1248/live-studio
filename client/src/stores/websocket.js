import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    socket: null,
    typewriterText: ''
  }),
  actions: {
    init() {
      this.socket = io('http://localhost:3000', {
        path: '/socket.io',
        transports: ['websocket'],
        autoConnect: true
      })
      
      this.socket.on('textUpdated', (text) => {
        this.updateTypewriter(text)
      })
    },
    updateTypewriter(text) {
      this.typewriterText = text
    }
  }
})