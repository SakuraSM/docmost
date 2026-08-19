import { describe, expect, it } from "vitest";
import {
  getPageIconImageUrl,
  getPageIconText,
  parsePageIconAttachmentId,
} from "./page-icon.utils.ts";

const attachmentId = "0198cfe2-5b13-74b4-a1fb-4935d06d48bc";
const imageIcon = `page-icon:${attachmentId}`;

describe("page icon utilities", () => {
  it("parses valid image icon identifiers", () => {
    expect(parsePageIconAttachmentId(imageIcon)).toBe(attachmentId);
  });

  it.each(["📘", "page-icon:not-a-uuid", "page-icon:", null, undefined])(
    "does not parse %s as an image icon",
    (icon) => expect(parsePageIconAttachmentId(icon)).toBeNull(),
  );

  it("uses a signed public URL when supplied", () => {
    expect(getPageIconImageUrl(imageIcon, "/api/files/public/icon?jwt=x")).toBe(
      "/api/files/public/icon?jwt=x",
    );
  });

  it("builds a private attachment URL", () => {
    expect(getPageIconImageUrl(imageIcon)).toContain(
      `/api/files/${attachmentId}/icon`,
    );
  });

  it("keeps emoji but omits internal image identifiers from text", () => {
    expect(getPageIconText("📘")).toBe("📘");
    expect(getPageIconText(imageIcon)).toBe("");
    expect(getPageIconText("page-icon:not-a-uuid")).toBe("");
  });
});
