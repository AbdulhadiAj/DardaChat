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

const BlockFriendDialog = ({ chatId, open, setOpen }: Props) => {
  const { mutate: blockFriend, pending } = useMutationState(api.friend.block);

  const handleBlockFriend = async () => {
    blockFriend({ chatId })
      .then(() => {
        toast.success("Blocked friend");
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
            Blocking this user will prevent him from sending you messages and
            seeing your updates in this chat. You will also no longer receive
            notifications from this conversation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleBlockFriend}>
            Block
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlockFriendDialog;
