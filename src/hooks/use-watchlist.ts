"use client";
import { useState, useEffect, useCallback } from "react";

type WatchlistType = "agent" | "coin";

interface WatchlistItem {
  type: WatchlistType;
  id: string;
  label: string;
  addedAt: number;
}

const STORAGE_KEY = "botfun-watchlist";

function loadWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(items: WatchlistItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setItems(loadWatchlist());
  }, []);

  const add = useCallback((type: WatchlistType, id: string, label: string) => {
    setItems(prev => {
      if (prev.find(i => i.id === id && i.type === type)) return prev;
      const next = [...prev, { type, id, label, addedAt: Date.now() }];
      saveWatchlist(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      saveWatchlist(next);
      return next;
    });
  }, []);

  const isWatched = useCallback((id: string) => {
    return items.some(i => i.id === id);
  }, [items]);

  const agents = items.filter(i => i.type === "agent");
  const coins = items.filter(i => i.type === "coin");

  return { items, agents, coins, add, remove, isWatched };
}