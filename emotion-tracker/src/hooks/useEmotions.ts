import {
  createEmotion,
  deleteEmotion,
  getEmotions,
  getEmotionsByRange,
  getEmotionsByUserId,
  getEmotionsByUserIdAndByRange,
  updateEmotion,
} from "@/lib/emotions-controller";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFirebaseUser } from "./useFirebaseUser";

export function useEmotions(options?: {
  user_id?: string | undefined;
  fromDate?: number | undefined;
}) {
  const queryClient = useQueryClient();
  const { user } = useFirebaseUser();

  const emotionsQuery = useQuery({
    queryKey: ["emotions"],
    queryFn: getEmotions,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: !!user?.uid, // только если пользователь авторизован
  });

  const emotionsByRangeQuery = useQuery({
    queryKey: ["emotions-range", options?.fromDate],
    queryFn: () => getEmotionsByRange(options?.fromDate),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 360,
    enabled: !!user?.uid && !!options?.fromDate, // только если пользователь авторизован
  });

  const emotionsByUserIdQuery = useQuery({
    queryKey: ["emotions-by-user-id", options?.user_id],
    queryFn: () => getEmotionsByUserId(options?.user_id),

    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: !!user?.uid && !!options?.user_id, // только если пользователь авторизован
  });

  const emotionsByUserIdAndByRangeQuery = useQuery({
    queryKey: [
      "emotions-range-by-user-id",
      options?.user_id,
      options?.fromDate,
    ],
    queryFn: () =>
      getEmotionsByUserIdAndByRange(options?.user_id, options?.fromDate),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 360,
    enabled: !!user?.uid && !!options?.user_id && !!options?.fromDate, // только если пользователь авторизован
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
    emotionsByUserIdQuery,
    emotionsByRangeQuery,
    emotionsByUserIdAndByRangeQuery,
  };
}
