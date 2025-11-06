import React from 'react';
import { AppRouter } from './components/AppRouter';
import { QueryProvider } from './components/QueryProvider';
import { Toaster } from './components/ui/sonner';

// FORCE REBUILD: 2025-01-23-14:30:00
export default function App() {
  return (
    <QueryProvider>
      <AppRouter />
      <Toaster />
    </QueryProvider>
  );
}