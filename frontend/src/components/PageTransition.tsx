import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper component that adds a fade-in + slide-up transition to page content.
 *
 * Uses framer-motion's AnimatePresence-compatible motion.div with:
 * - Initial: opacity 0, y: 20
 * - Animate: opacity 1, y: 0
 * - Exit: opacity 0, y: -20
 * - Duration: 0.3s
 *
 * @example
 * ```tsx
 * <PageTransition>
 *   <div>Page content here</div>
 * </PageTransition>
 * ```
 */
export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
