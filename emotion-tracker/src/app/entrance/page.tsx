"use client";

import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/lib/firebase";
import {
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GoogleSignInButton() {
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setRedirect(true);
          const token = await firebaseUser.getIdToken();

          // Ставим HttpOnly cookie через API
          await fetch("/api/set-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
            credentials: "include",
          });

          router.replace("/dashboard");
        }
      } catch (err: any) {
        console.error("Redirect login failed:", err);
        setRedirect(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setRedirect(true);

      // Сохраняем сессию
      await setPersistence(auth, browserLocalPersistence);

      // Запускаем редирект вместо popup
      await signInWithRedirect(auth, googleProvider);
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Login failed");
    }
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
