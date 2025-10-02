import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFirebaseUser } from "./useFirebaseUser";
import {
  addCollaborator,
  getCollaborators,
  getPermissionByCollaboratorUid,
  removeCollaborator,
  updateCollaborator,
} from "@/lib/controllers/collaborators-controller";
import { toast } from "sonner";
import { errorToast } from "@/lib/func";

export function useCollaborators(options?: { user_id?: string | undefined }) {
  const queryClient = useQueryClient();
  const { user } = useFirebaseUser();

  const collaboratorsQuery = useQuery({
    queryKey: ["collaborators"],
    queryFn: getCollaborators,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: !!user?.uid, // только если пользователь авторизован
  });

  const collaboratorPermissionQuery = useQuery({
    queryKey: ["collaborator-permission", options?.user_id],
    queryFn: async () => await getPermissionByCollaboratorUid(options?.user_id),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: !!user?.uid && !!options?.user_id, // только если пользователь авторизован
  });

  const addCollaboratorMutation = useMutation({
    mutationFn: addCollaborator,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["collaborators"] }); // рефетч
    },
    onError: errorToast,
  });

  const removeCollaboratorMutation = useMutation({
    mutationFn: removeCollaborator,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["collaborators"] }); // рефетч
      toast.success("Unsubscribed successfully", {
        className: "!bg-green-500/50 !border-green-600 !backdrop-blur-sm",
        duration: 3000,
      });
    },
    onError: errorToast,
  });

  const updateCollaboratorMutation = useMutation({
    mutationFn: updateCollaborator,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["collaborators"] }); // рефетч
      toast.success("Collaborator has been updated", {
        className: "!bg-green-500/50 !border-green-600 !backdrop-blur-sm",
        duration: 3000,
      });
    },
    onError: errorToast,
  });

  return {
    collaboratorsQuery,
    addCollaboratorMutation,
    removeCollaboratorMutation,
    updateCollaboratorMutation,
    collaboratorPermissionQuery,
  };
}
