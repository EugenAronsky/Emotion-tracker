"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { auth, googleProvider } from "@/lib/firebase";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

export default function GoogleSignInButton() {
  const router = useRouter();
  const translate = useTranslation();
  const [loading, setLoading] = useState(false);

  const redirect = () => {
    if (document.referrer.includes(`${window.location.origin}/entrance/qrcode`))
      router.back();
    else router.replace("/dashboard");
  };

  useEffect(() => {
    // Сохраняем сессию между перезагрузками
    (async () => await setPersistence(auth, browserLocalPersistence))();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        const token = await user.getIdToken();
        await fetch("/api/set-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          credentials: "include",
        });

        redirect();
      } else {
        console.log("Any session...");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      // Открываем popup для Google login
      const result = await signInWithPopup(auth, googleProvider);

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
      redirect();
    } catch (err: any) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full w-full items-center justify-center">
      <section className="flex flex-col items-center gap-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <b className="text-primary animate-pulse text-3xl">
              {translate("redirecting")}
            </b>
            <BeatLoader size={10} className="mt-3 dark:invert" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold">{translate("welcome")}</h1>

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
              {translate("googleSignIn")}
            </Button>
          </>
        )}
      </section>
    </main>
  );
}
