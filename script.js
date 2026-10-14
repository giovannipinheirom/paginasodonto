document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  const updateProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = (window.pageYOffset / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  // 2. Navbar Backdrop on Scroll
  const navbar = document.getElementById('navbar');
  const updateNavbar = () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-3');
      navbar.classList.remove('bg-transparent', 'py-5');
    } else {
      navbar.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-sm', 'py-3');
      navbar.classList.add('bg-transparent', 'py-5');
    }
  };
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // 3. Smooth Scroll Entrance Animation via Intersection Observer
  const scrollElements = document.querySelectorAll('.reveal-on-scroll, .reveal-slide-left, .reveal-slide-right, .reveal-scale');

  const checkVisibility = (el) => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= windowHeight * 0.92;
  };

  // Immediate check for above-the-fold or currently visible elements
  scrollElements.forEach((el) => {
    if (checkVisibility(el)) {
      el.classList.add('is-visible');
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    scrollElements.forEach((el) => {
      if (!el.classList.contains('is-visible')) {
        observer.observe(el);
      }
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    scrollElements.forEach(el => el.classList.add('is-visible'));
  }

  // 4. Before / After Comparison Slider
  const baContainer = document.querySelector('.ba-container');
  const baWrapper = document.querySelector('.ba-before-wrapper');
  const baHandle = document.querySelector('.ba-handle');
  const baBeforeImg = document.querySelector('.ba-before-img');

  if (baContainer && baWrapper && baHandle && baBeforeImg) {
    let isDragging = false;

    const updateSliderWidth = () => {
      baBeforeImg.style.width = `${baContainer.offsetWidth}px`;
    };

    window.addEventListener('resize', updateSliderWidth);
    updateSliderWidth();

    const setPosition = (clientX) => {
      const rect = baContainer.getBoundingClientRect();
      let pos = (clientX - rect.left) / rect.width;
      if (pos < 0.05) pos = 0.05;
      if (pos > 0.95) pos = 0.95;

      const percentage = pos * 100;
      baWrapper.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    };

    const handleStart = (e) => {
      isDragging = true;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
    };

    const handleEnd = () => {
      isDragging = false;
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
    };

    baContainer.addEventListener('mousedown', handleStart);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('mousemove', handleMove);

    baContainer.addEventListener('touchstart', handleStart, { passive: true });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: true });

    // Subtle initial swing invitation animation
    setTimeout(() => {
      baWrapper.style.transition = 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      baHandle.style.transition = 'left 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      baWrapper.style.width = '48%';
      baHandle.style.left = '48%';
      setTimeout(() => {
        baWrapper.style.transition = '';
        baHandle.style.transition = '';
      }, 800);
    }, 700);
  }

  // 5. Accordion Functionality
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        accordionItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  // 6. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
