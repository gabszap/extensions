# Age Bypass for Twitter — Bypass Age-Restricted Media

![Version](https://img.shields.io/badge/version-1.1.0-2ea44f)
![Platform](https://img.shields.io/badge/platform-X%20%2F%20Twitter-000000)
![License](https://img.shields.io/badge/license-MIT-blue)

Uses the [fxTwitter API](https://github.com/FxEmbed/FxEmbed) to fetch the original media, displayed in a native-like grid layout and lightbox.

## Install

[**Install**](https://github.com/gabszap/extensions/raw/refs/heads/main/X-agebypass/agebypass.main.user.js) — requires a userscript manager (Violentmonkey or Tampermonkey).

## Features

- **Manual reveal** — eye icon in the tweet action bar (next to Grok/bookmark buttons), doesn't auto-reveal
- **Auto-Reveal** *(experimental)* — when enabled, automatically reveals age-restricted media on the timeline/feed. A sub-option ("Reveal on Post") controls whether auto-reveal also applies on the tweet's individual page (permalink). When disabled, use the manual eye button.
- **Grid layout** — preserves X's native multi-image presentation:
  - 1 image: aspect-ratio aware sizing with Twitter-style max-width
  - 2 images: side by side
  - 3 images: 2x2 grid (large left + 2 stacked right)
  - 4 images: 2x2 grid
- **Lightbox viewer** — full-screen overlay with:
  - Fade transitions
  - Keyboard navigation (left/right arrows to browse, Esc to close)
  - Open images in new tab on click
- **Video support** — videos with native `<video>` controls (play/pause, volume, fullscreen)
- **Multi-language** — detects Portuguese ("Mostrar"), English ("Show"), Spanish, and French age restriction indicators
- **API caching** — responses are cached for 30 minutes to avoid redundant API calls
- **Compatible** — works alongside other X userscripts (Pinboard, etc.)

## Configuration

Settings are available via your userscript manager's menu:

1. Click the **Violentmonkey** or **Tampermonkey** icon in your browser toolbar
2. Select **"⚙️ Age Bypass Settings"** from the menu
3. Toggle the options to your preference — changes take effect immediately

| Setting | Default | Description |
|---------|---------|-------------|
| **Debug Mode** | Off | Enables verbose console logging for troubleshooting and development |
| **Auto-Reveal** | Off | *(Experimental)* Automatically reveals age-restricted media on the feed/timeline. When enabled, a sub-option for post page behavior becomes available |
| **Reveal on Post** | Off | *(Sub-option of Auto-Reveal)* When both Auto-Reveal and this are on, media is automatically revealed on the tweet's individual page (permalink) as well |

> **Note:** Settings are stored in your browser's local storage and persist across sessions.

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

