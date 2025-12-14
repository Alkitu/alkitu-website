// Centralized exports for all hooks

// DOM hooks
export {
  useElementRect,
  useElementWidth,
  useCenterOfElement,
  type ElementRect,
} from './dom/useElementRect';

export {
  useMousePosition,
  type MousePosition,
} from './dom/useMousePosition';

// UI hooks
export { useCarousel } from './ui/useCarousel';
export { usePagination } from './ui/usePagination';
export { default as useScreenWidth } from './ui/useScreenWidth';

// Data hooks
export {
  useMediumPosts,
  type MediumPost,
  type UseMediumPostsReturn,
} from './data/useMediumPosts';

// Routing hooks
export { useLocalizedPath } from './routing/useLocalizedPath';
