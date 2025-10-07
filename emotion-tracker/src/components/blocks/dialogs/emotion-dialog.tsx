import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEmotions } from "@/hooks/query/useEmotions";
import { EmotionForm, EmotionReturnProps, Permission } from "@/lib/type";
import { cn } from "@/lib/utils";
import { UseMutationResult } from "@tanstack/react-query";
import { Eraser, HardDriveUpload, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PuffLoader } from "react-spinners";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Slider } from "../../ui/slider";
import { Textarea } from "../../ui/textarea";
import { useTranslation } from "@/hooks/useTranslation";

export function EmotionDialog({
  defaultData,
  permission,
  children,
  date,
}: {
  date: Date | undefined;
  permission?: Permission;
  children: React.ReactNode;
  defaultData: EmotionReturnProps | undefined;
}) {
  const translate = useTranslation();
  const hidden = Boolean(permission);
  const emotions = translate("emotions");
  const [open, setOpen] = useState(false);
  const { updateMutation, createMutation, deleteMutation } = !hidden
    ? useEmotions()
    : {
        updateMutation: {} as UseMutationResult<
          any,
          Error,
          {
            id: string;
            updates: Partial<EmotionForm>;
          },
          unknown
        >,
        createMutation: {} as UseMutationResult<
          any,
          Error,
          EmotionForm & {
            date?: Date | undefined;
          },
          unknown
        >,
        deleteMutation: {} as UseMutationResult<any, Error, string, unknown>,
      };

  const defaultValues = {
    mood: defaultData?.mood || "Normal",
    emotion:
      defaultData?.emotion || Object.keys(emotions["Normal"])?.at(0) || "",
    description: defaultData?.description || "",
    intensity: defaultData?.intensity || 50,
  };

  const {
    watch,
    reset,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmotionForm>();
  const mood = watch("mood");

  useEffect(() => reset(defaultValues), [defaultData]);

  const onSubmit: SubmitHandler<EmotionForm> = async (data) => {
    !defaultData
      ? createMutation.mutate(
          {
            ...data,
            date: date,
          },
          {
            onSuccess: () => close(),
          },
        )
      : updateMutation.mutate(
          { id: defaultData.id, updates: data },
          {
            onSuccess: () => close(),
          },
        );
  };

  const close = (open?: boolean) => {
    setTimeout(() => reset(defaultValues), 200);
    setOpen(open || false);
  };

  return (
    <Dialog
      open={
        deleteMutation.isPending ||
        updateMutation.isPending ||
        createMutation.isPending
          ? true
          : open
      }
      onOpenChange={close}
    >
      <DialogTrigger
        className={cn(
          Boolean(permission) && "pointer-events-none",
          permission === "reader" &&
            Boolean(defaultData) &&
            "pointer-events-auto",
        )}
        asChild
      >
        {children}
      </DialogTrigger>
      <DialogContent className="overflow-hidden max-[400px]:p-4 sm:max-w-[425px]">
        <div
          className={cn(
            "absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center transition-all",
            deleteMutation.isPending ||
              updateMutation.isPending ||
              createMutation.isPending
              ? "bg-secondary/60 visible"
              : "invisible",
          )}
        >
          <PuffLoader size={140} color="#3b82f6" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{translate("emotion_dialog_title")}</DialogTitle>
            <DialogDescription>
              {translate("emotion_dialog_description")}
            </DialogDescription>
          </DialogHeader>

          <Controller
            name="mood"
            control={control}
            disabled={hidden}
            defaultValue="Normal"
            render={({ field }) => (
              <RadioGroup
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);

                  if (
                    defaultValues.mood === value &&
                    Boolean(defaultValues.emotion)
                  )
                    setValue("emotion", defaultValues.emotion);
                  else
                    setValue(
                      "emotion",
                      Object.keys(emotions[value as keyof typeof emotions])?.at(
                        0,
                      ) || "",
                    );
                }}
                className="*:bg-secondary flex justify-between gap-3 border-b pb-4 *:flex *:size-14 *:items-center *:justify-center *:rounded-full *:max-[400px]:size-12 *:max-[400px]:text-3xl max-[361px]:gap-2"
              >
                <Label
                  className={cn(
                    "text-4xl transition-all",
                    field.value === "Awful" && "!bg-red-300",
                  )}
                >
                  <span>😡</span>
                  <RadioGroupItem value="Awful" className="hidden" />
                </Label>

                <Label
                  className={cn(
                    "text-4xl transition-all",
                    field.value === "Bad" && "!bg-blue-300",
                  )}
                >
                  <span>😢</span>
                  <RadioGroupItem value="Bad" className="hidden" />
                </Label>

                <Label
                  className={cn(
                    "text-4xl transition-all",
                    field.value === "Normal" && "!bg-yellow-300",
                  )}
                >
                  <span>🤨</span>
                  <RadioGroupItem value="Normal" className="hidden" />
                </Label>

                <Label
                  className={cn(
                    "text-4xl transition-all",
                    field.value === "Good" && "!bg-green-300",
                  )}
                >
                  <span>😊</span>
                  <RadioGroupItem value="Good" className="hidden" />
                </Label>

                <Label
                  className={cn(
                    "text-4xl transition-all",
                    field.value === "Excellent" && "!bg-purple-300",
                  )}
                >
                  <span>😍</span>
                  <RadioGroupItem value="Excellent" className="hidden" />
                </Label>
              </RadioGroup>
            )}
          />

          <Controller
            name="emotion"
            control={control}
            disabled={hidden}
            render={({ field }) => (
              <RadioGroup
                {...field}
                onValueChange={field.onChange}
                className="*:bg-secondary flex flex-wrap justify-center gap-2"
              >
                {Object.keys(emotions[mood as keyof typeof emotions])?.map(
                  (emotion) => {
                    const moodObj = emotions[mood as keyof typeof emotions];

                    return (
                      <Label
                        key={`sub-emotion-${emotion}`}
                        className={cn(
                          "flex items-center justify-center rounded-md border px-1.5 py-1 text-sm opacity-85 transition-all dark:opacity-100",
                          field.value === emotion
                            ? mood === "Awful"
                              ? "border-red-500 !bg-red-400/40 text-red-700 dark:border-red-300 dark:text-red-300"
                              : mood === "Bad"
                                ? "border-blue-500 !bg-blue-400/40 text-blue-700 dark:border-blue-300 dark:text-blue-300"
                                : mood === "Normal"
                                  ? "border-yellow-500 !bg-yellow-400/40 text-yellow-700 dark:border-yellow-300 dark:text-yellow-300"
                                  : mood === "Good"
                                    ? "border-green-500 !bg-green-400/40 text-green-700 dark:border-green-300 dark:text-green-300"
                                    : mood === "Excellent"
                                      ? "border-purple-500 !bg-purple-400/40 text-purple-700 dark:border-purple-300 dark:text-purple-300"
                                      : null
                            : null,
                        )}
                      >
                        <span>{`${emotion} ${moodObj[emotion as keyof typeof moodObj]}`}</span>
                        <RadioGroupItem value={emotion} className="hidden" />
                      </Label>
                    );
                  },
                )}
              </RadioGroup>
            )}
          />

          <Textarea
            {...register("description")}
            className={cn(
              "h-36 resize-none disabled:opacity-100",
              !Boolean(defaultData?.description) && hidden && "hidden",
            )}
            placeholder={translate("emotion_dialog_textarea_placeholder")}
            disabled={hidden}
          />

          <Controller
            disabled={hidden}
            name="intensity"
            control={control}
            defaultValue={50}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{translate("intensity")}</span>
                  <span>{field.value}</span>
                </div>

                <Slider
                  {...field}
                  value={[field.value]}
                  className={cn(
                    "data-[disabled]:opacity-100",
                    mood === "Awful" &&
                      "*:first:*:bg-red-200 *:last:*:border-red-700 *:last:*:bg-red-400",

                    mood === "Bad" &&
                      "*:first:*:bg-blue-200 *:last:*:border-blue-700 *:last:*:bg-blue-400",

                    mood === "Normal" &&
                      "*:first:*:bg-yellow-200 *:last:*:border-yellow-600 *:last:*:bg-yellow-400",

                    mood === "Good" &&
                      "*:first:*:bg-green-200 *:last:*:border-green-700 *:last:*:bg-green-400",

                    mood === "Excellent" &&
                      "*:first:*:bg-purple-200 *:last:*:border-purple-700 *:last:*:bg-purple-400",
                  )}
                  onValueChange={(val) => field.onChange(val[0])}
                  max={100}
                  min={0}
                />
              </div>
            )}
          />
          <DialogFooter className="flex flex-row *:grow" hidden={hidden}>
            {defaultData && (
              <Button
                onClick={() => deleteMutation.mutate(defaultData.id)}
                variant="destructive"
                className="!grow-0"
                size={"icon"}
                type="button"
              >
                <Trash2 />
              </Button>
            )}
            <DialogClose asChild>
              <Button
                onClick={() => setTimeout(() => reset(defaultValues), 200)}
                variant="outline"
                type="button"
              >
                <Eraser /> {translate("cancel")}
              </Button>
            </DialogClose>

            <Button type="submit">
              {!defaultData ? (
                <>
                  <UploadCloud />
                  {translate("upload")}
                </>
              ) : (
                <>
                  <HardDriveUpload />
                  {translate("update")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
