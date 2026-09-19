# The Specialty Atlas 🫀

**Every residency, every fellowship, every country — mapped, scored and stress-tested for internationally trained doctors (IMGs).**

A fast, dependency-free static site: 50 core medical specialties scored against a weighted rubric, 238 fellowships catalogued, 15 destination countries compared, and step-by-step IMG routes — fresh MD abroad vs home-board-first, and how specialty choice actually works in each system.

## FLAT EDITION — nothing to break

Every page is a **fully self-contained HTML file** (all styles and scripts are inlined). There are **no folders and no dependencies** — upload these files anywhere and they just work.

| Page | What's on it |
|---|---|
| `index.html` | The verdict, personalized Top-10 with reasoning, profile, key sourced stats |
| `specialties.html` | 50 core specialties in full depth — searchable, sortable, filterable |
| `countries.html` | 15 country dossiers + master comparison table + passport reality check |
| `routes.html` | Home-base strategy, 7 IMG routes, Path A/B matrix, specialty-choice mechanisms |
| `catalog.html` | 238 fellowships — search + sort |
| `ai.html` | The AI-boom dozen, the augmentation paradox, positioning plan |
| `method.html` | Rubric, legends, every sourced number, disclaimers |

## Deploy on GitHub Pages (5 minutes)

1. Create a **public** repository (e.g. `specialty-atlas`) — do NOT tick any "add README" box.
2. On the repo page: **Add file → Upload files** → select **all files** from this folder → **Commit changes**.
3. **Settings → Pages → Build and deployment** → Source: **Deploy from a branch** → Branch: **main**, folder: **/ (root)** → Save.
4. Wait ~1 minute → your site is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.
5. Optional: edit `sitemap.xml` and `robots.txt` (pencil icon) and replace `YOUR-USERNAME` with your real username.

That's it. No build step, no folders, no npm.

## Optional later: the live "pulse"

The footer has a slot for anonymous page-view counts + feedback via an Appwrite backend. Ask for the Appwrite pack when you're ready — the site runs 100% without it.

## Data provenance

All figures are planning estimates from public 2024–26 sources listed in `method.html`. Not career or financial advice.
