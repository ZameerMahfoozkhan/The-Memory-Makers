/* ============================================================
   THE MEMORY MAKERS PHOTOGRAPHY — Interactive Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Page Loader ─────────────────────────────────────────── */
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });
  // Fallback: hide after 3s even if load event already fired
  setTimeout(() => loader.classList.add('hidden'), 3000);

  /* ── Navbar ──────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.remove('transparent');
      navbar.classList.add('solid');
    } else {
      navbar.classList.remove('solid');
      navbar.classList.add('transparent');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
  sections.forEach(s => observerNav.observe(s));

  /* ── Mobile Menu ─────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Smooth Scroll ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Hero Slideshow ──────────────────────────────────────── */
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;
  if (slides.length > 1) {
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 5000);
  }

  /* ── Scroll Reveal Animations ────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  /* ── Services Toggle ─────────────────────────────────────── */
  const viewAllServicesBtn = document.getElementById('viewAllServices');
  const servicesExtra = document.getElementById('servicesExtra');
  if (viewAllServicesBtn && servicesExtra) {
    viewAllServicesBtn.addEventListener('click', () => {
      servicesExtra.classList.toggle('show');
      if (servicesExtra.classList.contains('show')) {
        viewAllServicesBtn.innerHTML = 'Show Less <span style="transition:transform .3s;display:inline-block;transform:rotate(180deg)">↓</span>';
      } else {
        viewAllServicesBtn.innerHTML = 'View All Services <span style="transition:transform .3s;display:inline-block">↓</span>';
        // Scroll back to the services header slightly
        const servicesSection = document.getElementById('services');
        window.scrollTo({ top: servicesSection.offsetTop - 80, behavior: 'smooth' });
      }
    });
  }

  /* ── Portfolio Filters ───────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      masonryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            item.style.transition = 'opacity .4s ease, transform .4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(.95)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  /* ── Lightbox ────────────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let lightboxImages = [];
  let lightboxIndex = 0;

  function collectImages() {
    lightboxImages = [];
    document.querySelectorAll('.masonry-item:not([style*="display: none"]) img').forEach(img => {
      lightboxImages.push(img.src);
    });
  }

  function openLightbox(index) {
    collectImages();
    lightboxIndex = index;
    lightboxImg.src = lightboxImages[lightboxIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = lightboxImages[lightboxIndex];
      lightboxImg.style.opacity = '1';
    }, 200);
  }

  masonryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  /* ── Animated Counters ───────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-number[data-count]');
  let countersDone = false;
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersDone) {
        countersDone = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.count);
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          const tick = () => {
            current += step;
            if (current >= target) {
              counter.innerHTML = target.toLocaleString() + '<span>+</span>';
            } else {
              counter.innerHTML = Math.floor(current).toLocaleString() + '<span>+</span>';
              requestAnimationFrame(tick);
            }
          };
          tick();
        });
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => counterObserver.observe(c));

  /* ── Testimonial Carousel ────────────────────────────────── */
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('carouselDots');
  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let cardsPerView = getCardsPerView();
    let currentIndex = 0;
    const totalDots = Math.ceil(cards.length / cardsPerView);

    function getCardsPerView() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function renderDots() {
      dotsContainer.innerHTML = '';
      const dots = Math.ceil(cards.length / cardsPerView);
      for (let i = 0; i < dots; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goToSlide(index) {
      const maxIndex = Math.ceil(cards.length / cardsPerView) - 1;
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap || 24);
      track.style.transform = `translateX(-${currentIndex * cardsPerView * cardWidth}px)`;
      renderDots();
    }

    renderDots();

    // Auto-play
    let autoPlay = setInterval(() => {
      const maxIndex = Math.ceil(cards.length / cardsPerView) - 1;
      goToSlide(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    }, 5000);

    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.parentElement.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        const maxIndex = Math.ceil(cards.length / cardsPerView) - 1;
        goToSlide(currentIndex >= maxIndex ? 0 : currentIndex + 1);
      }, 5000);
    });

    // Touch / swipe
    let startX = 0;
    let isDragging = false;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
    track.addEventListener('touchmove', e => { /* let default scroll */ }, { passive: true });
    track.addEventListener('touchend', e => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        const maxIndex = Math.ceil(cards.length / cardsPerView) - 1;
        goToSlide(diff > 0 ? Math.min(currentIndex + 1, maxIndex) : Math.max(currentIndex - 1, 0));
      }
    });

    window.addEventListener('resize', () => {
      cardsPerView = getCardsPerView();
      goToSlide(0);
    });
  }

  /* ── FAQ Accordion ───────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Button Ripple Effect ────────────────────────────────── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ── Parallax Hover on Story Cards ───────────────────────── */
  document.querySelectorAll('.story-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Lazy Loading (IntersectionObserver) ──────────────────── */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImages.forEach(img => imgObserver.observe(img));
  }

  /* ── Instagram Grid Click ────────────────────────────────── */
  document.querySelectorAll('.insta-item').forEach(item => {
    item.addEventListener('click', () => {
      window.open('https://www.instagram.com/the_memory_makers_photography/', '_blank');
    });
  });

  /* ── Contact Form Validation ─────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      const inputs = contactForm.querySelectorAll('[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = '#e74c3c';
          input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
        }
      });
      if (!valid) {
        e.preventDefault();
      }
    });
  }

}); // end DOMContentLoaded
