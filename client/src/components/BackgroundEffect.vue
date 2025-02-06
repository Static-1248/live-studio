<template>
  <div class="background-effect">
    <canvas id="space"></canvas>
  </div>
</template>

<script setup>
/**
 * Starfield background effect
 */

import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
  const canvas = document.getElementById('space');
  const ctx = canvas.getContext('2d');

  const CONFIG = {
    STAR_COUNT: 300,
    BASE_SPEED: 0.3,
    TWINKLE_CONFIG: {
      FREQ_AVG: 2,
      FREQ_STDDEV: 0.0002,
    },
    SIZE_VARIATION: 1.5,
    COLOR_VARIATION: true,
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function randomNormal(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  const stars = Array.from({ length: CONFIG.STAR_COUNT }, () => {
    const hasColor = CONFIG.COLOR_VARIATION && Math.random() > 0.8;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * CONFIG.SIZE_VARIATION,
      alpha: Math.random(),
      color: hasColor ? 
        `hsl(${Math.random() * 60 + 200}, 70%, 80%)` : 
        'rgba(255, 255, 255, 1)',
      vx: (Math.random() - 0.5) * CONFIG.BASE_SPEED,
      vy: (Math.random() - 0.5) * CONFIG.BASE_SPEED,
      frequency: randomNormal(CONFIG.TWINKLE_CONFIG.FREQ_AVG, CONFIG.TWINKLE_CONFIG.FREQ_STDDEV),
      phase: Math.random() * 2 * Math.PI,
      minAlpha: Math.random() * 0.5,
      maxAlpha: 0.5 + Math.random() * 0.5,
    };
  });

  function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      star.x += star.vx;
      star.y += star.vy;

      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      const time = Date.now() / 1000;
      star.alpha = star.minAlpha + (star.maxAlpha - star.minAlpha) * (0.5 + 0.5 * Math.sin(time * star.frequency + star.phase));

      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0, 
        star.x, star.y, star.size * 2
      );
      gradient.addColorStop(0, star.color.replace('1)', `${star.alpha})`));
      gradient.addColorStop(1, star.color.replace('1)', '0)'));

      ctx.fillStyle = gradient;
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = 'rgba(12, 25, 45, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);
  }
  animate();

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
  });
});
</script>

<style scoped>
.background-effect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  z-index: -1;
}
</style>
