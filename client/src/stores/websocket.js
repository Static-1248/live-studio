import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    socket: null,
    typewriterText: '',
    descriptionText: '' // Add this line
  }),
  actions: {
    init() {
      this.socket = io('http://localhost:3000', {
        path: '/socket.io',
        transports: ['websocket'],
        autoConnect: true
      })
      
      this.socket.on('ttyUpdated', (text) => { // Rename this event
        this.updateTypewriter(text)
      })

      // Rename this block for intro updates
      this.socket.on('introUpdated', (description) => {
        this.updateDescription(description)
      })
    },
    updateTypewriter(text) {
      this.typewriterText = text
    },
    // Rename this method for intro updates
    updateDescription(description) {
      this.descriptionText = description
    }
  }
})