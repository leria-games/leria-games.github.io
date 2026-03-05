/**
 * Header component - loads and manages navigation
 */
import { loadHTML } from './utils.js';
import { PROJECTS } from '../data/projects.js';

export async function initHeader() {
  const headerElement = await loadHTMLComponent('#site-header', '/components/header.html');
  if (!headerElement)
    return;
  
  setupBurger();
  setupRandomProjectLink();
}

export async function initFooter() {
  const footerElement = await loadHTMLComponent('#site-footer', '/components/footer.html');
  if (!footerElement) 
    return;

  const yearSpan = footerElement.querySelector('#current-year');
  if (yearSpan) 
    yearSpan.textContent = new Date().getFullYear();
}

async function loadHTMLComponent(elementId, componentPath) {
  const element = await loadHTML(elementId, componentPath);

  if (!element) {
    console.error(`Failed to load ${elementId}`);
    return;
  }
  return element;
}

function setupBurger() {
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupRandomProjectLink() {
  const randomLink = document.getElementById('random-project-link');
  if (!randomLink) return;

  // Get all project IDs
  const projectIds = PROJECTS.map(project => project.id);

  randomLink.addEventListener('click', (e) => {
    e.preventDefault();
    const randomId = projectIds[Math.floor(Math.random() * projectIds.length)];
    window.location.href = `/project-page.html?id=${randomId}`;
  });
}