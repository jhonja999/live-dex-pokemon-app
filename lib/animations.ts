import { SPRING_CONFIG, ANIMATION_DURATION } from './designTokens'

/**
 * Global Framer Motion animation variants
 * Used consistently across the app
 */

export const cardHover = {
  scale: 1.05,
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  transition: {
    type: 'spring',
    ...SPRING_CONFIG.normal,
  },
}

export const cardTap = {
  scale: 0.98,
  transition: {
    duration: ANIMATION_DURATION.fast / 1000,
  },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: ANIMATION_DURATION.normal / 1000,
  },
}

export const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: {
    type: 'spring',
    ...SPRING_CONFIG.normal,
  },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: {
    type: 'spring',
    ...SPRING_CONFIG.normal,
  },
}

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: {
    type: 'spring',
    ...SPRING_CONFIG.normal,
  },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: {
    type: 'spring',
    ...SPRING_CONFIG.normal,
  },
}

export const flipCard = {
  initial: { rotationY: 0 },
  animate: { rotationY: 180 },
  exit: { rotationY: 0 },
  transition: {
    duration: ANIMATION_DURATION.slow / 1000,
    type: 'spring',
    ...SPRING_CONFIG.normal,
  },
}

export const pulseAnimation = {
  animate: {
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
}

export const shimmerAnimation = {
  initial: { backgroundPosition: '0% 0%' },
  animate: { backgroundPosition: '100% 100%' },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: 'loop' as const,
  },
}

export const bounceAnimation = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
    },
  },
}

/**
 * Animation timing constants
 */
export const TIMING = {
  fast: ANIMATION_DURATION.fast / 1000,
  normal: ANIMATION_DURATION.normal / 1000,
  slow: ANIMATION_DURATION.slow / 1000,
} as const
