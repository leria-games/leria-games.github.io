/**
 * Lightweight DOM utilities for static sites
 * No build process required - works directly in browser
 */

/**
 * Creates an element with optional attributes and children
 */
export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    }
    else if (key.includes('-')) {
      element.setAttribute(key, value);
    }
    else {
      element[key] = value;
    }
  });
  
  // Append children
  children.flat().forEach(child => {
    if (child === null || child === undefined) return;
    
    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child));
    }
    else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  
  return element;
}


/**
 * Get thumbnail media object from a project
 */
export function getThumbnail(project) {
  if (!project.media?.length) return null;
  const images = project.media.filter(m => m.type === 'image');
  return images.find(m => m.role === 'thumbnail') || images[0];
}

/**
 * Load HTML from external file
 */
export async function loadHTML(selector, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const element = document.querySelector(selector);
    if (element) {
      element.innerHTML = html;
      // Wait for next tick to ensure DOM is parsed
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    return element;
  }
  catch (error) {
    console.error(`Failed to load ${url}:`, error);
    return null;
  }
}