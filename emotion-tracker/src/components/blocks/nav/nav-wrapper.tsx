"use client";

import { useInvites } from "@/hooks/query/useInvite";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { ChartArea, Languages, Layout, Moon, Sun, User2 } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { InviteDialog } from "../dialogs/invite-dialog";
import LanguagePicker from "./language-picker";

export default function NavWrapper({
  hidden,
  children,
}: {
  hidden?: boolean;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const { invitesQuery } = useInvites();
  const { theme, setTheme } = useTheme();
  const { user, loading } = useFirebaseUser();
  const [mounted, setMounted] = useState(false);
  const [queue, setQueue] = useState<Array<{ open: boolean; number: number }>>(
    [],
  );

  useEffect(() => {
    !user && !loading && router.push("/entrance");
  }, [user, loading]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setQueue(
      Array.from({ length: invitesQuery.data?.length }).map((_, index) => ({
        open: false,
        number: index,
      })),
    );
  }, [invitesQuery.data]);

  return (
    <main className="flex h-full w-full flex-col overflow-hidden">
      <header
        className="mb-6 flex h-fit w-full items-center justify-between border-b px-6 py-3 shadow-sm/5"
        hidden={hidden}
      >
        <h1 className="text-xl font-bold">Mood Diary</h1>

        <section className="flex items-center justify-center gap-3">
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() =>
              theme === "light" ? setTheme("dark") : setTheme("light")
            }
          >
            {mounted && theme === "light" ? <Sun /> : <Moon />}
          </Button>

          <LanguagePicker>
            <Button size={"icon"} variant={"outline"}>
              <Languages />
            </Button>
          </LanguagePicker>
        </section>
      </header>
      <section className="flex grow px-6 pb-6">{children}</section>
      <footer
        className="flex h-fit w-full items-center justify-around gap-4 border-t px-6 py-3 *:*:grow *:grow"
        hidden={hidden}
      >
        <Link href="/dashboard" className="flex items-center">
          <Button variant={"secondary"}>
            <Layout />
          </Button>
        </Link>

        <Link href="/statistics" className="flex items-center">
          <Button variant={"secondary"} className="flex items-center">
            <ChartArea />
          </Button>
        </Link>

        <Link href="/profile" className="flex items-center">
          <Button variant={"secondary"} className="flex items-center">
            <User2 />
          </Button>
        </Link>
      </footer>

      {queue.length && invitesQuery.data[0] ? (
        <InviteDialog
          key={`invite-${queue.at(0)?.number}`}
          data={invitesQuery.data[0]}
          onInteractionEnd={() =>
            setQueue(
              JSON.parse(
                JSON.stringify(queue.filter((_, index) => index !== 0)),
              ),
            )
          }
        />
      ) : null}
    </main>
  );
}
