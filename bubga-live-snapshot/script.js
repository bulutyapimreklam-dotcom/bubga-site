const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const modal = document.querySelector(".showreel-modal");
const openShowreel = document.querySelector("[data-open-showreel]");
const closeShowreel = document.querySelector("[data-close-showreel]");
const revealTargets = document.querySelectorAll(
  ".media-simple-section, .business-lines, .line-list span, .partners, .split-title, .project-card, .process .section-head, .process-grid article, .services .section-head, .service-grid article, .about-band, .testimonials .section-head, blockquote, .faq .section-head, details, .site-footer > *"
);
const countTargets = document.querySelectorAll("[data-count]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

revealTargets.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
});

if (menuToggle && header) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (header && menuToggle) {
      header.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

if (openShowreel) {
  openShowreel.addEventListener("click", () => {
    modal.showModal();
  });
}

if (closeShowreel) {
  closeShowreel.addEventListener("click", () => {
    modal.close();
  });
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
}

const animateCount = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}+`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if (reduceMotion) {
  revealTargets.forEach((item) => item.classList.add("in-view"));
  countTargets.forEach((item) => {
    item.textContent = `${item.dataset.count}+`;
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((item) => revealObserver.observe(item));

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  countTargets.forEach((item) => countObserver.observe(item));

  window.addEventListener(
    "scroll",
    () => {
      document.documentElement.style.setProperty("--hero-shift", String(window.scrollY * 0.12));
    },
    { passive: true }
  );
}
