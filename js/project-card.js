/**
 * ProjectCard - Renders individual project cards
 */

import { el, getThumbnail } from './utils.js';

/**
 * Create a single project card
 */
export function createCard(project) {
  const thumbnail = getThumbnail(project);
  const tags = project.tags?.join(',') || '';

  return el('a',
    {
      href: `project-page.html?id=${project.id}`,
      class: 'project-link',
      'data-tags': tags,
      'data-id': project.id
    },
    el('div', { class: 'project-card-container' },
      el('div', { class: 'project-card-thumbnail' },
        el('img', {
          src: thumbnail?.src || '/data/assets/placeholder.png',
          alt: `${project.title} preview`
        })
      ),
      el('div', { class: 'project-card-text' },
        el('h3', {}, project.title),
        el('p', { class: 'project-teaser' }, project.teaser || '')
      )
    )
  );
}

/**
 * Render all project cards to container
 */
export function renderCards(projects, container) {
  projects.forEach(project => {
    container.appendChild(createCard(project));
  });
}