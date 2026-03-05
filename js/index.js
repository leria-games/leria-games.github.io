/**
 * Index page - Main portfolio page
 */
import { PROJECTS } from '../data/projects.js';
import { initHeader, initFooter } from './site-header-footer.js';
import { renderCards } from './project-card.js';
import { el } from './utils.js';

async function init() {
  await initHeader();
  await initFooter();

  const grid = document.getElementById('project-grid');
  if (grid) {
    renderCards(PROJECTS, grid);
    renderFilterTags();
  }

  setupBackToTopButton();
}

/**
 * Apply filter from URL parameter (e.g., ?filter=Unity)
 * Called after overflow detection so .filter-tag-overflow classes exist.
 */
function applyFilterFromURL() {
  const params = new URLSearchParams(window.location.search);
  const filterTag = params.get('filter');
  if (!filterTag) return;

  const isHidden = document.querySelector(
    `.filter-tag-overflow[data-filter="${CSS.escape(filterTag)}"]`
  );
  if (isHidden) {
    setTagsExpanded(true);
  }
  filterProjects(filterTag);
}

/**
 * Expand or collapse the overflow filter tags.
 * Single source of truth for toggle state + button text.
 */
function setTagsExpanded(expanded) {
  const container = document.getElementById('filter-tags');
  const toggleBtn = container?.querySelector('.filter-tag-toggle');
  if (!container || !toggleBtn) return;

  container.classList.toggle('expanded', expanded);
  if (expanded) {
    toggleBtn.textContent = 'Less';
  }
  else {
    const count = container.querySelectorAll('.filter-tag-overflow').length;
    toggleBtn.textContent = `+${count} more`;
  }
}

// Tags that always appear first (in this order)
const PINNED_TAGS = [
  'Unity',
  'Training',
  'Educational',
  'Research',
  'Professional',
  'Virtual Reality',
  'Mobile',
  'Windows'
];

// Tags that work as title descriptors (e.g., "Training Projects")
const TITLE_TAGS = new Set([
  'Unity',
  'Training',
  'Educational',
  'Research',
  'Mobile',
  'Virtual Reality',
  'Godot Engine',
  'Android',
  'iOS',
  'MedTech',
  'Professional',
  'Windows',
  'Multiplayer Networking',
]);

/**
 * Extract unique tags from all projects and render filter chips
 * Shows pinned tags first, then popular tags. Only first row visible; "More" expands.
 */
function renderFilterTags() {
  const container = document.getElementById('filter-tags');
  if (!container) return;

  // Count tag occurrences
  const tagCounts = new Map();
  PROJECTS.forEach(project => {
    project.tags?.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // Sort tags by count (descending), then alphabetically
  const sortedByPopularity = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);

  // Pinned tags first (if they exist in projects), then remaining by popularity
  const pinnedSet = new Set(PINNED_TAGS.filter(tag => tagCounts.has(tag)));
  const orderedTags = [
    ...pinnedSet,
    ...sortedByPopularity.filter(tag => !pinnedSet.has(tag))
  ];

  // Create "All" button first
  const allBtn = el('button', {
    class: 'filter-tag active',
    'data-filter': 'all',
    type: 'button'
  }, 'All');
  allBtn.addEventListener('click', () => filterProjects(null));
  container.appendChild(allBtn);

  // Create all tag buttons
  const tagBtns = orderedTags.map(tag => {
    const btn = createTagButton(tag);
    container.appendChild(btn);
    return btn;
  });

  // Toggle button
  const toggleBtn = el('button', {
    class: 'filter-tag filter-tag-toggle',
    type: 'button'
  });
  container.appendChild(toggleBtn);

  // After layout: hide tags that overflow the first row
  requestAnimationFrame(() => {
    const firstRowTop = allBtn.offsetTop;
    const overflowing = tagBtns.filter(btn => btn.offsetTop > firstRowTop);

    if (overflowing.length === 0) {
      toggleBtn.remove();
      applyFilterFromURL();
      return;
    }

    overflowing.forEach(btn => btn.classList.add('filter-tag-overflow'));
    toggleBtn.textContent = `+${overflowing.length} more`;

    toggleBtn.addEventListener('click', () => {
      setTagsExpanded(!container.classList.contains('expanded'));
    });

    // Apply URL filter now that overflow detection is complete
    applyFilterFromURL();
  });
}

/**
 * Create a filter tag button
 */
function createTagButton(tag) {
  const btn = el('button', {
    class: 'filter-tag',
    'data-filter': tag,
    type: 'button'
  }, tag);
  btn.addEventListener('click', () => filterProjects(tag));
  return btn;
}

/**
 * Filter projects by tag
 */
function filterProjects(tag) {
  const cards = document.querySelectorAll('.project-link');
  const filterTags = document.querySelectorAll('.filter-tag');

  updateProjectsTitle(tag);

  const url = new URL(window.location);
  if (tag) {
    url.searchParams.set('filter', tag);
  } else {
    url.searchParams.delete('filter');
  }
  history.replaceState(null, '', url);

  // Update active state on filter buttons
  filterTags.forEach(btn => {
    const isActive = (tag === null && btn.dataset.filter === 'all') ||
                     btn.dataset.filter === tag;
    btn.classList.toggle('active', isActive);
  });

  // Filter cards
  cards.forEach(card => {
    const cardTags = card.dataset.tags?.split(',') || [];
    const shouldShow = tag === null || cardTags.includes(tag);

    if (shouldShow) {
      card.classList.remove('hidden');
      card.querySelector('.project-card-container').style.animation = 'fadeInUp 0.4s ease forwards';
    }
    else {
      card.classList.add('hidden');
    }
  });

}

/**
 * Update the projects section title with animated tag
 * Only updates for tags in TITLE_TAGS that make grammatical sense
 */
function updateProjectsTitle(tag) {
  const titleTag = document.getElementById('projects-title-tag');
  if (!titleTag) return;

  const showInTitle = tag && TITLE_TAGS.has(tag);

  titleTag.classList.remove('visible');
  setTimeout(() => {
    titleTag.textContent = showInTitle ? tag + ' ' : '';
    if (showInTitle) titleTag.classList.add('visible');
  }, 150);
}

/**
 * Setup back to top button
 */
function setupBackToTopButton() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  // Show/hide based on scroll position
  const toggleVisibility = () => {
    const shouldShow = window.scrollY > 400;
    btn.classList.toggle('visible', shouldShow);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility(); // Initial check

  // Scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
}
else {
  init();
}
