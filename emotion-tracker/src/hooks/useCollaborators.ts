import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFirebaseUser } from "./useFirebaseUser";
import {
  addCollaborator,
  getCollaborators,
  getPermissionByCollaboratorUid,
  removeCollaborator,
  updateCollaborator,
} from "@/lib/controllers/collaborators-controller";

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
  });

  const removeCollaboratorMutation = useMutation({
    mutationFn: removeCollaborator,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["collaborators"] }); // рефетч
    },
  });

  const updateCollaboratorMutation = useMutation({
    mutationFn: updateCollaborator,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["collaborators"] }); // рефетч
    },
  });

  return {
    collaboratorsQuery,
    addCollaboratorMutation,
    removeCollaboratorMutation,
    updateCollaboratorMutation,
    collaboratorPermissionQuery,
  };
}
