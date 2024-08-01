document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scrolled');
      }
    });
  }, {
    threshold: 0.1
  });

  function initScrollAnimations() {
    const elements = document.body.children;
    let belowFold = false;

    Array.from(elements).forEach(element => {
      if (!belowFold && element.getBoundingClientRect().bottom > window.innerHeight) {
        belowFold = true;
      }
      
      if (belowFold) {
        element.classList.add('scroll-animation');
        observer.observe(element);
      }
    });
  }

  initScrollAnimations();
});