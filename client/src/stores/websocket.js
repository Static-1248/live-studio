import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    displaySocket: null,
    controlSocket: null,
    typewriterText: ''
  }),
  actions: {
    initDisplay() {
      this.displaySocket = this.createSocket()
	  this.displaySocket.connect()
    },
    initControl() {
      this.controlSocket = this.createSocket()
      this.controlSocket.connect()
    },
    createSocket() {
      return io('http://localhost:3000', {
        path: '/socket.io',
        transports: ['websocket'],
        autoConnect: false
      })
    },
    init() {
      this.socket = io('http://localhost:3000', {
        path: '/socket.io', // Match server path
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