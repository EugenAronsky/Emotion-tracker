"use client";

import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/lib/firebase";
import {
  browserPopupRedirectResolver,
  signInWithRedirect,
} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GoogleSignInButton() {
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setRedirect(true);
          const token = await user.getIdToken();
          await fetch("/api/set-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          router.replace("/dashboard");
        } catch (error: any) {
          console.error(error);
          alert(error.message);
          setRedirect(false);
        }
      } // если авторизован → на главную
      else setRedirect(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    await signInWithRedirect(
      auth,
      googleProvider,
      browserPopupRedirectResolver,
    );
  };

  return (
    <main className="flex h-full w-full items-center justify-center">
      <section className="flex flex-col items-center gap-6">
        {redirect ? (
          <div className="animate-pulse text-3xl font-[700]">
            Redirecting...
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Welcome to Emotion Tracker</h1>
            <Button
              onClick={handleGoogleSignIn}
              size={"lg"}
              variant={"outline"}
              className="cursor-pointer"
            >
              <Image
                src="/google-black-icon.webp"
                alt=""
                width={20}
                height={20}
                className="size-5 dark:invert"
              />
              Continue with Google
            </Button>
          </>
        )}
      </section>
    </main>
  );
}
