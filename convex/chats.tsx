import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getAll = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const chatMemberships = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    const chats = await Promise.all(
      chatMemberships?.map(async (membership) => {
        const chat = await ctx.db.get(membership.chatId);

        if (!chat) {
          throw new ConvexError("Chat could not be found");
        }

        return chat;
      })
    );

    const chatsWithDetails = await Promise.all(
      chats.map(async (chat, index) => {
        const allChatMemberships = await ctx.db
          .query("chatMembers")
          .withIndex("by_chatId", (q) => q.eq("chatId", chat?._id))
          .collect();

        if (chat.isGroup) {
          return {
            chat,
          };
        } else {
          const otherMembership = allChatMemberships.filter(
            (membership) => membership.memberId !== currentUser._id
          )[0];

          const otherMember = await ctx.db.get(otherMembership.memberId);

          if (!otherMember) {
            throw new ConvexError("Can't find other member");
          }

          const settings = await ctx.db
            .query("settings")
            .withIndex("by_userId", (q) => q.eq("userId", otherMember._id))
            .first();

          return {
            chat,
            otherMember,
            settings,
          };
        }
      })
    );

    return chatsWithDetails;
  },
});

const getLastMessageDetails = async ({
  ctx,
  id,
}: {
  ctx: QueryCtx | MutationCtx;
  id: Id<"messages"> | undefined;
}) => {
  if (!id) return null;

  const message = await ctx.db.get(id);

  if (!message) return null;

  const sender = await ctx.db.get(message.senderId);

  if (!sender) return null;

  const content = getMessageContent(
    message.type,
    message.content as unknown as string
  );

  return {
    content,
    sender: sender.username,
    lastMessageTime: message._creationTime,
  };
};

const getMessageContent = (type: string, content: string) => {
  switch (type) {
    case "text":
      return content;
    case "image":
      return "[Image]";
    case "file":
      return "[File]";
    case "call":
      return "[Call]";
    default:
      return "[Non-text]";
  }
};

interface ChatWithMembership {
  chat: {
    _id: Id<"chats">;
    _creationTime: number;
    name?: string;
    groupAdminId?: Id<"users">;
    lastMessageId?: Id<"messages">;
    isGroup: boolean;
  };
  membership: {
    memberId: Id<"users">;
    chatId: Id<"chats">;
    lastSeenMessage?: Id<"messages">;
  };
}

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) throw new ConvexError("User not found");

    const chatMemberships = await ctx.db
      .query("chatMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    const chatWithMembershipResults = await Promise.all(
      chatMemberships.map(
        async (membership): Promise<ChatWithMembership | null> => {
          const chat = await ctx.db.get(membership.chatId);
          if (!chat) return null;

          // Only skip if no message AND it's not a group
          if (!chat.isGroup) {
            const message = await ctx.db
              .query("messages")
              .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
              .first();

            if (!message) return null;
          }

          return { chat, membership };
        }
      )
    );

    const filtered: ChatWithMembership[] = chatWithMembershipResults.filter(
      (item): item is ChatWithMembership => item !== null
    );

    const chatsWithDetails = await Promise.all(
      filtered.map(async ({ chat, membership }) => {
        const allChatMemberships = await ctx.db
          .query("chatMembers")
          .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
          .collect();

        const lastMessage = await getLastMessageDetails({
          ctx,
          id: chat.lastMessageId,
        });

        const lastSeenMessage = membership.lastSeenMessage
          ? await ctx.db.get(membership.lastSeenMessage)
          : null;

        const lastSeenMessageTime = lastSeenMessage
          ? lastSeenMessage._creationTime
          : -1;

        if (chat.isGroup) {
          const unseenGroupMessages = await ctx.db
            .query("messages")
            .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
            .filter((q) => q.gt(q.field("_creationTime"), lastSeenMessageTime))
            .filter((q) => q.neq(q.field("senderId"), currentUser._id))
            .collect();

          return {
            chat,
            lastMessage,
            unseenGroupCount: unseenGroupMessages.length,
          };
        } else {
          const unseenChatMessages = await ctx.db
            .query("messages")
            .withIndex("by_chatId", (q) => q.eq("chatId", chat._id))
            .filter((q) => q.gt(q.field("_creationTime"), lastSeenMessageTime))
            .filter((q) => q.neq(q.field("senderId"), currentUser._id))
            .collect();

          const otherMembership = allChatMemberships.find(
            (m) => m.memberId !== currentUser._id
          );

          const otherMember = otherMembership
            ? await ctx.db.get(otherMembership.memberId)
            : null;

          if (!otherMember) {
            throw new ConvexError("Can't find other member");
          }

          const settings = await ctx.db
            .query("settings")
            .withIndex("by_userId", (q) => q.eq("userId", otherMember._id))
            .first();

          return {
            chat,
            otherMember,
            lastMessage,
            unseenChatCount: unseenChatMessages.length,
            settings,
          };
        }
      })
    );

    return chatsWithDetails;
  },
});
