import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(rootDir, "dist");
const baseUrl = "https://startupzero.vercel.app";

const pages = [
  {
    route: "/",
    title: "Startup Zero - Startup Simulation Game",
    description:
      "Startup Zero is a browser startup simulation about runway, product decisions, founder types, industries, and the Founder League challenge.",
    h1: "Build a startup one month at a time",
    body: [
      "Startup Zero is a browser startup simulation where each month asks you to choose one action: develop, hire, market, fundraise, pivot, or rest.",
      "The game models cash, revenue, users, burn rate, runway, morale, product progress, market fit, reputation, and competition pressure.",
      "Founder types, industries, monthly reports, mentor analysis, and Founder League make each run replayable.",
    ],
  },
  {
    route: "/how-to-play",
    title: "How to Play Startup Zero",
    description:
      "Learn Startup Zero's monthly loop, core metrics, victory and failure conditions, and beginner-friendly startup decisions.",
    h1: "How to play Startup Zero",
    body: [
      "Each turn is one month. Choose one action, confirm the impact, review the monthly result, and react to events.",
      "Cash and morale are survival metrics. Revenue, users, market fit, product progress, and reputation determine whether growth is healthy.",
      "Normal Mode is won by reaching the revenue target while keeping the company alive.",
    ],
  },
  {
    route: "/strategy",
    title: "Startup Zero Strategy Guide",
    description:
      "Practical Startup Zero strategy based on early, mid, late game decisions, action tradeoffs, and Founder League pressure.",
    h1: "Strategy without a single correct answer",
    body: [
      "Early runs should learn before scaling: product progress and market fit make marketing more efficient.",
      "Mid-game choices become expensive because hiring raises burn, marketing increases acquisition pressure, and pivoting resets progress.",
      "Founder League adds a 36-month clock, tougher events, competition pressure, and score-based ranking.",
    ],
  },
  {
    route: "/founders",
    title: "Founder Types in Startup Zero",
    description:
      "Compare Engineer, Sales, Product, Growth, and Bootstrap founder types and how they change Startup Zero strategy.",
    h1: "Choose a founder style before the first month",
    body: [
      "Engineer Founders build faster but have weaker fundraising and marketing leverage.",
      "Sales Founders grow revenue and funding odds but need to watch product progress and burn.",
      "Product, Growth, and Bootstrap founders each create a different balance of fit, speed, and survival.",
    ],
  },
  {
    route: "/industries",
    title: "Industries in Startup Zero",
    description:
      "Learn how SaaS, Game, AI, Marketplace, and Local Business Tech change growth, revenue, risk, and difficulty.",
    h1: "Industries create different startup shapes",
    body: [
      "SaaS rewards recurring revenue, product quality, and market fit.",
      "Game and AI create stronger upside but more volatility, cost, and competitive pressure.",
      "Marketplace is difficult early, while Local Business Tech favors steady revenue and reputation.",
    ],
  },
  {
    route: "/founder-league",
    title: "Founder League Mode in Startup Zero",
    description:
      "Founder League is Startup Zero's advanced 36-month ranking mode with company valuation, Founder Score, and local records.",
    h1: "Founder League: the 36-month advanced mode",
    body: [
      "Founder League unlocks after clearing Normal Mode twice and runs for a fixed 36 months.",
      "Founder Score combines assets, valuation, annualized revenue, users, market fit, reputation, product progress, survival, difficulty, and penalties.",
      "The mode adds competition pressure and local ranking records for replayable advanced runs.",
    ],
  },
  {
    route: "/about",
    title: "About Startup Zero",
    description:
      "Startup Zero is an interactive startup simulation built to make runway, market fit, morale, and growth tradeoffs easier to understand.",
    h1: "About Startup Zero",
    body: [
      "Startup Zero turns startup vocabulary into visible decisions and consequences.",
      "The project focuses on short replayable runs where cash, growth, morale, product, market, and competition cannot be ignored.",
      "It is a learning-oriented game, not financial or business advice.",
    ],
  },
  {
    route: "/contact",
    title: "Contact Startup Zero",
    description:
      "Contact information for Startup Zero feedback, bug reports, privacy questions, and advertising policy concerns.",
    h1: "Contact",
    body: [
      "General inquiries can be sent to contact@startupzero.app.",
      "For bug reports, include your device, browser, language setting, selected mode, industry, founder type, and what happened.",
      "For privacy or advertising policy questions, include the page URL and concern.",
    ],
  },
  {
    route: "/privacy",
    title: "Privacy Policy - Startup Zero",
    description:
      "Startup Zero privacy policy covering browser storage, Google advertising, cookies, analytics, and contact information.",
    h1: "Privacy Policy",
    body: [
      "Startup Zero stores game progress, language settings, tutorial state, and local rankings in the browser when storage is available.",
      "The Vercel public version may use Google AdSense. Google and third-party vendors may use cookies, IP-related data, device identifiers, and similar technologies for ad serving and measurement.",
      "Users can manage personalized advertising through Google's ad settings and browser cookie controls.",
    ],
  },
  {
    route: "/terms",
    title: "Terms of Use - Startup Zero",
    description:
      "Terms of use for Startup Zero, including simulation limits, saved data, ads, and service availability.",
    h1: "Terms of Use",
    body: [
      "Startup Zero is a browser-based simulation game and should not be treated as legal, investment, financial, or business advice.",
      "Save data and local rankings are stored in the browser when available and may be removed if browser data is cleared.",
      "The public site may display labeled advertisements on content pages, separated from game controls and setup flows.",
    ],
  },
  {
    route: "/changelog",
    title: "Startup Zero Devlog and Changelog",
    description:
      "Read how Startup Zero has evolved with Founder League, safer storage, monthly results, founder identity, and content-first public pages.",
    h1: "Devlog: how Startup Zero is evolving",
    body: [
      "Startup Zero started as a compact monthly action loop and expanded into a clearer company-operating rhythm.",
      "Recent updates added action confirmation, month progress, monthly results, founder and company names, Founder League, safeStorage, and platform-specific builds.",
      "The public version now separates content-rich guide pages from action-oriented gameplay screens for a safer review structure.",
    ],
  },
];

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const renderStaticContent = (page) => `
    <article class="prerendered-content">
      <h1>${escapeHtml(page.h1)}</h1>
      ${page.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n      ")}
      <nav aria-label="Related Startup Zero pages">
        <a href="/">Home</a>
        <a href="/how-to-play">How to Play</a>
        <a href="/strategy">Strategy</a>
        <a href="/founders">Founders</a>
        <a href="/industries">Industries</a>
        <a href="/founder-league">Founder League</a>
        <a href="/play">Play</a>
      </nav>
    </article>`;

