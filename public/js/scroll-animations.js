document.addEventListener('DOMContentLoaded', function() {
    const scrollAnimates = document.querySelectorAll('.about-me, .my-journey, .personal-interests');
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
  
    scrollAnimates.forEach(element => {
      observer.observe(element);
    });
  });