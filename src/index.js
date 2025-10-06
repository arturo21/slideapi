import * as slideapi from './slide/slideapi.js';

export const g = selector => {
  const el = getelem(selector);
  if (!el) return {};
  return {
    ...dom.methods(el),
    ...slideapi.initSlideshow(el),
    getSlideshow: () => slideapi.getSlideshow(el),
    registerSlideEffect: slideapi.registerEffect
  };
};

if (typeof window !== 'undefined') {
  window.g = g;
}
