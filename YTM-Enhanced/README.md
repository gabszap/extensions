# YT-Music Enhancer

![Version](https://img.shields.io/badge/version-1.46-2ea44f)
![Platform](https://img.shields.io/badge/platform-YouTube%20Music-ff0000)
![Type](https://img.shields.io/badge/type-userscript-1f6feb)
![Browsers](https://img.shields.io/badge/browsers-Chromium%20%7C%20Firefox-6f42c1)

A userscript that upgrades the YouTube Music web app with playlist management, homepage debloating, volume controls, theming, and a full settings panel.

> UI labels are in Portuguese (pt-BR).

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Settings Panel](#settings-panel)
- [Console API](#console-api)
- [Storage](#storage)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)
- [Known Limitations](#known-limitations)

## Features

### Playlist management

- **Pin playlists** in the sidebar, library page, and "Save to playlist" modal. Pinned playlists are reordered to the top (after "Liked Songs").
- **Hide playlists** across sidebar, library, save modal (both "Recents" carousel and "All playlists" list), and home page carousels.
- **"Liked Songs" protection** — always kept at the top, cannot be pinned or hidden.
- **Pin visibility modes**: `always`, `dynamic` (subtle opacity), `hover-only`.

### Homepage debloat

- **Hide carousel sections**: 22 predefined sections (e.g., "Favoritos antigos", "Mixtapes", "Radios", "Covers e remixes", "Paradas") can be toggled individually or all at once via a master toggle with domino animation.
- **Dynamic section hiding**: personalized/genre sections not in the predefined list can be hidden via an X button on the carousel header. These are stored separately and can be restored in settings.
- **Section matching**: sections are matched by normalized title or strapline text (accent-insensitive).
- **Artist hiding in "Ouvir de novo"**: individual artists can be hidden via X button on both the homepage carousel and the `/listen_again` grid page. Artists are identified by channel ID.
- **Upgrade button removal**: toggle to hide the "Upgrade" sidebar entry.

### Context menu debloat

- 19 right-click context menu items can be individually toggled on/off (e.g., "Start radio", "Share", "Stats for nerds", "Download").
- Hidden items are removed from the popup and the menu is repositioned automatically.

### UI and quality of life

- **Volume percentage overlay** — centered display while adjusting volume.
- **Mouse-wheel volume control** — scroll on the volume slider to adjust in steps of 5.
- **Auto-close save notifications** — "Saved"/"Added" toasts auto-dismiss after 3 seconds.
- **Library redirect** — optional auto-redirect from `/library` to `/library/playlists`.
- **Player bar layout tweaks** — centered controls, hidden like button, rounded search box.
- **Startup toast** — animated notification on script load with name and version.

### Theming

- **4 built-in presets**: YT Red, Blue Neon, Monochrome, Catppuccin (with Latte/Frappe/Macchiato/Mocha sub-variants).
- **4 custom color pickers**: accent, background, pin color, pin pinned color.
- **25+ CSS custom properties** generated with automatic dark/light adaptation.
- Live preview with instant application.

## Requirements

- A userscript manager — [Violentmonkey](https://violentmonkey.github.io/) (recommended) or [Tampermonkey](https://www.tampermonkey.net/)
- Chromium- or Firefox-based browser
- YouTube Music at `https://music.youtube.com/`

## Installation

### One-click install

Click the link below and your userscript manager will offer to install it:

[**Install YT-Music Enhancer**](https://github.com/gabszap/extensions/raw/refs/heads/main/YTM-Enhanced/ytm-enhanced.main.user.js)

### Manual install

1. Install a userscript manager.
2. Open the manager dashboard and create a new script.
3. Paste the contents of `ytm-enhanced.main.user.js`.
4. Save, enable, and open `https://music.youtube.com/`.

## Usage

1. Open YouTube Music.
2. Use the pin/hide buttons next to playlists in the sidebar, library, and save modal.
3. Hover over carousel headers on the homepage to reveal the X button for hiding sections.
4. Right-click any track to see the debloated context menu.
5. Open settings from the floating gear button (draggable, position persisted).

## Settings Panel

The gear button opens a centered modal with backdrop blur. Sections:

| Section | Controls |
|---|---|
| **Visibilidade do alfinete** | Dropdown: always / dynamic / hover-only |
| **Abrir sempre em playlists** | Toggle for library redirect |
| **Aparencia** | 4 preset buttons, Catppuccin variant selector, 4 color pickers, reset button |
| **Debloat** | Upgrade button toggle |
| Menu de contexto | Collapsible — 19 individual item toggles |
| Playlists ocultas | Collapsible — per-playlist restore + "Reexibir todas" |
| **Homepage** | Sub-section label |
| Ocultar artistas em "Ouvir de novo" | Toggle (OFF unhides all) |
| Artistas ocultos | Collapsible — per-artist restore + "Reexibir todos" |
| Ocultar secoes | Collapsible — master toggle + 22 individual section toggles + dynamic section restore |

## Console API

The script exposes `YTEnhancer` on `window`:

```js
YTEnhancer.getPinVisibilityMode();
YTEnhancer.setPinVisibilityMode("always");
YTEnhancer.cyclePinVisibilityMode();

YTEnhancer.getHiddenPlaylists();
YTEnhancer.unhideAllPlaylists();

YTEnhancer.getThemeColors();
YTEnhancer.setThemeColors({ popupAccent: "#37c7ff" });
YTEnhancer.resetThemeColors();
YTEnhancer.applyThemePreset("blue-neon");
YTEnhancer.applyCatppuccinVariant("mocha");
```

## Storage

Uses `GM_getValue`/`GM_setValue` with automatic one-time migration from `localStorage`.

| Key | Type | Description |
|---|---|---|
| `yt-enhancer:pinned-playlists` | `string[]` | Pinned playlist IDs |
| `yt-enhancer:hidden-playlists` | `string[]` | Hidden playlist IDs |
| `yt-enhancer:hidden-playlist-labels` | `object` | Display names for hidden playlists |
| `yt-enhancer:pin-visibility-mode` | `string` | `always` / `dynamic` / `hover-only` |
| `yt-enhancer:settings-button-position` | `object` | Gear button `{left, top}` |
| `yt-enhancer:settings-theme` | `object` | 4 hex color values |
| `yt-enhancer:last-known-version` | `string` | Cached version for toast |
| `yt-enhancer:library-redirect-playlists` | `boolean` | Library redirect toggle |
| `yt-enhancer:hidden-context-menu-items` | `string[]` | Hidden context menu item IDs |
| `yt-enhancer:hide-upgrade-button` | `boolean` | Upgrade button toggle |
| `yt-enhancer:hide-listen-again-artists` | `boolean` | Hide all artists toggle |
| `yt-enhancer:hidden-artists` | `string[]` | Hidden artist channel IDs |
| `yt-enhancer:hidden-artist-labels` | `object` | Display names for hidden artists |
| `yt-enhancer:hidden-homepage-sections` | `string[]` | Hidden predefined section IDs |
| `yt-enhancer:hidden-dynamic-sections` | `object[]` | Hidden personalized sections |

## Project Structure

```
YTM-Enhanced/
  ytm-enhanced.main.user.js   Main userscript (single file, no build step)
  README.md                    This file
```

## Development Notes

- No build step — edit `ytm-enhanced.main.user.js` directly.
- Run `node -c ytm-enhanced.main.user.js` for syntax validation after changes.
- Bump `@version` in the userscript header on each release.
- Selectors target YouTube Music's internal Web Components (`ytmusic-*`, `yt-formatted-string`, etc.) which may change without notice.

## Known Limitations

- YouTube Music frequently changes its DOM structure; selectors may need updates after major YTM releases.
- Labels and text matching are optimized for pt-BR. Other locales may not match correctly for section hiding and context menu debloat.
- The script polls the DOM every 500ms rather than using framework-level hooks, since YTM's internal API is not publicly documented.
