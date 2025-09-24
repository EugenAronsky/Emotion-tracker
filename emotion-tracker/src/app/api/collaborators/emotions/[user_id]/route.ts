import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

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
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate(),
      };
    });

    return NextResponse.json(emotions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
