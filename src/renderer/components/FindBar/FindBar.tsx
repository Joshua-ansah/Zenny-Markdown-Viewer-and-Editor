import React, { useEffect, useRef } from 'react';
import styles from './FindBar.module.css';

interface FindBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  currentMatch: number;
  totalMatches: number;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

export function FindBar({
  searchTerm,
  onSearchTermChange,
  currentMatch,
  totalMatches,
  onNext,
  onPrevious,
  onClose,
}: FindBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        onPrevious();
      } else {
        onNext();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const renderCounter = () => {
    if (!searchTerm.trim()) {
      return null;
    }
    if (totalMatches === 0) {
      return <span className={styles.counter}>No results</span>;
    }
    return (
      <span className={styles.counter}>
        {currentMatch} of {totalMatches}
      </span>
    );
  };

  return (
    <div className={styles.findBar}>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder="Find in page..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {renderCounter()}
      <button
        className={styles.button}
        onClick={onPrevious}
        disabled={totalMatches === 0}
        title="Previous (Shift+Enter)"
        aria-label="Previous match"
      >
        ↑
      </button>
      <button
        className={styles.button}
        onClick={onNext}
        disabled={totalMatches === 0}
        title="Next (Enter)"
        aria-label="Next match"
      >
        ↓
      </button>
      <button
        className={styles.closeButton}
        onClick={onClose}
        title="Close (Escape)"
        aria-label="Close find bar"
      >
        ✕
      </button>
    </div>
  );
}
