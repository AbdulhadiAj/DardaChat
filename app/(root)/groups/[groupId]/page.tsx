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
import DeleteGroupDialog from "./_components/dialogs/DeleteGroupDialog";
import LeaveGroupDialog from "./_components/dialogs/LeaveGroupDialog";

type Params = Promise<{ groupId: Id<"chats"> }>;

const ChatPage = (props: { params: Params }) => {
  const params = use(props.params);
  const groupId = params.groupId;

  const chat = useQuery(api.chat.get, { id: groupId });

  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);

  if (chat === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8" />
      </div>
    );
  }

  if (chat === null) {
    return (
      <p className="w-full h-full flex items-center justify-center">
        Group not found
      </p>
    );
  }

  // Build options based on admin status
  const options = chat.isAdmin
    ? [
        {
          label: "Delete group",
          destructive: true,
          onClick: () => setDeleteGroupDialogOpen(true),
        },
      ]
    : [
        {
          label: "Leave group",
          destructive: false,
          onClick: () => setLeaveGroupDialogOpen(true),
        },
      ];

  return (
    <ChatContainer>
      <DeleteGroupDialog
        chatId={groupId}
        open={deleteGroupDialogOpen}
        setOpen={setDeleteGroupDialogOpen}
      />
      <LeaveGroupDialog
        chatId={groupId}
        open={leaveGroupDialogOpen}
        setOpen={setLeaveGroupDialogOpen}
      />
      <Header name={chat.name || ""} options={options} />
      <Body members={chat.otherMembers ? chat.otherMembers : []} />
      <ChatInput />
    </ChatContainer>
  );
};

export default ChatPage;
