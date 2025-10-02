"use client";
import { CollaboratorDialog } from "@/components/blocks/collaborator-dialog";
import NavWrapper from "@/components/blocks/nav-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCollaborators } from "@/hooks/useCollaborators";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { auth } from "@/lib/firebase";
import { SenderInfo } from "@/lib/type";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import {
  HatGlasses,
  LogOut,
  ScanQrCode,
  UserRoundPlus,
  Waypoints,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { PuffLoader } from "react-spinners";
import MyQRCodeDialog from "../../components/blocks/qrcode-dialog";
import CllaboratorCard from "./ui/collaborator-card";

export default function Profile() {
  const { user, loading } = useFirebaseUser();
  const { collaboratorsQuery } = useCollaborators();

  return (
    <NavWrapper>
      <div className="flex w-full flex-col gap-6 *:border-none *:shadow-[0_3px_6px_0_#00000010]">
        {!loading && user?.photoURL && (
          <>
            <Card className="flex-row justify-between">
              <CardContent className="flex w-full items-center justify-between">
                <div className="flex w-full flex-row items-center gap-4">
                  <Image
                    alt=""
                    width={60}
                    height={60}
                    src={user.photoURL}
                    className="border-secondary rounded-full border-[3.5px]"
                  />
                  <div className="flex flex-col gap-0.5">
                    <b className="text-xl">{user?.displayName}</b>
                    <span className="text-sm">
                      {`Joined since ${moment(user?.metadata.creationTime).format("DD/MM/YYYY")}`}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => signOut(auth)}
                  className="text-destructive hover:text-destructive"
                  variant={"secondary"}
                  size={"icon"}
                >
                  <LogOut />
                </Button>
              </CardContent>
            </Card>

            <Card className="max-h-[calc(100svh-293.6px)] grow overflow-hidden">
              <CardHeader className="text-md flex items-center justify-between">
                <div className="text-md flex items-center gap-3">
                  <Waypoints size={20} />
                  <b>Collaborators</b>
                </div>

                <div className="flex gap-3">
                  <MyQRCodeDialog>
                    <Button size={"icon"} variant={"secondary"}>
                      <ScanQrCode />
                    </Button>
                  </MyQRCodeDialog>

                  <CollaboratorDialog
                    emails={collaboratorsQuery.data?.collaboratorsEmails || []}
                  >
                    <Button size={"icon"} variant={"secondary"}>
                      <UserRoundPlus />
                    </Button>
                  </CollaboratorDialog>
                </div>
              </CardHeader>
              <CardContent
                className={cn(
                  "shadow-primary/15 mx-6 grow overflow-hidden overflow-y-scroll rounded-lg p-4 shadow-[inset_0_0_10px_0] dark:shadow-black/40",
                  collaboratorsQuery.isFetching && "p-0",
                )}
              >
                <section className="relative flex min-h-full flex-col gap-3">
                  {!collaboratorsQuery.isFetching ? (
                    collaboratorsQuery.data?.myCollaborators.length ? (
                      collaboratorsQuery.data?.myCollaborators?.map(
                        (senderInfo: SenderInfo, index: number) => (
                          <CllaboratorCard
                            senderInfo={senderInfo}
                            key={`collaborator-${index}`}
                            emails={
                              collaboratorsQuery.data?.collaboratorsEmails || []
                            }
                          />
                        ),
                      )
                    ) : (
                      <div className="flex grow flex-col items-center justify-center opacity-60">
                        <HatGlasses size={80} className="stroke-1" />
                        <span>No collaborators</span>
                      </div>
                    )
                  ) : (
                    <div
                      className={
                        "absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center transition-all"
                      }
                    >
                      <PuffLoader size={140} color="#3b82f6" />
                    </div>
                  )}
                </section>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </NavWrapper>
  );
}
