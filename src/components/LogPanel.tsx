import type { LogEntry } from "../gameState";
import { useI18n } from "../i18n";

type LogPanelProps = {
  logs: LogEntry[];
};

export default function LogPanel({ logs }: LogPanelProps) {
  const { t } = useI18n();
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("dashboard.activity")}</p>
        <h2 className="text-2xl font-bold text-slate-950">{t("dashboard.log")}</h2>
      </div>

      <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
        {logs.map((log) => (
          <div key={log.id} className="rounded-md bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("common.month", { month: log.month })}
              </p>
              <span className="rounded bg-white px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t(`common.kinds.${log.kind ?? "system"}`)}
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {log.messageKey ? t(log.messageKey, log.params) : log.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
