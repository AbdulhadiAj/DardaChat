import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/backend";
import { internal } from "./_generated/api";

const validatePayload = async (
  req: Request
): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(payload, svixHeaders) as WebhookEvent;

    return event;
  } catch (error) {
    console.error("Clerk webhook request could not be verified");
    return;
  }
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  if (!event) {
    return new Response("Could not validate Clerk payload", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created": {
      const user = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });

      if (!user) {
        console.log(`Creating user ${event.data.id}`);
        await ctx.runMutation(internal.user.create, {
          username: `${event.data.username}`,
          imageUrl: event.data.image_url,
          clerkId: event.data.id,
          email: event.data.email_addresses[0].email_address,
        });
      } else {
        console.log(`User already exists with clerkId ${event.data.id}`);
      }

      break;
    }

    case "user.updated": {
      console.log("Updating User:", event.data.id);

      const user = await ctx.runQuery(internal.user.get, {
        clerkId: event.data.id,
      });

      if (user) {
        await ctx.runMutation(internal.user.update, {
          id: user._id,
          username: `${event.data.username}`,
          imageUrl: event.data.image_url,
          email: event.data.email_addresses[0].email_address,
        });
      } else {
        await ctx.runMutation(internal.user.create, {
          username: `${event.data.username}`,
          imageUrl: event.data.image_url,
          clerkId: event.data.id,
          email: event.data.email_addresses[0].email_address,
        });
      }

      break;
    }

    case "user.deleted": {
      const clerkId = event.data?.id;

      if (!clerkId) {
        console.error("Missing Clerk ID in user.deleted event");
        break;
      }
      console.log("Deleting User:", clerkId);

      await ctx.runMutation(internal.user.deleteUser, {
        clerkId,
      });

      break;
    }

    default: {
      console.log("Clerk webhook event not supported", event.type);
    }
  }

  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
