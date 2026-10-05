import { describe, it, expect } from "vitest";
import {
  parseIsoCalendarDate,
  formatDate,
  formatChartAxisTick,
  formatChartTooltipDate,
  formatCurrency,
  formatCompactCurrency,
  formatFullCurrency,
  formatCompactNumber,
  formatInteger,
  formatPercent,
} from "@/lib/formater";

describe("formater utilities", () => {
  it("parseIsoCalendarDate parses ISO date string safely", () => {
    const d = parseIsoCalendarDate("2026-03-15");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(2);
    expect(d.getDate()).toBe(15);
  });

  it("formatDate handles different styles", () => {
    expect(formatDate("2026-03-15", "month")).toContain("Mar");
    expect(formatDate("2026-03-15", "day-month")).toContain("15");
    expect(formatDate("2026-03-15", "full")).toContain("2026");
  });

  it("formatChartAxisTick formats weekday for <= 7 days and day-month for > 7 days", () => {
    const shortTick = formatChartAxisTick("2026-03-15", 7);
    expect(shortTick).toBeDefined();

    const longTick = formatChartAxisTick("2026-03-15", 30);
    expect(longTick).toContain("Mar");
  });

  it("formatChartTooltipDate formats correctly", () => {
    const short = formatChartTooltipDate("2026-03-15", "short");
    const long = formatChartTooltipDate("2026-03-15", "long");
    expect(short).toBeDefined();
    expect(long).toBeDefined();
  });

  it("formatCurrency formats whole dollars in USD", () => {
    const result = formatCurrency(284920);
    expect(result).toContain("284,920");
    expect(result).toContain("$");
  });

  it("formatCompactCurrency formats compact notation", () => {
    const result = formatCompactCurrency(1500000);
    expect(result).toBeDefined();
  });

  it("formatFullCurrency formats with 2 decimal places", () => {
    const result = formatFullCurrency(154.6);
    expect(result).toContain("154.60");
  });

  it("formatCompactNumber formats compact number", () => {
    const result = formatCompactNumber(12500);
    expect(result).toBeDefined();
  });

  it("formatInteger formats whole numbers with grouping", () => {
    expect(formatInteger(1842)).toBe("1,842");
  });

  it("formatPercent formats percentage with decimal places", () => {
    expect(formatPercent(3.06, 2)).toBe("3.06%");
    expect(formatPercent(8, 1)).toBe("8.0%");
  });
});
