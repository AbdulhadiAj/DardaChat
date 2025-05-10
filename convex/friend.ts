import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const remove = mutation({
  args: {
    chatId: v.id("chats"),
  },
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

    const chat = await ctx.db.get(args.chatId);

    if (!chat) {
      throw new ConvexError("Chat not found");
    }

    const memberships = await ctx.db
      .query("chatMembers")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    if (!memberships || memberships.length !== 2) {
      throw new ConvexError("This chat does not have any members");
    }

    const friendship = await ctx.db
      .query("friends")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .unique();

    if (!friendship) {
      throw new ConvexError("Friend could not be found");
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    await ctx.db.delete(args.chatId);

    await ctx.db.delete(friendship._id);

    await Promise.all(
      memberships.map(async (membership) => {
        await ctx.db.delete(membership._id);
      })
    );

    await Promise.all(
      messages.map(async (message) => {
        await ctx.db.delete(message._id);
      })
    );
  },
});

export const block = mutation({
  args: {
    chatId: v.id("chats"),
  },
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

    const chat = await ctx.db.get(args.chatId);

    if (!chat) {
      throw new ConvexError("Chat not found");
    }

    const friendship = await ctx.db
      .query("friends")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .unique();

    if (!friendship) {
      throw new ConvexError("Friend could not be found");
    }

    const blockedContactId =
      friendship.user1 === currentUser._id
        ? friendship.user2
        : friendship.user1;

    if (!blockedContactId) {
      throw new ConvexError("Blocked contact not found in chat");
    }

    await ctx.db.insert("blockedContacts", {
      blockerContactId: currentUser._id,
      blockedContactId,
    });
  },
});

export const unblock = mutation({
  args: {
    chatId: v.id("chats"),
  },
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

    const chat = await ctx.db.get(args.chatId);

    if (!chat) {
      throw new ConvexError("Chat not found");
    }

    const friendship = await ctx.db
      .query("friends")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .unique();

    if (!friendship) {
      throw new ConvexError("Friend could not be found");
    }

    const block1 = await ctx.db
      .query("blockedContacts")
      .withIndex("by_blocker_blocked", (q) =>
        q
          .eq("blockerContactId", friendship.user1)
          .eq("blockedContactId", friendship.user2)
      )
      .unique();

    const block2 = await ctx.db
      .query("blockedContacts")
      .withIndex("by_blocker_blocked", (q) =>
        q
          .eq("blockerContactId", friendship.user2)
          .eq("blockedContactId", friendship.user1)
      )
      .unique();

    const existingBlock = block1 || block2;

    if (!existingBlock) {
      throw new ConvexError("Block not found");
    }

    await ctx.db.delete(existingBlock._id);
  },
});

export const isBlocked = query({
  args: {
    chatId: v.id("chats"),
  },
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

    const chat = await ctx.db.get(args.chatId);

    if (!chat) {
      throw new ConvexError("Chat not found");
    }

    const friendship = await ctx.db
      .query("friends")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .unique();

    if (!friendship) {
      throw new ConvexError("Friend could not be found");
    }

    const block1 = await ctx.db
      .query("blockedContacts")
      .withIndex("by_blocker_blocked", (q) =>
        q
          .eq("blockerContactId", friendship.user1)
          .eq("blockedContactId", friendship.user2)
      )
      .unique();

    const block2 = await ctx.db
      .query("blockedContacts")
      .withIndex("by_blocker_blocked", (q) =>
        q
          .eq("blockerContactId", friendship.user2)
          .eq("blockedContactId", friendship.user1)
      )
      .unique();

    const existingBlock = block1 || block2 ? true : false;

    if (existingBlock) {
      const option1 = await ctx.db
        .query("blockedContacts")
        .withIndex("by_blocker_blocked", (q) =>
          q
            .eq("blockerContactId", currentUser._id)
            .eq("blockedContactId", friendship.user2)
        )
        .unique();
      const option2 = await ctx.db
        .query("blockedContacts")
        .withIndex("by_blocker_blocked", (q) =>
          q
            .eq("blockerContactId", currentUser._id)
            .eq("blockedContactId", friendship.user1)
        )
        .unique();

      const isBlocker = option1 || option2 ? true : false;

      return { existingBlock, isBlocker };
    }
    return { existingBlock };
  },
});
