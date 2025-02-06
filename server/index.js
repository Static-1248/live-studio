import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { resolve } from 'path'
import { Server } from 'socket.io' // Add this line

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: false
    }
  }
})

// Remove @fastify/websocket registration
await fastify.register(fastifyStatic, {
  root: resolve(process.cwd(), 'client/dist'),
  prefix: '/'
})

// Initialize socket.io directly
const io = new Server(fastify.server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  },
  path: '/socket.io' // Use default socket.io path
})

io.on('connection', (socket) => {
  console.log(`Client connected [${socket.id}] from:`, socket.handshake.headers.origin)

  socket.on('textUpdated', (text) => {
    console.log(`Received text from ${socket.id}:`, text)
    io.emit('textUpdated', text)
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected [${socket.id}]`)
  })
})

// Add this for ESM compatibility
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()