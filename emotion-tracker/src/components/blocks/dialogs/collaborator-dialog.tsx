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
import { useCollaborators } from "@/hooks/query/useCollaborators";
import { useInvites } from "@/hooks/query/useInvite";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronsUpDown,
  HardDriveUpload,
  Send,
  TicketX,
  UserRoundX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PuffLoader } from "react-spinners";
import * as z from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { useTranslation } from "@/hooks/useTranslation";

const CollaboratorInviteSchema = z
  .object({
    email: z.string().nonempty({ message: "Shop category is required!" }),
    permission: z.enum(["observer", "viewer", "reader"]),
  })
  .required();

export type CollaboratorInviteProps = z.infer<typeof CollaboratorInviteSchema>;

export function CollaboratorDialog({
  defaultData,
  children,
  emails,
}: {
  emails: Array<string>;
  children?: React.ReactNode;
  defaultData?:
    | (CollaboratorInviteProps & { uid: string; name: string })
    | undefined;
}) {
  const translate = useTranslation();
  const [open, setOpen] = useState(false);
  const { inviteCollaboratorMutation } = useInvites();
  const { updateCollaboratorMutation, removeCollaboratorMutation } =
    useCollaborators();

  const [openPopover, setOpenPopover] = useState(false);
  const [value, setValue] = useState("");

  const defaultValues = {
    email: defaultData?.email || "",
    permission: defaultData?.permission || "observer",
  };

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CollaboratorInviteProps>({
    resolver: zodResolver(CollaboratorInviteSchema),
  });

  useEffect(() => reset(defaultValues), [defaultData]);

  const close = () => {
    setTimeout(() => reset(defaultValues), 200);
    setOpen(false);
    setValue("");
  };

  const onSubmit: SubmitHandler<CollaboratorInviteProps> = async (data) => {
    defaultData !== undefined
      ? updateCollaboratorMutation.mutate(
          { permission: data.permission, user_id: defaultData.uid },
          { onSuccess: () => close() },
        )
      : inviteCollaboratorMutation.mutate(data, {
          onSuccess: () => close(),
        });
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        reset(defaultValues);
        setOpen(value);
        setValue("");
      }}
      open={
        inviteCollaboratorMutation.isPending ||
        removeCollaboratorMutation.isPending
          ? true
          : open
      }
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => openPopover && e.preventDefault()}
        className="overflow-hidden sm:max-w-[425px]"
      >
        <div
          className={cn(
            "bg-secondary/60 absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center transition-all",
            inviteCollaboratorMutation.isPending ||
              removeCollaboratorMutation.isPending ||
              updateCollaboratorMutation.isPending ||
              "invisible",
          )}
        >
          <PuffLoader size={140} color="#3b82f6" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader className="mb-3">
            <DialogTitle>
              {defaultData?.name
                ? defaultData.name
                : translate("collaborator_dialog_title")}
            </DialogTitle>
            <DialogDescription hidden={Boolean(defaultData)}>
              {translate("collaborator_dialog_description")}
            </DialogDescription>
          </DialogHeader>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild disabled={Boolean(defaultData?.email)}>
                  <Button
                    role="combobox"
                    variant="outline"
                    aria-expanded={openPopover}
                    className={cn(
                      "w-full justify-between",
                      Boolean(errors.email?.message) &&
                        "dark:!border-destructive dark:!bg-destructive/20 !bg-destructive/10 !border-destructive/50",
                    )}
                  >
                    {defaultData?.email
                      ? defaultData?.email
                      : value
                        ? emails.find((email) => email === value)
                        : translate("email_popover_placeholder")}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0">
                  <Command>
                    <CommandInput
                      placeholder={translate("email_popover_placeholder")}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>{translate("no_user")}</CommandEmpty>
                      <CommandGroup>
                        {emails.map((email) => (
                          <CommandItem
                            key={email}
                            value={email}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue,
                              );
                              setOpenPopover(false);
                              field.onChange({
                                target: {
                                  value: email,
                                  name: field.name,
                                },
                              });
                            }}
                          >
                            {email}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === email ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />

          <Controller
            name="permission"
            control={control}
            defaultValue="observer"
            render={({ field }) => (
              <RadioGroup
                {...field}
                onValueChange={field.onChange}
                className="*:border-input flex gap-3 *:flex *:h-9 *:w-full *:items-center *:justify-center *:rounded-md *:border *:px-3 *:py-1.5 *:text-sm rtl:flex-row-reverse"
              >
                <Label
                  className={cn(
                    "flex items-center justify-center gap-3 text-base transition-all",
                    field.value === "observer" && "!bg-purple-500 text-white",
                  )}
                >
                  {translate("observer")}
                  <RadioGroupItem value="observer" className="hidden" />
                </Label>

                <Label
                  className={cn(
                    "flex items-center justify-center gap-3 text-base transition-all",
                    field.value === "viewer" && "!bg-sky-400 text-white",
                  )}
                >
                  {translate("viewer")}
                  <RadioGroupItem value="viewer" className="hidden" />
                </Label>

                <Label
                  className={cn(
                    "flex items-center justify-center gap-3 text-base transition-all",
                    field.value === "reader" && "!bg-teal-400 text-white",
                  )}
                >
                  {translate("reader")}
                  <RadioGroupItem value="reader" className="hidden" />
                </Label>
              </RadioGroup>
            )}
          />

          <DialogFooter className="mt-3 flex flex-row *:grow">
            {defaultData && (
              <Button
                onClick={() => {
                  Boolean(defaultData) &&
                    removeCollaboratorMutation.mutate(defaultData.uid);
                }}
                variant="destructive"
                className="!grow-0"
                size={"icon"}
                type="button"
              >
                <UserRoundX />
              </Button>
            )}
            <DialogClose asChild>
              <Button
                onClick={() => setTimeout(() => reset(defaultValues), 200)}
                variant="outline"
                type="button"
              >
                <TicketX />
                {translate("cancel")}
              </Button>
            </DialogClose>

            <Button type="submit">
              {!defaultData ? (
                <>
                  <Send />
                  {translate("invite")}
                </>
              ) : (
                <>
                  <HardDriveUpload />
                  {translate("update")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
