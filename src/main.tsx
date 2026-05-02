import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LanguageProvider, validateTranslations } from "./i18n";
import "./index.css";

if (import.meta.env.DEV) {
  validateTranslations();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
);
