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

// A soft pointer glow and restrained card tilt are enabled only on fine pointers.
const finePointer = window.matchMedia("(pointer: fine)").matches;
if (finePointer && !reduceMotion) {
  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
  }, { passive: true });

  document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 2.5}deg) rotateY(${x * 2.5}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

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

// Give each navigation label a subtle letter-scatter micro-interaction on activation.
document.querySelectorAll(".site-nav a").forEach((link) => {
  if (!link.dataset.originalLabel) link.dataset.originalLabel = link.textContent.trim();
  const label = link.dataset.originalLabel;
  link.textContent = "";
  [...label].forEach((character, index) => {
    const letter = document.createElement("span");
    letter.className = "nav-letter";
    letter.textContent = character === " " ? "\u00a0" : character;
    letter.style.setProperty("--scatter-rotate", `${index % 2 ? 7 : -7}deg`);
    letter.style.animationDelay = `${index * 12}ms`;
    link.appendChild(letter);
  });
  link.addEventListener("click", () => {
    link.classList.remove("nav-scattering");
    void link.offsetWidth;
    link.classList.add("nav-scattering");
    window.setTimeout(() => link.classList.remove("nav-scattering"), 520);
  });
});
