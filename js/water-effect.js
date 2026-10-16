/* ========================================================
   WATER-LIKE EFFECTS & FLUID NAVIGATION ENGINE
   Interactive water ripples, fluid waves, and page flow
   ======================================================== */

(function () {
  'use strict';

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class WaterSimulation {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'water-canvas';
      this.canvas.className = 'water-canvas';
      this.ctx = this.canvas.getContext('2d');
      this.ripples = [];
      this.droplets = [];
      this.caustics = [];
      this.mouse = { x: -1000, y: -1000, lastX: -1000, lastY: -1000, speed: 0 };
      this.lastScrollY = window.scrollY;
      this.isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      this.active = !prefersReducedMotion;
      this.maxRipples = 60;
      this.maxDroplets = 40;

      this.init();
    }

    init() {
      // Append canvas to body behind content
      document.body.prepend(this.canvas);
      this.resize();

      // Listen for window resize
      window.addEventListener('resize', () => this.resize(), { passive: true });

      // Init ambient caustics
      this.initCaustics();

      // Mouse and touch interaction
      let lastMoveTime = 0;
      const handlePointerMove = (x, y) => {
        const now = performance.now();
        const dx = x - this.mouse.lastX;
        const dy = y - this.mouse.lastY;
        const dist = Math.hypot(dx, dy);
        this.mouse.speed = dist;

        // Emit trail ripples if mouse moved fast enough or enough time passed
        if (dist > 8 && now - lastMoveTime > 35) {
          this.addRipple(x, y, Math.min(dist * 0.4, 18), 0.35);
          lastMoveTime = now;
        }

        this.mouse.lastX = x;
        this.mouse.lastY = y;
        this.mouse.x = x;
        this.mouse.y = y;
      };

      window.addEventListener('mousemove', (e) => {
        handlePointerMove(e.clientX, e.clientY);
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      // Click / Tap creates a splash & multi-ring ripple
      const handlePointerDown = (x, y, intensity = 1.0) => {
        this.createSplash(x, y, intensity);
      };

      window.addEventListener('pointerdown', (e) => {
        // Only primary mouse button or touch
        if (e.button === 0 || e.pointerType === 'touch') {
          handlePointerDown(e.clientX, e.clientY, 1.2);
        }
      }, { passive: true });

      // Scroll creates fluid wave displacement
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const scrollDiff = Math.abs(currentScrollY - this.lastScrollY);

        if (scrollDiff > 4) {
          const x = Math.random() * this.width;
          const y = Math.random() * this.height;
          this.addRipple(x, y, Math.min(scrollDiff * 0.8, 30), 0.25);
        }

        this.lastScrollY = currentScrollY;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.lastScrollY = window.scrollY;
        }, 100);
      }, { passive: true });

      // Listen for theme change
      window.addEventListener('themechange', (e) => {
        this.isDark = e.detail ? e.detail.theme !== 'light' : document.documentElement.getAttribute('data-theme') !== 'light';
      });

      // Start animation loop
      if (this.active) {
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
      }

      // Link navigation water transition
      this.initNavigationWaterWaves();
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    initCaustics() {
      const count = Math.min(18, Math.floor(window.innerWidth / 80));
      this.caustics = [];
      for (let i = 0; i < count; i++) {
        this.caustics.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: 80 + Math.random() * 140,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
        });
      }
    }

    addRipple(x, y, initialRadius = 5, strength = 0.5) {
      if (this.ripples.length >= this.maxRipples) {
        this.ripples.shift();
      }
      this.ripples.push({
        x,
        y,
        radius: initialRadius,
        maxRadius: 120 + strength * 140,
        speed: 2.2 + strength * 1.8,
        opacity: Math.min(strength * 0.85, 0.75),
        decay: 0.012 + (1 - strength) * 0.008,
        lineWidth: 1.5 + strength * 2,
        rings: 2 + Math.floor(strength * 2)
      });
    }

    createSplash(x, y, intensity = 1.0) {
      // Primary multi-stage ripples
      this.addRipple(x, y, 6, 0.9 * intensity);
      setTimeout(() => this.addRipple(x, y, 12, 0.65 * intensity), 90);
      setTimeout(() => this.addRipple(x, y, 18, 0.45 * intensity), 190);

      // Droplets
      const dropletCount = Math.floor(6 + intensity * 6);
      for (let i = 0; i < dropletCount; i++) {
        if (this.droplets.length >= this.maxDroplets) {
          this.droplets.shift();
        }
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.5 * intensity;
        this.droplets.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          radius: 2 + Math.random() * 2.5,
          opacity: 0.8,
          gravity: 0.12,
          life: 1.0,
          decay: 0.02 + Math.random() * 0.02
        });
      }
    }

    initNavigationWaterWaves() {
      // When clicking internal links, create an expansive water ripple before navigating
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        // Check if internal page link
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
          return;
        }

        // Check if same-origin HTML page
        if (href.endsWith('.html') || (!href.includes('://') && !href.startsWith('//'))) {
          const rect = link.getBoundingClientRect();
          const clickX = e.clientX || (rect.left + rect.width / 2);
          const clickY = e.clientY || (rect.top + rect.height / 2);

          // Trigger large water wave
          this.createSplash(clickX, clickY, 1.8);
          this.addRipple(clickX, clickY, 15, 1.4);

          // Add a subtle ripple wash animation to the body
          const wash = document.createElement('div');
          wash.className = 'water-page-wash';
          wash.style.left = `${clickX}px`;
          wash.style.top = `${clickY}px`;
          document.body.appendChild(wash);

          // Allow natural navigation after a tiny silky ripple expansion (120ms)
          // so the user sees the water effect emerge
          e.preventDefault();
          setTimeout(() => {
            window.location.href = href;
          }, 140);
        }
      });
    }

    animate() {
      requestAnimationFrame(this.animate);

      // Clear with subtle fade for smooth motion trails
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Color palettes based on theme
      const primaryColor = this.isDark
        ? { r: 6, g: 182, b: 212 }     // Cyan
        : { r: 2, g: 132, b: 199 };    // Ocean blue
      const accentColor = this.isDark
        ? { r: 167, g: 139, b: 250 }   // Violet / purple
        : { r: 109, g: 40, b: 217 };   // Royal purple

      // 1. Draw ambient caustics (soft water light reflections)
      for (let i = 0; i < this.caustics.length; i++) {
        const c = this.caustics[i];
        c.x += c.speedX;
        c.y += c.speedY;
        c.phase += c.pulseSpeed;

        if (c.x < -c.radius) c.x = this.width + c.radius;
        if (c.x > this.width + c.radius) c.x = -c.radius;
        if (c.y < -c.radius) c.y = this.height + c.radius;
        if (c.y > this.height + c.radius) c.y = -c.radius;

        const currentRadius = c.radius * (1 + 0.15 * Math.sin(c.phase));
        const causticAlpha = this.isDark ? 0.035 + 0.02 * Math.sin(c.phase) : 0.045 + 0.02 * Math.sin(c.phase);

        const grad = this.ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, currentRadius);
        grad.addColorStop(0, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${causticAlpha})`);
        grad.addColorStop(0.6, `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, ${causticAlpha * 0.5})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(c.x, c.y, currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // 2. Draw water ripples
      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const r = this.ripples[i];
        r.radius += r.speed;
        r.opacity -= r.decay;

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          this.ripples.splice(i, 1);
          continue;
        }

        // Draw multiple concentric wave crests per ripple
        for (let ring = 0; ring < r.rings; ring++) {
          const ringOffset = ring * 14;
          const currentRadius = r.radius - ringOffset;
          if (currentRadius <= 0) continue;

          const ringOpacity = Math.max(0, r.opacity * (1 - ring * 0.28));

          // Outer highlight wave ring
          this.ctx.beginPath();
          this.ctx.arc(r.x, r.y, currentRadius, 0, Math.PI * 2);
          this.ctx.strokeStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${ringOpacity * 0.75})`;
          this.ctx.lineWidth = Math.max(0.7, r.lineWidth * (1 - r.radius / r.maxRadius));
          this.ctx.stroke();

          // Subtle inner refraction trough ring
          this.ctx.beginPath();
          this.ctx.arc(r.x, r.y, Math.max(1, currentRadius - 3), 0, Math.PI * 2);
          this.ctx.strokeStyle = `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, ${ringOpacity * 0.35})`;
          this.ctx.lineWidth = Math.max(0.5, r.lineWidth * 0.6);
          this.ctx.stroke();
        }
      }

      // 3. Draw water droplets
      for (let i = this.droplets.length - 1; i >= 0; i--) {
        const d = this.droplets[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += d.gravity;
        d.life -= d.decay;
        d.opacity = Math.max(0, d.life * 0.85);

        if (d.life <= 0) {
          // Leave a tiny micro ripple where droplet lands
          if (Math.random() > 0.5) {
            this.addRipple(d.x, d.y, 3, 0.2);
          }
          this.droplets.splice(i, 1);
          continue;
        }

        this.ctx.beginPath();
        this.ctx.arc(d.x, d.y, d.radius * d.life, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${d.opacity})`;
        this.ctx.fill();

        // Droplet specular highlight
        this.ctx.beginPath();
        this.ctx.arc(d.x - d.radius * 0.3, d.y - d.radius * 0.3, d.radius * 0.35 * d.life, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${d.opacity * 0.8})`;
        this.ctx.fill();
      }
    }
  }

  // Initialize WaterSimulation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new WaterSimulation());
  } else {
    new WaterSimulation();
  }
})();
