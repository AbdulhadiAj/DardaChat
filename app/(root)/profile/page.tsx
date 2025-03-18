import ChatFallback from "@/components/shared/chat/ChatFallback";
import ItemList from "@/components/shared/item-list/ItemList";
import React from "react";

type Props = {};

const ProfilePage = (props: Props) => {
  return (
    <>
      <ItemList title="Profile">Profile Page</ItemList>
      <ChatFallback />
    </>
  );
};

export default ProfilePage;
