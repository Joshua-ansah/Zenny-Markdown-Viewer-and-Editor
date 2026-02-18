import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type ViewMode = 'editor' | 'preview' | 'split';

interface ViewContextValue {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleView: () => void;
}

const ViewContext = createContext<ViewContextValue | undefined>(undefined);

interface ViewProviderProps {
  children: ReactNode;
}

export function ViewProvider({ children }: ViewProviderProps) {
  const [viewMode, setViewModeState] = useState<ViewMode>('split');

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    // Persist to localStorage for next session
    try {
      localStorage.setItem('zenny-view-mode', mode);
    } catch (error) {
      console.error('Failed to save view mode preference:', error);
    }
  }, []);

  const toggleView = useCallback(() => {
    setViewModeState((current) => {
      const modes: ViewMode[] = ['editor', 'split', 'preview'];
      const currentIndex = modes.indexOf(current);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      
      // Persist to localStorage
      try {
        localStorage.setItem('zenny-view-mode', nextMode);
      } catch (error) {
        console.error('Failed to save view mode preference:', error);
      }
      
      return nextMode;
    });
  }, []);

  // Load saved preference on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('zenny-view-mode');
      if (saved && (saved === 'editor' || saved === 'preview' || saved === 'split')) {
        setViewModeState(saved);
      }
    } catch (error) {
      console.error('Failed to load view mode preference:', error);
    }
  }, []);

  const value: ViewContextValue = {
    viewMode,
    setViewMode,
    toggleView,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}

export function useView(): ViewContextValue {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}
