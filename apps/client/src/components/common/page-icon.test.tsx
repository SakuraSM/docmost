import { fireEvent, render } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { PageIcon } from "./page-icon.tsx";

const imageIcon = "page-icon:0198cfe2-5b13-74b4-a1fb-4935d06d48bc";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

const renderIcon = (icon?: string | null) => {
  const result = render(
    <MantineProvider>
      <PageIcon icon={icon} />
    </MantineProvider>,
  );
  return result.container;
};

describe("PageIcon", () => {
  it("renders emoji as text", () => {
    const container = renderIcon("📘");
    expect(container.textContent).toContain("📘");
  });

  it("renders image icons as decorative cropped images", () => {
    const container = renderIcon(imageIcon);
    const image = container.querySelector("img");
    expect(image).not.toBeNull();
    expect(image!.getAttribute("alt")).toBe("");
    expect(image!.style.objectFit).toBe("cover");
  });

  it("falls back to the default icon after an image error", () => {
    const container = renderIcon(imageIcon);
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("does not expose malformed internal image identifiers", () => {
    const container = renderIcon("page-icon:not-a-uuid");
    expect(container.textContent).not.toContain("page-icon:");
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
