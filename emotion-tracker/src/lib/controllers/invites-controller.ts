import { CollaboratorInviteProps } from "@/components/blocks/dialogs/collaborator-dialog";
import { auth } from "@/lib/firebase";
import { errorHandler } from "../func";
import { InviteProps, Permission } from "../type";

// Получить приглашения
async function getInvites() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch("/api/invites", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return errorHandler(res);
}

async function getQrCodeInvites(permission: Permission, signal: AbortSignal) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Not authenticated");
  const res = await fetch("/api/invites/qrcode", {
    method: "GET",
    signal: signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      permission: permission || "observer",
    },
  });
  return errorHandler(res);
}

async function inviteCollaborator(data: CollaboratorInviteProps) {
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

async function confirmQRCodeInvite(id: string) {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    window.location.pathname = "/entrance";
    throw new Error("Not authenticated");
  }
  const res = await fetch(`/api/invites/qrcode/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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

export {
  getInvites,
  denyInvite,
  confirmInvite,
  getQrCodeInvites,
  inviteCollaborator,
  confirmQRCodeInvite,
};
