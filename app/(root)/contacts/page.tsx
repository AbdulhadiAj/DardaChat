"use client";

import ItemList from "@/components/shared/item-list/ItemList";
import React, { useState } from "react";
import AddFriendDialog from "./_components/AddFriendDialog";
import SeeRequestsDialog from "./_components/SeeRequestsDialog";
import ChatFallback from "@/components/shared/chat/ChatFallback";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import ContactItem from "./_components/ContactItem";

type Props = {};

const ContactsPage = (props: Props) => {
  const chats = useQuery(api.chats.getAll);
  const [search, setSearch] = useState("");

  const sortedChats = chats
    ?.filter((chat) => chat.otherMember?.username) // Ensure username exists
    .sort((a, b) =>
      a.otherMember!.username.localeCompare(b.otherMember!.username)
    );

  const filteredChats = sortedChats?.filter((chat) =>
    chat.otherMember?.username
      ?.toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <>
      <ItemList
        title="Contacts"
        action1={<SeeRequestsDialog />}
        action2={<AddFriendDialog />}
      >
        <div className="w-full sticky top-0 bg-secondary z-10 rounded-xl">
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {filteredChats ? (
          filteredChats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No Contacts yet</p>
          ) : (
            filteredChats.map((chat) =>
              chat ? (
                <ContactItem
                  key={chat.chat._id}
                  id={chat.chat._id}
                  username={chat.otherMember?.username || ""}
                  imageUrl={chat.otherMember?.imageUrl || ""}
                  email={chat.otherMember?.email || ""}
                />
              ) : null
            )
          )
        ) : (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </ItemList>

      <ChatFallback />
    </>
  );
};

export default ContactsPage;
