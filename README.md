<div align="center">

<!-- Animated Banner -->
<img src="https://capsule-render.vercel.app/api?type=shark&color=0:07111f,50:0f4c75,100:07111f&height=200&section=header&text=TAXWISE%20AI&fontSize=72&fontColor=ffffff&animation=twinkling&fontAlignY=45&desc=AI-Powered%20Tax%20Software%20Recommendation%20Engine&descAlignY=68&descSize=20&descColor=93c5fd" width="100%"/>

<!-- Typing Animation -->
<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=800&size=22&duration=2600&pause=700&color=60A5FA&center=true&vCenter=true&repeat=true&width=820&height=55&lines=%F0%9F%A7%BE+Canadian+Tax+Software+Recommendation+System;%F0%9F%A4%96+Groq+LLaMA+3.3+AI+Assistant+%2B+Rule+Engine;%F0%9F%8E%AF+Smart+6-Step+Wizard+%2B+Product+Comparison;%F0%9F%9A%80+Next.js+14+%2B+TypeScript+%2B+Tailwind+CSS" alt="Typing SVG" />
</a>

<br/>

<!-- Badges -->
<p>
  <img src="https://img.shields.io/badge/FRAMEWORK-NEXT.JS%2014-000000?style=for-the-badge&logo=nextdotjs&logoColor=white&labelColor=07111f" />
  <img src="https://img.shields.io/badge/LANGUAGE-TYPESCRIPT-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=07111f" />
  <img src="https://img.shields.io/badge/AI-GROQ%20%2F%20LLAMA%203.3-FF4B4B?style=for-the-badge&logo=meta&logoColor=white&labelColor=07111f" />
  <img src="https://img.shields.io/badge/STATUS-READY-22c55e?style=for-the-badge&logo=statuspage&logoColor=white&labelColor=07111f" />
</p>

<p>
  <img src="https://img.shields.io/badge/STYLING-TAILWIND%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=07111f" />
  <img src="https://img.shields.io/badge/TESTING-VITEST%20%2842%20TESTS%29-6E9F18?style=for-the-badge&logo=vitest&logoColor=white&labelColor=07111f" />
  <img src="https://img.shields.io/badge/DOMAIN-CANADIAN%20TAX%20SOFTWARE-f97316?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=07111f" />
</p>

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> IMAGE.PREVIEW — SCREENSHOTS`

<!-- Upload your screenshots to this repo and replace the URLs below -->
<img width="952" height="401" alt="image" src="https://github.com/user-attachments/assets/a3b3247e-ed51-4f66-a30e-32b3df735223" />


<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> SYSTEM.INIT — WHAT IS THIS PROJECT?`

**TaxWise AI** is a full-stack AI-powered tax software recommendation web app. It combines a deterministic product-matching wizard with a Groq-powered AI assistant and a polished dark-first interface for comparing Canadian tax software tiers.

The recommendation engine is a pure, rule-based function with no UI imports — fully auditable and testable. The AI assistant layer adds natural language interaction on top, powered by `llama-3.3-70b-versatile` via the Groq SDK, with structured JSON responses and built-in safety guardrails.

<br/>

<div align="center">

|         `MODULE`          | `ROLE`                                                                          |   `STATE`   |
| :-----------------------: | :------------------------------------------------------------------------------ | :---------: |
|    🧭 Wizard Engine       | 6-step recommendation flow with conditional corporate revenue step              | `✅ ACTIVE` |
|    🤖 Groq AI Assistant   | Multi-turn LLaMA 3.3 assistant with structured JSON output and safety rules     | `🟢 ONLINE` |
|    📦 Product Catalog     | 8 Canadian tax software tiers with filtering, sorting, and comparison           | `✅ READY`  |
|    📊 Recommendation API  | Pure rule-based engine (`POST /api/recommend`) with priority chain              | `⚡ LIVE`   |
|    🛡️ Admin Inspector     | Schema validation, card/table view, and JSON export for all products            | `⚡ LIVE`   |
|    🧪 Vitest Test Suite   | 42 tests across 9 scenarios covering engine correctness and edge cases          | `✅ PASSING` |

