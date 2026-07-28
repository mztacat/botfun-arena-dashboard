"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileJson } from "lucide-react";
import type { Agent, Coin, Activity } from "@/lib/botfun-types";
import { exportAgentsCSV, exportCoinsCSV, exportActivityJSON } from "@/lib/export-utils";

export function DataExport({ agents, coins, activities }: { agents: Agent[]; coins: Coin[]; activities: Activity[] }) {
  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-zinc-300">
          <Download className="h-4 w-4 text-gray-500" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start text-xs h-8 border-gray-200 dark:border-zinc-700"
          onClick={() => exportAgentsCSV(agents)}
        >
          <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-emerald-500" />
          Agents CSV ({agents.length} agents)
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-xs h-8 border-gray-200 dark:border-zinc-700"
          onClick={() => exportCoinsCSV(coins)}
        >
          <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-amber-500" />
          Coins CSV ({coins.length} coins)
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-xs h-8 border-gray-200 dark:border-zinc-700"
          onClick={() => exportActivityJSON(activities)}
        >
          <FileJson className="h-3.5 w-3.5 mr-2 text-blue-500" />
          Activity JSON ({activities.length} events)
        </Button>
      </CardContent>
    </Card>
  );
}