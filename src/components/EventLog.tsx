import type { LogEntry, LogKind } from "../gameState";
import { useI18n } from "../i18n";

type EventLogProps = {
  logs: LogEntry[];
};

const kindStyles: Record<LogKind, { icon: string; className: string }> = {
  system: { icon: "*", className: "bg-slate-200 text-slate-700" },
  action: { icon: ">", className: "bg-teal-100 text-teal-700" },
  finance: { icon: "$", className: "bg-sky-100 text-sky-700" },
  event: { icon: "!", className: "bg-amber-100 text-amber-700" },
  result: { icon: "#", className: "bg-red-100 text-red-700" },
  ad: { icon: "+", className: "bg-violet-100 text-violet-700" },
};

export default function EventLog({ logs }: EventLogProps) {
  const { t } = useI18n();
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("dashboard.feedback")}</p>
        <h2 className="text-2xl font-bold text-slate-950">{t("dashboard.eventLog")}</h2>
      </div>

      <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">
        {logs.map((log) => {
          const kind = log.kind ?? "system";
          const style = kindStyles[kind];

          return (
            <div key={log.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start gap-3">
                <span className={`flex h-8 min-w-8 items-center justify-center rounded-full text-xs font-bold ${style.className}`}>
                  {style.icon}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t("common.month", { month: log.month })}
                    </p>
                    <span className="rounded bg-white px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t(`common.kinds.${kind}`)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {log.messageKey ? t(log.messageKey, log.params) : log.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
