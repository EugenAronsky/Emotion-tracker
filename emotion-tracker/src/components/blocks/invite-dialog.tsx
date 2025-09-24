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
import { useInvites } from "@/hooks/useInvite";
import { InviteProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import { PartyPopper, TicketX } from "lucide-react";
import { useState } from "react";
import { PuffLoader } from "react-spinners";

export function InviteDialog({ data }: { data: InviteProps }) {
  const [open, setOpen] = useState(true);
  const { inviteConfirmationMutation, denyInviteMutation } = useInvites();

  return (
    <Dialog
      open={
        inviteConfirmationMutation.isPending || denyInviteMutation.isPending
          ? true
          : open
      }
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="overflow-hidden sm:max-w-[425px]">
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
            Invite you to share yours emotions!
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row *:grow">
          <DialogClose asChild>
            <Button
              onClick={() =>
                denyInviteMutation.mutate(data.id, {
                  onSuccess: () => setOpen(false),
                })
              }
              variant="destructive"
              type="button"
            >
              <TicketX /> Deny
            </Button>
          </DialogClose>

          <Button
            onClick={() =>
              inviteConfirmationMutation.mutate(data, {
                onSuccess: () => setOpen(false),
              })
            }
          >
            <PartyPopper />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
