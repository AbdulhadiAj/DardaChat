import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CircleArrowLeft, Phone, Settings, Video } from "lucide-react";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  name: string;
  options?: {
    label: string;
    destructive: boolean;
    onClick: () => void;
  }[];
  setCallType: Dispatch<SetStateAction<"audio" | "video" | null>>;
};

const Header = ({ name, options, setCallType }: Props) => {
  return (
    <Card className="w-full flex flex-row rounded-lg items-center p-2 justify-between">
      <div className="flex items-center gap-2">
        <Link href="/groups" className="block lg:hidden">
          <CircleArrowLeft />
        </Link>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{name.charAt(0).toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{name}</h2>
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setCallType("audio")}
        >
          <Phone />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setCallType("video")}
        >
          <Video />
        </Button>
        {options ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button size="icon" variant="secondary">
                <Settings />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {options.map((option, id) => {
                return (
                  <DropdownMenuItem
                    key={id}
                    onClick={option.onClick}
                    className={cn("font-semibold", {
                      "text-destructive": option.destructive,
                    })}
                  >
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </Card>
  );
};

export default Header;
