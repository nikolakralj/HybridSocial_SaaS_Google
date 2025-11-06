/**
 * Shared Timesheet Data Context
 * 
 * Provides a single source of truth for timesheet entries across
 * both the entry calendar and the approval drawer.
 * 
 * This is a temporary solution until full database integration is complete.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { TimesheetEntry } from '../types';

interface TimesheetDataContextType {
  // All entries stored by date and user
  entries: Map<string, TimesheetEntry[]>; // Key: `userId-date` (e.g., "user-1-2025-10-07")
  
  // Methods
  addEntry: (entry: TimesheetEntry) => void;
  updateEntry: (entryId: string, updates: Partial<TimesheetEntry>) => void;
  deleteEntry: (entryId: string) => void;
  getEntriesByDate: (userId: string, date: string) => TimesheetEntry[];
  getEntriesByPeriod: (userId: string, startDate: string, endDate: string) => TimesheetEntry[];
  clearAllEntries: () => void;
}

const TimesheetDataContext = createContext<TimesheetDataContextType | null>(null);

export function TimesheetDataProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Map<string, TimesheetEntry[]>>(new Map());

  const addEntry = useCallback((entry: TimesheetEntry) => {
    setEntries(prev => {
      const newEntries = new Map(prev);
      const key = `${entry.userId}-${entry.date}`;
      const existing = newEntries.get(key) || [];
      newEntries.set(key, [...existing, entry]);
      return newEntries;
    });
  }, []);

  const updateEntry = useCallback((entryId: string, updates: Partial<TimesheetEntry>) => {
    setEntries(prev => {
      const newEntries = new Map(prev);
      for (const [key, entryList] of newEntries.entries()) {
        const index = entryList.findIndex(e => e.id === entryId);
        if (index !== -1) {
          const updated = [...entryList];
          updated[index] = { ...updated[index], ...updates };
          newEntries.set(key, updated);
          break;
        }
      }
      return newEntries;
    });
  }, []);

  const deleteEntry = useCallback((entryId: string) => {
    setEntries(prev => {
      const newEntries = new Map(prev);
      for (const [key, entryList] of newEntries.entries()) {
        const filtered = entryList.filter(e => e.id !== entryId);
        if (filtered.length !== entryList.length) {
          newEntries.set(key, filtered);
          break;
        }
      }
      return newEntries;
    });
  }, []);

  const getEntriesByDate = useCallback((userId: string, date: string) => {
    const key = `${userId}-${date}`;
    return entries.get(key) || [];
  }, [entries]);

  const getEntriesByPeriod = useCallback((userId: string, startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const periodEntries: TimesheetEntry[] = [];

    for (const [key, entryList] of entries.entries()) {
      if (key.startsWith(userId)) {
        entryList.forEach(entry => {
          const entryDate = new Date(entry.date);
          if (entryDate >= start && entryDate <= end) {
            periodEntries.push(entry);
          }
        });
      }
    }

    return periodEntries.sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  const clearAllEntries = useCallback(() => {
    setEntries(new Map());
  }, []);

  return (
    <TimesheetDataContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntriesByDate,
        getEntriesByPeriod,
        clearAllEntries,
      }}
    >
      {children}
    </TimesheetDataContext.Provider>
  );
}

export function useTimesheetData() {
  const context = useContext(TimesheetDataContext);
  if (!context) {
    throw new Error('useTimesheetData must be used within TimesheetDataProvider');
  }
  return context;
}
