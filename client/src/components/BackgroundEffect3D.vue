<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  particleCount: {
    type: Number,
    default: 5000
  },
  depthRange: {
    type: Number,
    default: 3000
  },
  moveSpeed: {
    type: Number,
    default: 1.2
  }
})

const container = ref(null)
let scene, camera, renderer, particles
let frameId = null
const sceneSizes = new THREE.Vector2()

const config = {
  sizeRange: [0.5, 2.5],
  colorPalette: [
    new THREE.Color().setHSL(200/360, 0.8, 0.9),
    new THREE.Color().setHSL(220/360, 0.7, 0.8),
    new THREE.Color().setHSL(240/360, 0.6, 0.7)
  ],
  blurFactor: 0.7
}

function initScene() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, sceneSizes.x / sceneSizes.y, 1, 5000)
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  })
  renderer.setSize(sceneSizes.x, sceneSizes.y)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)
}

function createParticles() {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(props.particleCount * 3)
  const particleSizes = new Float32Array(props.particleCount)
  const colors = new Float32Array(props.particleCount * 3)

  for (let i = 0; i < props.particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * sceneSizes.x * 2
    positions[i * 3 + 1] = (Math.random() - 0.5) * sceneSizes.y * 2
    positions[i * 3 + 2] = Math.random() * props.depthRange * -1

    particleSizes[i] = config.sizeRange[0] + 
      Math.random() * (config.sizeRange[1] - config.sizeRange[0])

    const color = config.colorPalette[
      Math.floor(Math.random() * config.colorPalette.length)
    ]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles);
}

function animate() {
  frameId = requestAnimationFrame(animate)

  const positions = particles.geometry.attributes.position.array
  
  for (let i = 0; i < props.particleCount; i++) {
    positions[i * 3 + 2] += props.moveSpeed
    
    if (positions[i * 3 + 2] > 0) {
      positions[i * 3 + 2] = -props.depthRange
      positions[i * 3] = (Math.random() - 0.5) * sceneSizes.x * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * sceneSizes.y * 2
    }
  }
  
  particles.geometry.attributes.position.needsUpdate = true
  renderer.render(scene, camera)
}

function handleResize() {
  sceneSizes.set(
    container.value.clientWidth,
    container.value.clientHeight
  )
  
  camera.aspect = sceneSizes.x / sceneSizes.y
  camera.updateProjectionMatrix()
  renderer.setSize(sceneSizes.x, sceneSizes.y)
}

onMounted(() => {
  sceneSizes.set(
    container.value.clientWidth,
    container.value.clientHeight
  )
  
  initScene()
  createParticles()
  animate()
  
  camera.position.z = 0
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('resize', handleResize)
  renderer.dispose()
})
</script>

<template>
  <div ref="container" class="space-background"></div>
</template>

<style scoped>
.space-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  background-color: #000;
}

canvas {
  filter: blur(calc(v-bind('config.blurFactor') * 1px));
}
</style>