import { validate as isValidUuid } from 'uuid';
import { imageDimensionsFromData } from 'image-dimensions';

export const PAGE_ICON_PREFIX = 'page-icon:';
export const PAGE_ICON_MAX_DIMENSION = 256;

export function buildPageIconValue(attachmentId: string): string {
  return `${PAGE_ICON_PREFIX}${attachmentId}`;
}

export function parsePageIconAttachmentId(
  icon: string | null | undefined,
): string | null {
  if (!icon?.startsWith(PAGE_ICON_PREFIX)) return null;

  const attachmentId = icon.slice(PAGE_ICON_PREFIX.length);
  return isValidUuid(attachmentId) ? attachmentId : null;
}

export function isValidPageIconImage(
  buffer: Uint8Array,
  fileExtension: string,
): boolean {
  const expectedType =
    fileExtension === '.png'
      ? 'png'
      : ['.jpg', '.jpeg'].includes(fileExtension)
        ? 'jpeg'
        : null;
  if (!expectedType) return false;

  const dimensions = imageDimensionsFromData(buffer);
  return Boolean(
    dimensions &&
    dimensions.type === expectedType &&
    dimensions.width <= PAGE_ICON_MAX_DIMENSION &&
    dimensions.height <= PAGE_ICON_MAX_DIMENSION,
  );
}
