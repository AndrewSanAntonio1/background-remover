# Cutout — Background Remover (Frontend)

Frontend for a SaaS background-removal app: upload an image, get a transparent
PNG back. Built with **React + Vite**, plain **CSS** (no Tailwind), and
**Axios**.

> **Frontend only.** There is no backend in this repo. `POST /remove-background`
> is a placeholder, and the app ships with a local mock so the entire flow —
> upload, loading, result, download, errors — is testable today.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Pages

| Route                | What it is                                                                  |
| -------------------- | --------------------------------------------------------------------------- |
| `/`                  | Landing page — hero, features, how it works, FAQ, contact, footer            |
| `/remove-background` | The tool — drag & drop / file picker, preview, processing, result, download  |
| `*`                  | 404                                                                         |

## Project structure

```
src/
├── components/          reusable, page-agnostic UI
│   ├── Alert            inline error / success message
│   ├── Button           renders as <button>, <Link>, or <a> depending on props
│   ├── Dropzone         drag & drop + file picker
│   ├── FaqItem          accordion row with animated height
│   ├── Footer, Navbar   app chrome (Navbar includes the mobile drawer)
│   ├── Icons            inline SVGs, recoloured via currentColor
│   ├── ImagePanel       framed image + caption, optional checkerboard
│   ├── Loader           processing overlay with scanning beam + progress
│   ├── Logo, Reveal     brand mark; scroll-into-view animation wrapper
│   └── SectionHeader    eyebrow + title + subtitle
├── sections/            landing page sections
│   └── Hero, Features, HowItWorks, Faq, Contact
├── pages/               route components
│   └── LandingPage, RemoveBackgroundPage, NotFoundPage
├── services/
│   └── api.js           Axios client, validation, error mapping, mock
├── App.jsx              routes + scroll management
├── index.css            design tokens, reset, primitives, animations
└── main.jsx             entry point
```

Each component keeps its styles in a sibling `.css` file imported from the
component itself.

## Connecting the backend

The contract `src/services/api.js` is written against:

```
POST /remove-background
  request:  multipart/form-data  { image: File }
  response: image/png  (binary, transparent background)
```

To switch from the mock to a real server, create `.env.local`:

```bash
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:8000   # or leave empty to use the dev proxy
```

Leaving `VITE_API_BASE_URL` empty routes requests through the `/api` proxy
configured in [vite.config.js](vite.config.js).

If your backend returns JSON (`{ url: "https://…" }`) rather than raw image
bytes, only one branch in `removeBackground()` changes — it's marked with a
comment.

`api.js` also handles:

- **Client-side validation** — PNG/JPG/WEBP only, 10 MB cap, empty-file check
- **Error mapping** — network, timeout, 413/415/429, and 5xx each get a
  message written for a person rather than a stack trace
- **Upload progress** — forwarded to the loader's progress bar
- **Cancellation** — via `AbortSignal`, wired to unmount and reset

## Responsive design

Mobile-first throughout; every layout rule scales up from the small-screen
base. Breakpoints in use:

| Width    | Behaviour                                                         |
| -------- | ----------------------------------------------------------------- |
| < 600px  | Single column, full-width buttons, 2-column footer                |
| ≥ 640px  | 2-column feature grid                                             |
| ≥ 768px  | 3-up steps, larger spacing and radii, 3-column tips               |
| ≥ 860px  | Original and result panels sit side by side                       |
| ≥ 900px  | Desktop nav replaces the drawer; contact splits into two columns  |
| ≥ 1024px | 3-column features, hero becomes two columns                       |

Also handled: `overflow-x: hidden` plus truncation on text that could otherwise
force sideways scroll, 44px+ touch targets, `env(safe-area-inset-*)` padding
for notched displays, 16px inputs to stop iOS zoom-on-focus, hover effects
gated behind `@media (hover: hover)`, and full `prefers-reduced-motion`
support.

## Accessibility

Skip link, labelled form fields with `aria-invalid` / `aria-describedby`,
`role="alert"` on errors and `aria-live` on status, `aria-expanded` /
`aria-controls` on the accordion and mobile menu, Escape to close the drawer,
visible focus rings, and a keyboard-operable dropzone (it's a real button, so
the picker opens without dragging).

## Notes

- Object URLs created for previews and results are tracked and revoked on
  reset and unmount, so repeated uploads don't leak memory.
- The contact form validates locally and posts to a placeholder — no messages
  are delivered.

## Author

**Andrew San Antonio**  
Email: sgandrew290@gmail.com

## License

MIT
