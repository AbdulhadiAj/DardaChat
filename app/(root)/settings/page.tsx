"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ChatFallback from "@/components/shared/chat/ChatFallback";
import ItemList from "@/components/shared/item-list/ItemList";
import React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = {};

const SettingsPage = (props: Props) => {
  const currentUser = useQuery(api.user.getProfile);

  const user = {
    name: currentUser?.username,
    imageUrl: currentUser?.imageUrl,
    email: currentUser?.email,
  };

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const updateProfilePhoto = useMutation(api.user.updateProfilePhotoVisibility);

  const handleTogglePhoto = (checked: boolean) => {
    updateProfilePhoto({ profilePhoto: checked });
  };

  return (
    <>
      <ItemList title="Settings">
        <div className="relative mt-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold">{user.name}</h2>
        </div>
        <Card className="w-full mx-auto p-0 mt-6">
          <CardContent className="flex flex-col items-center gap-4">
            <Accordion type="multiple" className="w-full space-y-2">
              <AccordionItem value="personal-info">
                <AccordionTrigger>Personal Info</AccordionTrigger>
                <AccordionContent className="text-sm space-y-4">
                  <div>
                    <span className="text-muted-foreground">Name</span>
                    <br />
                    <span className="font-semibold">{user.name}</span>
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
                  <div>
                    <span className="text-muted-foreground">Location</span>
                    <br />
                    <span className="font-semibold">California, USA</span>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="privacy">
                <AccordionTrigger>Privacy</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Hide profile photo</span>
                    <Switch
                      checked={
                        !currentUser?.settings?.profilePhoto ? false : true
                      }
                      onCheckedChange={handleTogglePhoto}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="blocked-contacts">
                <AccordionTrigger>Blocked contacts</AccordionTrigger>
                <AccordionContent>
                  {/* Add security options here */}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="help">
                <AccordionTrigger>Help</AccordionTrigger>
                <AccordionContent>
                  {/* Add help options here */}
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

export default SettingsPage;

function PencilIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}
