"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import DMChatItem from "./_components/DMChatItem";

type Props = React.PropsWithChildren<{}>;

const ChatsLayout = ({ children }: Props) => {
  const chats = useQuery(api.chats.get);
  const [search, setSearch] = useState("");

  const friendChats = chats?.filter((chat) => !chat.chat.isGroup);

  const filteredChats = friendChats?.filter((chat) =>
    chat.otherMember?.username
      ?.toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <>
      <ItemList title="Chats">
        <div className="w-full sticky top-0 bg-white z-10">
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {filteredChats ? (
          filteredChats.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No chats found
            </p>
          ) : (
            filteredChats.map((chat) =>
              chat ? (
                <DMChatItem
                  key={chat.chat._id}
                  id={chat.chat._id}
                  username={chat.otherMember?.username || ""}
                  imageUrl={chat.otherMember?.imageUrl || ""}
                  lastMessageContent={chat.lastMessage?.content}
                  lastMessageSender={chat.lastMessage?.sender}
                  unseenCount={chat.unseenChatCount!}
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

export default ChatsLayout;