</div>

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> RECOMMENDATION.PIPELINE — HOW IT WORKS`

```
╔══════════════════════════════════════════════════════════════════╗
║             TAXWISE AI — RECOMMENDATION EXECUTION FLOW          ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║   [01]  🧭  USER WIZARD (6 STEPS)                                ║
║         └─► Collects income type, deductions, filing needs       ║
║         └─► Conditional corporate revenue step for corps         ║
║                                                                  ║
║   [02]  ⚙️  RECOMMENDATION ENGINE                                ║
║         └─► Pure function in recommendation-engine.ts            ║
║         └─► Priority chain: Corporate → Expert → Freelance       ║
║         └─► → Premier → Deluxe → Free                           ║
║         └─► Detects contradictory deduction inputs               ║
║                                                                  ║
║   [03]  🤖  GROQ AI ASSISTANT (OPTIONAL)                         ║
║         └─► LLaMA 3.3 70B called server-side via Groq SDK        ║
║         └─► System prompt includes all products + safety rules   ║
║         └─► Returns structured JSON with answer + confidence     ║
║                                                                  ║
║   [04]  📊  RESULT RENDERING                                      ║
║         └─► Recommended product badge + confidence score         ║
║         └─► Reasons listed with always-present disclaimer        ║
║                                                                  ║
║   [05]  🛡️  ADMIN VALIDATION                                     ║
║         └─► Schema checks, color-coded features, JSON export     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> ENGINE.SPEC — RECOMMENDATION PRIORITY CHAIN`

<div align="center">

| `PRIORITY` | `CONDITION`                                         | `RECOMMENDED PRODUCT`      |
| :--------: | :-------------------------------------------------- | :------------------------: |
| 🥇 1       | Incorporated + no revenue                           | `Nil Corporate Return`     |
| 🥈 2       | Incorporated + revenue                              | `Business Corporate`       |
| 🥉 3       | Expert files for user                               | `Expert Full Service`      |
|  4         | Expert help or review requested                     | `Expert Assist`            |
|  5         | Freelance / gig / business / home-office / vehicle  | `Self-Employed`            |
|  6         | Investment / capital gains / rental / foreign income| `Premier`                  |
|  7         | Medical / donations / employment expenses           | `Deluxe`                   |
|  8         | Default — simple salary or student filing           | `Free`                     |

</div>

> ⚠️ Contradictory deduction inputs (e.g. `No special deductions` + a specific deduction selected) are detected automatically — the specific deduction always takes priority.

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> STACK.LOAD — TECHNOLOGIES`

<div align="center">

<img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
<img src="https://img.shields.io/badge/Groq_SDK-FF4B4B?style=for-the-badge&logo=meta&logoColor=white" />
<img src="https://img.shields.io/badge/LLaMA_3.3_70B-6d28d9?style=for-the-badge&logo=meta&logoColor=white" />
<img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" />
<img src="https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/next--themes-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />

</div>

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> LOCAL.SETUP — RUN IT ON YOUR MACHINE`

```bash
# Clone the repository
git clone <your-repo-url>
cd taxwise-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

Create `.env.local` in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> 💡 The assistant falls back to a local rule-based simulation when the key is not configured — the full app remains reviewable without a Groq account.

```bash
# Run the test suite
npm run test
```

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> API.ROUTES — BACKEND ENDPOINTS`

| `METHOD` | `ROUTE`            | `DESCRIPTION`                                                               |
| :------: | :----------------- | :-------------------------------------------------------------------------- |
|  `GET`   | `/`                | Landing page — animated hero, stats, product preview, FAQ                   |
|  `GET`   | `/products`        | Filterable and sortable product catalog                                     |
|  `GET`   | `/compare`         | Full feature comparison table for all 8 products                            |
|  `GET`   | `/recommend`       | 6-step wizard with conditional corporate revenue step                       |
|  `GET`   | `/assistant`       | Groq-powered multi-turn AI assistant UI                                     |
|  `GET`   | `/admin/products`  | Product config inspector, schema validation, JSON export                    |
|  `GET`   | `/api/products`    | Returns all product records                                                 |
|  `POST`  | `/api/recommend`   | Accepts `WizardAnswers`, returns `RecommendationResult`                     |
|  `POST`  | `/api/assistant`   | Accepts `{ question, conversationHistory }`, returns structured JSON        |

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> TEST.COVERAGE — VITEST SUITE`

```
╔══════════════════════════════════════════════════════════════════╗
║              AUTOMATED TEST COVERAGE  —  42 TESTS               ║
╠══════════════════════════════════════════════════════════════════╣
║  Salary only → Free                             3 tests          ║
║  Salary + donations → Deluxe                    4 tests          ║
║  Investment / Rental income → Premier           5 tests          ║
║  Freelance / Home-office → Self-Employed        6 tests          ║
║  Expert help → Expert Assist (override)         3 tests          ║
║  Expert file → Expert Full Service (override)   3 tests          ║
║  Incorporated + revenue → Business Corporate    3 tests          ║
║  Incorporated + no revenue → Nil Corporate      3 tests          ║
║  Contradictory deductions (edge case)           4 tests          ║
║  Structural integrity (bonus)                   8 tests          ║
╚══════════════════════════════════════════════════════════════════╝
```

Test artifacts are output to `test-results/`:
- `test-results.json` — machine-readable JSON report
- `test-results.txt` — human-readable summary

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> MANUAL.VERIFY — SCENARIO MATRIX`

<div align="center">

| `SCENARIO`                         | `EXPECTED RESULT`          |
| :--------------------------------- | :------------------------: |
| Salary only                        | `Free`                     |
| Salary + donations                 | `Deluxe`                   |
| Investment income                  | `Premier`                  |
| Rental income                      | `Premier`                  |
| Freelance income                   | `Self-Employed`            |
| Home-office expenses               | `Self-Employed`            |
| Wants expert help                  | `Expert Assist`            |
| Wants expert to file               | `Expert Full Service`      |
| Incorporated + revenue             | `Business Corporate`       |
| Incorporated + no revenue          | `Nil Corporate Return`     |
| AI asked refund guarantee          | `Safe disclaimer response` |

</div>

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> AI.SAFETY — ASSISTANT GUARDRAILS`

