import api from "@/lib/api-client";
import loadImage from "blueimp-load-image";
import {
  AvatarIconType,
  IAttachment,
  IPageAttachment,
  PageIconUploadResponse,
} from "@/features/attachments/types/attachment.types.ts";
import { IPagination, QueryParams } from "@/lib/types.ts";

const PAGE_ICON_SIZE = 128;
const PAGE_ICON_JPEG_QUALITY = 0.82;
export const PAGE_ICON_SOURCE_MAX_BYTES = 10 * 1024 * 1024;
const PAGE_ICON_MIME_TYPES = new Set(["image/png", "image/jpeg"]);

export function validatePageIconSource(file: File): void {
  if (file.size > PAGE_ICON_SOURCE_MAX_BYTES) {
    throw new Error("page-icon-too-large");
  }
  if (!PAGE_ICON_MIME_TYPES.has(file.type)) {
    throw new Error("page-icon-invalid-type");
  }
}

export async function getPageAttachments(
  pageId: string,
  params?: QueryParams,
): Promise<IPagination<IPageAttachment>> {
  const req = await api.post("/pages/attachments", { pageId, ...params });
  return req.data;
}

async function compressAndResizeIcon(
  file: File,
  type: AvatarIconType,
): Promise<File> {
  const isPng = file.type === "image/png";

  const { image: canvas } = await loadImage(file, {
    maxWidth: 300,
    maxHeight: 300,
    canvas: true,
    orientation: true,
    imageSmoothingQuality: "high",
  });

  if (type === AvatarIconType.AVATAR || !isPng) {
    const ctx = (canvas as HTMLCanvasElement).getContext("2d")!;
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
  }

  const outputType = isPng ? "image/png" : "image/jpeg";

  return new Promise<File>((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to compress image"));
          return;
        }
        resolve(new File([blob], file.name, { type: outputType }));
      },
      outputType,
      isPng ? undefined : 0.85,
    );
  });
}

export async function compressPageIcon(file: File): Promise<File> {
  validatePageIconSource(file);
  const isPng = file.type === "image/png";
  const { image } = await loadImage(file, {
    maxWidth: PAGE_ICON_SIZE,
    maxHeight: PAGE_ICON_SIZE,
    crop: true,
    aspectRatio: 1,
    canvas: true,
    orientation: true,
    imageSmoothingQuality: "high",
  });
  const canvas = image as HTMLCanvasElement;
  const outputType = isPng ? "image/png" : "image/jpeg";

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to compress page icon"));
          return;
        }
        resolve(new File([blob], file.name, { type: outputType }));
      },
      outputType,
      isPng ? undefined : PAGE_ICON_JPEG_QUALITY,
    );
  });
}

export async function uploadPageIcon(
  file: File,
  pageId: string,
): Promise<PageIconUploadResponse> {
  const processedImage = await compressPageIcon(file);
  const formData = new FormData();
  formData.append("pageId", pageId);
  formData.append("image", processedImage);

  const response = await api.post<PageIconUploadResponse>(
    "/attachments/page-icon",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
}

export async function uploadIcon(
  file: File,
  type: AvatarIconType,
  spaceId?: string,
): Promise<IAttachment> {
  const processed = await compressAndResizeIcon(file, type);

  const formData = new FormData();
  formData.append("type", type);
  if (spaceId) {
    formData.append("spaceId", spaceId);
  }
  formData.append("image", processed);

  return await api.post("/attachments/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function uploadUserAvatar(file: File): Promise<IAttachment> {
  return uploadIcon(file, AvatarIconType.AVATAR);
}

export async function uploadSpaceIcon(
  file: File,
  spaceId: string,
): Promise<IAttachment> {
  return uploadIcon(file, AvatarIconType.SPACE_ICON, spaceId);
}

export async function uploadWorkspaceIcon(file: File): Promise<IAttachment> {
  return uploadIcon(file, AvatarIconType.WORKSPACE_ICON);
}

async function removeIcon(
  type: AvatarIconType,
  spaceId?: string,
): Promise<void> {
  const payload: { spaceId?: string; type: string } = { type };

  if (spaceId) {
    payload.spaceId = spaceId;
  }

  await api.post("/attachments/remove-icon", payload);
}

export async function removeAvatar(): Promise<void> {
  await removeIcon(AvatarIconType.AVATAR);
}

export async function removeSpaceIcon(spaceId: string): Promise<void> {
  await removeIcon(AvatarIconType.SPACE_ICON, spaceId);
}

export async function removeWorkspaceIcon(): Promise<void> {
  await removeIcon(AvatarIconType.WORKSPACE_ICON);
}
