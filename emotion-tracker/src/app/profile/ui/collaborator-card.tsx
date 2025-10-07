import { CollaboratorDialog } from "@/components/blocks/dialogs/collaborator-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollaborators } from "@/hooks/query/useCollaborators";
import { useEmotions } from "@/hooks/query/useEmotions";
import { useTranslation } from "@/hooks/useTranslation";
import { Mood } from "@/lib/enums";
import { EmotionForm, SenderInfo } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  EllipsisVertical,
  Ghost,
  LoaderCircle,
  UserRoundPen,
  UserRoundX,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PuffLoader } from "react-spinners";
import CollaboratorInfo from "./collaborator-info";
import { useStore } from "@/app/store";

export default function CllaboratorCard({
  emails,
  senderInfo,
}: {
  senderInfo: SenderInfo;
  emails: Array<string>;
}) {
  const { lang } = useStore();
  const translate = useTranslation();
  const [open, setOpen] = useState(false);

  const fromDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.setDate(date.getDate());
  }, []);

  const { removeCollaboratorMutation, collaboratorPermissionQuery } =
    useCollaborators({ user_id: senderInfo.uid });
  const { emotionsByUserIdAndByRangeQuery } = useEmotions({
    user_id: senderInfo.uid,
    fromDate: fromDate,
  });

  const mood = emotionsByUserIdAndByRangeQuery.data?.at(0)?.mood;
  const my_permission = collaboratorPermissionQuery.data?.permission;

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
        permission={my_permission}
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
        className={cn(
          "flex flex-row items-center justify-between p-0 shadow-white/5 dark:shadow-[inset_0_0_10px]",
          senderInfo.permission === "observer" &&
            "to-card bg-gradient-to-r from-purple-200 to-[80%] dark:from-purple-900",
          senderInfo.permission === "viewer" &&
            "to-card bg-gradient-to-r from-sky-200 to-[80%] dark:from-sky-900",
          senderInfo.permission === "reader" &&
            "to-card bg-gradient-to-r from-teal-200 to-[80%] dark:from-teal-900",
        )}
      >
        <div
          className={cn(
            "absolute top-0 left-0 h-6 w-2 -skew-x-[45deg]",
            my_permission === "observer" && "bg-purple-500",
            my_permission === "viewer" && "bg-sky-400",
            my_permission === "reader" && "bg-teal-400",
          )}
        />

        <div
          onClick={() => my_permission !== "observer" && setOpen(true)}
          className="flex w-full items-center gap-3 p-3"
        >
          <span
            className={cn(
              "bg-secondary flex size-10 items-center justify-center rounded-full p-1 text-2xl shadow-[0_2px_7px_-2px] shadow-black/50 dark:shadow-[0_2px_8px_-1px]",
              mood === "Awful" && "bg-red-300",
              mood === "Bad" && "bg-blue-300",
              mood === "Normal" && "bg-yellow-300",
              mood === "Good" && "bg-green-300",
              mood === "Excellent" && "bg-purple-300",
            )}
          >
            {emotionsByUserIdAndByRangeQuery.isLoading ? (
              <LoaderCircle className="text-primary/50 animate-spin" />
            ) : emotionsByUserIdAndByRangeQuery.data?.length ? (
              <>{Mood[mood as EmotionForm["mood"]]}</>
            ) : (
              <Ghost className="text-primary/50" />
            )}
          </span>
          <span className="truncate font-[500] opacity-90 max-[400px]:max-w-[130px] max-[400px]:text-sm">
            {senderInfo.name}
          </span>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"ghost"} className="mr-3">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit min-w-0 *:gap-3"
            align={lang === "he" ? "start" : "end"}
          >
            <DropdownMenuItem asChild>
              <CollaboratorDialog
                defaultData={{
                  uid: senderInfo.uid,
                  name: senderInfo.name,
                  email: senderInfo.email,
                  permission: senderInfo.permission,
                }}
                emails={emails}
              >
                <div className="flex h-8 w-full gap-3 px-2 py-1.5">
                  <UserRoundPen size={16} />
                  <span className="text-sm">{translate("edit")}</span>
                </div>
              </CollaboratorDialog>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                removeCollaboratorMutation.mutate(senderInfo.uid);
              }}
            >
              <UserRoundX className="text-destructive" />
              <span className="text-destructive">{translate("remove")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
