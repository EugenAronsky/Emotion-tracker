import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useInvites } from "@/hooks/useInvite";
import { Permission } from "@/lib/type";
import { cn } from "@/lib/utils";
import { CaptionsOff } from "lucide-react";
import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GridLoader } from "react-spinners";
import { useDebounce } from "use-debounce";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const Loader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="relative flex size-full items-center justify-center"
  >
    <QRCodeSVG
      key={"/entrance/qrcode/some_cool_guy_wrote_this"}
      className="absolute size-full rounded-md opacity-10"
      value={"/entrance/qrcode/some_cool_guy_wrote_this"}
      level="H" // Error correction level (L, M, Q, H)
      bgColor="#fff"
      fgColor="#000"
      includeMargin={true}
    />
    <GridLoader color="#3b82f6" />
  </motion.div>
);

function MyQRCodeDialog({ children }: { children: React.ReactNode }) {
  const mount = useRef(false);
  const [permission, setPermission] = useState<Permission>("observer");
  const [debouncedPermission] = useDebounce(permission, 500);
  const { QRCodeInviteQuery } = useInvites({ permission: debouncedPermission });
  const [loading] = useDebounce(
    permission !== debouncedPermission ||
      QRCodeInviteQuery.isFetching ||
      !QRCodeInviteQuery.data,
    100,
  );

  const {
    control,
    formState: { errors },
  } = useForm<{ permission: Permission }>();
  const onOpenChange = (open: boolean) => open && QRCodeInviteQuery.refetch();

  useEffect(() => {
    if (mount.current) debouncedPermission && QRCodeInviteQuery.refetch();
    else mount.current = true;
  }, [debouncedPermission]);

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Let's scan it to add a friend</DialogTitle>
          <DialogDescription hidden />
        </DialogHeader>

        <div className="border-input aspect-square w-full rounded-md border dark:border-0">
          {!loading ? (
            <motion.div
              key={QRCodeInviteQuery.data.QRCodeURL}
              className="h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <QRCodeSVG
                className="size-full rounded-md"
                value={QRCodeInviteQuery.data.QRCodeURL}
                level="H" // Error correction level (L, M, Q, H)
                bgColor={
                  permission === "reader"
                    ? "#00d5be"
                    : permission === "viewer"
                      ? "#00bcff"
                      : "#ad46ff"
                }
                fgColor="#ffffff"
                includeMargin={true}
              />
            </motion.div>
          ) : (
            <Loader />
          )}
        </div>

        <Controller
          name="permission"
          control={control}
          defaultValue="observer"
          render={({ field }) => (
            <RadioGroup
              {...field}
              onValueChange={(value: Permission) => {
                field.onChange(value);
                setPermission(value);
              }}
              className="*:border-input flex gap-3 *:flex *:h-9 *:w-full *:items-center *:justify-center *:rounded-md *:border *:px-3 *:py-1.5 *:text-sm"
            >
              <Label
                className={cn(
                  "flex items-center justify-center gap-3 text-base transition-all",
                  field.value === "observer" && "!bg-purple-500 text-white",
                )}
              >
                Observer
                <RadioGroupItem value="observer" className="hidden" />
              </Label>

              <Label
                className={cn(
                  "flex items-center justify-center gap-3 text-base transition-all",
                  field.value === "viewer" && "!bg-sky-400 text-white",
                )}
              >
                Viewer
                <RadioGroupItem value="viewer" className="hidden" />
              </Label>

              <Label
                className={cn(
                  "flex items-center justify-center gap-3 text-base transition-all",
                  field.value === "reader" && "!bg-teal-400 text-white",
                )}
              >
                Reader
                <RadioGroupItem value="reader" className="hidden" />
              </Label>
            </RadioGroup>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              <CaptionsOff /> Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MyQRCodeDialog;
