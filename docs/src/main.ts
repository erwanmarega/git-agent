import "./style.css";
import { renderNavbar } from "./components/Navbar";
import { renderHero } from "./components/Hero";
import { renderFeatures } from "./components/Features";
import { renderInstallation } from "./components/Installation";
import { renderUsage } from "./components/Usage";
import { renderLocalDev } from "./components/LocalDev";
import { renderAPI } from "./components/API";
import { renderConfiguration } from "./components/Configuration";
import { renderFooter } from "./components/Footer";

type Section = "home" | "installation" | "usage" | "local" | "api" | "configuration";

let currentSection: Section = "home";

function navigateTo(section: Section): void {
  currentSection = section;
  render();

  window.location.hash = section === "home" ? "" : section;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

(window as any).navigateTo = navigateTo;

function handleHashChange(): void {
  const hash = window.location.hash.slice(1) as Section;
  if (
    hash &&
    ["installation", "usage", "local", "api", "configuration"].includes(hash)
  ) {
    currentSection = hash;
  } else {
    currentSection = "home";
  }
  render();
}

function render(): void {
  const app = document.querySelector<HTMLDivElement>("#app")!;

  let content = "";

  content += renderNavbar(currentSection);

  content += '<main class="main-content">';

  if (currentSection === "home") {
    content += renderHero();
    content += renderFeatures();
    content += `
      <section class="py-20 px-6">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="section-title">Prêt à commencer ?</h2>
          <p class="section-subtitle mx-auto mb-8">Installez Git Agent en quelques secondes et transformez votre workflow Git.</p>
          <button onclick="navigateTo('installation')" class="btn-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Installer maintenant
          </button>
        </div>
      </section>
    `;
  } else if (currentSection === "installation") {
    content += renderInstallation();
  } else if (currentSection === "usage") {
    content += renderUsage();
  } else if (currentSection === "local") {
    content += renderLocalDev();
  } else if (currentSection === "api") {
    content += renderAPI();
  } else if (currentSection === "configuration") {
    content += renderConfiguration();
  }

  content += renderFooter();

  content += '</main>';

  app.innerHTML = content;

  addCopyFunctionality();
}

function addCopyFunctionality(): void {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const codeBlock = target.closest(".code-wrapper")?.querySelector("code");
      if (codeBlock) {
        await navigator.clipboard.writeText(codeBlock.textContent || "");
        target.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        `;
        setTimeout(() => {
          target.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          `;
        }, 2000);
      }
    });
  });
}

window.addEventListener("hashchange", handleHashChange);
handleHashChange();
