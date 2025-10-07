import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFirebaseUser } from "../useFirebaseUser";
import {
  addCollaborator,
  getCollaborators,
  getPermissionByCollaboratorUid,
  removeCollaborator,
  updateCollaborator,
} from "@/lib/controllers/collaborators-controller";
import { toast } from "sonner";
import { errorToast } from "@/lib/func";
import { useTranslation } from "../useTranslation";

export function useCollaborators(options?: { user_id?: string | undefined }) {
  const translate = useTranslation();
  const { user } = useFirebaseUser();
  const queryClient = useQueryClient();
  const messages = translate("collaborators_mutation_messages");

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
      toast.success(messages.remove, {
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
      toast.success(messages.update, {
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
