import { motion } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Base Skeleton Block                                               */
/* ------------------------------------------------------------------ */

interface SkeletonBlockProps {
  className?: string;
  width?: string;
  height?: string;
}

function SkeletonBlock({ className = '', width, height }: SkeletonBlockProps) {
  return (
    <div
      className={`bg-dark-700 rounded-lg animate-pulse ${className}`}
      style={{ width, height }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton Variants                                                 */
/* ------------------------------------------------------------------ */

/** Single shimmer line */
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
          height="0.75rem"
        />
      ))}
      <span className="sr-only">Loading text content...</span>
    </div>
  );
}

/** Skeleton card — mimics the .card utility */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`bg-dark-800 border border-dark-600 rounded-xl p-6 shadow-lg space-y-4 ${className}`}
      role="status"
      aria-label="Loading card"
    >
      {/* Header icon placeholder */}
      <div className="flex items-center gap-3">
        <SkeletonBlock className="rounded-full" width="2.5rem" height="2.5rem" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock width="40%" height="0.875rem" />
          <SkeletonBlock width="60%" height="1.25rem" />
        </div>
      </div>
      {/* Body lines */}
      <SkeletonText lines={2} />
      <span className="sr-only">Loading card content...</span>
    </motion.div>
  );
}

/** 3-column stats skeleton grid */
export function SkeletonStats({ className = '' }: { className?: string }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      role="status"
      aria-label="Loading statistics"
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.08 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
      <span className="sr-only">Loading statistics...</span>
    </div>
  );
}

/** Skeleton chart container */
export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-dark-800 border border-dark-600 rounded-xl p-4 ${className}`}
      role="status"
      aria-label="Loading chart"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between mb-4">
        <SkeletonBlock width="25%" height="1rem" />
        <SkeletonBlock width="5rem" height="1.5rem" />
      </div>
      {/* Chart area */}
      <div className="relative overflow-hidden rounded-lg bg-dark-700/50 animate-pulse" style={{ height: '16rem' }}>
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 -translate-x-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.04) 50%, transparent 100%)',
            animation: 'shimmer 2s infinite',
          }}
        />
      </div>
      {/* Legend dots */}
      <div className="flex items-center gap-4 mt-4">
        <SkeletonBlock width="4rem" height="0.75rem" />
        <SkeletonBlock width="4rem" height="0.75rem" />
      </div>
      <span className="sr-only">Loading chart data...</span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton Table                                                    */
/* ------------------------------------------------------------------ */

export function SkeletonTable({ rows = 4, className = '' }: { rows?: number; className?: string }) {
  return (
    <div
      className={`bg-dark-800 border border-dark-600 rounded-xl overflow-hidden ${className}`}
      role="status"
      aria-label="Loading table"
    >
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-dark-600 bg-dark-700/50">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} width={`${60 + (i % 2) * 20}%`} height="0.875rem" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-4 gap-4 p-4 border-b border-dark-700/50 last:border-b-0"
        >
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <SkeletonBlock key={colIndex} width={`${50 + (colIndex % 3) * 15}%`} height="0.75rem" />
          ))}
        </div>
      ))}
      <span className="sr-only">Loading table data...</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Default export — generic Skeleton wrapper                         */
/* ------------------------------------------------------------------ */

export default function Skeleton({ className = '' }: { className?: string }) {
  return <SkeletonBlock className={`rounded-lg ${className}`} />;
}
