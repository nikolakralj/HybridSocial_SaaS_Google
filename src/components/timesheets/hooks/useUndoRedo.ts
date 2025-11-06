import { useState, useCallback, useRef } from 'react';

interface HistoryState<T> {
  state: T;
  timestamp: number;
  description?: string;
}

interface UseUndoRedoOptions<T> {
  maxHistory?: number;
  onUndo?: (state: T) => void;
  onRedo?: (state: T) => void;
}

export function useUndoRedo<T>(
  initialState: T,
  options: UseUndoRedoOptions<T> = {}
) {
  const { maxHistory = 50, onUndo, onRedo } = options;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<HistoryState<T>[]>([
    { state: initialState, timestamp: Date.now() }
  ]);

  const isUndoingRef = useRef(false);

  // Get current state
  const currentState = history[currentIndex].state;

  // Push new state to history
  const pushState = useCallback((state: T, description?: string) => {
    // Don't push if we're currently undoing/redoing
    if (isUndoingRef.current) return;

    setHistory(prev => {
      // Remove any future states (after current index)
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push({
        state,
        timestamp: Date.now(),
        description,
      });

      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
        setCurrentIndex(newHistory.length - 1);
      } else {
        setCurrentIndex(newHistory.length - 1);
      }

      return newHistory;
    });
  }, [currentIndex, maxHistory]);

  // Undo
  const undo = useCallback(() => {
    if (currentIndex <= 0) return;

    isUndoingRef.current = true;
    const newIndex = currentIndex - 1;
    const previousState = history[newIndex].state;
    
    setCurrentIndex(newIndex);
    onUndo?.(previousState);
    
    // Reset flag after state update
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 0);
  }, [currentIndex, history, onUndo]);

  // Redo
  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) return;

    isUndoingRef.current = true;
    const newIndex = currentIndex + 1;
    const nextState = history[newIndex].state;
    
    setCurrentIndex(newIndex);
    onRedo?.(nextState);
    
    // Reset flag after state update
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 0);
  }, [currentIndex, history, onRedo]);

  // Clear history
  const clear = useCallback((newInitialState?: T) => {
    const state = newInitialState || initialState;
    setHistory([{ state, timestamp: Date.now() }]);
    setCurrentIndex(0);
  }, [initialState]);

  // Get history info
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  const historySize = history.length;
  const currentDescription = history[currentIndex].description;

  return {
    state: currentState,
    pushState,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    historySize,
    currentDescription,
    history,
    currentIndex,
  };
}
