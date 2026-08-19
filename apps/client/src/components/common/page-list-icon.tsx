import { PageIcon } from "@/components/common/page-icon";

type Props = {
  icon?: string | null;
  isBase?: boolean;
};

export function PageListIcon({ icon, isBase }: Props) {
  return <PageIcon icon={icon} isBase={isBase} />;
}
