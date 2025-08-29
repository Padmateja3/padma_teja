// Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// ScrollReveal Animations
ScrollReveal().reveal(".section__header", {
  delay: 200,
  distance: "50px",
  origin: "left",
  duration: 800
});

ScrollReveal().reveal(".service__card, .portfolio__card", {
  interval: 200,
  distance: "60px",
  origin: "bottom",
  duration: 900
});

ScrollReveal().reveal(".header__image, .header__content", {
  distance: "80px",
  origin: "top",
  duration: 1000
});
