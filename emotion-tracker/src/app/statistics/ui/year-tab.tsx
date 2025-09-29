"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { shareScreenshot } from "@/lib/func";
import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";
import { useRef } from "react";
import Wave from "react-wavify";
import { Cell, Pie, PieChart } from "recharts";
import { TabProps } from "../page";

export default function YearTab({
  sortedPieChartData,
  pieChartData,
  permission,
  id,
}: TabProps & { id?: string }) {
  const maxIntensity = useRef<number>(0);
  return (
    <TabsContent
      id={id}
      value="year"
      className="w-full grow-0 *:border-none *:shadow-[0_3px_6px_0_#00000010]"
    >
      <Card className="relative h-fit w-full overflow-hidden">
        <Button
          onClick={async () => id && (await shareScreenshot(id))}
          className={cn(
            "absolute top-5 right-1 z-20",
            Boolean(permission) && "hidden",
          )}
          variant={"ghost"}
          size={"icon"}
        >
          <Share2 />
        </Button>
        <Wave
          className={cn("absolute top-0 right-0 left-0 h-14 rotate-180")}
          fill={
            sortedPieChartData.at(0)?.name === "😡"
              ? "#ffa2a280"
              : sortedPieChartData.at(0)?.name === "😢"
                ? "#8ec5ff80"
                : sortedPieChartData.at(0)?.name === "🤨"
                  ? "#fff08580"
                  : sortedPieChartData.at(0)?.name === "😊"
                    ? "#7bf1a880"
                    : "#dab2ff80"
          }
          paused={false}
          options={{
            height: 20,
            amplitude: 20,
            speed: 0.15,
            points: 3,
          }}
        />
        <CardContent className="z-10 flex h-fit flex-col justify-center">
          <b className="mb-1 w-full text-center text-lg">Yearly Mood</b>
          <section className="relative flex w-full flex-col items-center gap-2">
            <span
              className={cn(
                "absolute top-[67px] flex size-24 items-center justify-center rounded-full text-5xl",
                sortedPieChartData.at(0)?.name === "😡"
                  ? "bg-red-100"
                  : sortedPieChartData.at(0)?.name === "😢"
                    ? "bg-blue-100"
                    : sortedPieChartData.at(0)?.name === "🤨"
                      ? "bg-amber-100"
                      : sortedPieChartData.at(0)?.name === "😊"
                        ? "bg-green-100"
                        : "bg-purple-100",
              )}
            >
              {sortedPieChartData.at(0)?.name}
            </span>
            <PieChart width={300} height={160} className="pointer-events-none">
              <Pie
                cy={110}
                endAngle={-20}
                startAngle={200}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                data={pieChartData.filter((emotion) => emotion.value > 0)}
                dataKey="value"
                label={({ name, value, percent, x, y }) => (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={21}
                  >
                    {name}
                  </text>
                )}
              >
                {pieChartData
                  .filter((emotion) => emotion.value > 0)
                  .map((entry) => (
                    <Cell
                      stroke="trnsperent"
                      key={`cell-${entry.name}`}
                      fill={
                        entry.name === "😡"
                          ? "#ff5c5c"
                          : entry.name === "😢"
                            ? "#5c6cff"
                            : entry.name === "🤨"
                              ? "#ffd061"
                              : entry.name === "😊"
                                ? "#69ff63"
                                : "#d061ff"
                      }
                    />
                  ))}
              </Pie>
            </PieChart>

            <div className="mt-2 flex w-full flex-col overflow-hidden rounded-md">
              {sortedPieChartData.map((entry, index) => {
                const intensity = Number(
                  (
                    (entry.value /
                      pieChartData.reduce((acc, curr) => acc + curr.value, 0)) *
                    100
                  ).toFixed(1),
                );

                index === 0 && (maxIntensity.current = intensity);

                return (
                  <div
                    key={`block-${entry.name}`}
                    className={cn(
                      index % 2 ? "bg-secondary/50" : "bg-input/50",
                    )}
                  >
                    <div
                      style={{
                        width: `${(intensity / maxIntensity.current) * 100}%`,
                      }}
                      className={cn(
                        `flex min-w-fit justify-center px-3 text-center`,
                        entry.name === "😡"
                          ? "bg-red-200 text-red-600"
                          : entry.name === "😢"
                            ? "bg-blue-200 text-blue-600"
                            : entry.name === "🤨"
                              ? "bg-yellow-200 text-yellow-600"
                              : entry.name === "😊"
                                ? "bg-green-200 text-green-600"
                                : "bg-purple-200 text-purple-600",
                      )}
                    >
                      {`${entry.name} ~ ${intensity}%`}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
