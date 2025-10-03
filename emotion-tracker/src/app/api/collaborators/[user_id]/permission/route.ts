import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { SenderInfo } from "@/lib/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ user_id: string }> },
) {
  const { user_id } = await context.params;
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    const decoded = await adminAuth.verifyIdToken(token);

    const collaborators = await adminDb
      .collection("mood-set")
      .where("ownerId", "==", user_id)
      .get();

    const doc = collaborators.docs[0];
    const docData = doc.data();

    const me: SenderInfo = docData.sharedWith.find(
      ({ uid }: SenderInfo) => uid === decoded.uid,
    );

    if (me) return NextResponse.json({ permission: me.permission });

    return NextResponse.json({ error: "User not found!" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
