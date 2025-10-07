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
import { useInvites } from "@/hooks/query/useInvite";
import { useTranslation } from "@/hooks/useTranslation";
import { InviteProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import { PartyPopper, TicketX } from "lucide-react";
import { useState } from "react";
import { PuffLoader } from "react-spinners";

export function InviteDialog({
  data,
  onInteractionEnd,
}: {
  data: InviteProps;
  onInteractionEnd?: () => void;
}) {
  const translate = useTranslation();
  const [open, setOpen] = useState(true);
  const { inviteConfirmationMutation, denyInviteMutation } = useInvites();

  const onSuccess = () => {
    setTimeout(() => onInteractionEnd && onInteractionEnd(), 500);

    setOpen(false);
  };

  return (
    <Dialog
      open={
        inviteConfirmationMutation.isPending || denyInviteMutation.isPending
          ? true
          : open
      }
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="overflow-hidden *:data-[slot='dialog-close']:hidden sm:max-w-[425px]">
        <div
          className={cn(
            "bg-secondary/60 absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center transition-all",
            inviteConfirmationMutation.isPending ||
              denyInviteMutation.isPending ||
              "invisible",
          )}
        >
          <PuffLoader size={100} color="#3b82f6" />
        </div>

        <DialogHeader>
          <DialogTitle>{data.senderInfo.name}</DialogTitle>
          <DialogDescription>
            {translate("invite_dialog_description")}
          </DialogDescription>
          <div
            className={cn(
              "absolute top-0 left-0 h-8 w-3 -skew-x-[45deg]",
              data.senderInfo.permission === "observer" && "bg-purple-500",
              data.senderInfo.permission === "viewer" && "bg-sky-400",
              data.senderInfo.permission === "reader" && "bg-teal-400",
            )}
          />
        </DialogHeader>

        <DialogFooter className="flex flex-row *:grow">
          <DialogClose asChild>
            <Button
              onClick={() =>
                denyInviteMutation.mutate(data.id, {
                  onSuccess: onSuccess,
                })
              }
              variant="destructive"
              type="button"
            >
              <TicketX />
              {translate("deny")}
            </Button>
          </DialogClose>

          <Button
            onClick={() =>
              inviteConfirmationMutation.mutate(data, {
                onSuccess: onSuccess,
              })
            }
          >
            <PartyPopper />
            {translate("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
