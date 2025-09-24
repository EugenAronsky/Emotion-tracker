import { auth } from "@/lib/firebase";
import { CollaboratorForm } from "./type";
import { errorHandler } from "./func";

// Получить колобараторов
async function getCollaborators() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  //   const token = await user.getIdToken(); // ✅ гарантированно не undefined
  const res = await fetch("/api/collaborators", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return errorHandler(res);
}

async function addCollaborator(data: CollaboratorForm) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch("/api/collaborators", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return errorHandler(res);
}

async function removeCollaborator(user_id: string) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`/api/collaborators/${user_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return errorHandler(res);
}

export { getCollaborators, addCollaborator, removeCollaborator };
