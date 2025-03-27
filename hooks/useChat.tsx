import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";

export const useChat = () => {
  const params = useParams();
  const pathname = usePathname();

  const chatId = useMemo(() => {
    if (pathname.startsWith("/chats")) {
      return params?.chatId || "";
    }
    if (pathname.startsWith("/groups")) {
      return params?.groupId || "";
    }
    return "";
  }, [pathname, params?.groupId, params?.chatId]);

  const isActive = useMemo(() => !!chatId, [chatId]);

  return {
    isActive,
    chatId,
  };
};
