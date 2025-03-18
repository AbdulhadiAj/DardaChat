import ItemList from "@/components/shared/item-list/ItemList";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const GroupsLayout = ({ children }: Props) => {
  return (
    <>
      <ItemList title="Groups">Groups Page</ItemList>
      {children}
    </>
  );
};

export default GroupsLayout;
