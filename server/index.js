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

// Add this hook to set the response header
fastify.addHook('onSend', (request, reply, payload, done) => {
  reply.header('X-Frame-Options', 'ALLOW-FROM https://play-live.bilibili.com/')
  done()
})

await fastify.register(fastifyStatic, {
  root: resolve(process.cwd(), 'client/dist'),
  prefix: '/'
})

// Add this fallback route
fastify.setNotFoundHandler((request, reply) => {
  reply.sendFile('index.html')
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

  socket.on('ttyUpdated', (text) => { // Rename this event
    console.log(`Received tty text from ${socket.id}:`, text)
    io.emit('ttyUpdated', text) // Rename this event
  })

  // Rename this block for intro updates
  socket.on('introUpdated', (description) => {
    console.log(`Received intro text from ${socket.id}:`, description)
    io.emit('introUpdated', description) // Rename this event
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