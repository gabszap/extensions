# X Bookmark

![Version](https://img.shields.io/badge/version-2.6.78-2ea44f)
![Platform](https://img.shields.io/badge/platform-X%20%2F%20Twitter-000000)
![Type](https://img.shields.io/badge/type-userscript-1f6feb)
![Browsers](https://img.shields.io/badge/browsers-Chromium%20%7C%20Firefox-6f42c1)

A userscript that replaces X/Twitter's Grok button with a local bookmark system. Bookmarks are stored entirely in your browser via the userscript manager — no account sync, no API keys, full offline access.

> UI labels are in Portuguese (pt-BR).

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Gallery](#gallery)
- [Cloud Backup (Catbox)](#cloud-backup-catbox)
- [Settings](#settings)
- [Storage](#storage)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)
- [Known Limitations](#known-limitations)

## Features

### Core bookmarking

- **Replaces the Grok button** on every tweet with a bookmark toggle.
- **Saves locally** via `GM_setValue` — post URL, images (max 4096x4096), tags, timestamps, post date, username, and avatar.
- **Center toast** on bookmark add/remove mimicking X's native style, with a "Ver galeria" shortcut.

### Gallery

- Full-featured gallery modal opened with `Ctrl+B` (configurable).
- **Grid view** and **List view** with toggle.
- **Search** by @username.
- **Sort**: newest/oldest added, newest/oldest posted, favorites first, most images.
- **Tag filtering** with chip UI.
- **Favorites**: star/unstar bookmarks, sort by favorites.
- **Visual badges** on grid cards: Catbox backup, Twitter-only, partial backup, merged image, favorite, fallback warning.

### Tag system

- Full CRUD — create, delete, drag-and-drop reorder.
- Tag chips displayed on bookmarks.
- Tag-based filtering in the gallery.
- Bulk tag management for multiple selected bookmarks.

### Image handling

- **Max quality**: always requests `name=4096x4096` with fallback chain (4096 -> large -> Catbox backup URL).
- **Image merging**: stitches 2+ images from a post into one vertical image, uploads to Catbox.
- **Download**: individual, all from a bookmark, merged, or bulk from selection. Files named `@handle_postId_index.ext`.
- **Edit links**: full CRUD for image URLs within a bookmark, with thumbnail previews and Catbox cleanup warnings.
- **Lightbox extraction**: detects images from X's lightbox/swipe overlay when the article DOM doesn't contain them.

### Cloud backup (Catbox)

- **Automatic or manual backup** of bookmark images to [Catbox.moe](https://catbox.moe/).
- **Userhash configuration** with live validation (upload test + delete test).
- **Album support** — auto-add uploads to a Catbox album.
- **Anonymous upload mode** (no userhash required).
- **Selective backup** via tag filters (only backup bookmarks matching specific tags).
- **Periodic backup scan** — every 5 minutes, checks for bookmarks missing backups.

### Auto-tag rules

- Configure rules like `@username -> tag`.
- When bookmarking a post from that user, tags are automatically applied.
- Username autocomplete from existing bookmarks.

### Dead link checker

- Scans all Catbox backup URLs to find dead/inaccessible links.
- Generates a report with previews, post links, and status.
- **Re-upload** dead links individually or in bulk.
- **Binary re-encode fallback** — mutates 1 pixel to force a new hash when Catbox returns the same dead URL.
- **Manual fix** — paste a replacement URL directly.
- Remembers known dead file IDs to prevent reuse.
- Report is persisted and viewable later from settings.

### Bulk actions

Floating action bar when items are selected:

- Select All / Clear Selection
- Manage Tags
- Favorite / Unfavorite
- Download
- Backup to Catbox
- Delete

### Keyboard shortcuts

| Action | Default | Configurable |
|---|---|---|
| Open gallery | `Ctrl+B` | Yes |
| Close modal | `Escape` | Yes |
| Toggle view | `G` | Yes |
| Open settings | `S` | Yes |

## Requirements

- A userscript manager — [Violentmonkey](https://violentmonkey.github.io/) (recommended) or [Tampermonkey](https://www.tampermonkey.net/)
- Chromium- or Firefox-based browser
- X / Twitter at `https://x.com/`

## Installation

### One-click install

Click the link below and your userscript manager will offer to install it:

[**Install X Bookmark**](https://github.com/gabszap/extensions/raw/refs/heads/main/x-bookmark/x-bookmark.user.js)

### Manual install

1. Install a userscript manager.
2. Open the manager dashboard and create a new script.
3. Paste the contents of `x-bookmark.user.js`.
4. Save, enable, and open `https://x.com/`.

## Usage

1. Open X / Twitter.
2. The Grok button on each tweet is replaced with a bookmark button.
3. Click it to save the post with all its images.
4. Press `Ctrl+B` to open the gallery.
5. Use search, tags, sort, and filters to find saved posts.
6. Open settings from the gallery to configure backup, shortcuts, and appearance.

## Gallery

The gallery supports two layouts:

- **Grid view** — image cards with visual badges (backup status, favorite, merge).
- **List view** — compact rows with configurable thumbnail size and hover preview popup.

Both views support multi-select for bulk operations.

## Cloud Backup (Catbox)

To enable cloud backup:

1. Open the gallery (`Ctrl+B`) and click Settings.
2. Expand the "Cloud Backup (Catbox)" section.
3. Optionally enter your Catbox userhash (get one at [catbox.moe](https://catbox.moe/)) — anonymous uploads work without it.
4. Toggle "Auto-backup" to automatically upload images when bookmarking.
5. Optionally set tag filters to only backup specific bookmarks.

## Settings

Accessible from the gallery modal. Collapsible sections:

| Section | Controls |
|---|---|
| **Appearance** | Gallery title, show/hide user labels, show/hide overlays, list preview size (40-150px), grid photo height (150-500px) |
| **Keyboard Shortcuts** | Configurable bindings for gallery, close, view toggle, settings. Reset to defaults. |
| **Cloud Backup** | Auto-backup toggle, userhash input with validation, album short, tag filter for selective backup |
| **Automation** | Auto-tag rules configuration |
| **Developer** | Debug mode toggle, Check Catbox Links, View Last Report |

## Storage

All data is stored via `GM_setValue`/`GM_getValue` in the userscript manager.

| Key | Type | Description |
|---|---|---|
| `x_internal_bookmarks` | `object[]` | All bookmark data |
| `x_bookmark_tags` | `string[]` | Tag list with order |
| `x_bookmark_settings` | `object` | All settings |
| `x_bookmark_autotag_rules` | `object[]` | Auto-tag rules |
| `x_bookmark_dead_links_report` | `object` | Last dead link scan report |
| `x_bookmark_known_dead_file_ids` | `string[]` | Known dead Catbox file IDs |
| `x_bookmark_view_mode` | `string` | `grid` / `list` preference |

## Project Structure

```
x-bookmark/
  x-bookmark.user.js   Main userscript (single file, no build step)
  README.md             This file
```

## Development Notes

- No build step — edit `x-bookmark.user.js` directly.
- Run `node -c x-bookmark.user.js` for syntax validation.
- Bump `@version` in the userscript header on each release.
- The script uses `GM_xmlhttpRequest` for cross-origin requests to Catbox.moe.
- Image quality URLs use X's `pbs.twimg.com` CDN with `name=4096x4096` parameter.

## Known Limitations

- X frequently changes its DOM structure; selectors may need updates.
- Bookmarks are stored locally per browser/profile — no cross-device sync (use Catbox backup for image preservation).
- Large bookmark collections (1000+) may cause slower gallery rendering.
- Catbox.moe has file size limits and may occasionally be unavailable.
