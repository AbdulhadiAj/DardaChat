"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ChatFallback from "@/components/shared/chat/ChatFallback";
import ItemList from "@/components/shared/item-list/ItemList";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = {};

const ProfilePage = (props: Props) => {
  const user = useQuery(api.user.getProfile);
  const attachedFiles = useQuery(api.messages.getSentFiles);

  if (!user) return null;

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <ItemList title="Profile">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user.imageUrl} alt={user.username} />
          <AvatarFallback>{user.username?.[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-lg font-semibold">{user.username}</h2>
          <Badge className="bg-green-500 text-white mt-1">
            Active <span className="text-xs text-gray-500">Coming soon</span>
          </Badge>
        </div>
        <p className="text-muted-foreground text-center text-sm">
          If several languages coalesce, the grammar of the resulting language
          is more simple and regular than that of the individual.
        </p>
        <Card className="w-full mx-auto mt-5 p-0">
          <CardContent className="flex flex-col items-center gap-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="about">
                <AccordionTrigger>About</AccordionTrigger>
                <AccordionContent className="text-sm space-y-4">
                  <div>
                    <span className="text-muted-foreground">Name</span>
                    <br />
                    <span className="font-semibold">{user.username}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email</span>
                    <br />
                    <span>{user.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time</span>
                    <br />
                    <span>{currentTime}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="files">
                <AccordionTrigger>Attached Files</AccordionTrigger>
                <AccordionContent>
                  {attachedFiles && attachedFiles.length > 0 ? (
                    <ul className="space-y-4">
                      {attachedFiles.flatMap((file) =>
                        file.content.map((fileString, index) => {
                          const [url, name] = fileString.split("#");

                          return (
                            <li
                              key={`${file._id}_${index}`}
                              className="text-sm"
                            >
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                📎 {name}
                              </a>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No files sent yet.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </ItemList>
      <ChatFallback />
    </>
  );
};
export default ProfilePage;
