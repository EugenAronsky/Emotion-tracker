import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);

    const docRef = adminDb.collection("invites").doc(id);
    const doc = await docRef.get();
    const docData = doc.data();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Doesn't exist anymore!" },
        { status: 404 },
      );
    }

    if (docData?.to !== decoded.uid && docData?.from !== decoded.uid) {
      return NextResponse.json({ error: "Forbidden!" }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
