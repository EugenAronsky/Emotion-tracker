"use client";
import { Button } from "@/components/ui/button";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useInvites } from "@/hooks/query/useInvite";
import { AlertOctagon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "@/hooks/useTranslation";

export default function QRCode() {
  const router = useRouter();
  const { id } = useParams();
  const translate = useTranslation();
  const { user, loading } = useFirebaseUser();
  const { inviteQRCodeConfirmationMutation } = useInvites();

  useEffect(() => {
    if (Boolean(user) && id && !loading)
      inviteQRCodeConfirmationMutation.mutate(id as string, {
        onSuccess: () => router.push("/dashboard"),
      });
    else if (!Boolean(user) && !loading) router.push("/entrance");
  }, [id, loading, user]);

  return (
    <section className="flex h-svh w-full items-center justify-center">
      {!inviteQRCodeConfirmationMutation.isError ? (
        <div className="flex items-center justify-center gap-2">
          <b className="text-primary animate-pulse text-3xl">
            {translate("processing")}
          </b>
          <BeatLoader size={10} className="mt-3 dark:invert" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <AlertOctagon
            size={160}
            className="stroke-destructive/60 stroke-[1.2]"
          />
          <Link href={"/dashboard"} className="text-destructive/60">
            <Button
              variant={"ghost"}
              className="border-destructive/60 text-base"
            >
              {translate("back")}
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
