/**
 * Project detail page
 */

import { PROJECTS } from '../data/projects.js';
import { initFooter, initHeader } from './site-header-footer.js';
import {
  renderTags,
  renderDescription,
  renderContributions,
  renderVideos,
  renderLinksSection,
  renderDerivedProjects,
  renderPublications,
  renderBanner,
  renderGallery,
  renderBannerInfo
} from './project-renderer.js';

/**
 * Get project from URL parameter
 */
function getProject() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) return null;

  return PROJECTS.find(p => p.id === id);
}

/**
 * Render project content
 */
function renderProject(project) {
  document.title = `${project.title} - Portfolio`;
  document.getElementById('project-title').textContent = project.title;

  renderGallery(document.getElementById('image-gallery'), project);
  renderBanner(document.getElementById('project-thumbnail'), project);
  renderBannerInfo(document.getElementById('project-banner-details'), project);
  renderTags(document.getElementById('tags'), project.tags);
  renderDescription(document.getElementById('description'), project.description);
  renderContributions(document.getElementById('core-contributions'), project.coreTechnicalContributions);
  renderVideos(document.getElementById('videos'), project.videos);
  renderLinksSection(document.getElementById('links'), project.links);
  renderDerivedProjects(document.getElementById('archived-versions'), project.derivedProjects);
  renderPublications(document.getElementById('publications'), project.publications);
}

/**
 * Show error page
 */
function showError() {
  document.body.innerHTML = `
    <div style="text-align: center; padding: 4rem;">
      <h1>Project Not Found</h1>
      <p><a href="/" class="url-text">← Back to Home</a></p>
    </div>
  `;
}

async function init() {
  const project = getProject();

  if (!project) {
    showError();
    return;
  }

  await initHeader();
  await initFooter();
  renderProject(project);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
}
else {
  init();
}