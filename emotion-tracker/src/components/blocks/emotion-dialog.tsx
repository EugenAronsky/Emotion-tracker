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
import { useEmotions } from "@/hooks/useEmotions";
import { EmotionForm, EmotionReturnProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import { Eraser, HardDriveUpload, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PuffLoader } from "react-spinners";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";

export function EmotionDialog({
  defaultData,
  children,
  date,
}: {
  date: Date | undefined;
  children: React.ReactNode;
  defaultData: EmotionReturnProps | undefined;
}) {
  const [open, setOpen] = useState(false);
  const { updateMutation, createMutation, deleteMutation } = useEmotions();

  const defaultValues = {
    emotion: defaultData?.emotion || "Disgust",
    description: defaultData?.description || "",
    intensity: defaultData?.intensity || 50,
  };

  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmotionForm>();

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

  const close = () => {
    setTimeout(() => reset(defaultValues), 200);
    setOpen(false);
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
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-hidden sm:max-w-[425px]">
        <div
          className={cn(
            "absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-white/70 transition-all",
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
          <DialogHeader className="mb-6">
            <DialogTitle>New Entry</DialogTitle>
            <DialogDescription>How are you feeling today?</DialogDescription>
          </DialogHeader>
          <Controller
            name="emotion"
            control={control}
            defaultValue="Disgust"
            render={({ field }) => (
              <RadioGroup
                {...field}
                onValueChange={field.onChange}
                className="*:bg-secondary flex gap-3 *:flex *:size-14 *:items-center *:justify-center *:rounded-full"
              >
                <Label
                  className={cn(
                    "text-4xl transition-all",
                    field.value === "Anger" && "!bg-red-300",
                  )}
                >
                  <span>😡</span>
                  <RadioGroupItem value="Anger" className="hidden" />
                </Label>

                <Label
                  className={cn(
                    "text-4xl transition-all",
                    field.value === "Sadness" && "!bg-blue-300",
                  )}
                >
                  <span>😢</span>
                  <RadioGroupItem value="Sadness" className="hidden" />
                </Label>

                <Label
                  className={cn(
                    "text-4xl transition-all",
                    field.value === "Disgust" && "!bg-yellow-300",
                  )}
                >
                  <span>🤨</span>
                  <RadioGroupItem value="Disgust" className="hidden" />
                </Label>

                <Label
                  className={cn(
                    "text-4xl transition-all",
                    field.value === "Joy" && "!bg-green-300",
                  )}
                >
                  <span>😊</span>
                  <RadioGroupItem value="Joy" className="hidden" />
                </Label>

                <Label
                  className={cn(
                    "text-4xl transition-all",
                    field.value === "Love" && "!bg-purple-300",
                  )}
                >
                  <span>😍</span>
                  <RadioGroupItem value="Love" className="hidden" />
                </Label>
              </RadioGroup>
            )}
          />

          <Textarea
            {...register("description")}
            className="h-36 resize-none"
            placeholder="Add note..."
          />
          <Controller
            name="intensity"
            control={control}
            defaultValue={50}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Intensity</span>
                  <span>{field.value}</span>
                </div>

                <Slider
                  {...field}
                  value={[field.value]}
                  className={cn(
                    watch("emotion") === "Anger" &&
                      "*:first:*:bg-red-200 *:last:*:border-red-700 *:last:*:bg-red-400",

                    watch("emotion") === "Sadness" &&
                      "*:first:*:bg-blue-200 *:last:*:border-blue-700 *:last:*:bg-blue-400",

                    watch("emotion") === "Disgust" &&
                      "*:first:*:bg-yellow-200 *:last:*:border-yellow-600 *:last:*:bg-yellow-400",

                    watch("emotion") === "Joy" &&
                      "*:first:*:bg-green-200 *:last:*:border-green-700 *:last:*:bg-green-400",

                    watch("emotion") === "Love" &&
                      "*:first:*:bg-purple-200 *:last:*:border-purple-700 *:last:*:bg-purple-400",
                  )}
                  onValueChange={(val) => field.onChange(val[0])}
                  max={100}
                  min={0}
                />
              </div>
            )}
          />
          <DialogFooter className="mt-6 flex flex-row *:grow">
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
                <Eraser /> Cancel
              </Button>
            </DialogClose>

            <Button type="submit">
              {!defaultData ? (
                <>
                  <UploadCloud />
                  Upload
                </>
              ) : (
                <>
                  <HardDriveUpload />
                  Update
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
