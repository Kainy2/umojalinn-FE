"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Copy, UserRoundPlus, X } from "lucide-react";
import { TagInput } from "@/components/custom/tag/Input";
import { z } from "zod";
import { useDeleteProjectInvitation, useGetMe } from "@/tanstack/hooks/useUser";
import { Badge } from "@/components/ui/badge";
import useClipboard from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";
import { useInviteBuyer } from "@/tanstack/hooks/useProject";
import { Info } from "lucide-react";

// Define a Zod schema for an array of valid email strings
const emailListSchema = z.array(z.string().email());

function isValidEmailList(obj: unknown): obj is string[] {
  const validationResult = emailListSchema.safeParse(obj);
  return validationResult.success;
}

const InviteClient = () => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const { data: me } = useGetMe();

  const { mutate: inviteBuyer, isPending: loading } = useInviteBuyer({
    onSuccess() {
      setOpen(false);
      setTags([]);
    },
  });

  const { handleCopy } = useClipboard();

  const handleTags = (newTags: string[]) =>
    setTags((oldTags: string[]): string[] => {
      if (isValidEmailList(newTags)) {
        return newTags;
      }
      return oldTags;
    });

  const handleSubmit = () => {
    inviteBuyer({ emails: tags });
  };

  const { mutate: deleteInvitation, isPending } = useDeleteProjectInvitation();

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          className={cn("font-normal", !me?.data?.data && "hidden")}
        >
          <UserRoundPlus className="icon-base" />{" "}
          <span className="hidden md:inline">Invite Client</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <span className="mb-2 border border-border/50 rounded-md h-12 w-12 flex items-center justify-center">
            <UserRoundPlus className="icon-base" />
          </span>
          <DialogTitle className="text-[18px] text-left">
            Invite Client
          </DialogTitle>
          <DialogDescription className="text-left">
            Manage all your jobs in one place - invite client to create their
            project with you here on Umoja linn.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          {me?.data?.data?.designerProfile?.projectInvitations
            ?.slice?.(0, 4)
            ?.map?.((invite) => (
              <div
                key={invite?.id}
                className="bg-gray-100 flex justify-between p-2 text-sm text-foreground-body"
              >
                <span>
                  {invite?.buyerEmail ||
                    `${invite?.buyerProfile?.user?.firstName || ""} ${invite?.buyerProfile?.user?.lastName || ""
                    }`}
                </span>
                {!!invite?.status && (
                  <Badge
                    variant="outline"
                    className="text-foreground-body font-normal inline-flex gap-2"
                  >
                    <span>{invite?.status?.toLocaleLowerCase?.()}</span>
                    <button
                      className="[&>svg]:size-3"
                      onClick={() => deleteInvitation(invite?.id)}
                      disabled={isPending}
                    >
                      <X />
                    </button>
                  </Badge>
                )}
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-4">
          <Label>Email</Label>
          <div>
            <TagInput value={tags} onChange={handleTags} />
            <p className="text-xs text-foreground-body [&>svg]:size-4 [&>svg]:text-gray-400 mt-2 flex gap-1 items-center">
              <Info />
              Hit enter after typing each valid email.
            </p>
          </div>
          {!!me?.data?.data?.tag &&
            (!!tags?.length ||
              !!me?.data?.data?.designerProfile?.projectInvitations
                ?.length) && (
              <button
                className="text-primary text-sm flex items-center gap-1 "
                onClick={() =>
                  handleCopy(
                    `${
                      process.env.NEXT_PUBLIC_WEB_URL ||
                      "https://dev.d1451lqyj8o4u7.amplifyapp.com"
                    }/login?inviterTag=${me?.data?.data?.tag}`,
                  )
                }
              >
                <Copy className="h-4 w-4" />
                Copy link
              </button>
            )}
        </div>
        <DialogFooter>
          <Button
            disabled={!tags?.length}
            fullWidth
            type="submit"
            loading={loading}
            onClick={handleSubmit}
          >
            Send Invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteClient;
