import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { SenderInfo } from "@/lib/type";

async function updateCollaborators(uid: string, user_id: string) {
  const collaborators = await adminDb
    .collection("emotion-sets")
    .where("ownerId", "==", uid)
    .get();

  const doc = collaborators.docs[0];

  if (!doc.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const myUpdatedCollaborators = doc
    .data()
    .sharedWith.filter(
      ({ senderInfo: { uid } }: SenderInfo) => uid !== user_id,
    );

  doc.ref.update({ ...doc.data(), sharedWith: myUpdatedCollaborators });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ user_id: string }> },
) {
  const { user_id } = await context.params;
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);

    await updateCollaborators(decoded.uid, user_id);
    await updateCollaborators(user_id, decoded.uid);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
