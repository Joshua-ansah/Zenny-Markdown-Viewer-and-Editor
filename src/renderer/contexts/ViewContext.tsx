import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type ViewMode = 'editor' | 'preview' | 'split';

interface ViewContextValue {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleView: () => void;
  isTreeVisible: boolean;
  setTreeVisible: (visible: boolean) => void;
  toggleTreeVisibility: () => void;
}

const ViewContext = createContext<ViewContextValue | undefined>(undefined);

interface ViewProviderProps {
  children: ReactNode;
}

export function ViewProvider({ children }: ViewProviderProps) {
  const [viewMode, setViewModeState] = useState<ViewMode>('split');
  const [isTreeVisible, setIsTreeVisible] = useState<boolean>(true);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    // Persist to localStorage for next session
    try {
      localStorage.setItem('zenny-view-mode', mode);
    } catch (error) {
      console.error('Failed to save view mode preference:', error);
    }
  }, []);

  const setTreeVisible = useCallback((visible: boolean) => {
    setIsTreeVisible(visible);
    try {
      localStorage.setItem('zenny-tree-visible', String(visible));
    } catch (error) {
      console.error('Failed to save tree visibility preference:', error);
    }
  }, []);

  const toggleTreeVisibility = useCallback(() => {
    setIsTreeVisible((current) => {
      const newValue = !current;
      try {
        localStorage.setItem('zenny-tree-visible', String(newValue));
      } catch (error) {
        console.error('Failed to save tree visibility preference:', error);
      }
      return newValue;
    });
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

  // Load saved preferences on mount
  React.useEffect(() => {
    try {
      const savedViewMode = localStorage.getItem('zenny-view-mode');
      if (savedViewMode && (savedViewMode === 'editor' || savedViewMode === 'preview' || savedViewMode === 'split')) {
        setViewModeState(savedViewMode);
      }

      const savedTreeVisible = localStorage.getItem('zenny-tree-visible');
      if (savedTreeVisible !== null) {
        setIsTreeVisible(savedTreeVisible === 'true');
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, []);

  const value: ViewContextValue = {
    viewMode,
    setViewMode,
    toggleView,
    isTreeVisible,
    setTreeVisible,
    toggleTreeVisibility,
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
