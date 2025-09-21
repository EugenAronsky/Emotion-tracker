"use client";
import NavWrapper from "@/components/blocks/nav-wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmotions } from "@/hooks/useEmotions";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { Emotion } from "@/lib/enums";
import { EmotionReturnProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { PuffLoader, ScaleLoader } from "react-spinners";
import Wave from "react-wavify";
import { Cell, Pie, PieChart } from "recharts";
import WeekTab from "./ui/week-tab";
import MonthTab from "./ui/month-tab";
import YearTab from "./ui/year-tab";
import { Button } from "@/components/ui/button";
import { getAiTip } from "@/lib/gemini-controller";
import { useGemini } from "@/hooks/useGemini";

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

export default function Statistics() {
  const queryClient = useQueryClient();
  const { loading } = useFirebaseUser();
  const [fromDate, setFromDate] = useState<number>();
  const [slogan, setSlogan] = useState<string | undefined>();
  const [pieChartData, setPieChartData] = useState<
    Array<{ name: string; value: number }>
  >([]);

  const { emotionsByRangeQuery } = useEmotions({
    emotionsQueryParams: {
      fromDate: fromDate,
    },
  });

  const sortedPieChartData = structuredClone(pieChartData).sort((a, b) =>
    b.value > a.value ? 1 : -1,
  );

  const { slogonQuery } = useGemini({
    slogonQueryParams: {
      emotion: sortedPieChartData.at(0)?.name || "",
      prev_context: slogan,
    },
  });

  useEffect(() => {
    if (emotionsByRangeQuery.isSuccess) {
      const res = emotionsByRangeQuery.data?.reduce(
        (
          acc: Array<{
            name: string;
            value: number;
          }>,
          curr: EmotionReturnProps,
        ) => {
          const obj = acc.find((item) => item.name === Emotion[curr.emotion]);
          obj && (obj.value = Number(obj.value) + Number(curr.intensity));
          return acc;
        },
        [
          { name: "😡", value: 0 },
          { name: "😢", value: 0 },
          { name: "🤨", value: 0 },
          { name: "😊", value: 0 },
          { name: "😍", value: 0 },
        ],
      );
      Boolean(res?.length) && setPieChartData(res);
    }
  }, [emotionsByRangeQuery.data]);

  const tabsChangeHandler = (volume: "week" | "month" | "year" | string) => {
    switch (volume) {
      case "week": {
        const date = new Date();
        const day = date.getDay();
        date.setHours(0, 0, 0, 0);
        setFromDate(date.setDate(date.getDate() - day + (day === 0 ? -6 : 1)));
        break;
      }

      case "month": {
        const date = new Date();
        date.setHours(0, 0, 0, 0); // сброс времени
        setFromDate(date.setDate(1));
        break;
      }

      case "year": {
        const date = new Date();
        date.setHours(0, 0, 0, 0); // сброс времени
        setFromDate(date.setMonth(0, 1));
        break;
      }

      default:
        console.log("Time scope dosen't exist");
        break;
    }
  };

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ["emotions-range"] }); // рефетч
  }, [fromDate]);

  useEffect(() => {
    if (!slogonQuery.data) slogonQuery.refetch();
    else setSlogan(slogonQuery.data.slogon);
  }, [slogonQuery.data]);

  useEffect(() => {
    setFromDate(
      new Date().setDate(
        new Date().getDate() -
          new Date().getDay() +
          (new Date().getDay() === 0 ? -6 : 1),
      ),
    );
  }, []);

  const AskAI = () => !slogonQuery.isFetching && slogonQuery.refetch();

  return (
    <NavWrapper>
      <Tabs
        defaultValue="week"
        onValueChange={tabsChangeHandler}
        className="flex w-full flex-col items-center justify-start gap-6 !shadow-none"
      >
        <TabsList className="h-11 w-full gap-1 rounded-full *:rounded-full">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>

        {emotionsByRangeQuery.isFetching || loading ? (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-md !shadow-none">
            <PuffLoader size={160} color="#3b82f6" />
          </div>
        ) : (
          <>
            <WeekTab
              id="week"
              pieChartData={pieChartData}
              sortedPieChartData={sortedPieChartData}
            />
            <MonthTab
              id="month"
              pieChartData={pieChartData}
              sortedPieChartData={sortedPieChartData}
            />
            <YearTab
              id="year"
              pieChartData={pieChartData}
              sortedPieChartData={sortedPieChartData}
            />

            {/* <Card onClick={AskAI} className="w-full border-none">
              <CardContent className="text-center">
                {slogonQuery.isFetching ? (
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-md !shadow-none">
                    <ScaleLoader color="#3b82f6" />
                  </div>
                ) : (
                  <i className="pointer-events-none">
                    {slogonQuery.data.slogon
                      ?.replaceAll("*", "")
                      .replaceAll('"', "")}
                  </i>
                )}
              </CardContent>
            </Card> */}
          </>
        )}
      </Tabs>
    </NavWrapper>
  );
}
