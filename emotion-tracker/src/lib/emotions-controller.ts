import { auth } from "@/lib/firebase";
import { EmotionForm } from "./type";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { User } from "firebase/auth";

// Создать эмоцию
async function createEmotion(data: EmotionForm & { date?: Date }) {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch("/api/emotions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...data }),
  });

  return res;
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
  return res.json();
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
  const res = await fetch(`/api/emotions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...updates }),
  });
  return res;
}

// Удалить эмоцию
async function deleteEmotion(id: string) {
  const token = await auth.currentUser?.getIdToken();
  await fetch(`/api/emotions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export { createEmotion, getEmotions, updateEmotion, deleteEmotion };
