import type { GameStatus } from "../gameState";
import { useI18n } from "../i18n";

export default function StatusBadge({ status }: { status: GameStatus }) {
  const { t } = useI18n();
  const className =
    status === "won"
      ? "bg-emerald-100 text-emerald-800"
      : status === "lost"
        ? "bg-red-100 text-red-800"
        : "bg-sky-100 text-sky-800";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {t(`common.status.${status}`)}
    </span>
  );
}
