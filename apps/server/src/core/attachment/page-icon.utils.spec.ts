import {
  buildPageIconValue,
  parsePageIconAttachmentId,
  isValidPageIconImage,
} from './page-icon.utils';

describe('page icon utilities', () => {
  const attachmentId = '0198cfe2-5b13-74b4-a1fb-4935d06d48bc';

  it('builds and parses a page icon identifier', () => {
    const icon = buildPageIconValue(attachmentId);
    expect(icon).toBe(`page-icon:${attachmentId}`);
    expect(parsePageIconAttachmentId(icon)).toBe(attachmentId);
  });

  it.each(['📘', 'page-icon:not-a-uuid', 'page-icon:', null, undefined])(
    'rejects non-image icon %s',
    (icon) => expect(parsePageIconAttachmentId(icon)).toBeNull(),
  );

  it('validates the image signature and dimensions', () => {
    const png = Buffer.alloc(24);
    Buffer.from([
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
    ]).copy(png);
    png.writeUInt32BE(128, 16);
    png.writeUInt32BE(128, 20);

    expect(isValidPageIconImage(png, '.png')).toBe(true);
    expect(isValidPageIconImage(png, '.jpg')).toBe(false);
    expect(isValidPageIconImage(png, '.gif')).toBe(false);
  });

  it('rejects images above the pixel limit', () => {
    const png = Buffer.alloc(24);
    Buffer.from([
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
    ]).copy(png);
    png.writeUInt32BE(257, 16);
    png.writeUInt32BE(128, 20);

    expect(isValidPageIconImage(png, '.png')).toBe(false);
  });
});
