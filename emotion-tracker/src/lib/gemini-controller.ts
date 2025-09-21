import { auth } from "@/lib/firebase";

async function getAiTip({
  emotion,
  prev_context,
}: {
  emotion?: string;
  prev_context?: string;
}) {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(`/api/gemini`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ emotion, prev_context }),
  });
  return res.json();
}

export { getAiTip };
