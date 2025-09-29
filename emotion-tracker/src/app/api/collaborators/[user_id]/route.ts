import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { SenderInfo } from "@/lib/type";

async function deleteCollaborators(uid: string, user_id: string) {
  const collaborators = await adminDb
    .collection("emotion-sets")
    .where("ownerId", "==", uid)
    .limit(1)
    .get();

  const doc = collaborators.docs[0];

  if (!doc.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const docData = doc.data();
  const myUpdatedCollaborators = docData.sharedWith.filter(
    ({ uid }: SenderInfo) => uid !== user_id,
  );

  doc.ref.update({ ...docData, sharedWith: myUpdatedCollaborators });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ user_id: string }> },
) {
  const { user_id } = await context.params;
  try {
    const { token, permission } = await req.json();
    const decoded = await adminAuth.verifyIdToken(token);

    const collaborators = await adminDb
      .collection("emotion-sets")
      .where("ownerId", "==", decoded.uid)
      .limit(1)
      .get();

    const doc = collaborators.docs[0];

    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const docData = doc.data();
    const updatetdCollaborator: SenderInfo = docData.sharedWith.find(
      ({ uid }: SenderInfo) => uid === user_id,
    );

    if (updatetdCollaborator) {
      updatetdCollaborator.permission = permission;
      doc.ref.update({
        ...docData,
        sharedWith: [
          ...docData.sharedWith.filter(
            ({ uid }: SenderInfo) => uid !== user_id,
          ),
          updatetdCollaborator,
        ],
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
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

    await deleteCollaborators(decoded.uid, user_id);
    await deleteCollaborators(user_id, decoded.uid);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
