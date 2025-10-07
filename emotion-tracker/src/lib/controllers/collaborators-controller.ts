import { CollaboratorInviteProps } from "@/components/blocks/dialogs/collaborator-dialog";
import { auth } from "@/lib/firebase";
import { errorHandler } from "../func";

// Получить колобараторов
async function getCollaborators() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch("/api/collaborators", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return errorHandler(res);
}

async function getPermissionByCollaboratorUid(user_id?: string) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`/api/collaborators/${user_id}/permission`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return errorHandler(res);
}

async function addCollaborator(data: CollaboratorInviteProps) {
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

async function updateCollaborator({
  user_id,
  permission,
}: {
  user_id: string;
  permission: Partial<CollaboratorInviteProps["permission"]>;
}) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`/api/collaborators/${user_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, permission }),
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

export {
  addCollaborator,
  getCollaborators,
  getPermissionByCollaboratorUid,
  removeCollaborator,
  updateCollaborator,
};
