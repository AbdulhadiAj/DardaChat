import { UploadDropzone } from "@/lib/uploadthing";
import { UploadThingError } from "uploadthing/server";
import { toast } from "sonner";
import { Json } from "@uploadthing/shared";

type Props = {
  onChange: (urls: string[]) => void;
  type: "image" | "file";
};

const Uploader = ({ onChange, type }: Props) => {
  return (
    <UploadDropzone
      endpoint={type}
      onClientUploadComplete={(res) =>
        onChange(
          res.map((item) => {
            return item.ufsUrl + "#" + item.name;
          })
        )
      }
      onUploadError={(error: UploadThingError<Json>) => {
        toast.error(error.message);
      }}
      appearance={{
        container: "border-none p-0",
        label: "text-lg font-semibold text-gray-900",
        allowedContent: "text-sm text-gray-500 mt-2",
        button:
          "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded mt-4",
      }}
    />
  );
};

export default Uploader;
