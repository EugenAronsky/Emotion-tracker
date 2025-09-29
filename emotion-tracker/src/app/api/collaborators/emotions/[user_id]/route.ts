import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { Permission, SenderInfo } from "@/lib/type";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ user_id: string }> },
) {
  const { user_id } = await context.params;

  try {
    const fromDate = req.nextUrl.searchParams.get("fromDate");
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);

    const emotionSets = await adminDb
      .collection("emotion-sets")
      .where("ownerId", "==", user_id)
      .limit(1)
      .get();

    const EmotionSetDoc = emotionSets.docs[0];

    if (!EmotionSetDoc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const EmotionSetData = EmotionSetDoc.data();

    const permission: Permission = EmotionSetData.sharedWith.find(
      (collaborator: SenderInfo) => collaborator.uid === decoded.uid,
    ).permission;

    const snapshot = Boolean(fromDate)
      ? await adminDb
          .collection("emotions")
          .where("uid", "==", user_id)
          .where("date", ">=", Timestamp.fromDate(new Date(Number(fromDate))))
          .where("date", "<=", Timestamp.fromDate(new Date()))
          .get()
      : await adminDb.collection("emotions").where("uid", "==", user_id).get();

    const emotions = snapshot.docs.map((doc) => {
      const data = doc.data();

      switch (permission) {
        case "observer":
          return {
            id: null,
            emotion: data.emotion,
            date: data.date.toDate(),
          };

        case "viewer":
          return {
            ...data,
            id: null,
            description: null,
            date: data.date.toDate(),
          };

        case "reader":
          return {
            ...data,
            id: null,
            date: data.date.toDate(),
          };
      }
    });

    return NextResponse.json(emotions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
