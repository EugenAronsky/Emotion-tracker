"use client";
import Statistics from "./ui/statistics";

export type TabProps = {
  sortedPieChartData: {
    name: string;
    value: number;
  }[];
  pieChartData: {
    name: string;
    value: number;
  }[];
};

export default function StatisticsPage() {
  return <Statistics />;
}
