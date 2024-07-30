function pageTransition() {
    const main = document.querySelector('main');
    main.style.opacity = '0';
    main.style.transition = 'opacity 0.3s ease-in-out';
    setTimeout(() => {
      main.style.opacity = '1';
    }, 50);
  }
  
  function handleHeaderScroll() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
      const buttonPage = button.getAttribute('href').replace('.html', '').replace('/', '');
      if (buttonPage === currentPage || (currentPage === '' && buttonPage === 'index')) {
        button.classList.add('active');
      }
    });
  
    // Smooth scroll for anchor links within the same page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  
    // Intersection Observer for fade-in effect
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    sections.forEach(section => {
      observer.observe(section);
    });
  
    // Add smooth page transitions
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        pageTransition();
        setTimeout(() => {
          window.location = link.href;
        }, 300);
      });
    });
  
    // Run page transition on load
    pageTransition();
  
    // Add header scroll effect
    handleHeaderScroll();
  
    // Add parallax effect
    addParallaxEffect();
  });