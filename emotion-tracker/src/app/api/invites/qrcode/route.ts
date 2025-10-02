import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const permission = req.headers.get("permission");
    const token = req.headers.get("authorization")?.split("Bearer ")[1];

    if (!token)
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    const decoded = await adminAuth.verifyIdToken(token);

    const QR_UUID = crypto.randomUUID();
    const expiryDate = new Date().setMinutes(new Date().getMinutes() + 2);

    const myQrCodes = await adminDb
      .collection("qr-codes")
      .where("ownerId", "==", decoded.uid)
      .get();

    if (!myQrCodes.empty) {
      const writer = adminDb.bulkWriter();
      myQrCodes.docs.forEach((doc) => {
        writer.delete(doc.ref);
      });
      await writer.close();
    }

    const res = await adminDb.collection("qr-codes").add({
      ownerId: decoded.uid,
      secret: QR_UUID,
      senderInfo: {
        name: decoded.name,
        permission: permission,
        email: decoded.email,
      },
      expiryDate: Timestamp.fromDate(new Date(expiryDate)),
    });

    return NextResponse.json({ QRCodeURL: `/entrance/qrcode/${res.id}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
