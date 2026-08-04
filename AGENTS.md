# AGENTS.md

Instructions for AI coding agents working in this repository. Tool-agnostic —
Claude Code readers should also see [CLAUDE.md](CLAUDE.md), which covers the
same ground in more depth.

## Project

**Cutout** — background-removal web app. Upload an image, get a transparent PNG.
Two independent halves in one repo:

| Path        | Stack                                                   |
| ----------- | ------------------------------------------------------- |
| `frontend/` | React 18, Vite 5, plain CSS (no Tailwind), Axios, Router |
| `backend/`  | FastAPI, rembg, Pillow (Python)                         |

## Setup and commands

`cd` into a half before running anything — there is no root `package.json`.

```bash
# Frontend
cd frontend && npm install
npm run dev        # http://localhost:5173
npm run build      # -> frontend/dist
npm run preview

# Backend
cd backend && python -m venv venv
venv\Scripts\activate            # Windows; source venv/bin/activate elsewhere
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend install is large and slow — `rembg[cpu]` brings ONNX Runtime and
fetches a model on first inference, so the first request is much slower than
subsequent ones.

**No tests, no linter, no formatter is configured.** Do not fabricate
`npm test` or `npm run lint` invocations. Verify with `npm run build` plus
manual exercise of the affected UI, and say plainly which parts you could not
verify.

## Rules

1. **Plain CSS only.** No Tailwind, styled-components, Emotion, or component
   libraries. This is a stated project requirement.
2. **One stylesheet per component**, imported by that component: `Foo.jsx` ↔
   `Foo.css`. Shared values belong in `src/index.css` as custom properties.
3. **No new dependencies** without asking. Icons in particular go into
   `src/components/Icons.jsx` as inline SVG — don't add an icon package.
4. **Reuse the primitives.** `Button`, `Alert`, `Reveal`, `SectionHeader`,
   `ImagePanel`, `Dropzone`, `Loader` already exist. Check before writing new
   ones. `Button` renders as `<button>`, `<Link>`, or `<a>` based on props.
5. **Keep validation in sync.** Accepted types and the 10 MB cap are enforced in
   both `frontend/src/services/api.js` and `backend/app/utils.py`. Changing one
   without the other creates a bug where the client accepts what the server
   rejects.
6. **Mobile-first, and no horizontal scroll at any width.** Base CSS targets
   phones; scale up with the existing breakpoints (600/640/768/860/900/1024px).
7. **Preserve accessibility wiring.** Skip link, `aria-invalid` /
   `aria-describedby` on fields, `role="alert"` on errors, `aria-expanded` /
   `aria-controls` on the accordion and drawer, Escape to close the drawer,
   keyboard-operable dropzone.
8. **Match the surrounding style.** Two-space indent, no semicolons in JS,
   single quotes, function components with hooks. Comment the *why* for
   non-obvious decisions, not the *what*.
9. **Don't commit** unless asked. Never commit `.env.local`, `node_modules/`,
   `backend/venv/`, or `frontend/dist/`.

## Traps

These have already caused bugs. Read before touching the upload flow or error
handling.

- **Object URLs leak if not revoked.** `RemoveBackgroundPage` tracks every
  `URL.createObjectURL` in a ref and revokes on reset and unmount. Keep that
  behaviour.
- **Error bodies are Blobs, not JSON.** The image request sets
  `responseType: 'blob'`, which also applies to error responses, so FastAPI's
  `{detail: ...}` must be parsed out of a Blob. See `readBlobErrorDetail()`.
- **Generic framework errors are filtered on purpose.** `usableDetail()` drops
  "Not Found", "Internal Server Error", and similar, because they signal a
  missing or misconfigured route rather than anything a visitor can fix.
- **The `/api` prefix is rewritten away.** FastAPI serves
  `POST /remove-background` at the root, so the Vite proxy strips `/api`. If you
  change the base path, update the rewrite in `vite.config.js`.
- **The contact form intentionally has no endpoint.** `sendContactMessage()`
  opens a `mailto:` draft to `CONTACT_EMAIL`. Don't convert it into a POST
  without building a real endpoint first.
- **CORS is an explicit allowlist** in `backend/app/main.py`. New origins,
  including deployed ones, must be added or requests fail.

## The contract

```
POST /remove-background
  request:  multipart/form-data  { image: File }
  success:  200 image/png  (transparent background)
  errors:   JSON { detail: "..." } with 400 / 413 / 415 / 500
```

`VITE_USE_MOCK_API=true` simulates this locally — the whole UI flow works with
the backend stopped, returning the uploaded file unchanged after ~2.2s.
`frontend/.env.local` currently sets it to `false`, meaning real requests.

## Reporting work

State what you actually ran and what you didn't. If the build wasn't run, say
so rather than implying it passed. Don't describe a change as verified on the
strength of having read it.
