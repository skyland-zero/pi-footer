import { loadThemeConfig } from "./theme.ts";

export interface IconSet {
  pi: string;
  model: string;
  folder: string;
  branch: string;
  git: string;
  tokens: string;
  context: string;
  cost: string;
  time: string;
  agents: string;
  cache: string;
  input: string;
  output: string;
  host: string;
  session: string;
  auto: string;
  warning: string;
}

// Separator characters
export const SEP_DOT = " · ";

// Thinking level display text (Unicode/ASCII)
export const THINKING_TEXT_UNICODE: Record<string, string> = {
  minimal: "[min]",
  low: "[low]",
  medium: "[med]",
  high: "[high]",
  xhigh: "[xhi]",
  max: "[max]",
};

// Thinking level display text (Nerd Fonts - with icons)
// Glyph names verified against Nerd Fonts v3.5.1 glyphnames.json
export const THINKING_TEXT_NERD: Record<string, string> = {
  minimal: "\u{F0E7} min",   // nf-fa-flash
  low: "\u{F10C} low",       // nf-fa-circle_o
  medium: "\u{F192} med",    // nf-fa-dot_circle_o
  high: "\u{F111} high",     // nf-fa-circle
  xhigh: "\u{F06D} xhi",     // nf-fa-fire
  max: "\u{F135} max",       // nf-fa-rocket
};

// Get thinking text based on font support
export function getThinkingText(level: string): string | undefined {
  if (hasNerdFonts()) {
    return THINKING_TEXT_NERD[level];
  }
  return THINKING_TEXT_UNICODE[level];
}

// Nerd Font icons (glyph names verified against Nerd Fonts v3.5.1 glyphnames.json)
// Nerd Fonts v3 moved every nf-md-* glyph from U+F500..U+FD46 to U+F0001..U+F1AF0,
// so pre-v3 codepoints render as tofu in current fonts. Keep names in sync with the
// code points: the previous comments were wrong and made icon swaps a guessing game.
export const NERD_ICONS: IconSet = {
  pi: "\uE22C",          // nf-fae-pi
  model: "\u{F0674}",    // nf-md-creation
  folder: "\uF115",      // nf-fa-folder_open_o
  branch: "\uF126",      // nf-fa-code_fork
  git: "\uF1D3",         // nf-fa-git
  tokens: "\uE26B",      // nf-fae-coins
  context: "",           // no icon: the percentage reads fine on its own
  cost: "\uF155",        // nf-fa-usd
  time: "\uF017",        // nf-fa-clock_o
  agents: "\uF0C0",      // nf-fa-users
  cache: "\uF1C0",       // nf-fa-database
  input: "\uF090",       // nf-fa-sign_in
  output: "\uF08B",      // nf-fa-sign_out
  host: "\uF109",        // nf-fa-laptop
  session: "\u{F0EFE}",  // nf-md-identifier (v3 code point; v2 was U+F550)
  auto: "\u{F0068}",     // nf-md-auto_fix (shown while auto-compaction is on)
  warning: "\uF071",     // nf-fa-warning
};

// ASCII/Unicode fallback icons (matching oh-my-pi)
export const ASCII_ICONS: IconSet = {
  pi: "π",
  model: "",
  folder: "dir",
  branch: "⎇",
  git: "⎇",
  tokens: "⊛",
  context: "◫",
  cost: "$",
  time: "◷",
  agents: "AG",
  cache: "cache",
  input: "in:",
  output: "out:",
  host: "host",
  session: "id",
  auto: "AC",
  warning: "!",
};

type PartialIconSet = Partial<IconSet>;

function sanitizeUserIconOverrides(value: unknown): PartialIconSet {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }

  const rawIcons = value as Record<keyof IconSet, unknown>;
  const sanitized: PartialIconSet = {};
  const validKeys = Object.keys(NERD_ICONS) as Array<keyof IconSet>;
  for (const key of validKeys) {
    const icon = rawIcons[key];
    if (typeof icon === "string") {
      sanitized[key] = icon;
    }
  }

  return sanitized;
}

