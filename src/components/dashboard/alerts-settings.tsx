"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Plus, Trash2, BellOff } from "lucide-react";

interface AlertRule {
  id: string;
  type: string;
  target: string;
  label: string;
  active: boolean;
}

const TYPE_OPTIONS = [
  { value: "volume_spike", label: "Volume Spike" },
  { value: "agent_trade", label: "Agent Trade" },
  { value: "new_coin", label: "New Coin Launch" },
];

export function AlertsSettings({
  alerts,
  onAdd,
  onRemove,
  onToggle,
}: {
  alerts: AlertRule[];
  onAdd: (alert: { type: string; target: string; label: string; active: boolean }) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const [type, setType] = useState("volume_spike");
  const [target, setTarget] = useState("*");

  const handleAdd = () => {
    const typeLabel = TYPE_OPTIONS.find(t => t.value === type)?.label || type;
    onAdd({ type, target, label: `${typeLabel}: ${target === "*" ? "All" : target}`, active: true });
    setTarget("*");
  };

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <Bell className="h-4 w-4 text-blue-500" />
          Alert Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add form */}
        <div className="flex gap-1.5">
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="h-8 text-xs rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 px-2"
          >
            {TYPE_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <Input
            placeholder="* for all, or address/name"
            value={target}
            onChange={e => setTarget(e.target.value)}
            className="h-8 text-xs flex-1"
          />
          <Button size="sm" onClick={handleAdd} className="h-8 shrink-0">
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* List */}
        <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
          {alerts.length === 0 && (
            <p className="text-xs text-gray-400 dark:text-zinc-600 text-center py-4">No alerts set</p>
          )}
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-gray-50 dark:bg-zinc-900/50 group">
              <button onClick={() => onToggle(alert.id)} className="shrink-0">
                {alert.active ? (
                  <Bell className="h-3.5 w-3.5 text-blue-500" />
                ) : (
                  <BellOff className="h-3.5 w-3.5 text-gray-400 dark:text-zinc-600" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-xs truncate ${alert.active ? "text-gray-800 dark:text-zinc-200" : "text-gray-400 dark:text-zinc-600 line-through"}`}>
                  {alert.label}
                </p>
              </div>
              <button
                onClick={() => onRemove(alert.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-zinc-600 hover:text-red-500 transition-all"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}