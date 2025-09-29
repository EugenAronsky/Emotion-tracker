"use client";
import NavWrapper from "@/components/blocks/nav-wrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmotions } from "@/hooks/useEmotions";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { Emotion } from "@/lib/enums";
import { EmotionReturnProps, Permission, SenderInfo } from "@/lib/type";
import { VenetianMask } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PuffLoader } from "react-spinners";
import MonthTab from "./month-tab";
import WeekTab from "./week-tab";
import YearTab from "./year-tab";

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

export default function Statistics({
  senderInfo,
  permission,
}: {
  senderInfo?: SenderInfo;
  permission?: Permission;
}) {
  const defaultFromDate = useMemo(() => {
    const date = new Date();
    const day = date.getDay();
    date.setHours(0, 0, 0, 0);
    return date.setDate(date.getDate() - day + (day === 0 ? -6 : 1));
  }, []);
  const { loading } = useFirebaseUser();
  const [fromDate, setFromDate] = useState<number>(defaultFromDate);
  const [slogan, setSlogan] = useState<string | undefined>();
  const [pieChartData, setPieChartData] = useState<
    Array<{ name: string; value: number }>
  >([]);

  const { emotionsByRangeQuery, emotionsByUserIdAndByRangeQuery } = useEmotions(
    {
      fromDate: fromDate,
      user_id: senderInfo?.uid,
    },
  );

  const query = Boolean(senderInfo)
    ? emotionsByUserIdAndByRangeQuery
    : emotionsByRangeQuery;

  const sortedPieChartData = structuredClone(pieChartData).sort((a, b) =>
    b.value > a.value ? 1 : -1,
  );

  // const { slogonQuery } = useGemini({
  //   slogonQueryParams: {
  //     emotion: sortedPieChartData.at(0)?.name || "",
  //     prev_context: slogan,
  //   },
  // });

  useEffect(() => {
    if (query.isSuccess) {
      const res = query.data?.reduce(
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
  }, [query.data]);

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

  // useEffect(() => {
  //   Boolean(senderInfo)
  //     ? queryClient.refetchQueries({
  //         queryKey: ["emotions-range-by-user-id", senderInfo?.uid],
  //       })
  //     : queryClient.refetchQueries({ queryKey: ["emotions-range"] });
  // }, [fromDate]);

  // useEffect(() => {
  //   if (!slogonQuery.data) slogonQuery.refetch();
  //   else setSlogan(slogonQuery.data.slogon);
  // }, [slogonQuery.data]);

  // const AskAI = () => !slogonQuery.isFetching && slogonQuery.refetch();

  return (
    <NavWrapper hidden={Boolean(senderInfo)}>
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

        {query.isLoading || loading ? (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-md !shadow-none">
            <PuffLoader size={160} color="#3b82f6" />
          </div>
        ) : query.data?.length ? (
          <>
            <WeekTab
              id="week"
              pieChartData={pieChartData}
              permission={permission}
              sortedPieChartData={sortedPieChartData}
            />
            <MonthTab
              id="month"
              pieChartData={pieChartData}
              permission={permission}
              sortedPieChartData={sortedPieChartData}
            />
            <YearTab
              id="year"
              pieChartData={pieChartData}
              permission={permission}
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
        ) : (
          <div className="flex grow flex-col items-center justify-center opacity-60">
            <VenetianMask size={120} className="stroke-1" />
            There is no statistics for now
          </div>
        )}
      </Tabs>
    </NavWrapper>
  );
}
