"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { ConvexError } from "convex/values";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  chatId: Id<"chats">;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const UnblockFriendDialog = ({ chatId, open, setOpen }: Props) => {
  const { mutate: unblockFriend, pending } = useMutationState(
    api.friend.unblock
  );

  const handleBlockFriend = async () => {
    unblockFriend({ chatId })
      .then(() => {
        toast.success("Unblocked friend");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred"
        );
      });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Unblocking this user will allow him to send you messages and see
            your updates in this chat. You can also receive notifications from
            this conversation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleBlockFriend}>
            Unblock
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnblockFriendDialog;
