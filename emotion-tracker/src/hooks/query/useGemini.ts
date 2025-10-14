import { getAiTip } from "@/lib/controllers/gemini-controller";
import { useQuery } from "@tanstack/react-query";

export function useGemini(options?: {
  slogonQueryParams: {
    emotion?: string | undefined;
    prev_context?: string | undefined;
  };
}) {
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
