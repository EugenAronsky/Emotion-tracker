import { auth } from "@/lib/firebase";
import { CollaboratorForm, InviteProps } from "./type";
import { errorHandler } from "./func";

// Получить приглашения
async function getInvites() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  //   const token = await user.getIdToken(); // ✅ гарантированно не undefined
  const res = await fetch("/api/invites", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return errorHandler(res);
}

async function inviteCollaborator(data: CollaboratorForm) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch("/api/invites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return errorHandler(res);
}

async function confirmInvite(data: InviteProps) {
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

async function denyInvite(id: string) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(`/api/invites/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return errorHandler(res);
}

export { inviteCollaborator, getInvites, confirmInvite, denyInvite };
