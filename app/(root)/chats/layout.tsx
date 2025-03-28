"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import DMChatItem from "./_components/DMChatItem";

type Props = React.PropsWithChildren<{}>;

const ChatsLayout = ({ children }: Props) => {
  const chats = useQuery(api.chats.get);

  const friendChats = chats?.filter((chat) => !chat.chat.isGroup);

  return (
    <>
      <ItemList title="Chats">
        {friendChats ? (
          friendChats.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No chats found
            </p>
          ) : (
            friendChats.map((chat) => {
              return chat ? (
                <DMChatItem
                  key={chat.chat._id}
                  id={chat.chat._id}
                  username={chat.otherMember?.username || ""}
                  imageUrl={chat.otherMember?.imageUrl || ""}
                  lastMessageContent={chat.lastMessage?.content}
                  lastMessageSender={chat.lastMessage?.sender}
                  unseenCount={chat.unseenChatCount}
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

export default ChatsLayout;
