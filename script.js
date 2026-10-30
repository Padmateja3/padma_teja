// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("show"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("show")));

// ---------- Scroll progress + navbar + active link ----------
const progress = document.getElementById("progress");
const navbar = document.getElementById("navbar");
const sections = [...document.querySelectorAll("section[id], header[id]")];
const links = [...navLinks.querySelectorAll("a:not(.btn)")];

window.addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (scrollY / h) * 100 + "%";
  navbar.classList.toggle("scrolled", scrollY > 40);
  let current = "home";
  sections.forEach(s => { if (scrollY >= s.offsetTop - 140) current = s.id; });
  links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
}, { passive: true });

// ---------- Typing effect ----------
const roles = ["Full-Stack Developer", "Software Engineer (Fresher)", "React.js Developer", "Problem Solver"];
const typed = document.getElementById("typed");
let r = 0, c = 0, del = false;
(function type() {
  const word = roles[r];
  typed.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 40 : 85);
})();

// ---------- Reveal on scroll + counters ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 0.08 + "s";
  io.observe(el);
});

function countUp(el) {
  const target = +el.dataset.count, suffix = el.dataset.suffix || "";
  const start = performance.now(), dur = 1400;
  (function tick(t) {
    const p = Math.min((t - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

// ---------- 3D tilt (mouse) ----------
const canHover = matchMedia("(hover: hover)").matches;
if (canHover) {
  document.querySelectorAll(".tilt").forEach(el => {
    const max = +(el.dataset.tiltMax || 8);
    el.addEventListener("mousemove", e => {
      const b = el.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - 0.5;
      const y = (e.clientY - b.top) / b.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * max * 2}deg) rotateX(${-y * max * 2}deg) translateZ(10px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

// ---------- Spotlight lighting on glass cards ----------
document.querySelectorAll(".spot").forEach(el => {
  el.addEventListener("mousemove", e => {
    const b = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - b.left + "px");
    el.style.setProperty("--my", e.clientY - b.top + "px");
  });
});

// ---------- Cursor glow ----------
const glow = document.getElementById("cursor-glow");
addEventListener("mousemove", e => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; });

// ---------- Draggable 3D cube ----------
(() => {
  const cube = document.getElementById("cube");
  const wrap = cube.parentElement;
  let dragging = false, lx = 0, ly = 0, rx = -20, ry = 0;
  const apply = () => { cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; };
  const down = e => { dragging = true; cube.style.animation = "none"; const p = e.touches ? e.touches[0] : e; lx = p.clientX; ly = p.clientY; };
  const move = e => {
    if (!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    ry += (p.clientX - lx) * 0.6; rx -= (p.clientY - ly) * 0.6;
    lx = p.clientX; ly = p.clientY; apply();
  };
  const up = () => { dragging = false; };
  wrap.addEventListener("mousedown", down); addEventListener("mousemove", move); addEventListener("mouseup", up);
  wrap.addEventListener("touchstart", down, { passive: true });
  wrap.addEventListener("touchmove", move, { passive: true });
  wrap.addEventListener("touchend", up);
})();

// ---------- Particle network background ----------
(() => {
  const cv = document.getElementById("bg"), ctx = cv.getContext("2d");
  let w, h, pts = [], mouse = { x: -999, y: -999 };
  const size = () => {
    w = cv.width = innerWidth; h = cv.height = innerHeight;
    pts = Array.from({ length: Math.min(90, Math.floor(w * h / 18000)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      z: Math.random() * 0.8 + 0.4
    }));
  };
  addEventListener("resize", size); size();
  addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  (function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      // gentle parallax / repel from cursor
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 120) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.6 * p.z, 0, 7);
      ctx.fillStyle = "rgba(0,212,255,0.85)"; ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(124,92,255,${0.25 * (1 - d / 130)})`;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  })();
})();
