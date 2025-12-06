/* ============================
   FADE-IN ON SCROLL
============================ */
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.3,
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        }
    });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));


/* ============================
   TYPING ANIMATION
============================ */
const roles = [
    "Electrical Engineer",
    "Python Enthusiast",
    "Computer Software",
    "Financial Modeller",
    "Creative"
];

let index = 0;
let char = 0;

function typeRole() {
    char++;
    document.getElementById("typed").textContent = roles[index].slice(0, char);

    if (char === roles[index].length) {
        setTimeout(() => {
            char = 0;
            index = (index + 1) % roles.length;
            typeRole();
        }, 1200);
    } else {
        setTimeout(typeRole, 80);
    }
}
typeRole();


/* ============================
   SMOOTH STAGGERED TIMELINE REVEAL
============================ */
const revealItems = document.querySelectorAll(".reveal");

function revealTimeline() {
    let delay = 0;
    revealItems.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            setTimeout(() => {
                el.classList.add("visible");
            }, delay);
            delay += 180; 
        }
    });
}
window.addEventListener("scroll", revealTimeline);
revealTimeline();


/* ============================
   PARTICLE BACKGROUND
============================ */
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector(".hero-area").offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];
const NUM = 60;

for (let i = 0; i < NUM; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 2 + Math.random() * 2
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = "rgba(102, 252, 241, 0.8)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach(other => {
            const dist = Math.hypot(p.x - other.x, p.y - other.y);
            if (dist < 120) {
                ctx.strokeStyle = "rgba(102, 252, 241, 0.15)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(drawParticles);
}
drawParticles();
