import LanguageSwitcher from "./LanguageSwitcher";
import type React from "react";
import {
  navLabels,
  publicNavigation,
  type PublicRoute,
} from "../content/publicPages";
import { useI18n } from "../i18n";

type PublicSiteLayoutProps = {
  activeRoute: PublicRoute | "/play" | "/404";
  children: React.ReactNode;
};

const footerRoutes: Array<PublicRoute> = ["/about", "/contact", "/privacy", "/terms", "/changelog"];

export default function PublicSiteLayout({ activeRoute, children }: PublicSiteLayoutProps) {
  const { currentLanguage } = useI18n();
  const labels = navLabels[currentLanguage];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-lg font-black text-white">
              SZ
            </span>
            <span>
              <span className="block text-base font-black leading-tight">Startup Zero</span>
              <span className="block text-xs font-semibold text-slate-500">
                {currentLanguage === "ja" ? "起業シミュレーションゲーム" : "Startup simulation game"}
              </span>
            </span>
          </a>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-wrap lg:justify-end lg:pb-0">
              {publicNavigation.map((item) => (
                <a
                  key={item.route}
                  href={item.route}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold transition ${
                    activeRoute === item.route
                      ? "bg-teal-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {labels[item.labelKey]}
                </a>
              ))}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-semibold text-slate-500">
            {currentLanguage === "ja"
              ? "Startup Zeroは、起業判断を短いゲームループで体験するためのブラウザゲームです。"
              : "Startup Zero is a browser game about startup tradeoffs and monthly decisions."}
          </p>
          <nav className="flex flex-wrap gap-2 text-sm font-bold">
            {footerRoutes.map((route) => (
              <a key={route} href={route} className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100">
                {labels[
                  route === "/about"
                    ? "about"
                    : route === "/contact"
                      ? "contact"
                      : route === "/privacy"
                        ? "privacy"
                        : route === "/terms"
                          ? "terms"
                          : "changelog"
                ]}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}
