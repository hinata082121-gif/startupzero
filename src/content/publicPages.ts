import type { Language } from "../i18n/types";

export type PublicRoute =
  | "/"
  | "/how-to-play"
  | "/strategy"
  | "/founders"
  | "/industries"
  | "/founder-league"
  | "/about"
  | "/contact"
  | "/privacy"
  | "/terms"
  | "/changelog";

export type PublicPage = {
  route: PublicRoute;
  title: string;
  description: string;
  h1: string;
  intro: string;
  ctaLabel?: string;
  ctaHref?: string;
  sections: Array<{
    title: string;
    body: string[];
  }>;
  related: Array<PublicRoute | "/play">;
};

export const publicRoutes: PublicRoute[] = [
  "/",
  "/how-to-play",
  "/strategy",
  "/founders",
  "/industries",
  "/founder-league",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/changelog",
];

export const publicNavigation: Array<{ route: PublicRoute | "/play"; labelKey: keyof typeof navLabels.en }> = [
  { route: "/", labelKey: "home" },
  { route: "/play", labelKey: "play" },
  { route: "/how-to-play", labelKey: "howToPlay" },
  { route: "/strategy", labelKey: "strategy" },
  { route: "/founders", labelKey: "founders" },
  { route: "/industries", labelKey: "industries" },
  { route: "/founder-league", labelKey: "founderLeague" },
  { route: "/changelog", labelKey: "changelog" },
];

export const navLabels = {
  en: {
    home: "Home",
    play: "Play",
    howToPlay: "How to Play",
    strategy: "Strategy",
    founders: "Founders",
    industries: "Industries",
    founderLeague: "Founder League",
    about: "About",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    changelog: "Devlog",
  },
  ja: {
    home: "ホーム",
    play: "プレイ",
    howToPlay: "遊び方",
    strategy: "戦略",
    founders: "創業者タイプ",
    industries: "業界",
    founderLeague: "創業者リーグ",
    about: "このゲームについて",
    contact: "お問い合わせ",
    privacy: "プライバシー",
    terms: "利用規約",
    changelog: "開発ログ",
  },
} satisfies Record<Language, Record<string, string>>;

