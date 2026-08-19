import { useState, type ReactNode } from "react";
import { ThemeIcon } from "@mantine/core";
import { IconFileDescription, IconTable } from "@tabler/icons-react";
import {
  getPageIconImageUrl,
  isPageIconValue,
} from "@/features/page/page-icon.utils";

interface PageIconProps {
  icon?: string | null;
  iconUrl?: string | null;
  isBase?: boolean;
  size?: number;
  fallback?: ReactNode;
}

export function PageIcon({
  icon,
  iconUrl,
  isBase = false,
  size = 18,
  fallback,
}: PageIconProps) {
  const imageUrl = getPageIconImageUrl(icon, iconUrl);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const hasImageError = imageUrl === failedImageUrl;

  if (imageUrl && !hasImageError) {
    return (
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        onError={() => setFailedImageUrl(imageUrl)}
        style={{
          width: size,
          height: size,
          borderRadius: 3,
          objectFit: "cover",
          display: "block",
          flexShrink: 0,
        }}
      />
    );
  }

  if (icon && !isPageIconValue(icon)) return <>{icon}</>;
  if (fallback) return <>{fallback}</>;

  return (
    <ThemeIcon variant="transparent" color="gray" size={size}>
      {isBase ? <IconTable size={size} /> : <IconFileDescription size={size} />}
    </ThemeIcon>
  );
}
