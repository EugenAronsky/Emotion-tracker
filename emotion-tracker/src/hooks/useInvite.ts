import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFirebaseUser } from "./useFirebaseUser";
import {
  confirmInvite,
  denyInvite,
  getInvites,
  inviteCollaborator,
} from "@/lib/invites-controller";

export function useInvites() {
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();

  const invitesQuery = useQuery({
    queryKey: ["invites"],
    queryFn: getInvites,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    enabled: !!user?.uid, // только если пользователь авторизован
  });

  const inviteConfirmationMutation = useMutation({
    mutationFn: confirmInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  });

  const denyInviteMutation = useMutation({
    mutationFn: denyInvite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invites"] }),
  });

  const inviteCollaboratorMutation = useMutation({
    mutationFn: inviteCollaborator,
  });

  return {
    invitesQuery,
    denyInviteMutation,
    inviteCollaboratorMutation,
    inviteConfirmationMutation,
  };
}
