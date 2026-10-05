"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Delta, DeltaIcon, DeltaValue } from "@/components/shared/delta";

/** Daily return rate (% of fulfilled orders returned), last 7 days (demo). */
const returnDaily7 = [
  { day: "Mon", returnRate: 2.2 },
  { day: "Tue", returnRate: 1.5 },
  { day: "Wed", returnRate: 3.1 },
  { day: "Thu", returnRate: 4.8 },
  { day: "Fri", returnRate: 2.4 },
  { day: "Sat", returnRate: 3.2 },
  { day: "Sun", returnRate: 3.9 },
] as const;

const REFUNDED_SHARE_OF_ORDERS_PCT = 2.6;

const chartConfig = {
  returnRate: {
    label: "Return %",
    color: "#f4f4f5",
  },
} satisfies ChartConfig;

export function RefundReturnRateChart() {
  const first = returnDaily7[0];
  const lastW = returnDaily7.at(-1) ?? first;
  const returnTrendPct =
    first.returnRate > 0
      ? ((lastW.returnRate - first.returnRate) / first.returnRate) * 100
      : 0;

  return (
    <Card className="md:col-span-2 bg-card border-border/70 shadow-xs flex flex-col justify-between">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-base font-semibold">Return rate</CardTitle>
          <CardDescription className="text-xs">Last 7 days</CardDescription>
        </div>
        <div className="space-y-0.5 sm:text-right">
          <CardTitle className="text-lg font-bold text-foreground">
            {REFUNDED_SHARE_OF_ORDERS_PCT}%
          </CardTitle>
          <CardDescription className="text-xs">of orders refunded</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-auto px-2 sm:px-6">
        <ChartContainer
          className="aspect-auto h-52 w-full"
          config={chartConfig}
        >
          <LineChart
            accessibilityLayer
            data={[...returnDaily7]}
            margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted/20" />
            <XAxis
              axisLine={false}
              dataKey="day"
              interval={1}
              minTickGap={8}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line
              dataKey="returnRate"
              dot={false}
              stroke="#f4f4f5"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border/40 pt-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 text-muted-foreground text-xs">
          <Delta value={returnTrendPct}>
            <DeltaIcon />
            <DeltaValue />
          </Delta>
          <span className="inline-flex min-w-0 text-pretty">
            vs first day (last 7 days)
          </span>
        </div>
        <Button
          asChild
          className="text-muted-foreground hover:text-foreground text-xs h-7"
          size="sm"
          variant="ghost"
        >
          <a href="#/orders/returns" className="flex items-center gap-1">
            <span>Returns desk</span>
            <ArrowRight className="size-3.5" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
