// app/api/emotions/route.ts
import * as admin from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);

    const snapshot = await adminDb
      .collection("emotions")
      .where("uid", "==", decoded.uid)
      .get();

    const emotions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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
      date: date,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
