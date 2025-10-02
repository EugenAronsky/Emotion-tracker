import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFirebaseUser } from "./useFirebaseUser";
import {
  confirmInvite,
  confirmQRCodeInvite,
  denyInvite,
  getInvites,
  getQrCodeInvites,
  inviteCollaborator,
} from "@/lib/controllers/invites-controller";
import { toast } from "sonner";
import { errorToast } from "@/lib/func";
import { Permission } from "@/lib/type";

export function useInvites(options?: { permission?: string | undefined }) {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const invitesQuery = useQuery({
    queryKey: ["invites"],
    queryFn: getInvites,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    enabled: !!user?.uid, // только если пользователь авторизован
  });

  const QRCodeInviteQuery = useQuery({
    queryKey: ["qrcode-invite"],
    queryFn: async ({ signal }) =>
      await getQrCodeInvites(
        (options?.permission || "observer") as Permission,
        signal,
      ),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: false && !!options?.permission,
  });

  const inviteConfirmationMutation = useMutation({
    mutationFn: confirmInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      toast.success("Congratulations! Invite has been confirmed", {
        className: "!bg-green-500/50 !border-green-600 !backdrop-blur-sm",
        duration: 3000,
      });
    },
    onError: errorToast,
  });

  const inviteQRCodeConfirmationMutation = useMutation({
    mutationFn: confirmQRCodeInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      toast.success("Congratulations! New collaborator has been added", {
        className: "!bg-green-500/50 !border-green-600 !backdrop-blur-sm",
        duration: 3000,
      });
    },
    onError: errorToast,
  });

  const denyInviteMutation = useMutation({
    mutationFn: denyInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      toast.success("Invite has been removed successfully ", {
        className: "!bg-green-500/50 !border-green-600 !backdrop-blur-sm",
        duration: 3000,
      });
    },
    onError: errorToast,
  });

  const inviteCollaboratorMutation = useMutation({
    mutationFn: inviteCollaborator,
    onSuccess: ({ id }) => {
      toast.success("Invite has been sended", {
        action: {
          label: "Undo",
          onClick: () => id && denyInviteMutation.mutate(id),
        },
        className: "!bg-green-500/50 !border-green-600 !backdrop-blur-sm",
        duration: 5000,
      });
    },
    onError: errorToast,
  });

  return {
    invitesQuery,
    QRCodeInviteQuery,
    denyInviteMutation,
    inviteCollaboratorMutation,
    inviteConfirmationMutation,
    inviteQRCodeConfirmationMutation,
  };
}
