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
import { useCollaborators } from "@/hooks/useCollaborators";
import { useInvites } from "@/hooks/useInvite";
import { CollaboratorForm, EmotionReturnProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  HardDriveUpload,
  Send,
  TicketX,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PuffLoader } from "react-spinners";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

export function CollaboratorDialog({
  defaultData,
  children,
  emails,
}: {
  emails: Array<string>;
  children: React.ReactNode;
  defaultData?: EmotionReturnProps | undefined;
}) {
  const [open, setOpen] = useState(false);
  const { inviteCollaboratorMutation } = useInvites();

  const [openPopover, setOpenPopover] = useState(false);
  const [value, setValue] = useState("");

  const defaultValues = {
    email: defaultData?.emotion || "",
    role: "viewer",
  };

  const {
    watch,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CollaboratorForm>();

  useEffect(() => reset(defaultValues), [defaultData]);

  const close = () => {
    setTimeout(() => reset(defaultValues), 200);
    setOpen(false);
    setValue("");
  };

  const onSubmit: SubmitHandler<CollaboratorForm> = async (data) => {
    inviteCollaboratorMutation.mutate(data, { onSuccess: () => close() });
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        setOpen(value);
        setValue("");
      }}
      open={inviteCollaboratorMutation.isPending ? true : open}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => openPopover && e.preventDefault()}
        className="overflow-hidden sm:max-w-[425px]"
      >
        <div
          className={cn(
            "bg-secondary/60 absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center transition-all",
            inviteCollaboratorMutation.isPending || "invisible",
          )}
        >
          <PuffLoader size={140} color="#3b82f6" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader className="mb-3">
            <DialogTitle>Invite friend</DialogTitle>
            <DialogDescription>Share emotion with friends!</DialogDescription>
          </DialogHeader>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openPopover}
                    className="w-full justify-between"
                  >
                    {value
                      ? emails.find((email) => email === value)
                      : "Select email..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search email..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
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

          {/* <Controller
            name="role"
            control={control}
            defaultValue="viewer"
            render={({ field }) => (
              <RadioGroup
                {...field}
                onValueChange={field.onChange}
                className="flex gap-3 *:flex *:items-center *:justify-center *:rounded-full"
              >
                <Label
                  className={cn(
                    "flex items-center justify-center gap-3 text-base transition-all",
                  )}
                >
                  Viewer
                  <RadioGroupItem
                    value="viewer"
                    className={cn(field.value === "viewer" && "!bg-green-300")}
                  />
                </Label>

                <Label
                  className={cn(
                    "flex items-center justify-center gap-3 text-base transition-all",
                  )}
                >
                  Reader
                  <RadioGroupItem
                    value="reader"
                    className={cn(field.value === "reader" && "!bg-blue-300")}
                  />
                </Label>
              </RadioGroup>
            )}
          /> */}

          <DialogFooter className="mt-3 flex flex-row *:grow">
            {defaultData && (
              <Button
                // onClick={() => deleteMutation.mutate(defaultData.id)}
                variant="destructive"
                className="!grow-0"
                size={"icon"}
                type="button"
              >
                <Trash2 />
              </Button>
            )}
            <DialogClose asChild>
              <Button
                onClick={() => setTimeout(() => reset(defaultValues), 200)}
                variant="outline"
                type="button"
              >
                <TicketX /> Cancel
              </Button>
            </DialogClose>

            <Button type="submit">
              {!defaultData ? (
                <>
                  <Send />
                  Invite
                </>
              ) : (
                <>
                  <HardDriveUpload />
                  Update
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
