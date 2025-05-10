import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  url: string;
};

const FilePreview = ({ url }: Props) => {
  const parts = url.split("#");
  const baseUrl = parts[0];
  const fileName = parts[1];
  return (
    <Link href={baseUrl} target="_blank">
      <Button variant="secondary">{fileName.trim()}</Button>
    </Link>
  );
};

export default FilePreview;
