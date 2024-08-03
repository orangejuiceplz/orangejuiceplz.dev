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

    // adj parameters
    const params = {
        starSpeed: 0.01,
        shootingStarSpeed: 0.05,
        movementSmoothing: 0.05,
        maxShootingStars: 10,          // max number of shooting stars on screen
        shootingStarProbability: 0.005 // prob of creating a new shooting star each frame
    };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = 'rgb(22,22,36)';
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
            trail: [],
            trailLifetime: 1000 // Trail will last for 1 second
        };
    }

    function animateStars(timestamp) {
        // Clear the entire canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw the background
        ctx.fillStyle = 'rgb(22,22,36)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // smooth mouse movement
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

        // occasionally create a new shooting star
        if (shootingStars.length < params.maxShootingStars && Math.random() < params.shootingStarProbability) {
            shootingStars.push(createShootingStar());
        }

        shootingStars.forEach((star, index) => {
            let dx = (targetX - canvas.width / 2) * star.speed * params.shootingStarSpeed;
            let dy = (targetY - canvas.height / 2) * star.speed * params.shootingStarSpeed;

            star.x += dx;
            star.y += dy + star.speed;
            
            const currentTime = timestamp;
            star.trail.unshift({ x: star.x, y: star.y, opacity: star.opacity, time: currentTime });
            
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            star.trail = star.trail.filter((point, i) => {
                const age = currentTime - point.time;
                if (age < star.trailLifetime) {
                    const lifeProgress = age / star.trailLifetime;
                    point.opacity = star.opacity * (1 - lifeProgress);
                    ctx.lineTo(point.x, point.y);
                    return true;
                }
                return false;
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