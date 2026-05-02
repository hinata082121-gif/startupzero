import { useI18n } from "../i18n";

export default function AdBanner() {
  const { t } = useI18n();
  const label = t("ads.advertisement");

  return (
    <div
      aria-label={label}
      style={{
        width: "100%",
        maxWidth: "728px",
        height: "90px",
        background: "#f5f5f5",
        border: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        color: "#888",
        margin: "0 auto",
      }}
    >
      {label}
    </div>
  );
}
