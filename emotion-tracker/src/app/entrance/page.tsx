"use client";

import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/lib/firebase";
import {
  browserLocalPersistence,
  getRedirectResult,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GoogleSignInButton() {
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Сохраняем сессию в localStorage
        await setPersistence(auth, browserLocalPersistence);

        // Получаем результат редиректа (если был)
        const user = auth.currentUser;

        const result = await getRedirectResult(auth);

        if (user) {
          setRedirect(true);
          const token = await user.getIdToken();

          // Ставим HttpOnly cookie через API
          await fetch("/api/set-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
            credentials: "include",
          });

          router.replace("/dashboard");
        }

        // Резервный редирект, если уже авторизован
        else if (auth.currentUser) {
          router.replace("/dashboard");
        }
      } catch (err: any) {
        console.error("Auth error:", err);
        alert(err.message ?? "Login failed");
      } finally {
        setRedirect(false);
      }
    })();
  }, [router]);

  const handleGoogleSignIn = async () =>
    await signInWithPopup(auth, googleProvider);

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
