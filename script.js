const projects = [
  {
    title: "Coding Practice Build",
    type: "Software project",
    year: "2026",
    summary:
      "A hands-on coding project focused on building structure, improving logic, and becoming more confident with creating useful technical work from scratch.",
    tags: ["Programming", "Problem solving", "Hands-on learning"],
    accent: "#cf5c43",
  },
  {
    title: "Research and Data Journal",
    type: "Data analysis practice",
    year: "2026",
    summary:
      "A structured project for organizing observations, studying trends, and building stronger analysis habits through research and pattern review.",
    tags: ["Research", "Trend analysis", "Pattern review"],
    accent: "#0e7d72",
  },
  {
    title: "Electronics Practice Project",
    type: "Engineering build",
    year: "2025",
    summary:
      "A practical electronics-focused build designed to strengthen understanding of components, circuits, and how technical systems behave in real use.",
    tags: ["Components", "Systems thinking", "Practical testing"],
    accent: "#d7a343",
  },
];

const projectGrid = document.querySelector("#project-grid");
const yearNode = document.querySelector("#year");
const revealNodes = document.querySelectorAll(".reveal");

if (projectGrid) {
  projectGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card" style="--project-accent: ${project.accent}">
          <div class="project-visual"></div>
          <div class="project-meta">
            <span>${project.type}</span>
            <span>${project.year}</span>
          </div>
          <h3>${project.title}</h3>
          <p class="project-summary">${project.summary}</p>
          <ul class="project-tags" aria-label="${project.title} highlights">
            ${project.tags.map((tag) => `<li>${tag}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}
