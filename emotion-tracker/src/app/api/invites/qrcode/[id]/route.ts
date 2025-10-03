import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { SenderInfo } from "@/lib/type";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) return NextResponse.redirect(new URL("/entrance", req.nextUrl));

    const decoded = await adminAuth.verifyIdToken(token);

    const docRef = adminDb.collection("qr-codes").doc(id);
    const doc = await docRef.get();

    if (!doc.exists)
      return NextResponse.json({ error: "Not found!" }, { status: 404 });

    const docData = doc.data();

    if (!docData)
      return NextResponse.json({ error: "Not found!" }, { status: 404 });

    if (moment().isAfter(moment(new Date(docData.expiryDate))))
      return NextResponse.json(
        { error: "Invite has been expired!" },
        { status: 410 },
      );

    if (docData?.ownerId === decoded.uid)
      return NextResponse.json(
        { error: "You can't invite yourself!" },
        { status: 409 },
      );

    const snap = await adminDb
      .collection("mood-set")
      .where("ownerId", "==", decoded.uid)
      .limit(1)
      .get();

    const myEmotionSets = snap.docs[0];

    if (!myEmotionSets.exists)
      return NextResponse.json({ error: "Not found!" }, { status: 404 });

    const myEmotionSetsData = myEmotionSets.data();
    const myCollaborators = myEmotionSetsData.sharedWith;

    const [invite_a, invite_b] = await Promise.all([
      adminDb
        .collection("invites")
        .where("from", "==", docData.ownerId)
        .where("to", "==", decoded.uid)
        .limit(1)
        .get(),
      adminDb
        .collection("invites")
        .where("from", "==", decoded.uid)
        .where("to", "==", docData.ownerId)
        .limit(1)
        .get(),
    ]);

    const invites = [...invite_a.docs, ...invite_b.docs];
    if (
      myCollaborators.some(({ uid }: SenderInfo) => docData.ownerId === uid) &&
      Boolean(invites.length)
    )
      return NextResponse.json(
        { error: "Invite already exist!" },
        { status: 409 },
      );

    const res = await adminDb.collection("invites").add({
      from: docData.ownerId,
      to: decoded.uid,
      senderInfo: docData.senderInfo,
    });
    await docRef.delete();
    return NextResponse.json({ ok: true, id: res.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
