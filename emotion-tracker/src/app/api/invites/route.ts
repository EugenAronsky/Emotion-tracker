import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { SenderInfo } from "@/lib/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    const decoded = await adminAuth.verifyIdToken(token);

    const invites = await adminDb
      .collection("invites")
      .where("to", "==", decoded.uid)
      .get();

    const data = invites.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    const { email, permission } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required!" },
        { status: 400 },
      );
    }

    const decoded = await adminAuth.verifyIdToken(token);

    const snap = await adminDb
      .collection("emotion-sets")
      .where("ownerId", "==", decoded.uid)
      .limit(1)
      .get();

    const myEmotionSets = snap.docs[0];

    if (!myEmotionSets.exists) {
      return NextResponse.json({ error: "Not found!" }, { status: 404 });
    }

    const myEmotionSetsData = myEmotionSets.data();
    const myCollaborators = myEmotionSetsData.sharedWith;

    if (myEmotionSetsData.ownerEmail !== email) {
      const emotionSets = await adminDb
        .collection("emotion-sets")
        .where("ownerEmail", "==", email)
        .get();

      if (!emotionSets.docs[0].exists) {
        return NextResponse.json({ error: "Not found!" }, { status: 404 });
      }

      const collaboratorId = emotionSets.docs[0].data().ownerId;

      const [invite_a, invite_b] = await Promise.all([
        adminDb
          .collection("invites")
          .where("from", "==", decoded.uid)
          .where("to", "==", collaboratorId)
          .limit(1)
          .get(),
        adminDb
          .collection("invites")
          .where("from", "==", collaboratorId)
          .where("to", "==", decoded.uid)
          .limit(1)
          .get(),
      ]);

      const invites = [...invite_a.docs, ...invite_b.docs];

      const res = await adminDb.collection("invites").add({
        from: decoded.uid,
        to: collaboratorId,
        senderInfo: {
          name: decoded.name,
          permission: permission,
          email: email,
        },
      });
      return NextResponse.json({ ok: true, id: res.id });
    } else
      return NextResponse.json(
        { error: "You can't invite yourself!" },
        { status: 409 },
      );
  } catch (err) {
    return NextResponse.json({ error: "Invalid request!" }, { status: 400 });
  }
}
