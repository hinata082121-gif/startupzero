import { useI18n } from "../../i18n";

type CompanyInfoStepProps = {
  founderName: string;
  companyName: string;
  onFounderNameChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
};

export default function CompanyInfoStep({
  founderName,
  companyName,
  onFounderNameChange,
  onCompanyNameChange,
}: CompanyInfoStepProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-teal-50 p-4">
        <h3 className="text-lg font-black text-slate-950">{t("setup.confirmCompanyInfo")}</h3>
        <p className="mt-1 text-sm leading-6 text-teal-950">{t("setup.companyInfoBody")}</p>
      </div>
      <label className="block rounded-lg border border-slate-200 bg-white p-4">
        <span className="text-sm font-bold text-slate-950">{t("setup.founderName")}</span>
        <input
          value={founderName}
          onChange={(event) => onFounderNameChange(event.target.value)}
          placeholder={t("setup.enterFounderName")}
          className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </label>
      <label className="block rounded-lg border border-slate-200 bg-white p-4">
        <span className="text-sm font-bold text-slate-950">{t("setup.companyName")}</span>
        <input
          value={companyName}
          onChange={(event) => onCompanyNameChange(event.target.value)}
          placeholder={t("setup.enterCompanyName")}
          className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </label>
    </div>
  );
}
