/* ===========================
   Main JavaScript
   Navigation, Animations, Interactions
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Theme Toggle System (Dark / Light) ----
  const initTheme = () => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const currentTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButtons(currentTheme);
  };

  const updateThemeButtons = (theme) => {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      if (theme === 'light') {
        btn.classList.add('is-light');
      } else {
        btn.classList.remove('is-light');
      }
    });
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeButtons(newTheme);

    // Dispatch themechange event for water simulation and canvas
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
  };

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  initTheme();

  // ---- Ambient Floating Items on Every Page (Real Skills & 3D Objects) ----
  const initFloatingItems = () => {
    if (document.querySelector('.floating-items-container')) return;

    const container = document.createElement('div');
    container.className = 'floating-items-container';

    // Real skill chips with official brand icons & realistic 3D geometric shapes
    const itemsData = [
      { html: '<i class="fa-brands fa-react" style="color: #06b6d4;"></i><span>React</span>', top: '18%', right: '5%', type: 'skill-chip', anim: 'float-1', delay: '0s' },
      { html: '', top: '43%', left: '7%', size: '52px', type: 'balloon balloon-coral', anim: 'float-2', delay: '0.8s' },
      { html: '', top: '76%', left: '24%', size: '36px', type: 'shape-sphere3d', anim: 'float-3', delay: '1.2s' },
      { html: '', top: '78%', right: '22%', size: '52px', type: 'balloon balloon-cyan', anim: 'float-4', delay: '0.4s' },
      { html: '', top: '49%', right: '20%', size: '32px', type: 'shape-cube3d', anim: 'float-1', delay: '2s' },
      { html: '<i class="fa-brands fa-node-js" style="color: #22c55e;"></i><span>Node.js</span>', top: '70%', left: '4%', type: 'skill-chip', anim: 'float-3', delay: '1s' }
    ];

    itemsData.forEach((item) => {
      const el = document.createElement('div');
      el.className = `floating-item ${item.type} ${item.anim}`;
      el.innerHTML = item.html;
      el.setAttribute('draggable', 'false');
      el.style.top = item.top;
      if (item.left) el.style.left = item.left;
      if (item.right) el.style.right = item.right;
      if (item.size) {
        el.style.width = item.size;
        el.style.height = item.size;
      }
      el.style.animationDelay = item.delay;

      if (item.type.includes('balloon')) {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', 'Pop balloon');
        el.addEventListener('pointerdown', (event) => {
          event.preventDefault();
          el.classList.add('is-popped');
          window.setTimeout(() => el.remove(), 320);
        }, { once: true });
        el.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            el.classList.add('is-popped');
            window.setTimeout(() => el.remove(), 320);
          }
        }, { once: true });
      } else {
        el.addEventListener('pointerdown', (event) => {
          if (event.button !== 0) return;
          const rect = el.getBoundingClientRect();
          el.classList.add('is-dragging');
          el.style.left = `${rect.left}px`;
          el.style.top = `${rect.top}px`;
          el.style.right = 'auto';
          el.setPointerCapture(event.pointerId);

          const moveItem = (moveEvent) => {
            el.style.left = `${Math.max(0, Math.min(window.innerWidth - rect.width, moveEvent.clientX - rect.width / 2))}px`;
            el.style.top = `${Math.max(0, Math.min(window.innerHeight - rect.height, moveEvent.clientY - rect.height / 2))}px`;
          };
          const releaseItem = () => {
            el.classList.remove('is-dragging');
            el.removeEventListener('pointermove', moveItem);
            el.removeEventListener('pointerup', releaseItem);
            el.removeEventListener('pointercancel', releaseItem);
          };

          el.addEventListener('pointermove', moveItem);
          el.addEventListener('pointerup', releaseItem);
          el.addEventListener('pointercancel', releaseItem);
          event.preventDefault();
        });
      }

      container.appendChild(el);
    });

    document.body.appendChild(container);
  };

  initFloatingItems();

  // ---- Campus Reports & Showcase Sliding Picture Carousels ----
  const initSliders = () => {
    const sliderContainers = document.querySelectorAll('.slider-container');
    sliderContainers.forEach((container) => {
      const track = container.querySelector('.slider-track');
      const slides = container.querySelectorAll('.slide');
      const prevBtn = container.querySelector('.slider-prev');
      const nextBtn = container.querySelector('.slider-next');
      const dots = container.querySelectorAll('.slider-dot');

      if (!track || slides.length <= 1) return;

      let currentIndex = 0;
      let autoplayTimer = null;
      let touchStartX = 0;
      let touchEndX = 0;

      const updateSlider = (index) => {
        currentIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      };

      const nextSlide = () => updateSlider(currentIndex + 1);
      const prevSlide = () => updateSlider(currentIndex - 1);

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          nextSlide();
          resetAutoplay();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          prevSlide();
          resetAutoplay();
        });
      }

      dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
          updateSlider(targetIndex);
          resetAutoplay();
        });
      });

      // Touch / Swipe Support
      container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      }, { passive: true });

      container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 40;
        if (touchEndX < touchStartX - threshold) {
          nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
          prevSlide();
        }
        startAutoplay();
      }, { passive: true });

      // Autoplay with hover pause
      const startAutoplay = () => {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, 3800);
      };

      const stopAutoplay = () => {
        if (autoplayTimer) clearInterval(autoplayTimer);
      };

      const resetAutoplay = () => {
        stopAutoplay();
        startAutoplay();
      };

      container.addEventListener('mouseenter', stopAutoplay);
      container.addEventListener('mouseleave', startAutoplay);

      startAutoplay();
    });
  };

  initSliders();

  // ---- Seamless Photo Morph Transition (Home <-> About) ----
  const initPhotoMorphTransition = () => {
    const rawPath = window.location.pathname.toLowerCase();
    const isHomePage = rawPath.endsWith('index.html') || rawPath === '/' || rawPath.endsWith('/') || (!rawPath.includes('about') && !rawPath.includes('services') && !rawPath.includes('portfolio') && !rawPath.includes('contact'));
    const isAboutPage = rawPath.includes('about');

    // Check if arriving from a cross-page morph
    const storedMorph = sessionStorage.getItem('morph-photo-data');
    if (storedMorph) {
      sessionStorage.removeItem('morph-photo-data');
      try {
        const data = JSON.parse(storedMorph);
        
        if (data.from === 'home' && isAboutPage) {
          // Home -> About: expands seamlessly into About image card
          const targetWrapper = document.querySelector('.about-image');
          if (targetWrapper) {
            const targetImg = targetWrapper.querySelector('img');
            const targetRect = targetWrapper.getBoundingClientRect();
            
            if (targetImg) targetImg.style.opacity = '0';

            const overlay = document.createElement('div');
            overlay.className = 'photo-morph-overlay';
            overlay.style.transition = 'none';
            overlay.style.top = `${data.originRect.top}px`;
            overlay.style.left = `${data.originRect.left}px`;
            overlay.style.width = `${data.originRect.width}px`;
            overlay.style.height = `${data.originRect.height}px`;
            overlay.style.borderRadius = '50%';

            const cloneImg = document.createElement('img');
            cloneImg.src = targetImg ? targetImg.src : 'assets/Me/Danielchali.png';
            cloneImg.alt = 'Daniel Chali';
            overlay.appendChild(cloneImg);
            document.body.appendChild(overlay);

            // Force reflow so starting frame is locked in
            void overlay.offsetHeight;

            overlay.style.transition = 'top 0.52s cubic-bezier(0.16, 1, 0.3, 1), left 0.52s cubic-bezier(0.16, 1, 0.3, 1), width 0.52s cubic-bezier(0.16, 1, 0.3, 1), height 0.52s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.52s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.52s ease';

            requestAnimationFrame(() => {
              overlay.style.top = `${targetRect.top}px`;
              overlay.style.left = `${targetRect.left}px`;
              overlay.style.width = `${targetRect.width}px`;
              overlay.style.height = `${targetRect.height}px`;
              overlay.style.borderRadius = '20px';
            });

            setTimeout(() => {
              if (targetImg) targetImg.style.opacity = '1';
              overlay.remove();
            }, 550);
          }
        } else if (data.from === 'about' && isHomePage) {
          // About -> Home: shrinks seamlessly into Home circular frame
          const targetWrapper = document.querySelector('.hero-image-wrapper');
          if (targetWrapper) {
            const targetImg = targetWrapper.querySelector('img');
            const targetRect = targetWrapper.getBoundingClientRect();

            targetWrapper.style.opacity = '0';

            const overlay = document.createElement('div');
            overlay.className = 'photo-morph-overlay';
            overlay.style.transition = 'none';
            overlay.style.top = `${data.originRect.top}px`;
            overlay.style.left = `${data.originRect.left}px`;
            overlay.style.width = `${data.originRect.width}px`;
            overlay.style.height = `${data.originRect.height}px`;
            overlay.style.borderRadius = '20px';

            const cloneImg = document.createElement('img');
            cloneImg.src = targetImg ? targetImg.src : 'assets/Me/Danielchali.png';
            cloneImg.alt = 'Daniel Chali';
            overlay.appendChild(cloneImg);
            document.body.appendChild(overlay);

            // Force reflow so starting frame is locked in
            void overlay.offsetHeight;

            overlay.style.transition = 'top 0.52s cubic-bezier(0.16, 1, 0.3, 1), left 0.52s cubic-bezier(0.16, 1, 0.3, 1), width 0.52s cubic-bezier(0.16, 1, 0.3, 1), height 0.52s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.52s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.52s ease';

            requestAnimationFrame(() => {
              overlay.style.top = `${targetRect.top}px`;
              overlay.style.left = `${targetRect.left}px`;
              overlay.style.width = `${targetRect.width}px`;
              overlay.style.height = `${targetRect.height}px`;
              overlay.style.borderRadius = '50%';
            });

            setTimeout(() => {
              targetWrapper.style.opacity = '1';
              overlay.remove();
            }, 550);
          }
        }
      } catch (err) {
        console.warn('Photo morph transition error:', err);
      }
    }

    // Capture click on links connecting Home and About
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;
      const lowerHref = href.toLowerCase();

      if (isHomePage && lowerHref.includes('about')) {
        const heroPhoto = document.querySelector('.hero-image-wrapper');
        if (heroPhoto) {
          const rect = heroPhoto.getBoundingClientRect();
          sessionStorage.setItem('morph-photo-data', JSON.stringify({
            from: 'home',
            to: 'about',
            originRect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
          }));
        }
      } else if (isAboutPage && (lowerHref.includes('index') || lowerHref === '/' || lowerHref === './' || link.classList.contains('nav-logo'))) {
        const aboutPhoto = document.querySelector('.about-image');
        if (aboutPhoto) {
          const rect = aboutPhoto.getBoundingClientRect();
          sessionStorage.setItem('morph-photo-data', JSON.stringify({
            from: 'about',
            to: 'home',
            originRect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
          }));
        }
      }
    });
  };

  initPhotoMorphTransition();

  // ---- Navigation ----
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  // Scroll effect — add .scrolled class with enhanced effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close mobile nav on overlay click
  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ---- Active nav link tracking ----
  const updateActiveLink = () => {
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href').includes(current)) {
        item.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink);

  // ---- GSAP ScrollTrigger Animations ----
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal animations
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.reveal-left').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.reveal-right').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.reveal-scale').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    // Stagger children animations — each child triggers independently
    gsap.utils.toArray('.stagger-children').forEach(parent => {
      const children = Array.from(parent.children);
      children.forEach((child, i) => {
        gsap.from(child, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          delay: i * 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: child,
            start: 'top 92%',
            toggleActions: 'play none none none'
          }
        });
      });
    });

    // Hero text animation
    const heroLines = document.querySelectorAll('.hero h1 .line span');
    if (heroLines.length) {
      gsap.from(heroLines, {
        y: 120,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.3
      });
    }

    // Hero paragraph
    const heroParagraph = document.querySelector('.hero p');
    if (heroParagraph) {
      gsap.from(heroParagraph, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.8
      });
    }

    // Hero buttons
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
      gsap.from(heroButtons, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1
      });
    }

    // Hero badge
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
      gsap.from(heroBadge, {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.1
      });
    }

    // Hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
      gsap.from(heroStats, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.2
      });
    }

    // Counter animation for stat numbers
    document.querySelectorAll('.stat-number').forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      if (isNaN(target)) return;
      
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 90%',
        onEnter: () => {
          gsap.to(stat, {
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              const progress = this.progress();
              stat.textContent = Math.round(target * progress) + '+';
            }
          });
        },
        once: true
      });
    });
  }

  // ---- 3D Card Tilt Effect (Enhanced) ----
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      
      // Add subtle light reflection effect
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      card.style.backgroundImage = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.1), transparent)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.backgroundImage = 'none';
    });
  });

  // ---- Magnetic Buttons (Enhanced) ----
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ---- Button ripple effect ----
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ---- Contact Form (Enhanced) ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Form validation
    const validateForm = () => {
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();
      
      if (!name || !email || !message) {
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        alert('Please fill in all fields with valid information.');
        return;
      }

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate sending (no backend)
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #06b6d4)';
        contactForm.reset();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ---- Typed Effect for hero subtitle ----
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const words = ['Graphics Designer', 'Web Developer', 'UI/UX Designer', 'Videographer', 'Cartoon Animator', 'Brand Strategist', 'Full-Stack Developer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typedEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 500;
      }

      setTimeout(typeEffect, speed);
    }

    setTimeout(typeEffect, 1500);
  }

  // ---- Smooth scrolling for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Parallax effect on scroll ----
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      parallaxElements.forEach(el => {
        const scrollPosition = window.scrollY;
        const speed = el.getAttribute('data-parallax') || 0.5;
        el.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    });
  }

  // ---- Intersection Observer for fade-in effects ----
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .skill-card, .portfolio-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // ---- Current year in footer ----
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
