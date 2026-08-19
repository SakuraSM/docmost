import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { beforeAll, describe, expect, it, vi } from "vitest";
import EmojiPicker from "./emoji-picker.tsx";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@slidoapp/emoji-mart-react", () => ({
  default: () => <div data-testid="emoji-picker-panel" />,
}));

vi.mock("@slidoapp/emoji-mart-data", () => ({ default: {} }));

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

const renderPicker = (onImageSelect = vi.fn().mockResolvedValue(undefined)) => {
  render(
    <MantineProvider>
      <EmojiPicker
        icon={<span>📄</span>}
        readOnly={false}
        onEmojiSelect={vi.fn()}
        removeEmojiAction={vi.fn()}
        onImageSelect={onImageSelect}
      />
    </MantineProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Choose page icon" }));
  return onImageSelect;
};

describe("EmojiPicker image actions", () => {
  it("keeps the action bar below the emoji panel instead of overlaying it", async () => {
    renderPicker();

    const panel = await screen.findByTestId("emoji-picker-panel");
    const actions = screen.getByTestId("page-icon-picker-actions");

    expect(panel.nextElementSibling).toBe(actions);
    expect(actions.style.position).not.toBe("absolute");
  });

  it("opens the file control and uploads the selected image", async () => {
    const onImageSelect = renderPicker();
    const uploadButton = await screen.findByRole("button", {
      name: "Upload image",
    });
    const fileInput = screen.getByLabelText("Upload image", {
      selector: 'input[type="file"]',
    });
    const inputClick = vi.spyOn(fileInput as HTMLInputElement, "click");

    fireEvent.click(uploadButton);
    expect(inputClick).toHaveBeenCalledOnce();

    const file = new File(
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47])],
      "icon.png",
      {
        type: "image/png",
      },
    );
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => expect(onImageSelect).toHaveBeenCalledWith(file));
  });
});
