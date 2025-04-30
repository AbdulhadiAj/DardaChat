import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const create = internalMutation({
  args: {
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", args);
  },
});

export const get = internalQuery({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    return ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const update = internalMutation({
  args: {
    id: v.id("users"),
    username: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      username: args.username,
      imageUrl: args.imageUrl,
      email: args.email,
    });
  },
});

// export const deleteUser = internalMutation({
//   args: {
//     clerkId: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const user = await ctx.db
//       .query("users")
//       .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
//       .first();

//     if (user) {
//       await ctx.db.delete(user._id);
//     }
//   },
// });

export const deleteUser = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) return;

    const friendships = await ctx.db
      .query("friends")
      .filter((q) =>
        q.or(q.eq(q.field("user1"), user._id), q.eq(q.field("user2"), user._id))
      )
      .collect();

    await Promise.all(
      friendships.map(async (friendship) => {
        const { chatId, _id: friendshipId } = friendship;

        await ctx.db.delete(chatId);

        const memberships = await ctx.db
          .query("chatMembers")
          .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
          .collect();

        await Promise.all(
          memberships.map(async (membership) => {
            await ctx.db.delete(membership._id);
          })
        );

        const messages = await ctx.db
          .query("messages")
          .withIndex("by_chatId", (q) => q.eq("chatId", chatId))
          .collect();

        await Promise.all(
          messages.map(async (message) => {
            await ctx.db.delete(message._id);
          })
        );

        await ctx.db.delete(friendshipId);
      })
    );

    await ctx.db.delete(user._id);
  },
});
