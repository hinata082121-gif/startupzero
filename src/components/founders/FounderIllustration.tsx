import type { FounderType } from "../../gameState";
import { useI18n } from "../../i18n";

type FounderIllustrationProps = {
  founder: FounderType;
};

type FounderArt = {
  altKey: string;
  slug: string;
  bg: string;
  aura: string;
  accent: string;
  accentSoft: string;
  jacket: string;
  hair: string;
  expression: "cool" | "smile" | "thoughtful" | "bold" | "calm";
  prop: "laptop" | "pitch" | "wireframe" | "rocket" | "ledger";
};

const art: Record<FounderType, FounderArt> = {
  "Engineer Founder": {
    altKey: "founderIllustrations.engineerAlt",
    slug: "engineer",
    bg: "#dbeafe",
    aura: "#60a5fa",
    accent: "#2563eb",
    accentSoft: "#93c5fd",
    jacket: "#1d4ed8",
    hair: "#172554",
    expression: "cool",
    prop: "laptop",
  },
  "Sales Founder": {
    altKey: "founderIllustrations.salesAlt",
    slug: "sales",
    bg: "#dcfce7",
    aura: "#34d399",
    accent: "#059669",
    accentSoft: "#86efac",
    jacket: "#047857",
    hair: "#3f2b16",
    expression: "smile",
    prop: "pitch",
  },
  "Product Founder": {
    altKey: "founderIllustrations.productAlt",
    slug: "product",
    bg: "#ede9fe",
    aura: "#a78bfa",
    accent: "#7c3aed",
    accentSoft: "#c4b5fd",
    jacket: "#6d28d9",
    hair: "#312e81",
    expression: "thoughtful",
    prop: "wireframe",
  },
  "Growth Founder": {
    altKey: "founderIllustrations.growthAlt",
    slug: "growth",
    bg: "#ffedd5",
    aura: "#fb923c",
    accent: "#ea580c",
    accentSoft: "#fdba74",
    jacket: "#f97316",
    hair: "#7c2d12",
    expression: "bold",
    prop: "rocket",
  },
  "Bootstrap Founder": {
    altKey: "founderIllustrations.bootstrapAlt",
    slug: "bootstrap",
    bg: "#ccfbf1",
    aura: "#0f766e",
    accent: "#115e59",
    accentSoft: "#5eead4",
    jacket: "#0f3f46",
    hair: "#102a43",
    expression: "calm",
    prop: "ledger",
  },
};

export default function FounderIllustration({ founder }: FounderIllustrationProps) {
  const { t } = useI18n();
  const style = art[founder];
  const gradientId = `founder-bg-${style.slug}`;
  const glowId = `founder-glow-${style.slug}`;

  return (
    <div
      aria-label={t(style.altKey)}
      role="img"
      className="relative h-32 overflow-hidden rounded-xl border border-white/80 bg-white shadow-inner transition duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.015]"
    >
      <svg
        aria-hidden="true"
        className="h-full w-full"
        viewBox="0 0 260 150"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={style.bg} />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor={style.aura} stopOpacity="0.34" />
            <stop offset="70%" stopColor={style.aura} stopOpacity="0.08" />
            <stop offset="100%" stopColor={style.aura} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="260" height="150" rx="18" fill={`url(#${gradientId})`} />
        <circle cx="130" cy="72" r="92" fill={`url(#${glowId})`} />
        <BackgroundMotif style={style} />
        <CharacterBase style={style} />
        <FounderProp style={style} />
      </svg>
    </div>
  );
}

