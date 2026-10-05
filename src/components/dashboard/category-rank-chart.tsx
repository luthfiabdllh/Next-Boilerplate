"use client";

import React from "react";
import { LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export type CategoryMixDatum = {
  category: string;
  share: number;
};

// Monochromatic palette exactly matching Gambar 2
const SLICE_COLORS = [
  "#ffffff", // Apparel
  "#d4d4d8", // Accessories
  "#71717a", // Footwear
  "#3f3f46", // Home & living
  "#27272a", // Others
] as const;

const data: readonly CategoryMixDatum[] = [
  { category: "Apparel", share: 22 },
  { category: "Accessories", share: 22 },
  { category: "Others", share: 24 },
  { category: "Home & living", share: 14 },
  { category: "Footwear", share: 18 },
];

export function CategoryRankChart() {
  const chartConfig: ChartConfig = {
    share: {
      label: "Share",
    },
    s0: { label: "Apparel", color: SLICE_COLORS[0] },
    s1: { label: "Accessories", color: SLICE_COLORS[1] },
    s2: { label: "Others", color: SLICE_COLORS[4] },
    s3: { label: "Home & living", color: SLICE_COLORS[3] },
    s4: { label: "Footwear", color: SLICE_COLORS[2] },
  };

  const pieData = data.map((item, index) => ({
    key: `s${index}`,
    category: item.category,
    share: item.share,
    fill: SLICE_COLORS[index % SLICE_COLORS.length],
  }));

  return (
    <Card className="bg-card border-border/70 shadow-xs flex flex-col justify-between">
      <CardHeader className="pb-1">
        <CardTitle className="text-base font-semibold">
          Revenue Share by Category
        </CardTitle>
        <CardDescription className="text-xs">
          Last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="my-auto p-2">
        <ChartContainer
          className="aspect-auto h-60 w-full"
          config={chartConfig}
        >
          <PieChart accessibilityLayer>
            <Pie
              cornerRadius={0}
              data={pieData}
              dataKey="share"
              innerRadius={52}
              nameKey="key"
              outerRadius="82%"
              stroke="var(--card)"
              strokeWidth={3}
            >
              <LabelList
                className="fill-zinc-950 font-bold text-xs"
                dataKey="share"
                fill="currentColor"
                formatter={(val) => `${val}%`}
                position="inside"
                stroke="none"
              />
            </Pie>
            <ChartLegend
              content={
                <ChartLegendContent
                  className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 pt-3 text-[11px] text-muted-foreground"
                  nameKey="key"
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
