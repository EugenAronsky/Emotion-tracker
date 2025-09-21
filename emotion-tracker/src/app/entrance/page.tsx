"use client";

import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GoogleSignInButton() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) router.replace("/dashboard"); // если авторизован → на главную
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      // const user = result.user;

      // Отправляем токен на API route для HttpOnly cookie
      await fetch("/api/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (document.referrer.includes("http://localhost:3000")) router.back();
      else router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <main className="flex h-full w-full items-center justify-center">
      <section className="flex flex-col items-center gap-6">
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
      </section>
    </main>
  );
}