export const publicPages: Record<Language, Record<PublicRoute, PublicPage>> = {
  en: {
    "/": {
      route: "/",
      title: "Startup Zero - Startup Simulation Game",
      description:
        "Startup Zero is a browser startup simulation about runway, product decisions, founder types, industries, and the Founder League challenge.",
      h1: "Build a startup one month at a time",
      intro:
        "Startup Zero is a lightweight management game where every month forces one clear tradeoff: build, hire, market, raise, pivot, or rest.",
      ctaLabel: "Start a run",
      ctaHref: "/play",
      sections: [
        {
          title: "What makes the game different",
          body: [
            "The game is built around startup-specific pressure instead of generic resource collection. Cash, burn, runway, revenue, users, morale, product progress, market fit, reputation, and competition all interact with the action you choose each month.",
            "A good run is not just about hoarding cash. Marketing without fit becomes expensive, development without users delays learning, and aggressive hiring can raise burn faster than revenue grows.",
          ],
        },
        {
          title: "Founder types and industries change the run",
          body: [
            "You can start as an Engineer, Sales, Product, Growth, or Bootstrap founder. Each type changes the rhythm of decisions: technical founders build faster, sales founders raise and sell more easily, and bootstrap founders survive longer with slower growth.",
            "Industries also change what matters. SaaS rewards recurring revenue and fit, Game rewards user spikes and reputation, AI raises burn and competitive pressure, Marketplace gets stronger once network effects appear, and Local Business Tech favors steady revenue.",
          ],
        },
        {
          title: "Founder League is the advanced challenge",
          body: [
            "After clearing Normal Mode twice, Founder League unlocks as a 36-month challenge. It scores company value, total assets, revenue, users, product progress, market fit, reputation, survival, and difficulty.",
            "Founder League is designed for players who already understand the monthly loop and want a replayable local ranking target instead of a simple win screen.",
          ],
        },
      ],
      related: ["/how-to-play", "/strategy", "/founders", "/industries", "/founder-league", "/play"],
    },
    "/how-to-play": {
      route: "/how-to-play",
      title: "How to Play Startup Zero",
      description:
        "Learn Startup Zero's monthly loop, core metrics, victory and failure conditions, and beginner-friendly startup decisions.",
      h1: "How to play Startup Zero",
      intro:
        "Each turn is one month. You choose one action, review the result, absorb a possible event, and decide what the company needs next.",
      sections: [
        {
          title: "The monthly loop",
          body: [
            "The main rhythm is simple: choose one action, confirm the expected impact, watch the month advance, and read the monthly result. This keeps every decision tied to a visible change in the company.",
            "Actions can affect cash, revenue, users, morale, product progress, market fit, reputation, burn rate, and competition pressure. The result screen explains what changed so the next choice is easier to reason about.",
          ],
        },
        {
          title: "Key metrics to read first",
          body: [
            "Cash is the money left in the company. Burn Rate is the monthly operating cost. Revenue offsets burn. Runway estimates how many months the company can survive at the current pace.",
            "Users are not the same as revenue. Market Fit shows whether the product solves a real need. Product Progress shows how mature the product is. Team Morale is a survival metric: when morale reaches zero, the company collapses even if the idea is good.",
          ],
        },
        {
          title: "Victory and failure",
          body: [
            "Normal Mode is won by reaching the revenue target while keeping cash and morale alive. A company fails if cash reaches zero or team morale collapses.",
            "The early game is forgiving enough to learn the interface, but repeated expensive choices still matter. If runway is short, do not treat every month as a growth month.",
          ],
        },
      ],
      related: ["/strategy", "/founders", "/industries", "/play"],
    },
    "/strategy": {
      route: "/strategy",
      title: "Startup Zero Strategy Guide",
      description:
        "Practical Startup Zero strategy based on early, mid, late game decisions, action tradeoffs, and Founder League pressure.",
      h1: "Strategy without a single correct answer",
      intro:
        "Startup Zero rewards reading the company state. The best action changes when runway, morale, fit, and growth pressure change.",
      sections: [
        {
          title: "Early game: learn before scaling",
          body: [
            "In the first months, Product Progress and Market Fit usually matter more than raw user count. Marketing can create users, but if fit is weak, revenue conversion is inefficient and burn climbs.",
            "A stable start often mixes Develop, selective Marketing, and Rest when morale drops. Fundraising is stronger when reputation and traction already support the story.",
          ],
        },
        {
          title: "Mid game: mistakes become expensive",
          body: [
            "From around month six, the tradeoffs sharpen. Hiring speeds product work but raises burn. Marketing creates demand but can increase acquisition pressure. Pivot can rescue weak fit but sacrifices progress and users.",
            "A common failure is treating cash as permission to spend. A large cash balance still disappears if burn grows faster than revenue and runway is ignored.",
          ],
        },
        {
          title: "Late game and Founder League",
          body: [
            "Late game success depends on balance. Product Progress without users is slow, users without revenue are fragile, and revenue without morale can end suddenly.",
            "Founder League adds a 36-month clock, higher burn pressure, tougher events, and score-based ranking. It is less about merely surviving and more about building a valuable company before time runs out.",
          ],
        },
      ],
      related: ["/how-to-play", "/founder-league", "/industries", "/play"],
    },
    "/founders": {
      route: "/founders",
      title: "Founder Types in Startup Zero",
      description:
        "Compare Engineer, Sales, Product, Growth, and Bootstrap founder types and how they change Startup Zero strategy.",
      h1: "Choose a founder style before the first month",
      intro:
        "Founder type is not just flavor text. It changes which actions feel efficient and which weaknesses you must manage.",
      sections: [
        {
          title: "Engineer, Sales, and Product founders",
          body: [
            "Engineer Founders accelerate product progress and handle technical problems better, but marketing and fundraising are less forgiving.",
            "Sales Founders are strong at revenue, customers, and funding conversations, but product progress can lag and burn can rise. Product Founders are balanced, with stronger market fit and safer pivots.",
          ],
        },
        {
          title: "Growth and Bootstrap founders",
          body: [
            "Growth Founders can create user momentum quickly. They are powerful in Game or Marketplace runs, but the same speed can raise burn and morale risk.",
            "Bootstrap Founders are built for survival. Lower burn and steadier morale help long runs, but slower user growth means you must be patient about revenue targets.",
          ],
        },
        {
          title: "How to pick",
          body: [
            "Pick Engineer if you like product-first play, Sales if you want customer and funding leverage, Product if you want balance, Growth if you like volatility, and Bootstrap if you want a disciplined survival route.",
            "The best founder depends on the industry. AI can benefit from product strength, SaaS rewards fit and revenue discipline, and Local Business Tech pairs naturally with steady operators.",
          ],
        },
      ],
      related: ["/industries", "/strategy", "/play"],
    },
    "/industries": {
      route: "/industries",
      title: "Industries in Startup Zero",
      description:
        "Learn how SaaS, Game, AI, Marketplace, and Local Business Tech change growth, revenue, risk, and difficulty.",
      h1: "Industries create different startup shapes",
      intro:
        "Startup Zero uses industries to change the growth curve, revenue model, difficulty, and event mix of each run.",
      sections: [
        {
          title: "SaaS and Local Business Tech",
          body: [
            "SaaS is the standard route: recurring revenue is reliable, but weak product progress or market fit suppresses growth. It teaches the core loop cleanly.",
            "Local Business Tech is easier to read because revenue appears earlier and burn is lower. It is less explosive, but reputation and customer support matter more than viral growth.",
          ],
        },
        {
          title: "Game and AI",
          body: [
            "Game runs are hit-driven. Buzz, reviews, users, and reputation can swing the company quickly. A strong update can change everything, but backlash hurts hard.",
            "AI has high upside and easier fundraising when the story works, but burn and competition pressure are higher. API cost spikes and rival model launches can change the plan.",
          ],
        },
        {
          title: "Marketplace",
          body: [
            "Marketplace is the hardest early route because both demand and supply need traction. Low market fit suppresses revenue, and competition is high.",
            "Once users and fit build together, network effects can make later months very strong. The challenge is surviving long enough for that compounding to matter.",
          ],
        },
      ],
      related: ["/founders", "/strategy", "/founder-league", "/play"],
    },
    "/founder-league": {
      route: "/founder-league",
      title: "Founder League Mode in Startup Zero",
      description:
        "Founder League is Startup Zero's advanced 36-month ranking mode with company valuation, Founder Score, and local records.",
      h1: "Founder League: the 36-month advanced mode",
      intro:
        "Founder League turns Startup Zero into a fixed-length challenge where the goal is to maximize company quality, not just reach a single revenue target.",
      sections: [
        {
          title: "Unlock and rules",
          body: [
            "Founder League unlocks after clearing Normal Mode twice. Until then, the mode appears in setup but cannot be selected.",
            "A league run lasts 36 months. If the company goes bankrupt or morale collapses earlier, the run still ends and receives a score with penalties.",
          ],
        },
        {
          title: "What makes it harder",
          body: [
            "Founder League increases burn pressure, makes bad events more likely, reduces fundraising comfort, and makes competition more important.",
            "The mode adds competition pressure and a main competitor. High pressure makes acquisition and revenue growth harder, so product quality, reputation, and fit become defensive tools.",
          ],
        },
        {
          title: "Founder Score",
          body: [
            "Founder Score combines total assets, company valuation, annualized revenue, users, market fit, reputation, product progress, survival, difficulty bonuses, and penalties.",
            "This makes a balanced company score better than a lopsided one. A high cash balance helps, but a company with revenue, users, trust, and product maturity is valued more strongly.",
          ],
        },
      ],
      related: ["/strategy", "/industries", "/founders", "/play"],
    },
    "/about": {
      route: "/about",
      title: "About Startup Zero",
      description:
        "Startup Zero is an interactive startup simulation built to make runway, market fit, morale, and growth tradeoffs easier to understand.",
      h1: "About Startup Zero",
      intro:
        "Startup Zero was built to turn startup vocabulary into visible decisions: what you fund, what you delay, and what breaks when pressure rises.",
      sections: [
        {
          title: "Why the game exists",
          body: [
            "Many startup concepts are easier to understand when they are connected to consequences. Runway matters more when one hiring decision changes the number of months left.",
            "The game is intentionally compact. A run should be short enough to replay, but detailed enough that cash, growth, morale, product, market, and competition cannot be ignored.",
          ],
        },
        {
          title: "What the simulation includes",
          body: [
            "Startup Zero includes monthly actions, random but weighted events, industry modifiers, founder types, setup choices, monthly reports, mentor analysis, and Founder League ranking.",
            "It is not financial or business advice. It is a learning-oriented browser game about tradeoffs founders often talk about: focus, growth, burn, fit, reputation, and timing.",
          ],
        },
      ],
      related: ["/how-to-play", "/strategy", "/changelog", "/play"],
    },
    "/contact": {
      route: "/contact",
      title: "Contact Startup Zero",
      description:
        "Contact information for Startup Zero feedback, bug reports, privacy questions, and advertising policy concerns.",
      h1: "Contact",
      intro:
        "Use this page for Startup Zero feedback, bug reports, policy questions, or advertising placement concerns.",
      sections: [
        {
          title: "General contact",
          body: [
            "Email: contact@startupzero.app",
            "For gameplay feedback, include the mode, industry, founder type, language, and the month where the issue appeared.",
          ],
        },
        {
          title: "Bug and policy reports",
          body: [
            "For bug reports, include your device, browser, what you clicked, and what happened. Screenshots are useful when the issue is layout-related.",
            "For privacy, advertising, or policy concerns, include the page URL and a short description so the placement or wording can be reviewed.",
          ],
        },
      ],
      related: ["/privacy", "/terms", "/about"],
    },
    "/privacy": {
      route: "/privacy",
      title: "Privacy Policy - Startup Zero",
      description:
        "Startup Zero privacy policy covering browser storage, Google advertising, cookies, analytics, and contact information.",
      h1: "Privacy Policy",
      intro:
        "This policy explains how Startup Zero handles browser storage, advertising, cookies, analytics, and contact requests.",
      sections: [
        {
          title: "Game progress and browser storage",
          body: [
            "Startup Zero stores game progress, language settings, tutorial status, and local Founder League ranking data in the browser when storage is available.",
            "In restricted environments, such as sandboxed embedded game pages, storage may be limited to the current session through a safe in-memory fallback.",
          ],
        },
        {
          title: "Google advertising and cookies",
          body: [
            "The Vercel public version of Startup Zero may use Google AdSense. Google and third-party vendors may use cookies, IP-related data, device identifiers, and similar technologies to serve, measure, and limit ads.",
            "Google advertising cookies may allow ads to be shown based on previous visits to this site or other sites. Users can manage personalized advertising through Google's ad settings and browser cookie controls.",
          ],
        },
        {
          title: "Analytics and improvement",
          body: [
            "Startup Zero includes internal gameplay tracking hooks for actions such as game start, selected action, victory, game over, and language changes. These are designed so analytics services can be added later without changing game logic.",
            "Analytics, if enabled, is used to understand page usage, balance problems, and feature quality. The goal is to improve the game experience, not to sell personal gameplay records.",
          ],
        },
      ],
      related: ["/terms", "/contact", "/about"],
    },
    "/terms": {
      route: "/terms",
      title: "Terms of Use - Startup Zero",
      description:
        "Terms of use for Startup Zero, including simulation limits, saved data, ads, and service availability.",
      h1: "Terms of Use",
      intro:
        "These terms describe the basic rules and limitations for using Startup Zero.",
      sections: [
        {
          title: "Game and simulation limits",
          body: [
            "Startup Zero is a browser-based simulation game. It simplifies startup decisions for play and learning and should not be treated as legal, investment, financial, or business advice.",
            "Game outcomes are fictional and depend on simplified rules, random events, and balancing choices that may change over time.",
          ],
        },
        {
          title: "Saved data",
          body: [
            "Save data and local rankings are stored in the browser when available. Clearing browser data, using private browsing, or playing in restricted embedded environments may remove or limit saved progress.",
            "Local Founder League rankings are local records, not a global leaderboard.",
          ],
        },
        {
          title: "Advertising and availability",
          body: [
            "The public site may display labeled advertisements on content pages. Game controls, setup flows, settings, and other action-oriented screens are kept separate from ad placements.",
            "The service is provided as-is. Features, rules, text, and availability may change as the game evolves.",
          ],
        },
      ],
      related: ["/privacy", "/contact", "/about"],
    },
    "/changelog": {
      route: "/changelog",
      title: "Startup Zero Devlog and Changelog",
      description:
        "Read how Startup Zero has evolved with Founder League, safer storage, monthly results, founder identity, and content-first public pages.",
      h1: "Devlog: how Startup Zero is evolving",
      intro:
        "Startup Zero is developed around playtest feedback: make the company feel personal, make monthly decisions clearer, and make advanced runs replayable.",
      sections: [
        {
          title: "From MVP loop to monthly operating rhythm",
          body: [
            "The earliest version focused on six actions, cash, users, revenue, morale, product progress, market fit, events, and save/load. Later updates added action confirmation, month progress, monthly result screens, and previous-month deltas.",
            "These changes were made because instant number changes felt too abstract. The current flow makes it clearer that a founder chooses a plan, the team executes it, the market reacts, and next month begins with consequences.",
          ],
        },
        {
          title: "Replayability upgrades",
          body: [
            "Industries, founder types, scenarios, traits, and setup flow were added to make runs feel different. The founder and company name fields make each saved run easier to recognize.",
            "Founder League adds a 36-month score challenge, company valuation, competition pressure, and local rankings for players who want more structure after Normal Mode.",
          ],
        },
        {
          title: "Platform and policy work",
          body: [
            "The project now separates the Vercel public version from the CraftNova posting version. Vercel keeps content pages and AdSense support. CraftNova uses a single-file build, no AdSense output, compact layout, and safeStorage for sandboxed environments.",
            "The public version is being reorganized around content-first pages so articles, guides, policies, and game explanation are clearly separate from action-oriented gameplay screens.",
          ],
        },
      ],
      related: ["/about", "/how-to-play", "/founder-league", "/play"],
    },
  },
  ja: {
    "/": {
      route: "/",
      title: "Startup Zero - 起業シミュレーションゲーム",
      description:
        "Startup Zeroは、資金繰り、開発、採用、マーケティング、創業者タイプ、業界差分、創業者リーグを体験できるブラウザ起業シミュレーションです。",
      h1: "1か月ずつ会社を育てる起業シミュレーション",
      intro:
        "Startup Zeroは、毎月ひとつの行動を選び、資金・売上・ユーザー・士気・市場適合度を見ながら会社を成長させる経営ゲームです。",
      ctaLabel: "ゲームを始める",
      ctaHref: "/play",
      sections: [
        {
          title: "このゲームの特徴",
          body: [
            "Startup Zeroは、単なる資源集めではなく、スタートアップらしい圧力を中心に作っています。資金、月間支出、残り運転期間、売上、ユーザー数、チーム士気、開発進捗、市場適合度、評判、競争圧力が、毎月の行動によって変化します。",
            "資金を貯めるだけでは勝てません。市場適合度が低いまま広告を打つと効率が悪く、開発だけを続けると学習が遅れ、採用を急ぎすぎると支出と士気のリスクが増えます。",
          ],
        },
        {
          title: "創業者タイプと業界でプレイ感が変わる",
          body: [
            "技術者、営業、プロダクト、グロース、堅実経営の創業者タイプを選べます。技術者は開発に強く、営業タイプは売上と資金調達に強く、堅実経営タイプは長く生き残りやすい、といった違いがあります。",
            "業界も重要です。SaaSは継続収益と市場適合度、Gameはユーザー急増と評判、AIは高い成長性と高コスト、Marketplaceはネットワーク効果、Local Business Techは安定収益が軸になります。",
          ],
        },
        {
          title: "創業者リーグは上級者向けの挑戦",
          body: [
            "通常モードを2回クリアすると、36か月固定のFounder League / 創業者リーグが解放されます。会社評価額、総資産、売上、ユーザー数、市場適合度、評判、開発進捗、生存状況をもとにFounder Scoreを競います。",
            "創業者リーグは、単に勝利条件を満たすだけでなく、限られた期間でどれだけ価値の高い会社を作れるかを試すモードです。",
          ],
        },
      ],
      related: ["/how-to-play", "/strategy", "/founders", "/industries", "/founder-league", "/play"],
    },
    "/how-to-play": {
      route: "/how-to-play",
      title: "Startup Zeroの遊び方",
      description:
        "Startup Zeroの月次ループ、主要指標、勝利条件、失敗条件、初心者向けの進め方を解説します。",
      h1: "Startup Zeroの遊び方",
      intro:
        "1ターンは1か月です。行動を選び、結果を確認し、イベントを受け止め、次の月に何を優先するかを判断します。",
      sections: [
        {
          title: "毎月の基本ループ",
          body: [
            "まず今月の行動を1つ選びます。行動確認画面で予想される効果を確認し、月が進行し、月次結果画面で数値の変化を読みます。",
            "行動は、資金、売上、ユーザー数、士気、開発進捗、市場適合度、評判、月間支出、競争圧力に影響します。結果画面を見ることで、次の判断理由が分かりやすくなります。",
          ],
        },
        {
          title: "最初に見るべき指標",
          body: [
            "資金は会社に残っているお金です。月間支出は毎月かかる費用で、売上はその支出をどれだけ相殺できるかを示します。残り運転期間は、今のペースであと何か月続けられるかの目安です。",
            "ユーザー数と売上は同じではありません。市場適合度はプロダクトが需要に合っているか、開発進捗は完成度、チーム士気は会社を続けられる状態かを示します。士気が0になると、資金が残っていても事業は止まります。",
          ],
        },
        {
          title: "勝利と失敗",
          body: [
            "通常モードでは、資金と士気を守りながら売上目標に到達することが目的です。資金が0になるか、チーム士気が0になると失敗です。",
            "序盤は学びやすいように少し余裕がありますが、高コストな行動を続ければ破綻します。残り運転期間が短いときは、毎月を成長投資の月にしてよいか慎重に考える必要があります。",
          ],
        },
      ],
      related: ["/strategy", "/founders", "/industries", "/play"],
    },
    "/strategy": {
      route: "/strategy",
      title: "Startup Zero 戦略ガイド",
      description:
        "Startup Zeroの序盤・中盤・終盤、行動選択、よくある失敗、創業者リーグの考え方をゲーム仕様に基づいて解説します。",
      h1: "正解を固定しない戦略ガイド",
      intro:
        "Startup Zeroでは、会社の状態を読むことが重要です。資金、士気、市場適合度、成長圧力によって最適な行動は変わります。",
      sections: [
        {
          title: "序盤: 拡大より学習",
          body: [
            "最初の数か月は、ユーザー数だけを追うよりも、開発進捗と市場適合度を整えることが重要です。市場適合度が低いままマーケティングをすると、ユーザーは増えても売上効率が悪く、支出だけが増えやすくなります。",
            "安定した立ち上がりでは、開発、必要な範囲のマーケティング、士気が落ちたときの休息を組み合わせます。資金調達は、評判や実績があるほど成功しやすくなります。",
          ],
        },
        {
          title: "中盤: 判断ミスが高くつく",
          body: [
            "6か月目以降はトレードオフが強くなります。採用は開発を加速しますが支出を増やします。マーケティングは需要を作りますが、獲得コストが重くなります。ピボットは低い市場適合度を救えますが、進捗とユーザーの一部を失います。",
            "よくある失敗は、資金があることを使ってよい理由と考えてしまうことです。売上より支出の伸びが速いと、大きな資金も短期間で消えます。",
          ],
        },
        {
          title: "終盤と創業者リーグ",
          body: [
            "終盤はバランスが重要です。開発進捗だけでは遅く、ユーザーだけでは収益が不安定で、売上があっても士気が崩れると終わります。",
            "創業者リーグでは36か月の制限、高い支出圧力、厳しいイベント、スコア評価が加わります。生き残るだけでなく、時間内に価値の高い会社を作ることが目的になります。",
          ],
        },
      ],
      related: ["/how-to-play", "/founder-league", "/industries", "/play"],
    },
    "/founders": {
      route: "/founders",
      title: "Startup Zeroの創業者タイプ",
      description:
        "技術者、営業、プロダクト、グロース、堅実経営タイプの特徴と、プレイスタイルの違いを解説します。",
      h1: "最初の1か月の前に、創業者の性格を決める",
      intro:
        "創業者タイプは見た目だけではありません。得意な行動、弱点、立ち上がり方が変わります。",
      sections: [
        {
          title: "技術者・営業・プロダクトタイプ",
          body: [
            "技術者タイプは開発進捗が伸びやすく、技術トラブルにも強めです。一方で、営業や資金調達は少し難しくなります。",
            "営業タイプは顧客獲得、売上、資金調達に強いタイプです。ただし開発面が遅れやすく、支出が上がりやすい点に注意が必要です。プロダクトタイプは市場適合度とピボットに強いバランス型です。",
          ],
        },
        {
          title: "グロース・堅実経営タイプ",
          body: [
            "グロースタイプはユーザー獲得の勢いを作りやすく、GameやMarketplaceのような伸びる時に伸びる業界と相性があります。ただし、支出と士気リスクも高くなります。",
            "堅実経営タイプは長く生き残る力があります。支出を抑えやすく士気も安定しやすい一方で、ユーザー成長は遅めです。",
          ],
        },
        {
          title: "選び方",
          body: [
            "開発から積み上げたいなら技術者、顧客と資金調達を重視するなら営業、バランスを取りたいならプロダクト、急成長を狙うならグロース、生存力を重視するなら堅実経営が向いています。",
            "業界との組み合わせも重要です。AIは開発力、SaaSは市場適合度と売上規律、Local Business Techは安定運営が効きやすくなります。",
          ],
        },
      ],
      related: ["/industries", "/strategy", "/play"],
    },
    "/industries": {
      route: "/industries",
      title: "Startup Zeroの業界システム",
      description:
        "SaaS、Game、AI、Marketplace、Local Business Techの成長曲線、難易度、重要指標の違いを解説します。",
      h1: "業界によって会社の伸び方が変わる",
      intro:
        "Startup Zeroでは、業界ごとに成長曲線、収益モデル、難易度、イベントの出やすさが変わります。",
      sections: [
        {
          title: "SaaSとLocal Business Tech",
          body: [
            "SaaSは標準的なルートです。継続収益が強みですが、開発進捗や市場適合度が低いと売上が伸びにくくなります。基本を学びやすい業界です。",
            "Local Business Techは、早めに売上が立ちやすく支出も低めです。爆発力は控えめですが、評判や顧客対応が重要な安定型の業界です。",
          ],
        },
        {
          title: "GameとAI",
          body: [
            "Gameはヒット依存の業界です。配信者やレビュー、アップデート評価でユーザーと評判が大きく動きます。良い波に乗れば急成長しますが、炎上や評価低下も重いです。",
            "AIは成長性が高く、ストーリーが強いと資金調達もしやすい一方で、開発費やAPIコスト、競争圧力が高くなります。",
          ],
        },
        {
          title: "Marketplace",
          body: [
            "Marketplaceは序盤が難しい業界です。需要側と供給側の両方を伸ばす必要があり、市場適合度が低いと売上も伸びにくくなります。",
            "ただし、ユーザーと市場適合度が噛み合うとネットワーク効果が働き、後半の伸びが強くなります。そこまで生き残れるかが勝負です。",
          ],
        },
      ],
      related: ["/founders", "/strategy", "/founder-league", "/play"],
    },
    "/founder-league": {
      route: "/founder-league",
      title: "Founder League / 創業者リーグ",
      description:
        "創業者リーグは、36か月以内に会社価値とFounder Scoreを最大化するStartup Zeroの上級者向けランキングモードです。",
      h1: "創業者リーグ: 36か月の上級チャレンジ",
      intro:
        "Founder League / 創業者リーグは、単一の売上目標ではなく、会社全体の価値を最大化する固定期間モードです。",
      sections: [
        {
          title: "解放条件とルール",
          body: [
            "創業者リーグは、通常モードを2回クリアすると解放されます。未解放の間もセットアップ画面には表示されますが、選択はできません。",
            "リーグは36か月固定です。途中で資金が尽きたり士気が崩壊した場合も終了し、ペナルティ込みのスコアが記録されます。",
          ],
        },
        {
          title: "何が難しいのか",
          body: [
            "創業者リーグでは、支出圧力、悪いイベント、資金調達の難しさ、競争圧力が通常より重くなります。",
            "主な競合企業と競争圧力が表示され、圧力が高いほどユーザー獲得や売上成長が難しくなります。開発進捗、市場適合度、評判は、競争に対する防御にもなります。",
          ],
        },
        {
          title: "Founder Scoreの考え方",
          body: [
            "Founder Scoreは、総資産、会社評価額、年換算売上、ユーザー数、市場適合度、評判、開発進捗、生存状況、難易度倍率、ペナルティを組み合わせて計算します。",
            "資金だけが多い会社より、売上・ユーザー・信頼・プロダクト成熟度が揃った会社の方が高く評価されます。",
          ],
        },
      ],
      related: ["/strategy", "/industries", "/founders", "/play"],
    },
    "/about": {
      route: "/about",
      title: "Startup Zeroについて",
      description:
        "Startup Zeroは、資金繰り、市場適合度、チーム士気、成長判断を体験しながら学べるブラウザ起業シミュレーションです。",
      h1: "Startup Zeroについて",
      intro:
        "Startup Zeroは、スタートアップ用語をただ読むのではなく、選択と結果で理解するためのブラウザゲームです。",
      sections: [
        {
          title: "なぜ作ったか",
          body: [
            "残り運転期間や月間支出は、実際に1つの採用判断で何か月減るかを見ると理解しやすくなります。",
            "このゲームは短く遊べることを重視しつつ、資金、成長、士気、プロダクト、市場、競争を無視できないように設計しています。",
          ],
        },
        {
          title: "シミュレーションに含まれる要素",
          body: [
            "月次行動、状態に応じたイベント、業界補正、創業者タイプ、セットアップ、月次レポート、メンター分析、創業者リーグのランキングを含んでいます。",
            "これは金融・投資・経営助言ではありません。集中、成長、支出、市場適合、評判、タイミングといった判断を体験するための学習寄りのゲームです。",
          ],
        },
      ],
      related: ["/how-to-play", "/strategy", "/changelog", "/play"],
    },
    "/contact": {
      route: "/contact",
      title: "Startup Zero お問い合わせ",
      description:
        "Startup Zeroへのフィードバック、バグ報告、プライバシー、広告ポリシーに関する問い合わせ先です。",
      h1: "お問い合わせ",
      intro:
        "Startup Zeroへのフィードバック、バグ報告、ポリシー関連の連絡はこちらをご確認ください。",
      sections: [
        {
          title: "連絡先",
          body: [
            "メール: contact@startupzero.app",
            "ゲーム内容のフィードバックでは、モード、業界、創業者タイプ、言語設定、問題が起きた月を添えてください。",
          ],
        },
        {
          title: "バグ報告とポリシー関連",
          body: [
            "バグ報告では、端末、ブラウザ、クリックした内容、実際に起きたことを記載してください。表示崩れの場合はスクリーンショットが役立ちます。",
            "プライバシー、広告、ポリシーに関する連絡では、対象ページのURLと懸念点の概要を記載してください。",
          ],
        },
      ],
      related: ["/privacy", "/terms", "/about"],
    },
    "/privacy": {
      route: "/privacy",
      title: "プライバシーポリシー - Startup Zero",
      description:
        "Startup Zeroにおけるブラウザ保存、Google広告、Cookie、アクセス解析、問い合わせ情報の扱いについて説明します。",
      h1: "プライバシーポリシー",
      intro:
        "このページでは、Startup Zeroのブラウザ保存、広告、Cookie、アクセス解析、問い合わせ対応について説明します。",
      sections: [
        {
          title: "ゲーム進行とブラウザ保存",
          body: [
            "Startup Zeroは、利用可能な場合、ゲーム進行、言語設定、チュートリアル既読、ローカルの創業者リーグランキングをブラウザに保存します。",
            "埋め込み型ゲームサイトなど保存が制限された環境では、safeStorageによりプレイ中のみの一時保存に切り替わることがあります。",
          ],
        },
        {
          title: "Google広告とCookie",
          body: [
            "Vercel公開版のStartup Zeroでは、Google AdSenseを利用して広告を表示する場合があります。Googleおよび第三者配信事業者は、広告配信、測定、頻度制御、不正防止のためにCookie、IPに関連する情報、端末識別子、類似技術を使用することがあります。",
            "Googleの広告Cookieにより、このサイトや他サイトへの過去の訪問情報に基づく広告が表示される場合があります。パーソナライズ広告はGoogleの広告設定やブラウザのCookie設定から管理できます。",
          ],
        },
        {
          title: "アクセス解析と改善",
          body: [
            "Startup Zeroには、ゲーム開始、行動選択、勝利、ゲームオーバー、言語変更などを記録できる内部トラッキング用の構造があります。将来の解析サービス導入時にも、ゲームロジックを壊さず接続できるようにしています。",
            "解析を利用する場合は、ページ利用状況、ゲームバランス、機能改善の把握を目的とします。個人のプレイ記録を販売する目的ではありません。",
          ],
        },
      ],
      related: ["/terms", "/contact", "/about"],
    },
    "/terms": {
      route: "/terms",
      title: "利用規約 - Startup Zero",
      description:
        "Startup Zeroの利用条件、シミュレーション上の注意、保存データ、広告、提供条件について説明します。",
      h1: "利用規約",
      intro:
        "このページでは、Startup Zeroを利用する際の基本的な条件と注意事項を説明します。",
      sections: [
        {
          title: "ゲームとシミュレーションの限界",
          body: [
            "Startup Zeroはブラウザ上で遊べるシミュレーションゲームです。起業判断を簡略化して表現しており、法律、投資、金融、経営に関する助言ではありません。",
            "ゲーム結果は架空のものであり、簡略化されたルール、ランダムイベント、バランス調整に基づきます。仕様は変更されることがあります。",
          ],
        },
        {
          title: "保存データ",
          body: [
            "セーブデータやローカルランキングは、利用可能な場合にブラウザへ保存されます。ブラウザデータの削除、プライベートブラウズ、保存が制限された埋め込み環境では、進行状況が消えたり保存されない場合があります。",
            "創業者リーグランキングは、現在使用中のブラウザ内のローカル記録であり、全プレイヤー共通のランキングではありません。",
          ],
        },
        {
          title: "広告と提供条件",
          body: [
            "公開サイトでは、本文ページにラベル付きの広告を表示する場合があります。ゲーム操作、セットアップ、設定など行動目的の画面とは広告配置を分離します。",
            "本サービスは現状有姿で提供されます。機能、ルール、文章、提供状況は、改善に伴って変更される場合があります。",
          ],
        },
      ],
      related: ["/privacy", "/contact", "/about"],
    },
    "/changelog": {
      route: "/changelog",
      title: "Startup Zero 開発ログ",
      description:
        "Startup Zeroが、創業者リーグ、安全な保存、月次結果、会社名設定、公開ページ整備を通じてどのように改善されてきたかを記録します。",
      h1: "開発ログ: Startup Zeroの改善履歴",
      intro:
        "Startup Zeroは、プレイテストの反応をもとに、会社を運営している感覚、月次判断の分かりやすさ、上級者向けのリプレイ性を強化してきました。",
      sections: [
        {
          title: "MVPのゲームループから月次経営へ",
          body: [
            "初期版は、6つの行動、資金、ユーザー、売上、士気、開発進捗、市場適合度、イベント、セーブ/ロードを中心にしていました。その後、行動確認、月進行演出、月次結果、前月比表示を追加しました。",
            "数値が突然変わるだけでは経営感が弱かったため、現在は創業者が方針を決め、チームが実行し、市場が反応し、翌月に結果が残る流れを明確にしています。",
          ],
        },
        {
          title: "リプレイ性の強化",
          body: [
            "業界、創業者タイプ、シナリオ、特性、ステップ式セットアップを追加し、毎回の会社づくりが変わるようにしました。社長名と会社名の入力により、セーブごとの愛着と識別もしやすくなっています。",
            "創業者リーグでは、36か月のスコアチャレンジ、会社評価額、競争圧力、ローカルランキングを追加し、通常モード後の目標を作りました。",
          ],
        },
        {
          title: "公開環境とポリシー対応",
          body: [
            "現在はVercel公開版とCraftNova投稿版を分けています。Vercel版は公開本文ページとAdSense対応を維持し、CraftNova版は単体HTML、AdSenseなし、コンパクトUI、sandbox環境向けsafeStorageを使います。",
            "公開版は、ゲーム操作画面と本文ページを分離し、攻略・遊び方・業界・創業者・ポリシー情報を読めるページとして整理しています。",
          ],
        },
      ],
      related: ["/about", "/how-to-play", "/founder-league", "/play"],
    },
  },
};

export const getPublicPage = (language: Language, route: PublicRoute) =>
  publicPages[language][route] ?? publicPages.en[route];

