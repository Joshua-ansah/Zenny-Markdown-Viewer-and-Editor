import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface NavigationContextType {
  history: string[];
  currentIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  pushHistory: (path: string) => void;
  goBack: () => string | null;
  goForward: () => string | null;
  clearHistory: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
}

const MAX_HISTORY = 50;

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  const pushHistory = useCallback((path: string) => {
    setHistory(prevHistory => {
      // If we're not at the end of history, clear forward history
      const trimmedHistory = prevHistory.slice(0, currentIndex + 1);

      // Don't add if it's the same as the current path
      if (trimmedHistory[trimmedHistory.length - 1] === path) {
        return prevHistory;
      }

      // Add new path
      const newHistory = [...trimmedHistory, path];

      // Increment current index since we're adding a new item
      setCurrentIndex(currentIndex + 1);

      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        return newHistory.slice(newHistory.length - MAX_HISTORY);
      }
      return newHistory;
    });
  }, [currentIndex]);

  const goBack = useCallback((): string | null => {
    if (!canGoBack) return null;

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [canGoBack, currentIndex, history]);

  const goForward = useCallback((): string | null => {
    if (!canGoForward) return null;

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [canGoForward, currentIndex, history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  const value: NavigationContextType = {
    history,
    currentIndex,
    canGoBack,
    canGoForward,
    pushHistory,
    goBack,
    goForward,
    clearHistory,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
