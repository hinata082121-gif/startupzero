import type { GameState } from "../gameState";
import { useI18n } from "../i18n";

type GraphPanelProps = {
  state: GameState;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(value);

export default function GraphPanel({ state }: GraphPanelProps) {
  const { t } = useI18n();
  const points = buildGraphPoints(state);
  const userPath = buildPath(points.map((point) => point.users));
  const revenuePath = buildPath(points.map((point) => point.revenue));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("dashboard.graphEyebrow")}</p>
          <h2 className="text-2xl font-bold text-slate-950">{t("dashboard.graphTitle")}</h2>
        </div>
        <div className="text-right text-sm">
          <p className="font-bold text-teal-700">{state.users.toLocaleString()} {t("common.users")}</p>
          <p className="font-bold text-sky-700">{money(state.revenue)} {t("common.mrr")}</p>
        </div>
      </div>

      <div className="h-56 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <svg viewBox="0 0 320 160" className="h-full w-full" role="img" aria-label={t("dashboard.graphTitle")}>
          <line x1="18" y1="138" x2="306" y2="138" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="18" y1="18" x2="18" y2="138" stroke="#cbd5e1" strokeWidth="1" />
          <path d={userPath} fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
          <path d={revenuePath} fill="none" stroke="#0369a1" strokeWidth="4" strokeLinecap="round" />
          {points.map((point, index) => (
            <circle
              key={`${point.month}-${index}`}
              cx={toX(index, points.length)}
              cy={toY(point.users, points.map((item) => item.users))}
              r="3"
              fill="#0f766e"
            />
          ))}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-2">
          <span className="h-2 w-5 rounded-full bg-teal-700" />
          {t("dashboard.users")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-5 rounded-full bg-sky-700" />
          {t("dashboard.revenue")}
        </span>
      </div>
    </section>
  );
}

const buildGraphPoints = (state: GameState) => {
  const points = [
    {
      month: state.month,
      users: state.users,
      revenue: state.revenue,
    },
  ];

  let users = state.users;
  let revenue = state.revenue;

  for (const report of state.monthlyReports.slice(0, 7)) {
    users -= report.usersDelta;
    revenue -= report.revenueDelta;
    points.push({
      month: report.month,
      users: Math.max(0, users),
      revenue: Math.max(0, revenue),
    });
  }

  return points.reverse();
};

const buildPath = (values: number[]) =>
  values.map((value, index) => `${index === 0 ? "M" : "L"} ${toX(index, values.length)} ${toY(value, values)}`).join(" ");

const toX = (index: number, total: number) => {
  if (total <= 1) {
    return 18;
  }

  return 18 + (index / (total - 1)) * 288;
};

const toY = (value: number, values: number[]) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  return 138 - ((value - min) / range) * 116;
};
