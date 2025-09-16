import {
  createEmotion,
  deleteEmotion,
  getEmotions,
  updateEmotion,
} from "@/lib/emotions-controller";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFirebaseUser } from "./useFirebaseUser";

export function useEmotions() {
  const queryClient = useQueryClient();
  const { user, loading } = useFirebaseUser();

  const emotionsQuery = useQuery({
    queryKey: ["emotions"],
    queryFn: getEmotions,
    staleTime: 1000 * 60,
    enabled: !!user?.uid, // только если пользователь авторизован
  });

  const createMutation = useMutation({
    mutationFn: createEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotions"] }); // рефетч
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotions"] }); // рефетч
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotions"] }); // рефетч
    },
  });

  return { emotionsQuery, createMutation, updateMutation, deleteMutation };
}
