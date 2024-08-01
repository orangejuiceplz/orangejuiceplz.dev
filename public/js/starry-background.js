function createStarryBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
  
    const stars = [];
    const starCount = 200;
    let mouseX = 0;
    let mouseY = 0;
    const movementSensitivity = 0.001;
  
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        initStars();
    }
  
    function initStars() {
        stars.length = 0;
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                opacity: Math.random(),
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }
  
    function animateStars() {
        ctx.fillStyle = 'rgba(22,22,36,255)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      
        stars.forEach(star => {
            star.x += (mouseX - canvas.width / 2) * star.speed * movementSensitivity;
            star.y += (mouseY - canvas.height / 2) * star.speed * movementSensitivity;
    
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
    
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
    
            star.opacity = Math.sin(Date.now() * 0.001 + star.x + star.y) * 0.5 + 0.5;
        });
    
        requestAnimationFrame(animateStars);
    }
  
    resizeCanvas();
    animateStars();
  
    window.addEventListener('resize', resizeCanvas);
  
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}
  
document.addEventListener('DOMContentLoaded', createStarryBackground);