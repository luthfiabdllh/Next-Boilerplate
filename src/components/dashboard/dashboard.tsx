import { DashboardStats } from "./stats";
import { RevenueChart } from "./revenue-chart";
import { RefundReturnRateChart } from "./refund-return-rate-chart";
import { CategoryRankChart } from "./category-rank-chart";
import { QuickActions } from "./quick-actions";

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardStats />
      <RevenueChart />
      <RefundReturnRateChart />
      <CategoryRankChart />
      <QuickActions />
    </div>
  );
}
