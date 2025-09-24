import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFirebaseUser } from "./useFirebaseUser";
import {
  addCollaborator,
  getCollaborators,
  removeCollaborator,
} from "@/lib/collaborators-controller";

export function useCollaborators() {
  const queryClient = useQueryClient();
  const { user } = useFirebaseUser();

  const collaboratorsQuery = useQuery({
    queryKey: ["collaborators"],
    queryFn: getCollaborators,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: !!user?.uid, // только если пользователь авторизован
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

  return {
    collaboratorsQuery,
    addCollaboratorMutation,
    removeCollaboratorMutation,
  };
}
