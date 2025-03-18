import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Contact, MessageSquare, Settings, User, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();

  const requestsCount = useQuery(api.requests.count);

  const paths = useMemo(
    () => [
      {
        name: "Profile",
        href: "/profile",
        icon: <User />,
        active: pathname === "/profile",
      },
      {
        name: "Chats",
        href: "/chats",
        icon: <MessageSquare />,
        active: pathname.startsWith("/chats"),
      },
      {
        name: "Groups",
        href: "/groups",
        icon: <Users />,
        active: pathname.startsWith("/groups"),
      },
      {
        name: "Contacts",
        href: "/contacts",
        icon: <Contact />,
        active: pathname === "/contacts",
        count: requestsCount,
      },
      {
        name: "Settings",
        href: "/settings",
        icon: <Settings />,
        active: pathname === "/settings",
      },
    ],
    [pathname, requestsCount]
  );

  return paths;
};