// Separator characters
export interface SeparatorChars {
  powerlineLeft: string;
  powerlineRight: string;
  powerlineThinLeft: string;
  powerlineThinRight: string;
  slash: string;
  pipe: string;
  block: string;
  space: string;
  asciiLeft: string;
  asciiRight: string;
  dot: string;
}

export const NERD_SEPARATORS: SeparatorChars = {
  powerlineLeft: "\uE0B0",    // pl-left_hard_divider
  powerlineRight: "\uE0B2",   // pl-right_hard_divider
  powerlineThinLeft: "\uE0B1", // pl-left_soft_divider
  powerlineThinRight: "\uE0B3", // pl-right_soft_divider
  slash: "/",
  pipe: "|",
  block: "█",
  space: " ",
  asciiLeft: ">",
  asciiRight: "<",
  dot: "·",
};

export const ASCII_SEPARATORS: SeparatorChars = {
  powerlineLeft: ">",
  powerlineRight: "<",
  powerlineThinLeft: "|",
  powerlineThinRight: "|",
  slash: "/",
  pipe: "|",
  block: "#",
  space: " ",
  asciiLeft: ">",
  asciiRight: "<",
  dot: ".",
};

// TERM_PROGRAM values (lower-case substrings) of terminals whose users almost always
// have a Nerd Font configured: the terminal bundles one, or it exists to be themed.
const NERD_TERM_PROGRAMS = [
  "iterm", "wezterm", "kitty", "ghostty", "alacritty", "mintty", "tabby",
  "hyper", "rio", "warp", "konsole", "gnome-terminal", "tilix", "terminator",
  "contour", "waveterm", "vscode", "cursor", "windsurf", "zed", "tmux",
];

// Variables only set by a terminal or shell whose font is under the user's control.
// WT_* comes from Windows Terminal (also forwarded into WSL via WSLENV), MSYSTEM and
// MINGW_PREFIX from Git Bash and MSYS2, ConEmu* from ConEmu/Cmder.
const NERD_ENV_MARKERS: Array<[string, string | undefined]> = [
  ["GHOSTTY_RESOURCES_DIR", undefined], // survives into tmux children
  ["WT_SESSION", undefined],            // Windows Terminal
  ["WT_PROFILE_ID", undefined],         // Windows Terminal profile
  ["MSYSTEM", undefined],               // Git Bash / MSYS2
  ["MINGW_PREFIX", undefined],          // Git Bash / MSYS2
  ["ConEmuANSI", "ON"],                // ConEmu / Cmder
];

/**
 * Detect Nerd Font support from the terminal environment.
 *
 * No terminal can be asked which glyphs its font actually has, so this is a heuristic:
 * a known terminal or a shell marker that implies one. Force the answer either way with
 * `PI_FOOTER_NERD_FONTS=1` / `=0`, and replace individual glyphs via `theme.json`
 * ("icons": { "model": "..." }).
 */
export function hasNerdFonts(): boolean {
  const override = (process.env.PI_FOOTER_NERD_FONTS ?? "").trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(override)) return true;
  if (["0", "false", "no", "off"].includes(override)) return false;

  for (const [name, expected] of NERD_ENV_MARKERS) {
    const value = process.env[name];
    if (value !== undefined && (expected === undefined || value === expected)) return true;
  }

  // Case-insensitive, so "WezTerm" and "vscode" both match.
  const termProgram = (process.env.TERM_PROGRAM || "").toLowerCase();
  return NERD_TERM_PROGRAMS.some((name) => termProgram.includes(name));
}

export function getIcons(): IconSet {
  const baseIcons = hasNerdFonts() ? NERD_ICONS : ASCII_ICONS;
  return {
    ...baseIcons,
    ...sanitizeUserIconOverrides(loadThemeConfig().icons),
  };
}

export function getSeparatorChars(): SeparatorChars {
  return hasNerdFonts() ? NERD_SEPARATORS : ASCII_SEPARATORS;
}
