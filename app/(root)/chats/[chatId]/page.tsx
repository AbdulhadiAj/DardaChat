"use client";

import ChatContainer from "@/components/shared/chat/ChatContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import Header from "./_components/Header";
import Body from "@/components/shared/chat/chat-page-components/body/Body";
import ChatInput from "@/components/shared/chat/chat-page-components/input/ChatInput";
import RemoveFriendDialog from "./_components/dialogs/RemoveFriendDialog";

type Props = {
  params: {
    chatId: Id<"chats">;
  };
};

const ChatPage = ({ params: { chatId } }: Props) => {
  const chat = useQuery(api.chat.get, { id: chatId });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
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
      <Header
        name={chat.otherMember?.username || ""}
        imageUrl={chat.otherMember?.imageUrl}
        options={[
          {
            label: "Remove friend",
            destructive: true,
            onClick: () => setRemoveFriendDialogOpen(true),
          },
        ]}
      />
      <Body members={chat.otherMember ? [chat.otherMember] : []} />
      <ChatInput />
    </ChatContainer>
  );
};

export default ChatPage;
