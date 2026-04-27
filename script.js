const moodRange = document.getElementById("moodRange");
const barFill = document.getElementById("barFill");
const moodText = document.getElementById("moodText");
const noteCards = document.querySelectorAll(".note-card");
const toggleMode = document.getElementById("toggleMode");

const moodMessages = [
  { max: 20, text: "Crisp citrus glow with airy florals." },
  { max: 45, text: "Balanced bloom with sparkling elegance." },
  { max: 70, text: "Velvet rose rises over amber sweetness." },
  { max: 100, text: "Deep warm woods and sensual musk linger." },
];

moodRange.addEventListener("input", (event) => {
  const value = Number(event.target.value);
  barFill.style.width = `${value}%`;

  const selected = moodMessages.find((msg) => value <= msg.max);
  moodText.textContent = selected ? selected.text : moodMessages[1].text;

  const hue = 280 - value * 1.4;
  document.documentElement.style.setProperty("--accent", `hsl(${Math.max(hue, 18)} 90% 70%)`);
  document.documentElement.style.setProperty("--accent-2", `hsl(${Math.max(hue - 40, 0)} 84% 72%)`);
});

noteCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const color = card.dataset.color;
    card.style.background = `${color}30`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.background = "var(--card)";
  });
});

toggleMode.addEventListener("click", () => {
  const root = document.documentElement;
  const dark = getComputedStyle(root).getPropertyValue("--bg").trim() === "#0f0b1d";

  if (dark) {
    root.style.setProperty("--bg", "#fff7f2");
    root.style.setProperty("--text", "#3a2644");
    root.style.setProperty("--muted", "#6f5b79");
    root.style.setProperty("--card", "rgba(255, 255, 255, 0.8)");
    root.style.setProperty("--card-border", "rgba(58, 38, 68, 0.15)");
    document.body.style.background = "radial-gradient(circle at top right, #ffd2e2 0%, #fff7f2 55%, #ffe9f5 100%)";
  } else {
    root.style.setProperty("--bg", "#0f0b1d");
    root.style.setProperty("--text", "#f8f4ff");
    root.style.setProperty("--muted", "#d2c8ea");
    root.style.setProperty("--card", "rgba(255, 255, 255, 0.08)");
    root.style.setProperty("--card-border", "rgba(255, 255, 255, 0.2)");
    document.body.style.background = "radial-gradient(circle at top right, #251348 0%, #0f0b1d 50%, #08050f 100%)";
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const canvas = document.getElementById("petal-canvas");
const ctx = canvas.getContext("2d");
let width;
let height;
let particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function createParticles(count = 42) {
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2.5 + 1,
    speedY: Math.random() * 0.5 + 0.2,
    speedX: (Math.random() - 0.5) * 0.6,
    alpha: Math.random() * 0.5 + 0.2,
  }));
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p) => {
    p.y += p.speedY;
    p.x += p.speedX;

    if (p.y > height + 10) {
      p.y = -10;
      p.x = Math.random() * width;
    }

    if (p.x > width + 10) p.x = -10;
    if (p.x < -10) p.x = width + 10;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 180, 215, ${p.alpha})`;
    ctx.ellipse(p.x, p.y, p.r * 1.8, p.r, Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

resizeCanvas();
createParticles();
animateParticles();
