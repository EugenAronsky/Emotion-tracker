import {
  createEmotion,
  deleteEmotion,
  getEmotions,
  getEmotionsByRange,
  updateEmotion,
} from "@/lib/emotions-controller";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFirebaseUser } from "./useFirebaseUser";

export function useEmotions(options?: {
  emotionsQueryParams: { fromDate?: number | undefined };
}) {
  const queryClient = useQueryClient();
  const { user, loading } = useFirebaseUser();

  const emotionsQuery = useQuery({
    queryKey: ["emotions"],
    queryFn: getEmotions,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: !!user?.uid, // только если пользователь авторизован
  });

  const emotionsByRangeQuery = useQuery({
    queryKey: ["emotions-range"],
    queryFn: () => getEmotionsByRange(options?.emotionsQueryParams.fromDate),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 360,
    enabled: !!user?.uid, // только если пользователь авторизован
  });

  const createMutation = useMutation({
    mutationFn: createEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotions"] }); // рефетч
      queryClient.invalidateQueries({ queryKey: ["emotions-range"] }); // рефетч
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotions"] }); // рефетч
      queryClient.invalidateQueries({ queryKey: ["emotions-range"] }); // рефетч
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emotions"] }); // рефетч
      queryClient.invalidateQueries({ queryKey: ["emotions-range"] }); // рефетчфетч
    },
  });

  return {
    emotionsQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    emotionsByRangeQuery,
  };
}
