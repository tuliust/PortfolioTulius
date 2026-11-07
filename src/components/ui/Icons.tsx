import type { MetricIconName, ToolIconName } from "../../types/content"
import { ToolSymbol, toolIconOptions } from "../public/ToolIcons"

type IconProps = {
  name:
    | "menu"
    | "close"
    | "arrow"
    | "plus"
    | "up"
    | "down"
    | "edit"
    | "info"
    | "sliders"
    | "trash"
    | "image"
    | "palette"
    | "logout"
    | MetricIconName
  size?: number
}

export function Icon({ name, size = 22 }: IconProps) {
  const paths: Record<string, React.ReactNode> = {
    menu: (
      <>
        <path d="M3 7h18M3 17h18" />
      </>
    ),
    close: (
      <>
        <path d="m5 5 14 14M19 5 5 19" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 19 19 5M9 5h10v10" />
      </>
    ),
    plus: <path d="M12 3v18M3 12h18" />,
    up: (
      <>
        <path d="m6 15 6-6 6 6" />
      </>
    ),
    down: (
      <>
        <path d="m6 9 6 6 6-6" />
      </>
    ),
    edit: (
      <>
        <path d="m4 20 4-1 11-11-3-3L5 16l-1 4ZM14 7l3 3" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 7h16M4 17h16M8 4v6M16 14v6" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v6M14 11v6" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m3 17 5-5 4 4 3-3 6 6" />
      </>
    ),
    palette: (
      <>
        <path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12h-3Z" />
        <path d="M7 10h.01M8.5 6.5h.01M13 6h.01" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V4M4 20h16M8 17v-5M12 17V8M16 17V5" />
      </>
    ),
    trending: (
      <>
        <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6M19 14a5 5 0 0 1 2 4v2" />
      </>
    ),
    newspaper: (
      <>
        <path d="M5 3h14v18H5a3 3 0 0 1-3-3V6M8 7h7M8 11h8M8 15h8" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    megaphone: (
      <>
        <path d="M3 11h4l11-6v14L7 13H3zM7 13l2 6h4" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V4h8v3M3 13h18" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="m8 12-2 9 6-3 6 3-2-9" />
      </>
    ),
    layers: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />
      </>
    ),
    message: <path d="M4 5h16v12H9l-5 4V5ZM8 9h8M8 13h6" />,
    mail: <path d="M3 6h18v12H3zM3 7l9 7 9-7" />,
    phone: (
      <path d="M6 3h5l1 5-3 2a15 15 0 0 0 5 5l2-3 5 1v5c0 2-2 3-4 3A17 17 0 0 1 3 7c0-2 1-4 3-4" />
    ),
    microphone: <path d="M9 3a3 3 0 0 1 6 0v9a3 3 0 0 1-6 0V3ZM5 11a7 7 0 0 0 14 0M12 18v4" />,
    camera: <path d="M3 7h5l2-3h4l2 3h5v13H3V7ZM12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />,
    radio: <path d="M4 9h16v11H4V9ZM7 5l10-3M8 13h8M8 16h5" />,
    globe: (
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2c5 5 5 15 0 20M12 2c-5 5-5 15 0 20" />
    ),
    pen: <path d="m4 20 4-1 12-12-3-3L5 16l-1 4ZM14 7l3 3" />,
    share: <path d="M12 16V3M7 8l5-5 5 5M5 14H3v7h18v-7h-2" />,
    building: <path d="M4 21V5l8-3 8 3v16M4 21h16M9 8h1M14 8h1M9 12h1M14 12h1M9 16h6" />,
    handshake: <path d="M3 12l4-4 4 2 3-2 7 4-5 8-4-3-3 2-6-7ZM7 8l4-3 4 3M9 14l5 4" />,
    folder: <path d="M3 6h7l2 3h9v11H3V6Z" />,
    check: <path d="m4 12 5 5L20 6" />,
    clock: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 6v6l4 2" />,
    lightbulb: <path d="M8 15a7 7 0 1 1 8 0l-1 3H9l-1-3ZM9 21h6" />,
    shield: <path d="M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6l-9-4ZM8 12l3 3 5-6" />,
    star: <path d="m12 2 3 7 7 .5-5.5 5 2 7.5-6.5-4-6.5 4 2-7.5L2 9.5 9 9l3-7Z" />,
    flag: <path d="M5 22V3M5 4h14l-3 5 3 5H5" />,
    monitor: <path d="M3 4h18v13H3V4ZM8 21h8M12 17v4" />,
    code: <path d="m9 7-5 5 5 5M15 7l5 5-5 5M13 4l-2 16" />,
    cloud: <path d="M6 19a5 5 0 0 1-1-10 8 8 0 0 1 15 3 4 4 0 0 1-1 7H6Z" />,
    database: <path d="M4 6c0-4 16-4 16 0s-16 4-16 0ZM4 6v12c0 4 16 4 16 0V6M4 12c0 4 16 4 16 0" />,
    wifi: <path d="M2 9a16 16 0 0 1 20 0M5 13a11 11 0 0 1 14 0M9 17a5 5 0 0 1 6 0M12 21h.01" />,
    smartphone: <path d="M7 2h10v20H7V2ZM10 18h4" />,
    link: (
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2" />
    ),
    sparkles: <path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" />,
    logout: (
      <>
        <path d="M10 5H5v14h5M14 8l4 4-4 4M9 12h9" />
      </>
    ),
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] ??
        (toolIconOptions.some((tool) => tool.value === name) ? (
          <ToolSymbol name={name as ToolIconName} />
        ) : null)}
    </svg>
  )
}
