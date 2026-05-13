import { useEffect } from "react";

type AdSlotProps = {
  label: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const scriptId = "startup-zero-adsense-script";

const baseStyle = {
  width: "100%",
  maxWidth: "728px",
  minHeight: "90px",
  margin: "32px auto 40px",
} as const;

const fallbackStyle = {
  ...baseStyle,
  height: "90px",
  background: "#f5f5f5",
  border: "1px solid #ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  color: "#888",
} as const;

export default function VercelAdSlot({ label }: AdSlotProps) {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  const slotId = import.meta.env.VITE_ADSENSE_SLOT_ID;

  useEffect(() => {
    if (!clientId || document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
    document.head.appendChild(script);
  }, [clientId]);

  useEffect(() => {
    if (!clientId || !slotId) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense may be blocked by extensions or review environments.
    }
  }, [clientId, slotId]);

  if (!clientId || !slotId) {
    return (
      <div aria-label={label} style={fallbackStyle}>
        {label}
      </div>
    );
  }

  return (
    <div aria-label={label} style={baseStyle}>
      <div className="mb-1 text-center text-[11px] font-semibold text-slate-500">
        {label}
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: "90px" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
