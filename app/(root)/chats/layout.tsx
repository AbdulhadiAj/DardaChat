import ItemList from "@/components/shared/item-list/ItemList";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const ChatsLayout = ({ children }: Props) => {
  return (
    <>
      <ItemList title="Chats">Chats Page</ItemList>
      {children}
    </>
  );
};

export default ChatsLayout;
