import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Popover,
  Button,
  FileButton,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import { useClickOutside, useDisclosure, useWindowEvent } from "@mantine/hooks";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import {
  PAGE_ICON_SOURCE_MAX_BYTES,
  validatePageIconSource,
} from "@/features/attachments/services/attachment-service.ts";

// Load the picker module AND the emoji data in parallel inside the lazy
// resolution, then bind the data into the component. React.lazy only finishes
// suspending once both are in memory, so the Suspense boundary hides the
// Remove button until the Picker can render with real content.
const Picker = React.lazy(async () => {
  const [pickerModule, dataModule] = await Promise.all([
    import("@slidoapp/emoji-mart-react"),
    import("@slidoapp/emoji-mart-data"),
  ]);
  const PickerComp = pickerModule.default;
  const data = dataModule.default;
  return {
    default: (props: any) => <PickerComp {...props} data={data} />,
  };
});

export interface EmojiPickerInterface {
  onEmojiSelect: (emoji: any) => void | Promise<void>;
  icon: ReactNode;
  removeEmojiAction: () => void | Promise<void>;
  readOnly: boolean;
  actionIconProps?: {
    size?: string;
    variant?: string;
    c?: string;
    tabIndex?: number;
  };
  onImageSelect?: (file: File) => Promise<void>;
}

function EmojiPicker({
  onEmojiSelect,
  icon,
  removeEmojiAction,
  readOnly,
  actionIconProps,
  onImageSelect,
}: EmojiPickerInterface) {
  const { t } = useTranslation();
  const [opened, handlers] = useDisclosure(false);
  const { colorScheme } = useMantineColorScheme();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const resetFileInputRef = useRef<() => void>(null);

  const closeAndRestoreFocus = () => {
    handlers.close();
    requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  };

  useClickOutside(
    closeAndRestoreFocus,
    ["mousedown", "touchstart"],
    [dropdown, target],
  );

  // We need this because the default Mantine popover closeOnEscape does not work
  useWindowEvent("keydown", (event) => {
    if (opened && event.key === "Escape") {
      event.stopPropagation();
      event.preventDefault();
      closeAndRestoreFocus();
    }
  });

  // emoji-mart's built-in autoFocus calls .focus() without preventScroll, which
  // makes the browser scroll every scrollable ancestor of the search input to
  // bring it on screen — including the page editor's scroll container, so the
  // page jumps to the top whenever the picker is opened from a scrolled-down
  // position. The search input lives inside the <em-emoji-picker> custom
  // element's shadow root, so we poll for it after the dropdown mounts and
  // focus it ourselves with preventScroll.
  useEffect(() => {
    if (!opened || !dropdown) return;
    let cancelled = false;
    let rafId = 0;
    const tryFocus = (attempts: number) => {
      if (cancelled) return;
      const pickerEl = dropdown.querySelector("em-emoji-picker");
      const input = pickerEl?.shadowRoot?.querySelector<HTMLInputElement>(
        'input[type="search"]',
      );
      if (input) {
        input.focus({ preventScroll: true });
        return;
      }
      if (attempts < 60) {
        rafId = requestAnimationFrame(() => tryFocus(attempts + 1));
      }
    };
    rafId = requestAnimationFrame(() => tryFocus(0));
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [opened, dropdown]);

  const handleEmojiSelect = async (emoji) => {
    await onEmojiSelect(emoji);
    closeAndRestoreFocus();
  };

  const handleRemoveEmoji = async () => {
    await removeEmojiAction();
    closeAndRestoreFocus();
  };

  const handleImageChange = async (file: File | null) => {
    resetFileInputRef.current?.();
    if (!file || !onImageSelect) return;

    try {
      validatePageIconSource(file);
    } catch {
      notifications.show({
        message:
          file.size > PAGE_ICON_SOURCE_MAX_BYTES
            ? t("Image exceeds 10MB limit.")
            : t("Failed to upload image"),
        color: "red",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      await onImageSelect(file);
      closeAndRestoreFocus();
    } catch (error) {
      console.error(error);
      notifications.show({
        message: t("Failed to upload image"),
        color: "red",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <Popover
      opened={opened}
      onClose={closeAndRestoreFocus}
      width={332}
      position="bottom"
      disabled={readOnly}
      closeOnEscape={true}
    >
      <Popover.Target ref={setTarget}>
        <ActionIcon
          c={actionIconProps?.c || "gray"}
          variant={actionIconProps?.variant || "transparent"}
          size={actionIconProps?.size}
          tabIndex={actionIconProps?.tabIndex}
          onClick={handlers.toggle}
          aria-label={onImageSelect ? t("Choose page icon") : t("Pick emoji")}
          aria-haspopup="dialog"
          aria-expanded={opened}
          disabled={isUploadingImage}
        >
          {icon}
        </ActionIcon>
      </Popover.Target>
      <Suspense fallback={null}>
        <Popover.Dropdown
          bg="000"
          p={0}
          style={{ border: "none", overflow: "hidden" }}
          ref={setDropdown}
        >
          <Picker
            onEmojiSelect={handleEmojiSelect}
            perLine={8}
            skinTonePosition="search"
            theme={colorScheme}
          />
          <Group
            data-testid="page-icon-picker-actions"
            gap="xs"
            justify="flex-end"
            p="xs"
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)",
              background: "var(--mantine-color-body)",
            }}
          >
            {onImageSelect && (
              <FileButton
                onChange={handleImageChange}
                accept="image/png,image/jpeg"
                resetRef={resetFileInputRef}
                inputProps={{ "aria-label": t("Upload image") }}
              >
                {(fileButtonProps) => (
                  <Button
                    {...fileButtonProps}
                    variant="default"
                    c="gray"
                    size="xs"
                    loading={isUploadingImage}
                    disabled={isUploadingImage}
                  >
                    {t("Upload image")}
                  </Button>
                )}
              </FileButton>
            )}
            <Button
              variant="default"
              c="gray"
              size="xs"
              disabled={isUploadingImage}
              onClick={handleRemoveEmoji}
            >
              {t("Remove")}
            </Button>
          </Group>
        </Popover.Dropdown>
      </Suspense>
    </Popover>
  );
}

export default EmojiPicker;
