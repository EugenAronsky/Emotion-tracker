import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { InviteProps, SenderInfo } from "@/lib/type";
import { NextRequest, NextResponse } from "next/server";

function isDuplicates(arr: Array<Record<string, any>>, key: string) {
  return arr.some((obj, i) =>
    arr.findIndex((o) => o[key] === obj[key]) === -1 ? false : true,
  );
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    const decoded = await adminAuth.verifyIdToken(token);

    const emotionSets = await adminDb.collection("mood-set").get();

    const collaborators = await adminDb
      .collection("mood-set")
      .where("ownerId", "==", decoded.uid)
      .get();

    const myCollaborators = collaborators.docs[0].data().sharedWith;

    const collaboratorsEmails = emotionSets.docs
      .map((doc) => {
        const data = doc.data();
        const index = myCollaborators.findIndex(
          ({ uid }: SenderInfo) => uid === data.ownerId,
        );

        if (index === -1) return data.ownerEmail;
        else return null;
      })
      .filter((email) => email !== decoded.email && email !== null);

    return NextResponse.json({
      myCollaborators: myCollaborators,
      collaboratorsEmails: collaboratorsEmails,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    const { from, senderInfo, id } = (await req.json()) as InviteProps;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required!" },
        { status: 400 },
      );
    }

    const decoded = await adminAuth.verifyIdToken(token);

    if (from !== decoded.uid) {
      const ToEmotionSet = await adminDb
        .collection("mood-set")
        .where("ownerId", "==", decoded.uid)
        .limit(1)
        .get();

      const FromEmotionSet = await adminDb
        .collection("mood-set")
        .where("ownerId", "==", from)
        .limit(1)
        .get();

      const ToEmotionSetDoc = ToEmotionSet.docs[0];
      const FromEmotionSetDoc = FromEmotionSet.docs[0];

      if (!FromEmotionSetDoc.exists || !ToEmotionSetDoc.exists) {
        return NextResponse.json({ error: "Not found!" }, { status: 404 });
      }

      const FromEmotionSetRef = FromEmotionSetDoc.ref;
      const FromEmotionSetData = FromEmotionSetDoc.data();

      const ToEmotionSetRef = ToEmotionSetDoc.ref;
      const ToEmotionSetData = ToEmotionSetDoc.data();

      if (
        !isDuplicates(FromEmotionSetData.sharedWith, "uid") ||
        !isDuplicates(ToEmotionSetData.sharedWith, "uid")
      ) {
        FromEmotionSetRef.update({
          ...FromEmotionSetData,
          sharedWith: [
            ...FromEmotionSetData.sharedWith,
            {
              uid: decoded.uid,
              name: decoded.name,
              picture: decoded.picture,
              permission: senderInfo.permission,
              email: decoded.email,
            },
          ],
        });

        ToEmotionSetRef.update({
          ...ToEmotionSetData,
          sharedWith: [
            ...ToEmotionSetData.sharedWith,
            {
              uid: from,
              ...senderInfo,
            },
          ],
        });

        const docRef = adminDb.collection("invites").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
          return NextResponse.json(
            { error: "Invite not found" },
            { status: 404 },
          );
        }

        if (doc.data()?.to !== decoded.uid) {
          return NextResponse.json({ error: "Forbidden!" }, { status: 403 });
        }

        await docRef.delete();
      } else
        return NextResponse.json(
          { error: "The user has already been added!" },
          { status: 409 },
        );
    } else
      return NextResponse.json(
        { error: "You can't add yourself!" },
        { status: 409 },
      );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request!" }, { status: 400 });
  }
}
