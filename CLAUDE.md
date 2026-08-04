# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**Cutout** — a background-removal web app. Upload an image, get a transparent
PNG back. Monorepo with two independent halves:

```
frontend/    React 18 + Vite 5, plain CSS, Axios, React Router 6
backend/     FastAPI + rembg (Python)
```

Each half installs, runs, and deploys on its own. There is no shared build step
and no workspace tooling tying them together.

## Commands

Always `cd` into the right half first — running npm from the repo root will not
find `package.json`.

```bash
# Frontend
cd frontend
npm install
npm run dev        # http://localhost:5173, opens automatically
npm run build      # -> frontend/dist
npm run preview    # serve the production build

# Backend
cd backend
python -m venv venv
venv\Scripts\activate            # Windows; use source venv/bin/activate on Unix
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Note: `rembg[cpu]` pulls in ONNX Runtime and downloads a model on first
inference, so the initial backend install is slow (hundreds of MB) and the first
request takes noticeably longer than later ones.

There is **no test suite and no linter configured**. Don't invent commands for
them; verify with `npm run build` and by exercising the UI.

## The API contract

One endpoint. Both halves are written against it, so change them together.

```
POST /remove-background
  request:  multipart/form-data  { image: File }
  success:  200 image/png  (binary, transparent background)
  errors:   JSON { detail: "..." } with 400 / 413 / 415 / 500
```

Validation is deliberately duplicated on both sides — PNG/JPG/WEBP only, 10 MB
cap, empty-file rejection. The client copy gives instant feedback; the server
copy is the one that actually protects the service. **Keep the two in sync**:
`frontend/src/services/api.js` (`ACCEPTED_TYPES`, `MAX_FILE_SIZE`) and
`backend/app/utils.py` (same names).

### Mock mode

`VITE_USE_MOCK_API` controls whether requests are real:

- `true` — `removeBackground()` resolves locally after ~2.2s and returns the
  original file untouched. The entire UI flow works with no backend running.
- `false` — real HTTP. This is what `frontend/.env.local` currently sets.

With `VITE_API_BASE_URL` empty, requests go to `/api` and Vite's dev proxy
forwards them to `localhost:8000`, **stripping the `/api` prefix** because
FastAPI mounts its routes at the root. That rewrite is in `vite.config.js` and
is easy to break — if you change the base path, change the rewrite too.

Mock mode only affects the dev experience; it has no effect on a production
build unless the env var is set at build time.

## Architecture notes

### Frontend layout

```
src/
├── components/   reusable, page-agnostic UI (Button, Dropzone, Loader, …)
├── sections/     landing-page sections (Hero, Features, HowItWorks, Faq, Contact)
├── pages/        route components (Landing, RemoveBackground, NotFound)
├── services/     api.js — Axios client, validation, error mapping, mock
├── App.jsx       routes + scroll management
└── index.css     design tokens, reset, primitives, animations
```

Conventions worth preserving:

- **Styles live beside components.** Every `Foo.jsx` has a `Foo.css` that the
  component imports itself. No global stylesheet beyond `index.css`.
- **`index.css` owns the design system** — CSS custom properties for colour,
  radii, shadows, motion, plus shared primitives (`.container`, `.card`,
  `.section`, `.eyebrow`, `.checkerboard`) and every `@keyframes`. Add tokens
  there rather than hardcoding values in component CSS.
- **No Tailwind, no CSS-in-JS, no UI library.** Plain CSS is a project
  requirement, not an accident.
- **Icons are inline SVG** in `components/Icons.jsx`, coloured via
  `currentColor`. Add new ones there instead of adding a dependency.
- `Button` renders as `<button>`, a router `<Link>`, or an `<a>` depending on
  whether it gets `to` or `href`. Reach for it before writing a bare button.
- `Reveal` wraps content in an IntersectionObserver-driven fade-up. It's the
  standard way sections animate in.

### Things that will bite you

- **Object URLs must be revoked.** `RemoveBackgroundPage` tracks every
  `URL.createObjectURL` in a ref and revokes on reset and unmount. Preserve
  that when touching the upload flow, or repeated uploads leak memory.
- **Error responses arrive as Blobs.** The image request uses
  `responseType: 'blob'`, which applies to error bodies too — so FastAPI's
  `{detail: ...}` JSON has to be read out of a Blob (`readBlobErrorDetail`).
- **Framework error text is filtered.** `usableDetail()` drops generic
  boilerplate ("Not Found", "Internal Server Error") because those mean the
  route is missing or misconfigured — a deployment bug, not something a visitor
  can act on. Only bypass this if you're sure the string is user-facing.
- **The contact form does not POST anywhere.** There is no `/contact` endpoint.
  `sendContactMessage()` builds a `mailto:` draft addressed to `CONTACT_EMAIL`
  and navigates to it, so nothing is silently dropped. Don't "fix" it into a
  fetch call without adding a real endpoint.
- **CORS is an explicit allowlist** in `backend/app/main.py`. A new frontend
  origin (including a deployed one) must be added there or requests fail.

## Responsive and accessibility requirements

Mobile-first is a hard requirement: base rules target phones, media queries
scale up. Breakpoints in use are 600 / 640 / 768 / 860 / 900 / 1024px — reuse
them rather than introducing new ones.

Non-negotiables when editing UI:

- No horizontal scrolling at any width. Long filenames truncate or wrap; they
  never widen the layout.
- Touch targets stay at 44px+ (buttons are 48px by default).
- Inputs stay at 16px minimum, otherwise iOS Safari zooms on focus.
- Hover effects go inside `@media (hover: hover)` so phones don't get stuck
  hover states.
- `prefers-reduced-motion` is honoured globally in `index.css`. Don't add
  animations that escape it.
- Keep the accessibility wiring intact: skip link, labelled fields with
  `aria-invalid`/`aria-describedby`, `role="alert"` on errors, `aria-expanded`/
  `aria-controls` on the accordion and mobile drawer, Escape to close the
  drawer, and a keyboard-operable dropzone (it's a real `<button>`, so the file
  picker opens without dragging).

## Deployment

`vercel.json` (frontend) and `Procfile` / `railway.toml` / `runtime.txt`
(backend) are checked in; `DEPLOYMENT.md` has the details. When deploying,
remember the two coupled settings: the frontend's `VITE_API_BASE_URL` must
point at the deployed backend, and that frontend's origin must be in the
backend's CORS allowlist.
