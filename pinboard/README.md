# Pinboard

![Version](https://img.shields.io/badge/version-2.7.1-2ea44f)
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
- [Cloud Backup (Telegram)](#cloud-backup-telegram)
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
- **Visual badges** on grid cards: Telegram backup, Twitter-only, partial backup, merged image, favorite, fallback warning.

### Tag system

- Full CRUD — create, delete, drag-and-drop reorder.
- Tag chips displayed on bookmarks.
- Tag-based filtering in the gallery.
- Bulk tag management for multiple selected bookmarks.

### Image handling

- **Max quality**: always requests `name=4096x4096` with fallback chain (4096 -> large -> Telegram backup URL).
- **Image merging**: stitches 2+ images from a post into one vertical image, uploads to Telegram.
- **Download**: individual, all from a bookmark, merged, or bulk from selection. Files named `@handle_postId_index.ext`.
- **Edit links**: full CRUD for image URLs within a bookmark, with thumbnail previews.
- **Lightbox extraction**: detects images from X's lightbox/swipe overlay when the article DOM doesn't contain them.

### Cloud backup (Telegram)

- **Automatic or manual backup** of bookmark images via your own Telegram Bot.
- **Telegram Bot Configuration**: Requires a Bot Token and a Chat ID.
- **Document & Photo modes**: Images can be sent as Telegram Photos (may have compression) or Documents (100% untouched original file).
- **Fallback URL Rendering**: When Twitter CDNs fail, the script intercepts `tg:` links to dynamically stream the image back from Telegram to the UI.
- **Selective backup** via tag filters (only backup bookmarks matching specific tags).
- **Periodic backup scan** — every 5 minutes, checks for bookmarks missing backups.

### Auto-tag rules

- Configure rules like `@username -> tag`.
- When bookmarking a post from that user, tags are automatically applied.
- Username autocomplete from existing bookmarks.



### Bulk actions

Floating action bar when items are selected:

- Select All / Clear Selection
- Manage Tags
- Favorite / Unfavorite
- Download
- Backup to Telegram
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

[**Install Pinboard**](https://github.com/gabszap/extensions/raw/refs/heads/main/pinboard/pinboard.user.js)

### Manual install

1. Install a userscript manager.
2. Open the manager dashboard and create a new script.
3. Paste the contents of `pinboard.user.js`.
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

## Cloud Backup (Telegram)

To enable cloud backup to your own private Telegram conversation:

### How to get your Bot Token
1. Open Telegram and search for **@BotFather**.
2. Send the command `/newbot` and follow the prompts to choose a name and username for your bot.
3. Once created, BotFather will give you a **HTTP API Token** (e.g., `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`). Copy this token.

### How to get your Chat ID
1. Search for **@userinfobot** in Telegram and start a chat with it.
2. Depending on where you want to receive your backups, do one of the following:
   - **Directly from your Bot (Private DM):** Send any message to **@userinfobot** and copy the `Id` it replies with (this is YOUR personal account ID, usually a positive number).
   - **Group:** Forward any message from your group to **@userinfobot** OR use the "Share Chat" feature with it. It will reply with the group's ID (which typically starts with `-100`). Don't forget to add your new bot to this group so it can send messages.
3. **Crucial step** (for private bot DMs): Telegram bots cannot initiate conversations. You must search for your new bot in Telegram and send it a `/start` message first to authorize it to send you backups.

### Configuring the Extension
1. Open the Pinboard gallery (`Ctrl+B`) and click **Settings**.
2. Expand the **Cloud Backup** section.
3. Paste both your **Bot Token** and **Chat ID**.
4. Test the bot connection using the migration tool or by bookmarking a new post.
5. Choose between **Document** (lossless) or **Photo** (compressed) modes.
6. Check the "Auto-backup" toggle to automatically upload images going forward.

### Editing Images (Helper Bot Script)
If an image fails to upload properly or is glitched, you can fix it natively via your Telegram Chat using the included `telegram_bot.js` server.

1. Create a `.env` file in the project folder with your token:
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
2. Run the bot server from the terminal:
   ```bash
   node telegram_bot.js
   ```
3. In your Telegram app, **reply** to the glitched message from your bot.
4. Keep the original text empty, attach the **new, correct image**, and type `/edit` in the caption. The bot will instantly replace the media and preserve the original Twitter link text. You can also do `/edit New Caption` to overwrite the text.

## Settings

Accessible from the gallery modal. Collapsible sections:

| Section | Controls |
|---|---|
| **Appearance** | Gallery title, show/hide user labels, show/hide overlays, list preview size (40-150px), grid photo height (150-500px) |
| **Keyboard Shortcuts** | Configurable bindings for gallery, close, view toggle, settings. Reset to defaults. |
| **Cloud Backup** | Auto-backup toggle, Telegram Bot Token/Chat ID, Document/Photo upload methods, tag filter for selective backup |
| **Automation** | Auto-tag rules configuration |
| **Developer** | Debug mode toggle |

## Storage

All data is stored via `GM_setValue`/`GM_getValue` in the userscript manager.

| Key | Type | Description |
|---|---|---|
| `x_internal_bookmarks` | `object[]` | All bookmark data |
| `x_bookmark_tags` | `string[]` | Tag list with order |
| `x_bookmark_settings` | `object` | All settings |
| `x_bookmark_autotag_rules` | `object[]` | Auto-tag rules |

| `x_bookmark_view_mode` | `string` | `grid` / `list` preference |

## Project Structure

```
pinboard/
  pinboard.user.js   Main userscript (single file, no build step)
  README.md             This file
```

## Development Notes

- No build step — edit `pinboard.user.js` directly.
- Run `node -c pinboard.user.js` for syntax validation.
- Bump `@version` in the userscript header on each release.
- The script uses `GM_xmlhttpRequest` for cross-origin API requests to Telegram.
- Image quality URLs use X's `pbs.twimg.com` CDN with `name=4096x4096` parameter.

## Known Limitations

- When X changes its DOM structure, selectors may need updates.
- Bookmarks are stored locally per browser/profile — no cross-device sync (use Telegram backup for image preservation).
- Large bookmark collections (1000+) may cause slower gallery rendering.
- Telegram imposes a 20MB limit for bot uploads via GM_xmlhttpRequest, though X images rarely exceed this.
