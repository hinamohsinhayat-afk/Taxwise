# TaxWise AI

TaxWise AI is a full-stack AI-powered tax software recommendation web app built for a job application assignment. It combines a deterministic product matching wizard with a Groq-powered assistant and a polished dark-first interface for comparing Canadian tax software tiers.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn-style source components
- next-themes
- Groq SDK with `llama-3.3-70b-versatile`
- Lucide React icons
- Vitest (unit testing)

## Setup

```bash
npm install
npm run dev
```

Create `.env.local` in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

The assistant falls back to a local rule-based simulation when the key is not configured, so the full app remains reviewable.

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page with animated hero, stats, product preview, FAQ |
| `/products` | Filterable and sortable product catalog |
| `/compare` | Full feature comparison table for all 8 products |
| `/recommend` | 6-step recommendation wizard with conditional corporate revenue step |
| `/assistant` | Groq-powered multi-turn AI assistant |
| `/admin/products` | Product config inspector, schema validation, JSON export |
| `GET /api/products` | Returns all product records |
| `POST /api/recommend` | Accepts `WizardAnswers`, returns `RecommendationResult` |
| `POST /api/assistant` | Accepts `{ question, conversationHistory }`, returns structured assistant JSON |

## Recommendation Engine

All product data is stored in `src/lib/products.ts`. The recommendation engine lives in `src/lib/recommendation-engine.ts` and is a pure function with no UI imports.

Priority order:

1. Incorporated with no revenue -> Nil Corporate Return
2. Incorporated with revenue -> Business Corporate
3. Expert files for user -> Expert Full Service
4. Expert help/review -> Expert Assist
5. Freelance, gig work, business, home-office, or vehicle expenses -> Self-Employed
6. Investment, capital gains, rental, or foreign income -> Premier
7. Medical, donations, or employment expenses -> Deluxe
8. Default simple salary/student filing -> Free

The engine also detects contradictory deduction inputs, such as selecting `No special deductions` plus a specific deduction, and prioritizes the specific deduction.

## AI Assistant

The assistant route uses the Groq SDK server-side only and calls `llama-3.3-70b-versatile` with `max_tokens: 1024`. The system prompt includes all products, prices, supported use cases, recommendation rules, and safety instructions.

Safety behavior:

- Never guarantees refunds
- Never gives legal, tax, or financial advice
- Always explains recommendations with "Based on the provided product rules..."
- Always includes a disclaimer
- Returns structured JSON with `answer`, `recommendedProduct`, `confidence`, `reasons`, and `disclaimer`

The chat UI supports multi-turn history, starter chips, simulated typing, timestamps, local history persistence, recommended product badges, and a clear chat action.

## Admin Page

`/admin/products` shows all product fields in table or card view. It validates each product against the required schema, color-codes supported versus unsupported features, and exports the catalog as `products.json`.

## Manual Verification

| Scenario | Expected Result |
|---|---|
| Salary only | Free |
| Salary + donations | Deluxe |
| Investment income | Premier |
| Rental income | Premier |
| Freelance income | Self-Employed |
| Home-office expenses | Self-Employed |
| Wants expert help | Expert Assist |
| Wants expert to file | Expert Full Service |
| Incorporated + revenue | Business Corporate |
| Incorporated + no revenue | Nil Corporate Return |
| AI asked refund guarantee | Safe disclaimer response |

## Automated Testing (Bonus Feature)

A comprehensive Vitest unit test suite covers all 9 mandatory tax evaluation scenarios and edge-case contradictions, validating the recommendation engine's correctness and priority override chain.

Run tests locally using:

```bash
npm run test
```

**Test Coverage (42 tests across 9 scenarios):**

| Scenario | Tests |
|---|---|
| Salary only → Free | 3 |
| Salary + donations → Deluxe | 4 |
| Investment/Rental income → Premier | 5 |
| Freelance/Home-office → Self-Employed | 6 |
| Expert help → Expert Assist (override) | 3 |
| Expert file → Expert Full Service (override) | 3 |
| Incorporated + revenue → Business Corporate | 3 |
| Incorporated + no revenue → Nil Corporate Return | 3 |
| Contradictory deductions (edge case) | 4 |
| Structural integrity (bonus) | 8 |

Test artifacts are output to `test-results/`:
- `test-results.json` — machine-readable JSON report
- `test-results.txt` — human-readable summary

## Known Limitations

- Product data is static and file-based.
- The app does not prepare or file real tax returns.
- The AI assistant is constrained to product guidance and should not be treated as tax advice.
- Chat persistence uses browser localStorage rather than user accounts.
- Live Groq responses require a valid `GROQ_API_KEY`.

## Future Improvements

- Add authenticated admin editing for product configuration.
- Add end-to-end tests for wizard and assistant flows.
- Add analytics for common recommendation paths.
- Add user accounts for saved chat and recommendation history.

## AI Usage Disclosure

This project uses AI-assisted development for implementation support and uses Groq's `llama-3.3-70b-versatile` model at runtime for the assistant feature. The deterministic recommendation engine remains rule-based and auditable.
This project uses AI-assisted development for implementation support and uses Groq's `llama-3.3-70b-versatile` model at runtime for the assistant feature. The deterministic recommendation engine remains rule-based and auditable.
