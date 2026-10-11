"use strict";

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Mobile menu ---------- */
const burger = $("#burger");
const menu = $("#menu");

function setMenu(open) {
  menu.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("#menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ---------- Navbar, progress bar, active link ---------- */
const nav = $("#nav");
const progress = $("#progress");
const sections = $$("main section[id]");
const links = $$("#menu a:not(.btn)");

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  nav.classList.toggle("scrolled", y > 40);
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

  let current = sections[0].id;
  sections.forEach((s) => {
    if (y + 140 >= s.offsetTop) current = s.id;
  });
  links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Typing effect ---------- */
const typedEl = $("#typed");
const words = ["video editor", "storyteller", "colorist", "motion designer"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  let w = 0, c = words[0].length, deleting = false;
  typedEl.textContent = words[0];

  function tick() {
    const word = words[w];
    if (deleting) {
      c--;
    } else {
      c++;
    }
    typedEl.textContent = word.slice(0, c);

    let delay = deleting ? 45 : 90;
    if (!deleting && c === word.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && c === 0) {
      deleting = false;
      w = (w + 1) % words.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 2200);
}

/* ---------- Counters ---------- */
function countUp(el) {
  const target = +el.dataset.count;
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------- Reveal on scroll + skills + timeline ---------- */
const timeline = $("#timeline");

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("show");

      $$("[data-count]", el).forEach(countUp);
      $$(".bar i", el).forEach((b) => (b.style.width = b.dataset.w + "%"));
      if (el === timeline) el.classList.add("play");

      io.unobserve(el);
    });
  },
  { threshold: 0.2 }
);
$$(".reveal").forEach((el) => io.observe(el));

/* ---------- Photo fallback (shows letter if image is missing) ---------- */
const photo = $("#myPhoto");
const frame = $(".photo-frame");
function checkPhoto() {
  if (!photo.complete || photo.naturalWidth === 0) frame.classList.add("no-photo");
}
photo.addEventListener("error", () => frame.classList.add("no-photo"));
if (photo.complete) checkPhoto();

/* ---------- Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