const replaceOrInsertMeta = (html, selector, replacement) => {
  if (selector.test(html)) {
    return html.replace(selector, replacement);
  }

  return html.replace("</head>", `    ${replacement}\n  </head>`);
};

const buildHtml = (template, page, noindex = false) => {
  const canonical = `${baseUrl}${page.route === "/" ? "/" : page.route}`;
  let html = template;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(page.title)}</title>`);
  html = replaceOrInsertMeta(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/s,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/s,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/s,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/s,
    `<link rel="canonical" href="${canonical}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/s,
    `<meta name="robots" content="${noindex ? "noindex,follow" : "index,follow"}" />`,
  );
  html = html.replace('<div id="root"></div>', `<div id="root">${renderStaticContent(page)}</div>`);
  return html;
};

const template = await readFile(join(distDir, "index.html"), "utf8");

for (const page of pages) {
  const outputDir = page.route === "/" ? distDir : join(distDir, page.route.slice(1));
  const html = buildHtml(template, page);
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, "index.html"), html, "utf8");
  if (page.route !== "/") {
    await writeFile(join(distDir, `${page.route.slice(1)}.html`), html, "utf8");
  }
}

const playPage = {
  route: "/play",
  title: "Startup Zero - Play",
  description: "Play Startup Zero, a browser startup simulation game.",
  h1: "Play Startup Zero",
  body: [
    "This route contains the interactive game UI. It is separated from content pages so game controls and setup flows do not share ad placements.",
  ],
};
await mkdir(join(distDir, "play"), { recursive: true });
const playHtml = buildHtml(template, playPage, true);
await writeFile(join(distDir, "play", "index.html"), playHtml, "utf8");
await writeFile(join(distDir, "play.html"), playHtml, "utf8");
