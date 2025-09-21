import { ChartArea, Layout, Moon, Settings, Sun, User2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function NavWrapper({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <main className="flex h-full w-full flex-col">
      <header className="mb-6 flex h-fit w-full items-center justify-between border-b px-6 py-4 shadow-sm/5">
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
      <footer className="flex h-fit w-full items-center justify-around gap-4 border-t px-6 py-4 *:*:grow *:grow">
        <Link href="/dashboard" className="flex items-center">
          <Button variant={"secondary"}>
            <Layout />
          </Button>
        </Link>

        <Link href="/statistics" className="flex items-center">
          <Button variant={"secondary"}>
            <ChartArea />
          </Button>
        </Link>

        <Link href="/statistics" className="flex items-center">
          <Button variant={"secondary"}>
            <User2 />
          </Button>
        </Link>
      </footer>
    </main>
  );
}
