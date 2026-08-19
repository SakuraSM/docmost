import { getBackendUrl } from "@/lib/config";

export const PAGE_ICON_PREFIX = "page-icon:";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isPageIconValue(icon?: string | null): boolean {
  return Boolean(icon?.startsWith(PAGE_ICON_PREFIX));
}

export function parsePageIconAttachmentId(icon?: string | null): string | null {
  if (!icon?.startsWith(PAGE_ICON_PREFIX)) return null;

  const attachmentId = icon.slice(PAGE_ICON_PREFIX.length);
  return UUID_PATTERN.test(attachmentId) ? attachmentId : null;
}

export function getPageIconImageUrl(
  icon?: string | null,
  publicIconUrl?: string | null,
): string | null {
  const attachmentId = parsePageIconAttachmentId(icon);
  if (!attachmentId) return null;
  if (publicIconUrl) return publicIconUrl;
  return `${getBackendUrl()}/files/${attachmentId}/icon`;
}

export function getPageIconText(icon?: string | null): string {
  return isPageIconValue(icon) ? "" : (icon ?? "");
}
