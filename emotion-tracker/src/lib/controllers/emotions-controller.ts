import { auth } from "@/lib/firebase";
import { EmotionForm } from "../type";
import { errorHandler } from "../func";

// Создать эмоцию
async function createEmotion(data: EmotionForm & { date?: Date | undefined }) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch("/api/emotions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...data }),
  });
  return errorHandler(res);
}

// Получить эмоции
async function getEmotions() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  //   const token = await user.getIdToken(); // ✅ гарантированно не undefined
  const res = await fetch("/api/emotions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return errorHandler(res);
}

async function getEmotionsByUserId(user_id?: string | undefined) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  //   const token = await user.getIdToken(); // ✅ гарантированно не undefined
  const res = await fetch(`/api/collaborators/emotions/${user_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return errorHandler(res);
}

// Получить эмоции по дате
async function getEmotionsByRange(fromDate?: number | undefined) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  //   const token = await user.getIdToken(); // ✅ гарантированно не undefined
  const SearchParams = fromDate
    ? new URLSearchParams({ fromDate: fromDate.toString() })
    : "";

  const res = await fetch(`/api/emotions?${SearchParams.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return errorHandler(res);
}

async function getEmotionsByUserIdAndByRange(
  user_id?: string | undefined,
  fromDate?: number | undefined,
) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  //   const token = await user.getIdToken(); // ✅ гарантированно не undefined
  const SearchParams = fromDate
    ? new URLSearchParams({ fromDate: fromDate.toString() })
    : "";

  const res = await fetch(
    `/api/collaborators/emotions/${user_id}?${SearchParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return errorHandler(res);
}

// Обновить эмоцию
async function updateEmotion({
  id,
  updates,
}: {
  id: string;
  updates: Partial<EmotionForm>;
}) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`/api/emotions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...updates }),
  });
  return errorHandler(res);
}

// Удалить эмоцию
async function deleteEmotion(id: string) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`/api/emotions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return errorHandler(res);
}

export {
  getEmotions,
  createEmotion,
  deleteEmotion,
  updateEmotion,
  getEmotionsByRange,
  getEmotionsByUserId,
  getEmotionsByUserIdAndByRange,
};
