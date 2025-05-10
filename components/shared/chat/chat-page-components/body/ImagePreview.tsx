import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  urls: string[];
};

const ImagePreview = ({ urls }: Props) => {
  const isVideoFile = (filename: string) => {
    const videoFilePattern = /\.(mp4|webm|ogg|mov)$/i;
    return videoFilePattern.test(filename);
  };

  return (
    <div
      className={cn("grid gap-2 justify-items-start", {
        "grid-cols-1": urls.length === 1,
        "grid-cols-2": urls.length > 1,
      })}
    >
      {urls.map((url, index) => {
        const parts = url.split("#");
        const baseUrl = parts[0];
        const fileName = parts[1];
        const isVideo = isVideoFile(fileName);

        return (
          <Dialog key={index}>
            <div className="relative w-40 h-40 max-w-full cursor-pointer">
              <DialogTrigger asChild>
                {isVideo ? (
                  <video
                    poster={baseUrl}
                    className="w-full h-full object-cover rounded-md"
                  >
                    <source src={`${baseUrl}#t=0.1`} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={baseUrl}
                    alt="Uploaded image"
                    referrerPolicy="no-referrer"
                    fill
                    className="object-cover rounded-md"
                  />
                )}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isVideo ? "Video Preview" : "Image Preview"}
                  </DialogTitle>
                </DialogHeader>
                <div className="w-full h-96 relative flex items-center justify-center">
                  {isVideo ? (
                    <video poster={baseUrl} className="w-full" controls>
                      <source src={`${baseUrl}#t=0.1`} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={baseUrl}
                      alt="Uploaded image"
                      referrerPolicy="no-referrer"
                      layout="fill"
                      objectFit="contain"
                    />
                  )}
                </div>
              </DialogContent>
            </div>
          </Dialog>
        );
      })}
    </div>
  );
};

export default ImagePreview;