function BackgroundMotif({ style }: { style: FounderArt }) {
  if (style.prop === "laptop") {
    return (
      <g opacity="0.78">
        <path d="M22 28h50v30H22z" fill="#fff" opacity="0.7" />
        <path d="M30 38h20M30 47h32M55 38h10" stroke={style.accent} strokeWidth="3" strokeLinecap="round" />
        <path d="M205 26l12 10-12 10M188 46l-12-10 12-10" stroke={style.accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    );
  }

  if (style.prop === "pitch") {
    return (
      <g opacity="0.78">
        <rect x="22" y="30" width="52" height="36" rx="8" fill="#fff" opacity="0.78" />
        <path d="M34 56V45M48 56V38M62 56V33" stroke={style.accent} strokeWidth="5" strokeLinecap="round" />
        <path d="M197 44l11 9 18-21" stroke={style.accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    );
  }

  if (style.prop === "wireframe") {
    return (
      <g opacity="0.76">
        <rect x="21" y="29" width="58" height="40" rx="8" fill="#fff" opacity="0.76" />
        <rect x="32" y="40" width="20" height="8" rx="3" fill={style.accentSoft} />
        <rect x="56" y="40" width="12" height="8" rx="3" fill={style.accent} />
        <path d="M32 56h36M195 35h34M195 48h22M208 27v30" stroke={style.accent} strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  }

  if (style.prop === "rocket") {
    return (
      <g opacity="0.82">
        <path d="M205 58c5-22 22-31 27-33-1 10-6 27-26 35z" fill={style.accent} />
        <circle cx="215" cy="42" r="5" fill="#fff" opacity="0.85" />
        <path d="M202 61l-7 16 15-8M199 55l-17 5 15 7" fill={style.accentSoft} />
        <path d="M28 64l22-25 20 17 20-30" stroke={style.accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    );
  }

  return (
    <g opacity="0.78">
      <path d="M44 28l28 12v22c0 19-16 28-28 32-12-4-28-13-28-32V40z" fill="#fff" opacity="0.78" />
      <path d="M44 41v35" stroke={style.accent} strokeWidth="5" strokeLinecap="round" />
      <path d="M202 35h31v40h-31z" fill="#fff" opacity="0.72" />
      <path d="M210 47h16M210 59h12" stroke={style.accent} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

function CharacterBase({ style }: { style: FounderArt }) {
  const smilePath =
    style.expression === "cool"
      ? "M118 70c5 4 12 4 17 0"
      : style.expression === "thoughtful"
        ? "M119 70c4 2 10 2 14 0"
        : style.expression === "calm"
          ? "M118 70c5 5 13 5 18 0"
          : "M116 69c6 8 16 8 22 0";

  return (
    <g>
      <ellipse cx="130" cy="135" rx="60" ry="13" fill="#0f172a" opacity="0.12" />

      <path
        d="M89 132c7-34 25-51 42-51s36 17 42 51z"
        fill={style.jacket}
        stroke="#0f172a"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <path d="M110 91l20 37 20-37c-13 10-26 10-40 0z" fill="#f8fafc" opacity="0.94" />
      <path d="M115 95l15 28 15-28" stroke={style.accentSoft} strokeWidth="4" strokeLinecap="round" fill="none" />

      <path
        d="M96 134c-4-22-1-36 11-43l13 22-10 22zM164 134c4-22 1-36-11-43l-13 22 10 22z"
        fill={style.accent}
        opacity="0.82"
      />

      <circle cx="130" cy="58" r="30" fill="#ffd7b5" stroke="#0f172a" strokeOpacity="0.24" strokeWidth="2" />
      <path
        d="M100 53c6-26 26-37 46-29 15 6 19 20 16 33-12-11-33-10-50-2-4 2-8 1-12-2z"
        fill={style.hair}
      />
      <path d="M107 56c-6 2-8 9-4 14 3 4 7 4 10 1" fill="#ffd7b5" />
      <path d="M153 56c6 2 8 9 4 14-3 4-7 4-10 1" fill="#ffd7b5" />

      <circle cx="119" cy="61" r="3" fill="#0f172a" />
      <circle cx="141" cy="61" r="3" fill="#0f172a" />
      <path d={smilePath} stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" fill="none" />
      {style.expression === "cool" && (
        <path d="M112 57h14M134 57h14" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      )}
      {style.expression === "thoughtful" && (
        <circle cx="154" cy="36" r="5" fill="#fff" opacity="0.9" />
      )}
    </g>
  );
}

function FounderProp({ style }: { style: FounderArt }) {
  if (style.prop === "laptop") {
    return (
      <g transform="translate(73 101)">
        <rect x="0" y="0" width="78" height="38" rx="6" fill="#1e293b" />
        <rect x="8" y="7" width="62" height="23" rx="3" fill="#dbeafe" />
        <path d="M18 18h14M38 18h20M20 25h35" stroke={style.accent} strokeWidth="3" strokeLinecap="round" />
        <path d="M-8 38h94l-7 10H-1z" fill="#475569" />
      </g>
    );
  }

  if (style.prop === "pitch") {
    return (
      <g transform="translate(152 92)">
        <rect x="0" y="0" width="54" height="42" rx="8" fill="#f8fafc" stroke={style.accent} strokeWidth="3" />
        <path d="M12 30V19M26 30V11M40 30V15" stroke={style.accent} strokeWidth="5" strokeLinecap="round" />
        <path d="M-27 20c12-7 20-8 27-3" stroke="#ffd7b5" strokeWidth="9" strokeLinecap="round" />
      </g>
    );
  }

  if (style.prop === "wireframe") {
    return (
      <g transform="translate(68 101)">
        <rect x="0" y="0" width="80" height="39" rx="8" fill="#f8fafc" stroke={style.accent} strokeWidth="3" />
        <rect x="11" y="10" width="21" height="10" rx="4" fill={style.accentSoft} />
        <rect x="38" y="10" width="29" height="10" rx="4" fill={style.accent} />
        <path d="M12 28h55" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="85" cy="2" r="11" fill="#fff" stroke={style.accent} strokeWidth="3" />
      </g>
    );
  }

  if (style.prop === "rocket") {
    return (
      <g transform="translate(154 91)">
        <path d="M13 43c5-27 23-42 42-49-2 22-10 41-38 53z" fill={style.accent} stroke="#7c2d12" strokeOpacity="0.28" strokeWidth="2" />
        <circle cx="35" cy="18" r="7" fill="#fff7ed" />
        <path d="M15 44l-10 17 20-8M12 34l-22 5 20 11" fill={style.accentSoft} />
        <path d="M12 52c-6 7-13 11-23 12 4-9 8-15 16-20" fill="#facc15" opacity="0.9" />
      </g>
    );
  }

  return (
    <g transform="translate(75 100)">
      <rect x="0" y="0" width="66" height="40" rx="8" fill="#f8fafc" stroke={style.accent} strokeWidth="3" />
      <path d="M12 13h42M12 24h30" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      <path d="M77 2l21 9v17c0 15-12 23-21 27-9-4-21-12-21-27V11z" fill={style.accent} opacity="0.95" />
      <path d="M77 15v26" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}
