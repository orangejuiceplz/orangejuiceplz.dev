function createStarryBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    const stars = [];
    const shootingStars = [];
    const starCount = 200;
    const maxShootingStars = 2;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Adjustable parameters
    const params = {
        starSpeed: 0.01,           // Adjust this to change overall star speed
        shootingStarSpeed: 0.05,   // Adjust this to change shooting star speed
        movementSmoothing: 0.05,   // Adjust this to change how quickly stars react to mouse movement
    };

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
                speed: Math.random() * 0.5 + 0.1,
                twinkleSpeed: Math.random() * 0.005 + 0.002,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }

    function createShootingStar() {
        return {
            x: Math.random() * canvas.width,
            y: 0,
            length: Math.random() * 80 + 10,
            speed: Math.random() * 5 + 2,
            opacity: 1,
            trail: []
        };
    }

    function animateStars(timestamp) {
        ctx.fillStyle = 'rgba(22,22,36,0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Smooth mouse movement
        targetX += (mouseX - targetX) * params.movementSmoothing;
        targetY += (mouseY - targetY) * params.movementSmoothing;

        stars.forEach(star => {
            let dx = (targetX - canvas.width / 2) * star.speed * params.starSpeed;
            let dy = (targetY - canvas.height / 2) * star.speed * params.starSpeed;

            star.x += dx;
            star.y += dy;

            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            star.opacity = Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });

        // Occasionally create a new shooting star
        if (shootingStars.length < maxShootingStars && Math.random() < 0.005) {
            shootingStars.push(createShootingStar());
        }

        shootingStars.forEach((star, index) => {
            let dx = (targetX - canvas.width / 2) * star.speed * params.shootingStarSpeed;
            let dy = (targetY - canvas.height / 2) * star.speed * params.shootingStarSpeed;

            star.x += dx;
            star.y += dy + star.speed;
            
            star.trail.unshift({ x: star.x, y: star.y, opacity: star.opacity });
            if (star.trail.length > 20) star.trail.pop();

            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            star.trail.forEach((point, i) => {
                ctx.lineTo(point.x, point.y);
                point.opacity -= 0.05;
            });
            ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.stroke();

            star.opacity -= 0.01;

            if (star.opacity <= 0 || star.y > canvas.height) {
                shootingStars.splice(index, 1);
            }
        });

        requestAnimationFrame(animateStars);
    }

    resizeCanvas();
    requestAnimationFrame(animateStars);
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

document.addEventListener('DOMContentLoaded', createStarryBackground);