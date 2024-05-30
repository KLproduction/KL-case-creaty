"use client";

import { cn } from "@/lib/utils";
import Dropzone, { FileRejection } from "react-dropzone";
import { useState, useTransition } from "react";
import { Loader2, MousePointerSquareDashed } from "lucide-react";
import { Image } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const page = () => {
  const { toast } = useToast()
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setuploadProgress] = useState<number>(0);
  const router = useRouter()

  const { startUpload,isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`)
      })
    },
    onUploadProgress(p) {
      setuploadProgress(p)
    },
  })

  const onDropRejected = (rejectedFiles:FileRejection[]) => {
    const [file] = rejectedFiles;
    setIsDragOver(false)
    toast({
      title:`${file.file.type} type is not supported.`,
      description:"Please choose a PNG, JPG, JPGE instead",
      variant:"destructive"
    })
  };
  const onDropAccepted = (acceptedFiles:File[]) => {
    startUpload(acceptedFiles,{configId: undefined})
    setIsDragOver(false)
    console.log(acceptedFiles)
  };

  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-ray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
        {
          "ring-blue-900/25 bg-blue-900/10": isDragOver,
        }
      )}
    >
      <div className=" relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpge": [".jpge"],
            "image/jpg": [".jpg"],
          }}
          onDragEnter={() => {
            setIsDragOver(true), console.log("Droping");
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps({})}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500" />
              ) : (
                <Image className="h-6 w-6 text-zinc-500 mb-2" />
              )}
              <div className="flex flex-col justify-center text-sm mb-2 text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <p>Uploading...</p>
                    <Progress
                      value={uploadProgress}
                      className="mt-2 w-40 h-2 bg-gray-300"
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    Redirecting,please wait...
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-smibold">Drop file</span>
                    to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-bold">Click to upload </span>
                    or drag and drop
                  </p>
                )}
              </div>
              {isPending ? null : (
                <p className="text-xs text-zinc-500">JPG,JPGE,PNG</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default page;
