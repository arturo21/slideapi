/**
 * Slideshow plugin for general.js
 * Modular, extensible, declarative, and traceable
 * @author Arturo Vásquez
 */

const registry = new Map();
const effects = {
  fade: el => el.classList.add('fx-fade'),
  slide: el => el.classList.add('fx-slide'),
  none: el => (el.style.opacity = 1)
};

/**
 * Registers a new visual effect
 * @param {string} name - Effect name
 * @param {function} fn - Function that applies the effect to a slide element
 */
export function registerEffect(name, fn) {
  effects[name] = fn;
}

/**
 * Initializes a slideshow on the given element
 * @param {HTMLElement} el - Target container
 * @returns {object} - API methods for controlling the slideshow
 */
export function initSlideshow(el) {
  const slides = Array.from(el.children).filter(c => c.tagName !== 'SCRIPT');
  const fx = el.dataset.slideFx || 'fade';
  const timeout = parseInt(el.dataset.slideTimeout || '3000');
  const autoheight = el.dataset.slideAutoheight === 'true';
  const meta = el.dataset.slideMeta === 'true';
  const id = el.id || `slide-${Date.now()}`;
  el.id = id;

  let index = 0;
  let interval = null;

  slides.forEach((s, i) => {
    s.classList.add('slide-frame');
    s.style.display = i === 0 ? 'block' : 'none';
    s.dataset.slideIndex = i;
    if (meta) s.dataset.slideState = i === 0 ? 'active' : 'inactive';
  });

  /**
   * Shows a specific slide by index
   * @param {number} i - Slide index
   */
  function show(i) {
    slides.forEach((s, j) => {
      s.style.display = j === i ? 'block' : 'none';
      s.classList.remove('fx-fade', 'fx-slide');
      if (j === i) effects[fx]?.(s);
      if (autoheight) el.style.height = s.offsetHeight + 'px';
      if (meta) {
        s.dataset.slideState = j === i ? 'active' : 'inactive';
        el.dataset.slideIndex = i;
      }
    });
  }

  /**
   * Advances to the next slide
   */
  function next() {
    index = (index + 1) % slides.length;
    show(index);
  }

  /**
   * Goes back to the previous slide
   */
  function prev() {
    index = (index - 1 + slides.length) % slides.length;
    show(index);
  }

  /**
   * Goes to a specific slide
   * @param {number} i - Slide index
   */
  function go(i) {
    index = i % slides.length;
    show(index);
  }

  /**
   * Starts the slideshow autoplay
   */
  function play() {
    interval = setInterval(next, timeout);
  }

  /**
   * Pauses the slideshow autoplay
   */
  function pause() {
    clearInterval(interval);
  }

  /**
   * Destroys the slideshow and cleans up
   */
  function destroy() {
    pause();
    el.innerHTML = '';
    registry.delete(id);
  }

  /**
   * Returns the current slide index
   * @returns {number}
   */
  function getCurrentSlide() {
    return index;
  }

  /**
   * Returns metadata of the current slide
   * @returns {object}
   */
  function getSlideMeta() {
    const s = slides[index];
    return {
      index,
      caption: s.dataset.caption || null,
      state: s.dataset.slideState || 'active',
      element: s
    };
  }

  /**
   * Adds a new slide dynamically
   * @param {HTMLElement} node - Slide element
   * @param {object} metaData - Optional metadata
   */
  function addSlide(node, metaData = {}) {
    node.classList.add('slide-frame');
    node.style.display = 'none';
    node.dataset.slideIndex = slides.length;
    if (meta) node.dataset.slideState = 'inactive';
    Object.entries(metaData).forEach(([k, v]) => node.dataset[k] = v);
    el.appendChild(node);
    slides.push(node);
  }

  /**
   * Removes a slide by index
   * @param {number} i - Slide index
   */
  function removeSlide(i) {
    const s = slides[i];
    if (s) {
      el.removeChild(s);
      slides.splice(i, 1);
      if (index >= slides.length) index = 0;
      show(index);
    }
  }

  /**
   * Changes the effect dynamically
   * @param {string} name - Effect name
   */
  function setFx(name) {
    if (effects[name]) fx = name;
  }

  // Declarative navigation
  document.querySelectorAll(`[data-slide-prev="${id}"]`).forEach(btn => btn.onclick = prev);
  document.querySelectorAll(`[data-slide-next="${id}"]`).forEach(btn => btn.onclick = next);
  document.querySelectorAll(`[data-slide-go][data-slide-target="${id}"]`).forEach(btn => {
    btn.onclick = () => go(parseInt(btn.dataset.slideGo));
  });

  // Debug info
  console.groupCollapsed(`📦 Slideshow initialized: ${id}`);
  console.log('Total slides:', slides.length);
  console.log('Effect:', fx);
  console.log('Timeout:', timeout);
  console.log('Autoheight:', autoheight);
  console.groupEnd();

  show(index);
  play();

  const api = {
    slideNext: next,
    slidePrev: prev,
    slideGo: go,
    slidePause: pause,
    slidePlay: play,
    slideDestroy: destroy,
    getCurrentSlide,
    getSlideMeta,
    addSlide,
    removeSlide,
    setFx
  };

  registry.set(id, api);
  return api;
}

/**
 * Returns the API instance for a slideshow by element or ID
 * @param {HTMLElement|string} elOrId
 * @returns {object|null}
 */
export function getSlideshow(elOrId) {
  const id = typeof elOrId === 'string' ? elOrId : elOrId.id;
  return registry.get(id) || null;
}
