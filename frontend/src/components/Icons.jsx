/**
 * Inline SVG icons. Keeping them here avoids an icon dependency and keeps
 * them recolourable via `currentColor`.
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: false,
}

export const IconUpload = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" />
    <path d="M12 3v13" />
  </svg>
)

export const IconDownload = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5" />
    <path d="M12 15V3" />
  </svg>
)

export const IconSparkles = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M12 3l1.9 4.9L19 9.8l-5.1 1.9L12 16.6l-1.9-4.9L5 9.8l5.1-1.9z" />
    <path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
  </svg>
)

export const IconBolt = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" />
  </svg>
)

export const IconShield = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M12 22s8-3.5 8-10V5.5L12 2 4 5.5V12c0 6.5 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export const IconLayers = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="m12 2 9 5-9 5-9-5 9-5z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </svg>
)

export const IconCrop = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M6 2v14a2 2 0 0 0 2 2h14" />
    <path d="M2 6h14a2 2 0 0 1 2 2v14" />
  </svg>
)

export const IconWand = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="m15 4 5 5L9 20H4v-5z" />
    <path d="m13.5 5.5 5 5" />
    <path d="M4 4h.01M20 15h.01M17 2h.01" />
  </svg>
)

export const IconImage = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-4.5-4.5L7 21" />
  </svg>
)

export const IconCheck = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const IconAlert = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16.5h.01" />
  </svg>
)

export const IconClose = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const IconRefresh = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 4v5h-5" />
  </svg>
)

export const IconChevron = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const IconArrowRight = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconMenu = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export const IconMail = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
)

export const IconGlobe = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
  </svg>
)

export const IconChat = ({ size = 24, ...p }) => (
  <svg width={size} height={size} {...base} {...p}>
    <path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z" />
  </svg>
)
