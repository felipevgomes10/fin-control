import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { FileRouterType } from "@/app/api/uploadthing/core";

const UploadButton = generateUploadButton<FileRouterType>();
const UploadDropzone = generateUploadDropzone<FileRouterType>();

export const Upload = { UploadButton, UploadDropzone };
