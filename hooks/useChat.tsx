import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useChat = () => {
  const params = useParams();

  const conversationId = useMemo(
    () => params?.chatId || ("" as string),
    [params?.chatId]
  );

  const isActive = useMemo(() => !!conversationId, [conversationId]);

  return {
    isActive,
    conversationId,
  };
};