The Groq assistant is constrained by a strict system prompt that includes all products, prices, supported use cases, recommendation rules, and safety instructions.

- 🚫 Never guarantees refunds
- 🚫 Never gives legal, tax, or financial advice
- ✅ Always explains recommendations with `"Based on the provided product rules..."`
- ✅ Always includes a disclaimer
- ✅ Returns structured JSON: `answer`, `recommendedProduct`, `confidence`, `reasons`, `disclaimer`

The chat UI supports multi-turn history, starter chips, simulated typing, timestamps, local history persistence, recommended product badges, and a clear chat action.

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> PROJECT.STRUCTURE — REPO LAYOUT`

```text
taxwise-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Landing page
│   │   ├── products/page.tsx         # Product catalog
│   │   ├── compare/page.tsx          # Comparison table
│   │   ├── recommend/page.tsx        # 6-step wizard
│   │   ├── assistant/page.tsx        # AI chat UI
│   │   ├── admin/products/page.tsx   # Admin inspector
│   │   └── api/
│   │       ├── products/route.ts
│   │       ├── recommend/route.ts
│   │       └── assistant/route.ts
│   └── lib/
│       ├── products.ts               # Static product data
│       └── recommendation-engine.ts  # Pure rule-based engine
├── test-results/
│   ├── test-results.json
│   └── test-results.txt
├── .env.local
└── README.md
```

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> KNOWN.LIMITS — CURRENT CONSTRAINTS`

- Product data is static and file-based
- The app does not prepare or file real tax returns
- The AI assistant is constrained to product guidance and should not be treated as tax advice
- Chat persistence uses browser `localStorage` rather than user accounts
- Live Groq responses require a valid `GROQ_API_KEY`

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> FUTURE.ROADMAP — IMPROVEMENTS`

- Add authenticated admin editing for product configuration
- Add end-to-end tests for wizard and assistant flows
- Add analytics for common recommendation paths
- Add user accounts for saved chat and recommendation history

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> CONTRIBUTION.PROTOCOL — GET INVOLVED`

Contributions are welcome. Useful improvements include expanded tax scenario coverage, improved AI prompting, UI refinements, and deployment hardening.

```bash
git checkout -b feature/your-improvement
git add .
git commit -m "feat: describe your change"
git push origin feature/your-improvement
```

### Good contribution ideas

- Add more Canadian tax product tiers or scenarios
- Improve recommendation engine accuracy and edge-case handling
- Add explainability overlays for wizard decisions
- Improve deployment docs and environment pinning
- Add batch recommendation support via API

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

## `> AI.DISCLOSURE — TRANSPARENCY`

This project uses AI-assisted development for implementation support and uses Groq's `llama-3.3-70b-versatile` model at runtime for the assistant feature. The deterministic recommendation engine remains rule-based and fully auditable.

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" width="100%"/>

<div align="center">

<!-- Footer Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:07111f,40:0d2137,70:0f4c75,100:07111f&height=200&section=footer&text=HINA%20MOHSIN&fontSize=52&fontColor=ffffff&animation=twinkling&fontAlignY=45&desc=Next.js%2014%20%E2%80%A2%20Groq%20LLaMA%203.3%20%E2%80%A2%20TypeScript%20%E2%80%A2%20Vitest&descAlignY=68&descSize=16&descColor=93c5fd" width="100%"/>

<br/>

<!-- Skill Capsules -->
<img src="https://capsule-render.vercel.app/api?type=soft&color=0:07111f,100:0f4c75&height=60&text=Next.js%2014%20%20%7C%20%20TypeScript%20%20%7C%20%20Tailwind%20CSS%20%20%7C%20%20Framer%20Motion&fontSize=18&fontColor=93c5fd&animation=fadeIn" width="80%"/>

<br/>

<img src="https://capsule-render.vercel.app/api?type=soft&color=0:07111f,100:0f4c75&height=60&text=Groq%20SDK%20%20%7C%20%20LLaMA%203.3%20%20%7C%20%20Vitest%20%20%7C%20%20Rule-Based%20AI&fontSize=18&fontColor=93c5fd&animation=fadeIn" width="80%"/>

<br/><br/>

<!-- Static info badges -->
<img src="https://img.shields.io/badge/FOCUS-AI%20%2F%20Full--Stack%20Web-60a5fa?style=for-the-badge&labelColor=07111f" />
&nbsp;
<img src="https://img.shields.io/badge/DOMAIN-Canadian%20Tax%20Software-f97316?style=for-the-badge&labelColor=07111f" />
&nbsp;
<img src="https://img.shields.io/badge/STACK-Next.js%20%2F%20Groq%20%2F%20TypeScript-22c55e?style=for-the-badge&labelColor=07111f" />

<br/><br/>

<sub>⭐ Star this repo if it helped you — it keeps the project alive and visible.</sub>

</div>
