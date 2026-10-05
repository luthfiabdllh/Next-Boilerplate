"use client";

import { useId, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ArrowRight } from "lucide-react";
import { formatChartAxisTick, formatChartTooltipDate } from "@/lib/formater";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Delta, DeltaIcon, DeltaValue } from "@/components/shared/delta";
import { revenueChartDemo } from "./revenue-chart-data";

type PeriodDays = 7 | 14 | 30 | 60 | 90;

const xAxisIntervalByPeriod: Record<PeriodDays, number> = {
  7: 0,
  14: 1,
  30: 3,
  60: 4,
  90: 6,
};

type RevenueRow = {
  date: string;
  revenue: number;
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#f4f4f5",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const chartUid = useId().replace(/:/g, "");
  const idAreaGradient = `revenue-area-grad-${chartUid}`;
  const [periodDays, setPeriodDays] = useState<PeriodDays>(60);

  const chartRows = useMemo(
    () => revenueChartDemo.slice(-periodDays),
    [periodDays]
  );

  const growthPct = useMemo(() => {
    const first = chartRows[0]?.revenue ?? 0;
    const last = chartRows.at(-1)?.revenue ?? first;
    if (!first) {
      return 0;
    }
    return ((last - first) / first) * 100;
  }, [chartRows]);

  let xAxisMinTickGap: number | undefined;
  if (periodDays <= 7) {
    xAxisMinTickGap = undefined;
  } else {
    xAxisMinTickGap = Math.max(8, Math.min(52, Math.floor(periodDays / 2)));
  }

  return (
    <Card className="md:col-span-2 lg:col-span-4 bg-card border-border/70 shadow-xs">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2">
        <CardTitle className="text-base font-semibold">Revenue</CardTitle>
        <Select
          onValueChange={(v) => {
            setPeriodDays(Number(v) as PeriodDays);
          }}
          value={String(periodDays)}
        >
          <SelectTrigger
            aria-label="Revenue time range"
            className="w-full min-w-36 sm:w-fit h-8 text-xs bg-transparent border-border/60"
          >
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="60">Last 60 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer
          className="aspect-auto h-64 w-full p-0"
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={[...chartRows]}
            margin={{ left: 16, right: 16, top: 12, bottom: 0 }}
          >
            <defs>
              <linearGradient id={idAreaGradient} x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="#ffffff"
                  stopOpacity={0.16}
                />
                <stop
                  offset="100%"
                  stopColor="#ffffff"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted/20" />
            <XAxis
              axisLine={false}
              dataKey="date"
              interval={xAxisIntervalByPeriod[periodDays]}
              minTickGap={xAxisMinTickGap}
              tickFormatter={(value) =>
                formatChartAxisTick(String(value), periodDays)
              }
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-36"
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as RevenueRow | undefined;
                    if (!row?.date) {
                      return "";
                    }
                    return formatChartTooltipDate(row.date, "short");
                  }}
                />
              }
            />
            <Area
              dataKey="revenue"
              dot={false}
              fill={`url(#${idAreaGradient})`}
              stroke="#f4f4f5"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border/40 pt-3">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Delta value={growthPct}>
            <DeltaIcon />
            <DeltaValue />
          </Delta>
          <p className="inline-flex text-pretty">
            vs first day in last {periodDays} days.
          </p>
        </div>
        <Button
          asChild
          className="text-muted-foreground hover:text-foreground text-xs h-7"
          size="sm"
          variant="ghost"
        >
          <a href="#/reports" className="flex items-center gap-1">
            <span>View report</span>
            <ArrowRight className="size-3.5" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
