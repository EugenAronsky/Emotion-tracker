import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollaborators } from "@/hooks/useCollaborators";
import { useEmotions } from "@/hooks/useEmotions";
import { Emotion } from "@/lib/enums";
import { EmotionForm, SenderInfo } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  EllipsisVertical,
  Ghost,
  Info,
  LoaderCircle,
  UserRoundX,
} from "lucide-react";
import { PuffLoader } from "react-spinners";
import CollaboratorInfo from "./collaborator-info";
import { useMemo, useState } from "react";

export default function CllaboratorCard({ senderInfo }: SenderInfo) {
  const [open, setOpen] = useState(false);

  const fromDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.setDate(date.getDate());
  }, []);

  const { removeCollaboratorMutation } = useCollaborators();
  const { emotionsByUserIdAndByRangeQuery } = useEmotions({
    user_id: senderInfo.uid,
    fromDate: fromDate,
  });

  const emotion = emotionsByUserIdAndByRangeQuery.data?.at(0)?.emotion;

  return (
    <Card
      className={cn(
        "shadow-primary/15 relative overflow-hidden rounded-md border-0 p-0 shadow-[0_0_6px_0] dark:shadow-black/40",
        removeCollaboratorMutation.isSuccess && "hidden",
      )}
    >
      <CollaboratorInfo
        defaultOpen={open}
        senderInfo={senderInfo}
        setDefaultOpen={setOpen}
      />
      <div
        className={cn(
          "bg-secondary/60 absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center transition-all",
          removeCollaboratorMutation.isPending || "invisible",
        )}
      >
        <PuffLoader size={60} color="#3b82f6" />
      </div>

      <CardContent
        onClick={() => setOpen(true)}
        className="flex flex-row items-center justify-between p-3 dark:shadow-[inset_0_0_10px] dark:shadow-white/5"
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "bg-primary flex size-10 items-center justify-center rounded-full p-1 text-2xl",
              emotion === "Anger" && "bg-red-300",
              emotion === "Sadness" && "bg-blue-300",
              emotion === "Disgust" && "bg-yellow-300",
              emotion === "Joy" && "bg-green-300",
              emotion === "Love" && "bg-purple-300",
            )}
          >
            {emotionsByUserIdAndByRangeQuery.isLoading ? (
              <LoaderCircle className="text-secondary animate-spin" />
            ) : emotionsByUserIdAndByRangeQuery.data?.length ? (
              <>{Emotion[emotion as EmotionForm["emotion"]]}</>
            ) : (
              <Ghost className="text-secondary" />
            )}
          </span>
          <span>{senderInfo.name}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit min-w-0 *:gap-3" align="end">
            <DropdownMenuItem
              onClick={() => removeCollaboratorMutation.mutate(senderInfo.uid)}
            >
              <UserRoundX className="text-destructive" />
              <span className="text-destructive">Remove</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
