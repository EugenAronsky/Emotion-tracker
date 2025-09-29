import { ChartArea, Layout, Moon, Settings, Sun, User2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInvites } from "@/hooks/useInvite";
import { InviteDialog } from "./invite-dialog";
import { InviteProps } from "@/lib/type";

export default function NavWrapper({
  hidden,
  children,
}: {
  hidden?: boolean;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, loading } = useFirebaseUser();
  const { invitesQuery } = useInvites();

  useEffect(() => {
    !user && !loading && router.push("/entrance");
  }, [user, loading]);

  return (
    <main className="flex h-full w-full flex-col overflow-hidden">
      <header
        className="mb-6 flex h-fit w-full items-center justify-between border-b px-6 py-3 shadow-sm/5"
        hidden={hidden}
      >
        <h1 className="text-xl font-bold">Mood Diary</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() =>
            theme === "light" ? setTheme("dark") : setTheme("light")
          }
        >
          {theme === "light" ? <Sun /> : <Moon />}
        </Button>
      </header>
      <section className="flex grow px-6 pb-6">{children}</section>
      <footer
        className="flex h-fit w-full items-center justify-around gap-4 border-t px-6 pt-3 pb-0 *:*:grow *:grow"
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
      {invitesQuery.data &&
        invitesQuery.data.map((invite: InviteProps, index: number) => (
          <InviteDialog key={`invite-${index}`} data={invite} />
        ))}
    </main>
  );
}
