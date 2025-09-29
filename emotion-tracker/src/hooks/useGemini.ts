import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFirebaseUser } from "./useFirebaseUser";
import { getAiTip } from "@/lib/controllers/gemini-controller";

export function useGemini(options?: {
  slogonQueryParams: {
    emotion?: string | undefined;
    prev_context?: string | undefined;
  };
}) {
  const { user } = useFirebaseUser();

  const slogonQuery = useQuery({
    queryKey: ["slogon"],
    queryFn: () =>
      getAiTip({
        emotion: options?.slogonQueryParams.emotion,
        prev_context: options?.slogonQueryParams.prev_context,
      }),
    refetchOnReconnect: false,
    refetchInterval: false,
    enabled: false, // только если пользователь авторизован
  });

  return { slogonQuery };
}
