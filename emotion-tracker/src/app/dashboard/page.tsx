"use client";
import { EmotionDialog } from "@/components/blocks/emotion-dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useEmotions } from "@/hooks/useEmotions";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { Emotion } from "@/lib/enums";
import { EmotionReturnProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import { ChartArea, Layout, Settings, Sticker, User2 } from "lucide-react";
import moment from "moment";
import React, { useEffect } from "react";
import { PuffLoader } from "react-spinners";
import Wave from "react-wavify";

export default function Dashboard() {
  const { emotionsQuery } = useEmotions();
  const { user, loading } = useFirebaseUser();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [defaultData, setDefaultData] = React.useState<
    EmotionReturnProps | undefined
  >();

  useEffect(() => {
    setDefaultData(
      date !== undefined && emotionsQuery.data !== undefined
        ? emotionsQuery.data
            .filter(
              (e: any) =>
                moment(new Date(e.date)).format("MMM Do YY") ===
                moment(new Date(date)).format("MMM Do YY"),
            )
            .at(0)
        : undefined,
    );
  }, [emotionsQuery]);

  return (
    <main className="flex h-full w-full flex-col">
      <header className="mb-6 flex h-fit w-full items-center justify-between border-b px-6 py-4 shadow-sm/5">
        <h1 className="text-xl font-bold">Mood Diary</h1>
        <Settings />
      </header>

      {emotionsQuery.isFetching || loading ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <PuffLoader size={160} color="#3b82f6" />
        </div>
      ) : (
        <section className="flex grow flex-col items-center justify-start gap-6 px-6 pb-6 *:border-none *:shadow-[0_3px_6px_0_#00000010]">
          <Calendar
            fixedWeeks
            mode="single"
            selected={date}
            broadcastCalendar
            onSelect={setDate}
            captionLayout="label"
            className="flex w-full justify-center rounded-md border shadow-sm *:w-11/12 [&_tbody>tr]:gap-0.5"
            classNames={{
              caption_label: "text-lg font-bold",
              chevron: "size-5",
              today: "bg-sky-200/20 !rounded-full",
            }}
            disabled={{ after: new Date() }}
            components={{
              DayButton: (props) => {
                const dayEmotion = emotionsQuery.data?.find(
                  (e: any) =>
                    moment(new Date(e.date)).format("MMM Do YY") ===
                    moment(new Date(props.day.date)).format("MMM Do YY"),
                );

                return CalendarDayButton({
                  ...props,
                  className: cn(
                    "text-md !rounded-full ",
                    "group-data-[focused=true]/day:!ring-[0px] data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground",
                    dayEmotion && dayEmotion.emotion === "Anger"
                      ? "bg-red-200 data-[selected-single=true]:bg-red-500 data-[selected-single=true]:text-primary-foreground"
                      : dayEmotion && dayEmotion.emotion === "Sadness"
                        ? "bg-blue-200 data-[selected-single=true]:bg-blue-500 data-[selected-single=true]:text-primary-foreground"
                        : dayEmotion && dayEmotion.emotion === "Disgust"
                          ? "bg-yellow-200 data-[selected-single=true]:bg-yellow-500 data-[selected-single=true]:text-primary-foreground"
                          : dayEmotion && dayEmotion.emotion === "Joy"
                            ? "bg-green-200 data-[selected-single=true]:bg-green-500 data-[selected-single=true]:text-primary-foreground"
                            : dayEmotion && dayEmotion.emotion === "Love"
                              ? "bg-purple-200 data-[selected-single=true]:bg-purple-500 data-[selected-single=true]:text-primary-foreground"
                              : "",
                  ),
                });
              },
            }}
          />

          {Boolean(date) && (
            <EmotionDialog date={date} defaultData={defaultData}>
              <Card className="relative h-fit w-full overflow-hidden shadow-[0_3px_6px_0_#00000010]">
                <CardContent className="flex h-full flex-col items-center justify-center gap-4">
                  {defaultData === undefined ? (
                    <>
                      <Sticker size={60} />
                      <span className="flex flex-col items-center justify-center gap-2 text-center">
                        <b className="">No entries yet</b>
                        <p className="text-xs">
                          Start trecking your emotions to see your <br />
                          progress.
                        </p>
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Wave
                        className={cn("absolute right-0 bottom-0 left-0")}
                        fill={
                          defaultData.emotion === "Anger"
                            ? "#ffa2a280"
                            : defaultData.emotion === "Sadness"
                              ? "#8ec5ff80"
                              : defaultData.emotion === "Disgust"
                                ? "#fff08580"
                                : defaultData.emotion === "Joy"
                                  ? "#7bf1a880"
                                  : "#dab2ff80"
                        }
                        paused={false}
                        style={{
                          display: "flex",
                          transform: `translateY(${80 - defaultData.intensity * 0.8}%)`,
                        }}
                        options={{
                          height: 20,
                          amplitude: 20,
                          speed: 0.15,
                          points: 3,
                        }}
                      />

                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl">
                          {Emotion[defaultData.emotion]}
                        </span>
                        <b
                          className={cn(
                            `flex items-center text-lg ${defaultData.emotion === "Anger" ? "text-red-700/70" : defaultData.emotion === "Sadness" ? "text-blue-700/70" : defaultData.emotion === "Disgust" ? "text-yellow-700/70" : defaultData.emotion === "Joy" ? "text-green-700/70" : "text-purple-700/70"}`,
                          )}
                        >
                          {defaultData.emotion} - {defaultData.intensity}
                        </b>
                      </div>
                    </div>
                  )}
                  {/* <Button variant="outline" className="w-full">
              Add Entry
            </Button> */}
                </CardContent>
              </Card>
            </EmotionDialog>
          )}
        </section>
      )}

      <footer className="flex h-fit w-full items-center justify-center gap-4 border-t bg-white px-6 py-4 *:grow">
        <Button>
          <Layout />
          Dashboard
        </Button>

        <Button>
          <ChartArea />
          Statistics
        </Button>

        <Button>
          <User2 />
          Profile
        </Button>
      </footer>
    </main>
  );
}
