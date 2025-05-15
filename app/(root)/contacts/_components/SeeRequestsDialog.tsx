import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useQuery } from "convex/react";
import { Contact, Loader2 } from "lucide-react";
import React from "react";
import Request from "./Request";
import { Badge } from "@/components/ui/badge";

type Props = {};

const SeeRequestsDialog = (props: Props) => {
  const requests = useQuery(api.requests.get);
  const requestsCount = useQuery(api.requests.count);

  return (
    <div className="relative">
      <Dialog>
        <Tooltip>
          <TooltipTrigger>
            <Button size="icon" variant="outline">
              <DialogTrigger>
                <Contact />
              </DialogTrigger>
            </Button>
            {requestsCount ? (
              <Badge className="absolute left-6 bottom-7 px-2">
                {requestsCount}
              </Badge>
            ) : null}
          </TooltipTrigger>
          <TooltipContent>
            <p>See Requests</p>
          </TooltipContent>
        </Tooltip>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Current Requests</DialogTitle>
          </DialogHeader>
          {requests ? (
            requests.length === 0 ? (
              <p className="w-full text-center text-muted-foreground">
                No friend requests found
              </p>
            ) : (
              requests.map((request) => (
                <Request
                  key={request.request._id}
                  id={request.request._id}
                  imageUrl={request.sender.imageUrl}
                  username={request.sender.username}
                  email={request.sender.email}
                />
              ))
            )
          ) : (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SeeRequestsDialog;
