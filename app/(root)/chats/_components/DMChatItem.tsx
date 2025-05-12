import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { format, isToday, isYesterday } from "date-fns";

type Props = {
  id: Id<"chats">;
  imageUrl: string;
  username: string;
  lastMessageSender?: string;
  lastMessageContent?: string;
  unseenCount: number;
  lastMessageTime?: Date;
};

const DMChatItem = ({
  id,
  imageUrl,
  username,
  lastMessageSender,
  lastMessageContent,
  unseenCount,
  lastMessageTime,
}: Props) => {
  const formattedTime =
    lastMessageTime &&
    (isToday(lastMessageTime)
      ? format(lastMessageTime, "p") // "2:30 PM"
      : isYesterday(lastMessageTime)
        ? "Yesterday"
        : format(lastMessageTime, "MMM d")); // "Mar 25"

  return (
    <Link href={`/chats/${id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center w-full">
          <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-full flex-1 px-3">
            <div className="flex justify-between items-center w-full">
              <h4 className="truncate">{username}</h4>
              {lastMessageTime && (
                <span className="text-xs font-semibold text-muted-foreground ml-2 whitespace-nowrap">
                  {formattedTime}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {lastMessageSender && lastMessageContent ? (
                <>
                  <span className="font-semibold">{lastMessageSender}: </span>
                  <span>{lastMessageContent}</span>
                </>
              ) : (
                "Start the chat!"
              )}
            </div>
          </div>
          {unseenCount ? <Badge>{unseenCount}</Badge> : null}
        </div>
      </Card>
    </Link>
  );
};

export default DMChatItem;
