import Dashboard from "@/app/dashboard/ui/dashboard";
import Statistics from "@/app/statistics/ui/statistics";
import LanguagePicker from "@/components/blocks/nav/language-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Permission, SenderInfo } from "@/lib/type";
import { ChartArea, Languages, Layout, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction } from "react";

export default function CollaboratorInfo({
  senderInfo,
  defaultOpen,
  setDefaultOpen,
  permission,
}: {
  defaultOpen: boolean;
  permission: Permission;
  senderInfo: SenderInfo;
  setDefaultOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={defaultOpen} onOpenChange={setDefaultOpen}>
      <DialogTrigger asChild />
      <DialogContent className="flex h-full max-h-[calc(100%-2rem)] flex-col gap-0 p-0 *:data-[slot='dialog-close']:invisible">
        <DialogHeader className="mb-6 flex h-fit w-full flex-row items-center justify-between border-b px-6 py-4 shadow-sm/5">
          <DialogTitle className="text-xl font-bold">
            {senderInfo.name}
          </DialogTitle>
          <DialogDescription hidden />

          <div className="flex gap-3">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() =>
                theme === "light" ? setTheme("dark") : setTheme("light")
              }
            >
              {theme === "light" ? <Sun /> : <Moon />}
            </Button>

            <LanguagePicker>
              <Button size={"icon"} variant={"outline"}>
                <Languages />
              </Button>
            </LanguagePicker>

            <Button
              onClick={() => setDefaultOpen(false)}
              variant={"destructive"}
              size={"icon"}
            >
              <X />
            </Button>
          </div>
        </DialogHeader>

        <Tabs className="grow gap-0" defaultValue="dashboard">
          <TabsContent value="dashboard">
            <Dashboard senderInfo={senderInfo} permission={permission} />
          </TabsContent>

          <TabsContent value="statistics">
            <Statistics senderInfo={senderInfo} permission={permission} />
          </TabsContent>

          <TabsList
            defaultValue={"dashboard"}
            className="flex h-fit w-full items-center justify-around gap-4 border-t bg-transparent px-6 py-4 *:h-9 *:grow rtl:flex-row-reverse"
          >
            <TabsTrigger value="dashboard" asChild>
              <Button variant={"secondary"}>
                <Layout className="text-primary" />
              </Button>
            </TabsTrigger>
            <TabsTrigger value="statistics" asChild>
              <Button variant={"secondary"}>
                <ChartArea className="text-primary" />
              </Button>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
