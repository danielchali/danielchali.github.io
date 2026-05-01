/* ===========================
   Main JavaScript
   Navigation, Animations, Interactions
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

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

  // ---- Add ripple effect CSS ----
  const style = document.createElement('style');
  style.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    }

    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

});
