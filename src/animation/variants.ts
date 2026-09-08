import { Variants } from 'framer-motion';

export const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const hoverLift: Variants = {
  hover: {
    y: -5,
    scale: 1.02,
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    transition: { type: 'spring', stiffness: 300 },
  },
};

export const iconBounce: Variants = {
  hover: {
    y: [-2, 2, -2],
    transition: { repeat: Infinity, repeatDelay: 2, duration: 0.6 },
  },
};