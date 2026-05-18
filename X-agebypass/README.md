# Age Bypass for Twitter — Bypass Age-Restricted Media

![Version](https://img.shields.io/badge/version-1.0.0-2ea44f)
![Platform](https://img.shields.io/badge/platform-X%20%2F%20Twitter-000000)
![License](https://img.shields.io/badge/license-MIT-blue)

Uses the [fxTwitter API](https://github.com/FxEmbed/FxEmbed) to fetch the original media, displayed in a native-like grid layout and lightbox.

## Install

[**Install**](https://github.com/gabszap/extensions/raw/refs/heads/main/X-agebypass/agebypass.main.user.js) — requires a userscript manager (Violentmonkey or Tampermonkey).

## Features

- **Manual reveal** — eye icon in the tweet action bar (next to Grok/bookmark buttons), doesn't auto-reveal
- **Grid layout** — preserves X's native multi-image presentation:
  - 1 image: full width
  - 2 images: side by side
  - 3 images: 2x2 grid (large left + 2 stacked right)
  - 4 images: 2x2 grid
- **Lightbox viewer** — full-screen overlay with:
  - Fade transitions
  - Keyboard navigation (left/right arrows to browse, Esc to close)
  - Open images in new tab on click
- **Video support** — videos with native `<video>` controls (play/pause, volume, fullscreen)
- **Multi-language** — detects Portuguese ("Mostrar") and English ("Show") age restriction buttons
- **Compatible** — works alongside other X userscripts (Pinboard, etc.)

## Usage

1. Navigate to a tweet with age-restricted media
2. Click the eye icon in the tweet's action bar (bottom-right of the tweet)
3. Media is fetched via fxTwitter and displayed inline
4. Click any image/video to open in the lightbox viewer
5. Navigate with arrow keys or on-screen prev/next buttons

## Notes

- The fxTwitter API fetches media asynchronously — reveal time depends on the API response
- Only the age-restricted overlay is replaced; the rest of the tweet is preserved
- 1080p GIFs are converted to animated WebM/MP4, displayed as videos with controls
