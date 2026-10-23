const yearNode = document.querySelector("#year");
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealNodes = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

  revealNodes.forEach((node, index) => {
    node.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 75}ms`);
    observer.observe(node);
  });
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

// Scroll progress gives the page a subtle instrument-panel feel.
const progressFill = document.querySelector("#scroll-progress-fill");
let scrollTicking = false;
function updateScrollProgress() {
  if (!progressFill) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressFill.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  scrollTicking = false;
}
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollProgress);
    scrollTicking = true;
  }
}, { passive: true });
updateScrollProgress();

// Keep hover feedback stable: avoid pointer-following transforms that can jitter on cards.
// Mark the section currently being viewed in the navigation.
const navLinks = [...document.querySelectorAll(".site-nav a")];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -60% 0px" });
  observedSections.forEach((section) => navObserver.observe(section));
}

  
// Realistic click feedback: a soft ripple begins exactly where the user presses.
document.querySelectorAll(".button, .header-cta, .project-link").forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    if (reduceMotion || event.button !== 0) return;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "button-ripple";
    ripple.setAttribute("aria-hidden", "true");
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.querySelectorAll(".button-ripple").forEach((oldRipple) => oldRipple.remove());
    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });
});


// Contact dropdown: support touch/click as well as hover and keyboard.
const contactDropdown = document.querySelector(".contact-dropdown");
const contactTrigger = document.querySelector(".contact-trigger");
if (contactDropdown && contactTrigger) {
  const closeContactMenu = () => {
    contactDropdown.classList.remove("is-open");
    contactTrigger.setAttribute("aria-expanded", "false");
  };
  contactTrigger.addEventListener("pointermove", (event) => {
    const rect = contactTrigger.getBoundingClientRect();
    contactTrigger.style.setProperty("--liquid-x", `${event.clientX - rect.left}px`);
    contactTrigger.style.setProperty("--liquid-y", `${event.clientY - rect.top}px`);
  });
  contactTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    const open = !contactDropdown.classList.contains("is-open");
    contactDropdown.classList.toggle("is-open", open);
    contactTrigger.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (event) => {
    if (!contactDropdown.contains(event.target)) closeContactMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeContactMenu();
      contactTrigger.focus();
    }
  });
  contactDropdown.querySelectorAll(".contact-menu-item").forEach((link) => {
    link.addEventListener("click", closeContactMenu);
  });
}

// Keep navigation labels as normal text for stable rendering and accessible focus.
