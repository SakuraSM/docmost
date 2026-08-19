import { beforeEach, describe, expect, it, vi } from "vitest";
import loadImage from "blueimp-load-image";
import {
  compressPageIcon,
  PAGE_ICON_SOURCE_MAX_BYTES,
  validatePageIconSource,
} from "./attachment-service.ts";

vi.mock("blueimp-load-image", () => ({ default: vi.fn() }));

describe("page icon compression", () => {
  const toBlob = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    toBlob.mockImplementation((callback, type) => {
      callback(new Blob(["compressed"], { type }));
    });
    vi.mocked(loadImage).mockResolvedValue({
      image: { toBlob },
    } as unknown as Awaited<ReturnType<typeof loadImage>>);
  });

  it("requests EXIF-aware square center cropping at 128 pixels", async () => {
    await compressPageIcon(
      new File(["jpeg"], "icon.jpg", { type: "image/jpeg" }),
    );

    expect(loadImage).toHaveBeenCalledWith(
      expect.any(File),
      expect.objectContaining({
        maxWidth: 128,
        maxHeight: 128,
        crop: true,
        aspectRatio: 1,
        orientation: true,
      }),
    );
    expect(toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/jpeg",
      0.82,
    );
  });

  it("preserves transparent PNG output", async () => {
    const result = await compressPageIcon(
      new File(["png"], "icon.png", { type: "image/png" }),
    );
    expect(result.type).toBe("image/png");
    expect(toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/png",
      undefined,
    );
  });

  it("rejects unsupported and oversized source files", () => {
    expect(() =>
      validatePageIconSource(
        new File(["gif"], "icon.gif", { type: "image/gif" }),
      ),
    ).toThrow("page-icon-invalid-type");

    const oversized = new File(
      [new Uint8Array(PAGE_ICON_SOURCE_MAX_BYTES + 1)],
      "icon.png",
      {
        type: "image/png",
      },
    );
    expect(() => validatePageIconSource(oversized)).toThrow(
      "page-icon-too-large",
    );
  });

  it("rejects when canvas encoding fails", async () => {
    toBlob.mockImplementation((callback) => callback(null));
    await expect(
      compressPageIcon(new File(["jpeg"], "icon.jpg", { type: "image/jpeg" })),
    ).rejects.toThrow("Failed to compress page icon");
  });
});
