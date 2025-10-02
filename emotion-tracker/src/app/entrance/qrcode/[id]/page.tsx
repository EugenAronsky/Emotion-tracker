"use client";
import { Button } from "@/components/ui/button";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useInvites } from "@/hooks/useInvite";
import { AlertOctagon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BeatLoader } from "react-spinners";

export default function QRCode() {
  const router = useRouter();
  const { id } = useParams();
  const { user, loading } = useFirebaseUser();
  const { inviteQRCodeConfirmationMutation } = useInvites();

  useEffect(() => {
    if (id && user && !loading) {
      inviteQRCodeConfirmationMutation.mutate(id as string, {
        onSuccess: () => router.push("/dashboard"),
      });
    }
  }, [id, loading]);
  return (
    <section className="flex h-svh w-full items-center justify-center">
      {!inviteQRCodeConfirmationMutation.isError ? (
        <div className="flex items-center justify-center gap-2">
          <b className="text-primary animate-pulse text-3xl">Processing</b>
          <BeatLoader size={10} className="mt-3 dark:invert" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <AlertOctagon
            size={160}
            className="stroke-destructive stroke-[1.2]"
          />
          <Link href={"/dashboard"} className="text-destructive">
            <Button variant={"ghost"} className="border-destructive text-base">
              Go back
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
