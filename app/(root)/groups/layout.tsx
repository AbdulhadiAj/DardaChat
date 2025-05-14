"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import React, { useState } from "react";
import CreateGroupDialog from "./_components/CreateGroupDialog";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import GroupChatItem from "./_components/GroupChatItem";

type Props = React.PropsWithChildren<{}>;

const GroupsLayout = ({ children }: Props) => {
  const chats = useQuery(api.chats.get);
  const [search, setSearch] = useState("");

  const groupChats = chats
    ?.filter((chat) => chat.chat.isGroup)
    .sort((a, b) => {
      const aTime = a.lastMessage?.lastMessageTime ?? 0;
      const bTime = b.lastMessage?.lastMessageTime ?? 0;
      return bTime - aTime;
    });

  const filteredGroups = groupChats?.filter((chat) =>
    chat.chat.name?.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
      <ItemList title="Groups" action={<CreateGroupDialog />}>
        <div className="w-full sticky top-0 bg-secondary z-10 rounded-xl">
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {filteredGroups ? (
          filteredGroups.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No groups found
            </p>
          ) : (
            filteredGroups.map((chat) =>
              chat ? (
                <GroupChatItem
                  key={chat.chat._id}
                  id={chat.chat._id}
                  name={chat.chat.name || ""}
                  lastMessageContent={chat.lastMessage?.content}
                  lastMessageSender={chat.lastMessage?.sender}
                  unseenCount={chat.unseenGroupCount!}
                  lastMessageTime={
                    chat.lastMessage?.lastMessageTime
                      ? new Date(chat.lastMessage.lastMessageTime)
                      : undefined
                  }
                />
              ) : null
            )
          )
        ) : (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </ItemList>
      {children}
    </>
  );
};

export default GroupsLayout;
