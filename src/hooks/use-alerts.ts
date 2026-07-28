"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface AlertRule {
  id: string;
  type: "volume_spike" | "agent_trade" | "new_coin" | "price_change";
  target: string; // coin address, agent address, or "*" for all
  threshold?: number;
  label: string;
  active: boolean;
}

const STORAGE_KEY = "botfun-alerts";

function loadAlerts(): AlertRule[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAlerts(alerts: AlertRule[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const firedRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setAlerts(loadAlerts());
  }, []);

  const addAlert = useCallback((alert: Omit<AlertRule, "id">) => {
    const newAlert = { ...alert, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` };
    setAlerts(prev => {
      const next = [...prev, newAlert];
      saveAlerts(next);
      return next;
    });
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => {
      const next = prev.filter(a => a.id !== id);
      saveAlerts(next);
      return next;
    });
  }, []);

  const toggleAlert = useCallback((id: string) => {
    setAlerts(prev => {
      const next = prev.map(a => a.id === id ? { ...a, active: !a.active } : a);
      saveAlerts(next);
      return next;
    });
  }, []);

  const notify = useCallback((message: string) => {
    if (firedRef.current.has(message)) return;
    firedRef.current.add(message);

    setNotifications(prev => [...prev, message]);

    // Auto-dismiss after 8 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setNotifications(prev => prev.slice(1));
      firedRef.current.delete(message);
    }, 8000);

    // Browser notification - request permission lazily on first use
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      } else if (Notification.permission === "granted") {
        new Notification("bot.fun Alert", { body: message, icon: "/favicon.ico" });
      }
    }
  }, []);

  const dismissNotification = useCallback((index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  }, []);

  return { alerts, notifications, addAlert, removeAlert, toggleAlert, notify, dismissNotification };
}