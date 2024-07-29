document.addEventListener('DOMContentLoaded', function() {
    const scrollAnimates = document.querySelectorAll('.scroll-animate');

    function checkScroll() {
        scrollAnimates.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight * 0.8) {
                element.classList.add('in-view');
            }
        });
    }

    window.addEventListener('scroll', checkScroll);
    checkScroll(); 
});