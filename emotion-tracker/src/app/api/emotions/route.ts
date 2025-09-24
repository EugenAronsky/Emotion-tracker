// app/api/emotions/route.ts
import * as admin from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  try {
    const fromDate = req.nextUrl.searchParams.get("fromDate");
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);

    const snapshot = Boolean(fromDate)
      ? await adminDb
          .collection("emotions")
          .where("uid", "==", decoded.uid)
          .where("date", ">=", Timestamp.fromDate(new Date(Number(fromDate))))
          .where("date", "<=", Timestamp.fromDate(new Date()))
          .get()
      : await adminDb
          .collection("emotions")
          .where("uid", "==", decoded.uid)
          .get();

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

export async function POST(req: NextRequest) {
  try {
    const { token, emotion, description, intensity, date } = await req.json();

    // Проверяем токен пользователя
    const decoded = await adminAuth.verifyIdToken(token);

    // Сохраняем в Firestore
    if (decoded.uid === undefined) throw new Error("No UID in token");

    await adminDb.collection("emotions").add({
      uid: decoded.uid,
      emotion,
      description,
      intensity,
      date: Timestamp.fromDate(new Date(date)),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
