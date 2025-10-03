"use client";
import { EmotionDialog } from "@/components/blocks/emotion-dialog";
import NavWrapper from "@/components/blocks/nav-wrapper";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useEmotions } from "@/hooks/useEmotions";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { Mood } from "@/lib/enums";
import { EmotionReturnProps, Permission, SenderInfo } from "@/lib/type";
import { cn } from "@/lib/utils";
import moment from "moment";
import React, { useEffect } from "react";
import { PuffLoader } from "react-spinners";
import Wave from "react-wavify";

export default function Dashboard({
  senderInfo,
  permission,
}: {
  senderInfo?: SenderInfo;
  permission?: Permission;
}) {
  const { emotionsQuery, emotionsByUserIdQuery } = useEmotions({
    user_id: senderInfo?.uid,
  });
  const { loading } = useFirebaseUser();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [defaultData, setDefaultData] = React.useState<
    EmotionReturnProps | undefined
  >();

  const query = Boolean(senderInfo) ? emotionsByUserIdQuery : emotionsQuery;

  useEffect(() => {
    setDefaultData(
      date !== undefined && query.data !== undefined
        ? query.data
            .filter(
              (e: any) =>
                moment(new Date(e.date)).format("MMM Do YY") ===
                moment(new Date(date)).format("MMM Do YY"),
            )
            .at(0)
        : undefined,
    );
  }, [query]);

  return (
    <NavWrapper hidden={Boolean(senderInfo)}>
      <div className="flex h-full w-full flex-col items-center justify-start gap-6 *:border-none *:shadow-[0_3px_6px_0_#00000010]">
        {query.isFetching || loading ? (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-md !shadow-none">
            <PuffLoader size={160} color="#3b82f6" />
          </div>
        ) : (
          <>
            <Calendar
              defaultMonth={new Date(date || new Date())}
              fixedWeeks
              mode="single"
              selected={date}
              broadcastCalendar
              onSelect={setDate}
              captionLayout="label"
              className="bg-card flex aspect-[1.02/.98] w-full justify-center rounded-xl border shadow-sm *:w-11/12 [&_tbody>tr]:gap-0.5"
              classNames={{
                caption_label: "text-lg font-bold",
                chevron: "size-5",
                today: "bg-sky-200/20 !rounded-full",
                month_grid: "my-auto",
              }}
              disabled={{ after: new Date() }}
              components={{
                DayButton: (props) => {
                  const dayEmotion = query.data?.find(
                    (e: any) =>
                      moment(new Date(e.date)).format("MMM Do YY") ===
                      moment(new Date(props.day.date)).format("MMM Do YY"),
                  );

                  return CalendarDayButton({
                    ...props,
                    className: cn(
                      "text-md !rounded-full",
                      "group-data-[focused=true]/day:!ring-[0px] data-[selected-single=true]:bg-primary",
                      dayEmotion && "data-[selected-single=true]:text-white",
                      dayEmotion && dayEmotion.mood === "Awful"
                        ? "bg-red-200  text-red-600 data-[selected-single=true]:bg-red-500"
                        : dayEmotion && dayEmotion.mood === "Bad"
                          ? "bg-blue-200 text-blue-600 data-[selected-single=true]:bg-blue-500"
                          : dayEmotion && dayEmotion.mood === "Normal"
                            ? "bg-yellow-200 text-yellow-600 data-[selected-single=true]:bg-yellow-500"
                            : dayEmotion && dayEmotion.mood === "Good"
                              ? "bg-green-200 text-green-600  data-[selected-single=true]:bg-green-500"
                              : dayEmotion && dayEmotion.mood === "Excellent"
                                ? "bg-purple-200 text-purple-600 data-[selected-single=true]:bg-purple-500"
                                : "",
                    ),
                  });
                },
              }}
            />

            {Boolean(date) && (
              <EmotionDialog
                date={date}
                permission={permission}
                defaultData={defaultData}
              >
                <Card className="relative h-fit w-full overflow-hidden shadow-[0_3px_6px_0_#00000010]">
                  <CardContent className="flex h-full flex-col items-center justify-center gap-4">
                    {defaultData === undefined ? (
                      <>
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
                            defaultData.mood === "Awful"
                              ? "#ffa2a280"
                              : defaultData.mood === "Bad"
                                ? "#8ec5ff80"
                                : defaultData.mood === "Normal"
                                  ? "#fff08580"
                                  : defaultData.mood === "Good"
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

                        <div className="z-10 flex flex-col items-center justify-center gap-2">
                          <span className="text-4xl">
                            {Mood[defaultData.mood]}
                          </span>
                          <b
                            className={cn(
                              `flex items-center text-lg ${defaultData.mood === "Awful" ? "text-red-700/70" : defaultData.mood === "Bad" ? "text-blue-700/70" : defaultData.mood === "Normal" ? "text-yellow-700/70" : defaultData.mood === "Good" ? "text-green-700/70" : "text-purple-700/70"}`,
                              "dark:brightness-200",
                            )}
                          >
                            {defaultData.emotion} - {defaultData.intensity}
                          </b>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </EmotionDialog>
            )}
          </>
        )}
      </div>
    </NavWrapper>
  );
}
