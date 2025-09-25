import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(token);

    const emotionSet = await adminDb
      .collection("emotion-sets")
      .where("ownerId", "==", decoded.uid)
      .get();

    if (emotionSet.empty) {
      await adminDb.collection("emotion-sets").add({
        ownerEmail: decoded.email,
        ownerId: decoded.uid,
        sharedWith: [],
      });
    }

    const res = NextResponse.json({ ok: true });

    // Ставим HttpOnly cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax", // вместо "strict"
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
