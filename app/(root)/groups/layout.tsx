"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import React from "react";
import CreateGroupDialog from "./_components/CreateGroupDialog";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import GroupChatItem from "./_components/GroupChatItem";

type Props = React.PropsWithChildren<{}>;

const GroupsLayout = ({ children }: Props) => {
  const chats = useQuery(api.chats.get);

  const groupChats = chats?.filter((chat) => chat.chat.isGroup);

  return (
    <>
      <ItemList title="Groups" action={<CreateGroupDialog />}>
        {groupChats ? (
          groupChats.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No groups found
            </p>
          ) : (
            groupChats.map((chat) => {
              return chat ? (
                <GroupChatItem
                  key={chat.chat._id}
                  id={chat.chat._id}
                  name={chat.chat.name || ""}
                  lastMessageContent={chat.lastMessage?.content}
                  lastMessageSender={chat.lastMessage?.sender}
                  unseenCount={chat.unseenGroupCount}
                />
              ) : null;
            })
          )
        ) : (
          <Loader2 />
        )}
      </ItemList>
      {children}
    </>
  );
};

export default GroupsLayout;
