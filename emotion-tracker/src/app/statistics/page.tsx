"use client";
import { Permission } from "@/lib/type";
import Statistics from "./ui/statistics";

export type TabProps = {
  permission: Permission | undefined;
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
