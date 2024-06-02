import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import Jimp from 'jimp';
import { db } from "@/db";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      // Middleware simply forwards the input, ensuring it conforms to the expected schema
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const { configId } = metadata.input;
        const res = await fetch(file.url);
        const buffer = await res.arrayBuffer();
        const image = await Jimp.read(Buffer.from(buffer));
        const width = image.bitmap.width;
        const height = image.bitmap.height;
    
        if (!configId) {
          const configuration = await db.configuration.create({
            data: {
              imageUrl: file.url,
              height: height || 500,
              width: width || 500,
            },
          });
          return { configId: configuration.id };
        } else {
          const updateConfiguration = await db.configuration.update({
            where: { id: configId },
            data: { croppedImageUrl: file.url },
          });
          return { configId: updateConfiguration.id };
        }
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        throw new UploadThingError({
          message: "Error processing uploaded image",
          code: "INTERNAL_SERVER_ERROR",
          cause: error?.toString(),
        });
      }
    })
    
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
