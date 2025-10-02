"use client";

import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/lib/firebase";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

export default function GoogleSignInButton() {
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    (async () => await setPersistence(auth, browserLocalPersistence))();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setRedirect(true);

      // Открываем popup для Google login
      const result = await signInWithPopup(auth, googleProvider);

      // Сохраняем сессию между перезагрузками

      // Получаем Firebase token
      const token = await result.user.getIdToken();

      // Ставим HttpOnly cookie через API
      await fetch("/api/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "include",
      });

      // Редирект на dashboard
      if (
        document.referrer.includes(`${window.location.origin}/entrance/qrcode`)
      )
        router.back();
      else router.replace("/dashboard");
    } catch (err: any) {
      console.error(err);
      setRedirect(false);
      alert(err.message ?? "Login failed");
    } finally {
    }
  };

  return (
    <main className="flex h-full w-full items-center justify-center">
      <section className="flex flex-col items-center gap-6">
        {redirect ? (
          <div className="flex items-center justify-center gap-2">
            <b className="text-primary animate-pulse text-3xl">Redirecting</b>
            <BeatLoader size={10} className="mt-3 dark:invert" />
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
