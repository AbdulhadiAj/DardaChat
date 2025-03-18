import ChatFallback from "@/components/shared/chat/ChatFallback";
import ItemList from "@/components/shared/item-list/ItemList";
import React from "react";

type Props = {};

const SettingsPage = (props: Props) => {
  return (
    <>
      <ItemList title="Settings">Settings Page</ItemList>
      <ChatFallback />
    </>
  );
};

export default SettingsPage;
