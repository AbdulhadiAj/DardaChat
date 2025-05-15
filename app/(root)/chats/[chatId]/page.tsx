"use client";

import ChatContainer from "@/components/shared/chat/ChatContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React, { use, useState } from "react";
import Header from "./_components/Header";
import Body from "@/components/shared/chat/chat-page-components/body/Body";
import ChatInput from "@/components/shared/chat/chat-page-components/input/ChatInput";
import RemoveFriendDialog from "./_components/dialogs/RemoveFriendDialog";
import BlockFriendDialog from "./_components/dialogs/BlockFriendDialog";
import UnblockFriendDialog from "./_components/dialogs/UnblockFriendDialog";

type Params = Promise<{ chatId: Id<"chats"> }>;

const ChatPage = (props: { params: Params }) => {
  const params = use(props.params);
  const chatId = params.chatId;

  const chat = useQuery(api.chat.get, { id: chatId });

  const isBlocked = useQuery(api.friend.isBlocked, { chatId: chatId });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  const [blockFriendDialogOpen, setBlockFriendDialogOpen] = useState(false);
  const [unblockFriendDialogOpen, setUnblockFriendDialogOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  return chat === undefined ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8" />
    </div>
  ) : chat === null ? (
    <p className="w-full h-full flex items-center justify-center">
      Chat not found
    </p>
  ) : (
    <ChatContainer>
      <RemoveFriendDialog
        chatId={chatId}
        open={removeFriendDialogOpen}
        setOpen={setRemoveFriendDialogOpen}
      />
      <BlockFriendDialog
        chatId={chatId}
        open={blockFriendDialogOpen}
        setOpen={setBlockFriendDialogOpen}
      />
      <UnblockFriendDialog
        chatId={chatId}
        open={unblockFriendDialogOpen}
        setOpen={setUnblockFriendDialogOpen}
      />
      <Header
        name={chat.otherMember?.username || ""}
        imageUrl={chat.otherMember?.imageUrl}
        options={[
          isBlocked?.existingBlock && isBlocked.isBlocker
            ? {
                label: "Unblock friend",
                destructive: false,
                onClick: () => setUnblockFriendDialogOpen(true),
              }
            : {
                label: "Block friend",
                destructive: false,
                onClick: () => setBlockFriendDialogOpen(true),
              },
          {
            label: "Remove friend",
            destructive: true,
            onClick: () => setRemoveFriendDialogOpen(true),
          },
        ]}
        setCallType={setCallType}
      />
      <Body
        members={chat.otherMember ? [chat.otherMember] : []}
        callType={callType}
        setCallType={setCallType}
      />
      {isBlocked?.existingBlock && isBlocked?.isBlocker ? (
        <p className="flex items-center justify-center text-red-500">
          You blocked this contact
        </p>
      ) : isBlocked?.existingBlock && !isBlocked?.isBlocker ? (
        <p className="flex items-center justify-center text-red-500">
          You are blocked by this contact
        </p>
      ) : (
        <ChatInput />
      )}
    </ChatContainer>
  );
};

export default ChatPage;
