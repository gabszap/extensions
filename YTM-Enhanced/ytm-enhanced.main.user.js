// ==UserScript==
// @name        YT-Music Enhancer
// @namespace   YT-Music Enhancer
// @match       *://music.youtube.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// @version     1.46
// @author      gabszap
// @description Script para exibir porcentagem de volume no YouTube Music e outros snippets
// @updateURL   https://github.com/gabszap/extensions/raw/refs/heads/main/YTM-Enhanced/ytm-enhanced.main.user.js
// @downloadURL https://github.com/gabszap/extensions/raw/refs/heads/main/YTM-Enhanced/ytm-enhanced.main.user.js
// ==/UserScript==

(function () {
  "use strict";

  const SCRIPT_NAME = "YT-Music Enhancer";
  const PINNED_PLAYLISTS_STORAGE_KEY = "yt-enhancer:pinned-playlists";
  const HIDDEN_PLAYLISTS_STORAGE_KEY = "yt-enhancer:hidden-playlists";
  const HIDDEN_PLAYLIST_LABELS_STORAGE_KEY = "yt-enhancer:hidden-playlist-labels";
  const PIN_VISIBILITY_MODE_STORAGE_KEY = "yt-enhancer:pin-visibility-mode";
  const SETTINGS_BUTTON_POSITION_STORAGE_KEY =
    "yt-enhancer:settings-button-position";
  const SETTINGS_THEME_STORAGE_KEY = "yt-enhancer:settings-theme";
  const VERSION_CACHE_STORAGE_KEY = "yt-enhancer:last-known-version";
  const STORAGE_MIGRATION_DONE_KEY = "yt-enhancer:storage-migrated-to-vm";
  const LIBRARY_REDIRECT_STORAGE_KEY = "yt-enhancer:library-redirect-playlists";
  const CONTEXT_MENU_HIDDEN_STORAGE_KEY = "yt-enhancer:hidden-context-menu-items";
  const HIDE_UPGRADE_BUTTON_STORAGE_KEY = "yt-enhancer:hide-upgrade-button";
  const HIDE_LISTEN_AGAIN_ARTISTS_STORAGE_KEY = "yt-enhancer:hide-listen-again-artists";
  const HIDDEN_ARTISTS_STORAGE_KEY = "yt-enhancer:hidden-artists";
  const HIDDEN_ARTIST_LABELS_STORAGE_KEY = "yt-enhancer:hidden-artist-labels";
  const HIDDEN_HOMEPAGE_SECTIONS_STORAGE_KEY = "yt-enhancer:hidden-homepage-sections";
  const HIDDEN_DYNAMIC_SECTIONS_STORAGE_KEY = "yt-enhancer:hidden-dynamic-sections";
  const DEFAULT_PIN_VISIBILITY_MODE = "dynamic";
  const PIN_VISIBILITY_MODES = ["always", "dynamic", "hover-only"];
  const DEFAULT_SETTINGS_THEME = {
    popupAccent: "#ff3f66",
    popupBackground: "#101116",
    pinColor: "#ff8aa1",
    pinPinnedColor: "#ff2956",
  };
  const SETTINGS_THEME_PRESETS = {
    "yt-red": {
      popupAccent: "#ff3f66",
      popupBackground: "#101116",
      pinColor: "#ff8aa1",
      pinPinnedColor: "#ff2956",
    },
    "blue-neon": {
      popupAccent: "#37c7ff",
      popupBackground: "#08131f",
      pinColor: "#74d3ff",
      pinPinnedColor: "#2cc6ff",
    },
    monochrome: {
      popupAccent: "#cfd3db",
      popupBackground: "#0e1014",
      pinColor: "#8f949b",
      pinPinnedColor: "#f4f5f7",
    },
    catppuccin: {
      popupAccent: "#cba6f7",
      popupBackground: "#1e1e2e",
      pinColor: "#89b4fa",
      pinPinnedColor: "#cba6f7",
    },
  };
  const CATPPUCCIN_VARIANT_PRESETS = {
    latte: {
      popupAccent: "#8839ef",
      popupBackground: "#eff1f5",
      pinColor: "#1e66f5",
      pinPinnedColor: "#8839ef",
    },
    frappe: {
      popupAccent: "#ca9ee6",
      popupBackground: "#303446",
      pinColor: "#8caaee",
      pinPinnedColor: "#ca9ee6",
    },
    macchiato: {
      popupAccent: "#c6a0f6",
      popupBackground: "#24273a",
      pinColor: "#8aadf4",
      pinPinnedColor: "#c6a0f6",
    },
    mocha: {
      popupAccent: "#cba6f7",
      popupBackground: "#1e1e2e",
      pinColor: "#89b4fa",
      pinPinnedColor: "#cba6f7",
    },
  };
  const DEFAULT_CATPPUCCIN_VARIANT = "mocha";

  const CONTEXT_MENU_ITEMS = [
    { id: "start-radio", label: "Iniciar radio" },
    { id: "play-next", label: "Tocar a seguir" },
    { id: "add-to-queue", label: "Adicionar a fila" },
    { id: "save-to-library", label: "Salvar na biblioteca" },
    { id: "remove-from-library", label: "Remover da biblioteca" },
    { id: "add-to-liked", label: "Adicionar as musicas que gostei" },
    { id: "remove-from-liked", label: "Remover das musicas que gostei" },
    { id: "download", label: "Baixar" },
    { id: "save-to-playlist", label: "Salvar na playlist" },
    { id: "remove-from-playlist", label: "Remover da playlist" },
    { id: "remove-from-queue", label: "Remover da fila" },
    { id: "go-to-album", label: "Ir para o album" },
    { id: "go-to-artist", label: "Ir para a pagina do artista" },
    { id: "show-credits", label: "Mostrar creditos da musica" },
    { id: "share", label: "Compartilhar" },
    { id: "report", label: "Denunciar" },
    { id: "pin-to-listen-again", label: "Fixar em Ouvir de novo" },
    { id: "clear-queue", label: "Remover fila" },
    { id: "stats-for-nerds", label: "Estatisticas para nerds" },
  ];

  const HOMEPAGE_SECTIONS = [
    { id: "favoritos-antigos", label: "Favoritos antigos" },
    { id: "da-sua-biblioteca", label: "Da sua biblioteca" },
    { id: "canais-de-musica", label: "Canais de musica que voce pode gostar" },
    { id: "da-comunidade", label: "Da comunidade" },
    { id: "parecido-com", label: "Parecido com", matchStrapline: true, hint: "Oculta playlists e artistas similares" },
    { id: "lancamentos", label: "Lancamentos" },
    { id: "albuns-para-voce", label: "Albuns para voce" },
    { id: "novidades-e-classicos", label: "Novidades e classicos" },
    { id: "mixtapes", label: "Mixtapes criadas para voce" },
    { id: "radios", label: "Radios para voce" },
    { id: "playlists-em-destaque", label: "Playlists em destaque para voce" },
    { id: "musica-indie", label: "Musica indie e alternativa" },
    { id: "videos-recomendados", label: "Videos de musica recomendados" },
    { id: "paradas", label: "Paradas", hint: "Charts e top musicas" },
    { id: "tocou-nos-shorts", label: "Tocou nos Shorts" },
    { id: "descobertas-diarias", label: "Suas descobertas diarias" },
    { id: "continuar-ouvindo", label: "Continuar ouvindo" },
    { id: "covers-e-remixes", label: "Covers e remixes" },
    { id: "mixes-longos", label: "Mixes longos" },
    { id: "programas-para-voce", label: "Programas para voce", hint: "Podcasts" },
    { id: "musicas-em-alta", label: "Musicas em alta para voce" },
    { id: "apresentacoes-ao-vivo", label: "Apresentaçoes ao vivo", hint: "Lives e shows ao vivo" },
  ];

  function hasViolentmonkeyStorage() {
    return typeof GM_getValue === "function" && typeof GM_setValue === "function";
  }

  function readLegacyLocalStorageValue(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return undefined;

      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    } catch {
      return undefined;
    }
  }

  function getStoredValue(key, defaultValue) {
    if (hasViolentmonkeyStorage()) {
      const value = GM_getValue(key);
      return value === undefined ? defaultValue : value;
    }

    const legacyValue = readLegacyLocalStorageValue(key);
    return legacyValue === undefined ? defaultValue : legacyValue;
  }

  function setStoredValue(key, value) {
    if (hasViolentmonkeyStorage()) {
      GM_setValue(key, value);
      return;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignora falhas de storage
    }
  }

  function migrateLegacyStorageToViolentmonkey() {
    if (!hasViolentmonkeyStorage()) return;

    const hasMigrated = GM_getValue(STORAGE_MIGRATION_DONE_KEY, false);
    if (hasMigrated) return;

    const keysToMigrate = [
      PINNED_PLAYLISTS_STORAGE_KEY,
      HIDDEN_PLAYLISTS_STORAGE_KEY,
      HIDDEN_PLAYLIST_LABELS_STORAGE_KEY,
      PIN_VISIBILITY_MODE_STORAGE_KEY,
      SETTINGS_BUTTON_POSITION_STORAGE_KEY,
      SETTINGS_THEME_STORAGE_KEY,
      VERSION_CACHE_STORAGE_KEY,
      CONTEXT_MENU_HIDDEN_STORAGE_KEY,
      HIDE_UPGRADE_BUTTON_STORAGE_KEY,
      HIDE_LISTEN_AGAIN_ARTISTS_STORAGE_KEY,
      HIDDEN_ARTISTS_STORAGE_KEY,
      HIDDEN_ARTIST_LABELS_STORAGE_KEY,
      HIDDEN_HOMEPAGE_SECTIONS_STORAGE_KEY,
      HIDDEN_DYNAMIC_SECTIONS_STORAGE_KEY,
    ];

    keysToMigrate.forEach((key) => {
      const existingValue = GM_getValue(key);
      if (existingValue !== undefined) return;

      const legacyValue = readLegacyLocalStorageValue(key);
      if (legacyValue !== undefined) {
        GM_setValue(key, legacyValue);
      }
    });

    GM_setValue(STORAGE_MIGRATION_DONE_KEY, true);
  }

  migrateLegacyStorageToViolentmonkey();

  function extractVersionFromMetadata(metadataText) {
    if (typeof metadataText !== "string") return "";

    const match = metadataText.match(/@version\s+([^\s]+)/);
    return match && match[1] ? match[1].trim() : "";
  }

  function cacheScriptVersion(version) {
    if (!version || version === "unknown") return;

    setStoredValue(VERSION_CACHE_STORAGE_KEY, version);
  }

  function getScriptVersion() {
    const managerInfo =
      globalThis.GM_info ||
      globalThis.GM?.info ||
      globalThis.window?.GM_info ||
      globalThis.window?.GM?.info;

    const metadataCandidates = [
      managerInfo?.scriptMetaStr,
      managerInfo?.script?.scriptMetaStr,
      managerInfo?.script?.metaStr,
    ];

    for (const metadataString of metadataCandidates) {
      const parsedVersion = extractVersionFromMetadata(metadataString);
      if (parsedVersion) {
        cacheScriptVersion(parsedVersion);
        return parsedVersion;
      }
    }

    const versionCandidates = [
      managerInfo?.script?.version,
      managerInfo?.script?.ver,
    ];

    for (const versionCandidate of versionCandidates) {
      if (typeof versionCandidate === "string" && versionCandidate.trim()) {
        const normalizedVersion = versionCandidate.trim();
        cacheScriptVersion(normalizedVersion);
        return normalizedVersion;
      }
    }

    const currentScriptVersion = extractVersionFromMetadata(
      document.currentScript?.textContent || "",
    );
    if (currentScriptVersion) {
      cacheScriptVersion(currentScriptVersion);
      return currentScriptVersion;
    }

    const pageScripts = Array.from(document.querySelectorAll("script"));
    for (const scriptElement of pageScripts) {
      const scriptText = scriptElement.textContent || "";
      if (!scriptText.includes(SCRIPT_NAME) || !scriptText.includes("@version")) {
        continue;
      }

      const scriptVersion = extractVersionFromMetadata(scriptText);
      if (scriptVersion) {
        cacheScriptVersion(scriptVersion);
        return scriptVersion;
      }
    }

    const cachedVersion = getStoredValue(VERSION_CACHE_STORAGE_KEY, "");
    if (typeof cachedVersion === "string" && cachedVersion.trim()) {
      return cachedVersion.trim();
    }

    return "unknown";
  }

  const SCRIPT_VERSION = getScriptVersion();

  console.log(`[YT-Enhancer] 🎵 Script iniciado (v${SCRIPT_VERSION})!`);

  // === CONFIGURAÇÃO ===

  function normalizePinVisibilityMode(mode) {
    const normalizedMode = (mode || "").trim().toLowerCase();
    return PIN_VISIBILITY_MODES.includes(normalizedMode)
      ? normalizedMode
      : DEFAULT_PIN_VISIBILITY_MODE;
  }

  function loadPinVisibilityMode() {
    const rawMode = getStoredValue(
      PIN_VISIBILITY_MODE_STORAGE_KEY,
      DEFAULT_PIN_VISIBILITY_MODE,
    );
    return normalizePinVisibilityMode(
      typeof rawMode === "string" ? rawMode : DEFAULT_PIN_VISIBILITY_MODE,
    );
  }

  let pinVisibilityMode = loadPinVisibilityMode();

  let libraryRedirectToPlaylists = getStoredValue(LIBRARY_REDIRECT_STORAGE_KEY, false);

  function setLibraryRedirect(enabled) {
    libraryRedirectToPlaylists = Boolean(enabled);
    setStoredValue(LIBRARY_REDIRECT_STORAGE_KEY, libraryRedirectToPlaylists);
  }

  function applyPinVisibilityMode(mode) {
    const nextMode = normalizePinVisibilityMode(mode);
    pinVisibilityMode = nextMode;

    document.documentElement.dataset.ytEnhancerPinMode = nextMode;

    setStoredValue(PIN_VISIBILITY_MODE_STORAGE_KEY, nextMode);

    return nextMode;
  }

  function normalizeHexColor(value, fallbackColor) {
    const fallback = (fallbackColor || "#000000").toLowerCase();
    const normalizedValue = typeof value === "string" ? value.trim().toLowerCase() : "";

    if (/^#[0-9a-f]{6}$/i.test(normalizedValue)) {
      return normalizedValue;
    }

    const shortHexMatch = normalizedValue.match(/^#([0-9a-f]{3})$/i);
    if (shortHexMatch) {
      const [r, g, b] = shortHexMatch[1];
      return `#${r}${r}${g}${g}${b}${b}`;
    }

    return fallback;
  }

  function normalizeSettingsTheme(theme) {
    const source = theme && typeof theme === "object" ? theme : {};

    return {
      popupAccent: normalizeHexColor(
        source.popupAccent,
        DEFAULT_SETTINGS_THEME.popupAccent,
      ),
      popupBackground: normalizeHexColor(
        source.popupBackground,
        DEFAULT_SETTINGS_THEME.popupBackground,
      ),
      pinColor: normalizeHexColor(source.pinColor, DEFAULT_SETTINGS_THEME.pinColor),
      pinPinnedColor: normalizeHexColor(
        source.pinPinnedColor,
        DEFAULT_SETTINGS_THEME.pinPinnedColor,
      ),
    };
  }

  function normalizeCatppuccinVariantName(variantName) {
    const normalizedName =
      typeof variantName === "string" ? variantName.trim().toLowerCase() : "";
    return Object.prototype.hasOwnProperty.call(
      CATPPUCCIN_VARIANT_PRESETS,
      normalizedName,
    )
      ? normalizedName
      : DEFAULT_CATPPUCCIN_VARIANT;
  }

  function areThemesEqual(leftTheme, rightTheme) {
    const left = normalizeSettingsTheme(leftTheme);
    const right = normalizeSettingsTheme(rightTheme);

    return (
      left.popupAccent === right.popupAccent &&
      left.popupBackground === right.popupBackground &&
      left.pinColor === right.pinColor &&
      left.pinPinnedColor === right.pinPinnedColor
    );
  }

  function getMatchingCatppuccinVariant(theme) {
    const normalizedTheme = normalizeSettingsTheme(theme);

    return (
      Object.entries(CATPPUCCIN_VARIANT_PRESETS).find(([, variantTheme]) =>
        areThemesEqual(normalizedTheme, variantTheme),
      )?.[0] || null
    );
  }

  function getMatchingThemePresetName(theme) {
    const normalizedTheme = normalizeSettingsTheme(theme);

    const directPreset = Object.entries(SETTINGS_THEME_PRESETS).find(
      ([presetName, presetTheme]) =>
        presetName !== "catppuccin" && areThemesEqual(normalizedTheme, presetTheme),
    )?.[0];

    if (directPreset) return directPreset;

    if (
      areThemesEqual(normalizedTheme, SETTINGS_THEME_PRESETS.catppuccin) ||
      getMatchingCatppuccinVariant(normalizedTheme)
    ) {
      return "catppuccin";
    }

    return null;
  }

  function loadSettingsTheme() {
    return normalizeSettingsTheme(
      getStoredValue(SETTINGS_THEME_STORAGE_KEY, DEFAULT_SETTINGS_THEME),
    );
  }

  let settingsTheme = loadSettingsTheme();

  function hexToRgb(hexColor) {
    const normalized = normalizeHexColor(hexColor, "#000000");
    return {
      r: Number.parseInt(normalized.slice(1, 3), 16),
      g: Number.parseInt(normalized.slice(3, 5), 16),
      b: Number.parseInt(normalized.slice(5, 7), 16),
    };
  }

  function rgbToHex({ r, g, b }) {
    const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
    const toHex = (value) => clamp(value).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function mixHexColors(baseColor, mixColor, mixRatio) {
    const ratio = Math.max(0, Math.min(1, Number(mixRatio) || 0));
    const baseRgb = hexToRgb(baseColor);
    const mixRgb = hexToRgb(mixColor);

    return rgbToHex({
      r: baseRgb.r * (1 - ratio) + mixRgb.r * ratio,
      g: baseRgb.g * (1 - ratio) + mixRgb.g * ratio,
      b: baseRgb.b * (1 - ratio) + mixRgb.b * ratio,
    });
  }

  function rgbaFromHex(hexColor, alpha) {
    const rgb = hexToRgb(hexColor);
    const normalizedAlpha = Math.max(0, Math.min(1, Number(alpha) || 0));
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${normalizedAlpha})`;
  }

  function getColorBrightness(hexColor) {
    const { r, g, b } = hexToRgb(hexColor);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  function applySettingsTheme(theme, persist = true, emitEvent = true) {
    const normalizedTheme = normalizeSettingsTheme(theme);
    settingsTheme = normalizedTheme;

    const isDarkBackground = getColorBrightness(normalizedTheme.popupBackground) < 150;
    const popupAccent = normalizedTheme.popupAccent;
    const popupBackground = normalizedTheme.popupBackground;

    const variables = {
      "--yte-pin-color": normalizedTheme.pinColor,
      "--yte-pin-pinned-color": normalizedTheme.pinPinnedColor,
      "--yte-pin-glow": rgbaFromHex(normalizedTheme.pinPinnedColor, 0.42),
      "--yte-popup-accent": popupAccent,
      "--yte-popup-accent-strong": mixHexColors(popupAccent, "#000000", 0.28),
      "--yte-popup-accent-soft": rgbaFromHex(
        popupAccent,
        isDarkBackground ? 0.18 : 0.12,
      ),
      "--yte-popup-accent-border": rgbaFromHex(
        popupAccent,
        isDarkBackground ? 0.3 : 0.38,
      ),
      "--yte-popup-bg-top": mixHexColors(
        popupBackground,
        isDarkBackground ? "#1a1d24" : "#ffffff",
        isDarkBackground ? 0.2 : 0.45,
      ),
      "--yte-popup-bg-mid": mixHexColors(
        popupBackground,
        isDarkBackground ? "#000000" : "#f3f4f8",
        isDarkBackground ? 0.22 : 0.3,
      ),
      "--yte-popup-bg-bottom": mixHexColors(
        popupBackground,
        isDarkBackground ? "#000000" : "#edf0f6",
        isDarkBackground ? 0.38 : 0.4,
      ),
      "--yte-popup-text": isDarkBackground ? "#f5f5f6" : "#18191d",
      "--yte-popup-muted": isDarkBackground
        ? "rgba(255, 255, 255, 0.76)"
        : "rgba(35, 38, 46, 0.75)",
      "--yte-popup-label": isDarkBackground
        ? mixHexColors(popupAccent, "#ffffff", 0.35)
        : mixHexColors(popupAccent, "#15161a", 0.18),
      "--yte-popup-select-bg": mixHexColors(
        popupBackground,
        isDarkBackground ? "#2a2d36" : "#ffffff",
        isDarkBackground ? 0.38 : 0.72,
      ),
      "--yte-popup-select-border": rgbaFromHex(
        popupAccent,
        isDarkBackground ? 0.26 : 0.32,
      ),
      "--yte-popup-close-color": isDarkBackground
        ? "rgba(255, 255, 255, 0.8)"
        : "rgba(30, 33, 39, 0.84)",
      "--yte-popup-close-hover-bg": mixHexColors(popupAccent, "#000000", 0.22),
      "--yte-popup-toggle-grad-a": mixHexColors(popupAccent, "#ffffff", 0.05),
      "--yte-popup-toggle-grad-b": mixHexColors(popupAccent, "#000000", 0.22),
      "--yte-popup-toggle-border": rgbaFromHex(
        popupAccent,
        isDarkBackground ? 0.44 : 0.52,
      ),
      "--yte-popup-toggle-shadow": rgbaFromHex(popupAccent, 0.38),
    };

    Object.entries(variables).forEach(([name, value]) => {
      document.documentElement.style.setProperty(name, value);
    });

    if (persist) {
      setStoredValue(SETTINGS_THEME_STORAGE_KEY, normalizedTheme);
    }

    if (emitEvent) {
      document.dispatchEvent(
        new CustomEvent("yt-enhancer:theme-change", {
          detail: { theme: normalizedTheme },
        }),
      );
    }

    return normalizedTheme;
  }

  function applyThemePreset(presetName, persist = true) {
    const normalizedPresetName = typeof presetName === "string" ? presetName : "";

    if (normalizedPresetName === "catppuccin") {
      return applyCatppuccinVariant(DEFAULT_CATPPUCCIN_VARIANT, persist);
    }

    const presetTheme = SETTINGS_THEME_PRESETS[normalizedPresetName];

    if (!presetTheme) {
      return settingsTheme;
    }

    return applySettingsTheme(
      {
        ...DEFAULT_SETTINGS_THEME,
        ...presetTheme,
      },
      persist,
    );
  }

  function applyCatppuccinVariant(variantName, persist = true) {
    const normalizedVariant = normalizeCatppuccinVariantName(variantName);
    const variantTheme = CATPPUCCIN_VARIANT_PRESETS[normalizedVariant];

    return applySettingsTheme(
      {
        ...DEFAULT_SETTINGS_THEME,
        ...variantTheme,
      },
      persist,
    );
  }

  function normalizePlaylistName(name) {
    return (name || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function extractPlaylistIdFromUrl(url) {
    if (!url) return "";

    try {
      const parsedUrl = new URL(url, window.location.origin);
      return parsedUrl.searchParams.get("list") || "";
    } catch {
      return "";
    }
  }

  function normalizeSearchText(text) {
    return normalizePlaylistName(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isLikedSongsTitle(title) {
    const normalized = normalizeSearchText(title);

    if (!normalized) return false;

    return (
      normalized === "gostei" ||
      normalized === "liked" ||
      normalized === "liked songs" ||
      normalized === "liked music" ||
      normalized.includes("marcada como gost") ||
      normalized.includes("marcadas como gost") ||
      normalized.includes("marcada como gostei") ||
      normalized.includes("marcadas como gostei") ||
      normalized.includes("musicas marcadas como gostei") ||
      normalized.includes("musica marcada como gostei")
    );
  }

  function isCreatePlaylistTitle(title) {
    const normalized = normalizeSearchText(title);
    return normalized === "nova playlist" || normalized === "new playlist";
  }

  function isLikedSongsPinnedKey(key) {
    if (!key) return false;

    if (key.startsWith("id:")) {
      return key.slice(3).startsWith("LM");
    }

    if (key.startsWith("name:")) {
      return isLikedSongsTitle(key.slice(5));
    }

    return false;
  }

  function createPlaylistKeys({ id, name }) {
    const keys = [];

    if (id) {
      keys.push(`id:${id}`);
    }

    const normalizedName = normalizePlaylistName(name);
    if (normalizedName) {
      keys.push(`name:${normalizedName}`);
    }

    return [...new Set(keys)];
  }

  function normalizePlaylistKeys(keys) {
    if (Array.isArray(keys)) {
      return [...new Set(keys.filter((key) => typeof key === "string" && key))];
    }

    if (typeof keys === "string" && keys) {
      return [keys];
    }

    return [];
  }

  function hasLikedSongsKey(keys) {
    return normalizePlaylistKeys(keys).some((key) => isLikedSongsPinnedKey(key));
  }

  function loadStoredKeyArray(storageKey) {
    const storedValue = getStoredValue(storageKey, []);

    if (Array.isArray(storedValue)) {
      return storedValue;
    }

    if (typeof storedValue === "string" && storedValue.trim()) {
      try {
        const parsedFromString = JSON.parse(storedValue);
        return Array.isArray(parsedFromString) ? parsedFromString : [];
      } catch {
        return [];
      }
    }

    return [];
  }

  function loadPinnedPlaylists() {
    try {
      const parsed = loadStoredKeyArray(PINNED_PLAYLISTS_STORAGE_KEY);

      if (!Array.isArray(parsed)) return [];

      return [...new Set(parsed)].filter(
        (key) =>
          typeof key === "string" &&
          key.trim().length > 0 &&
          !isLikedSongsPinnedKey(key),
      );
    } catch (error) {
      console.warn(
        "[YT-Enhancer] Não foi possível ler playlists fixadas.",
        error,
      );
      return [];
    }
  }

  function loadHiddenPlaylists() {
    try {
      const parsed = loadStoredKeyArray(HIDDEN_PLAYLISTS_STORAGE_KEY);

      return [...new Set(parsed)].filter(
        (key) =>
          typeof key === "string" &&
          key.trim().length > 0 &&
          !isLikedSongsPinnedKey(key),
      );
    } catch (error) {
      console.warn(
        "[YT-Enhancer] Não foi possível ler playlists ocultas.",
        error,
      );
      return [];
    }
  }

  function loadHiddenPlaylistLabels() {
    try {
      const storedValue = getStoredValue(HIDDEN_PLAYLIST_LABELS_STORAGE_KEY, {});
      const parsedLabels =
        storedValue && typeof storedValue === "object" && !Array.isArray(storedValue)
          ? storedValue
          : {};

      return Object.fromEntries(
        Object.entries(parsedLabels).filter(
          ([key, label]) =>
            typeof key === "string" &&
            key.trim().length > 0 &&
            typeof label === "string" &&
            label.trim().length > 0,
        ),
      );
    } catch (error) {
      console.warn(
        "[YT-Enhancer] Não foi possível ler nomes de playlists ocultas.",
        error,
      );
      return {};
    }
  }

  let pinnedPlaylistKeys = loadPinnedPlaylists();
  let hiddenPlaylistKeys = loadHiddenPlaylists();
  let hiddenPlaylistLabels = loadHiddenPlaylistLabels();
  const playlistIdByName = new Map();

  function savePinnedPlaylists() {
    try {
      pinnedPlaylistKeys = [...new Set(pinnedPlaylistKeys)].filter(
        (key) => !isLikedSongsPinnedKey(key),
      );

      setStoredValue(PINNED_PLAYLISTS_STORAGE_KEY, pinnedPlaylistKeys);
    } catch (error) {
      console.warn(
        "[YT-Enhancer] Não foi possível salvar playlists fixadas.",
        error,
      );
    }
  }

  function saveHiddenPlaylists() {
    try {
      hiddenPlaylistKeys = [...new Set(hiddenPlaylistKeys)].filter(
        (key) => !isLikedSongsPinnedKey(key),
      );

      const allowedKeys = new Set(hiddenPlaylistKeys);
      hiddenPlaylistLabels = Object.fromEntries(
        Object.entries(hiddenPlaylistLabels).filter(
          ([key, label]) =>
            allowedKeys.has(key) && typeof label === "string" && label.trim().length > 0,
        ),
      );

      setStoredValue(HIDDEN_PLAYLISTS_STORAGE_KEY, hiddenPlaylistKeys);
      setStoredValue(HIDDEN_PLAYLIST_LABELS_STORAGE_KEY, hiddenPlaylistLabels);

      document.dispatchEvent(
        new CustomEvent("yt-enhancer:hidden-playlists-change", {
          detail: { count: hiddenPlaylistKeys.length },
        }),
      );
    } catch (error) {
      console.warn(
        "[YT-Enhancer] Não foi possível salvar playlists ocultas.",
        error,
      );
    }
  }

  function rememberHiddenPlaylistLabel(keys, title) {
    const normalizedTitle = (title || "").replace(/\s+/g, " ").trim();
    if (!normalizedTitle) return;

    normalizePlaylistKeys(keys).forEach((key) => {
      if (!key) return;
      hiddenPlaylistLabels[key] = normalizedTitle;
    });
  }

  function getHiddenPlaylistLabel(key) {
    const storedLabel = hiddenPlaylistLabels[key];
    if (typeof storedLabel === "string" && storedLabel.trim()) {
      return storedLabel.trim();
    }

    if (key.startsWith("name:")) {
      const rawName = key.slice(5).trim();
      return rawName
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
    }

    if (key.startsWith("id:")) {
      return `Playlist ${key.slice(3, 10)}`;
    }

    return "Playlist oculta";
  }

  function getHiddenPlaylistGroups() {
    const groups = new Map();

    hiddenPlaylistKeys.forEach((key) => {
      const label = getHiddenPlaylistLabel(key);
      const groupKey = normalizePlaylistName(label || key);
      const existingGroup = groups.get(groupKey);

      if (existingGroup) {
        existingGroup.keys.push(key);
        return;
      }

      groups.set(groupKey, {
        label,
        keys: [key],
      });
    });

    return Array.from(groups.values());
  }

  function isPlaylistHidden(keys) {
    const normalizedKeys = normalizePlaylistKeys(keys);
    return normalizedKeys.some((key) => hiddenPlaylistKeys.includes(key));
  }

  function hidePlaylist(keys, title) {
    const normalizedKeys = normalizePlaylistKeys(keys).filter(
      (key) => !isLikedSongsPinnedKey(key),
    );
    if (normalizedKeys.length === 0) return false;

    rememberHiddenPlaylistLabel(normalizedKeys, title);

    normalizedKeys.forEach((key) => {
      if (!hiddenPlaylistKeys.includes(key)) {
        hiddenPlaylistKeys.push(key);
      }
    });

    saveHiddenPlaylists();
    return true;
  }

  function unhidePlaylist(keys) {
    const normalizedKeys = normalizePlaylistKeys(keys);
    if (normalizedKeys.length === 0) return false;

    hiddenPlaylistKeys = hiddenPlaylistKeys.filter(
      (currentKey) => !normalizedKeys.includes(currentKey),
    );
    normalizedKeys.forEach((key) => {
      delete hiddenPlaylistLabels[key];
    });

    saveHiddenPlaylists();
    return true;
  }

  function toggleHiddenPlaylist(keys, title) {
    if (isPlaylistHidden(keys)) {
      unhidePlaylist(keys);
      return false;
    }

    hidePlaylist(keys, title);
    return true;
  }

  function unhideAllPlaylists() {
    hiddenPlaylistKeys = [];
    hiddenPlaylistLabels = {};
    saveHiddenPlaylists();
  }

  // === CONTEXT MENU DEBLOAT ===
  let hiddenContextMenuItems = getStoredValue(CONTEXT_MENU_HIDDEN_STORAGE_KEY, []);

  // === UPGRADE BUTTON DEBLOAT ===
  let hideUpgradeButton = getStoredValue(HIDE_UPGRADE_BUTTON_STORAGE_KEY, false);

  function setHideUpgradeButton(hidden) {
    hideUpgradeButton = Boolean(hidden);
    setStoredValue(HIDE_UPGRADE_BUTTON_STORAGE_KEY, hideUpgradeButton);
  }

  // === LISTEN AGAIN ARTISTS DEBLOAT ===
  let hideListenAgainArtists = getStoredValue(HIDE_LISTEN_AGAIN_ARTISTS_STORAGE_KEY, false);
  let hiddenArtistKeys = getStoredValue(HIDDEN_ARTISTS_STORAGE_KEY, []);
  let hiddenArtistLabels = getStoredValue(HIDDEN_ARTIST_LABELS_STORAGE_KEY, {});

  if (!Array.isArray(hiddenArtistKeys)) hiddenArtistKeys = [];
  if (!hiddenArtistLabels || typeof hiddenArtistLabels !== "object") hiddenArtistLabels = {};

  function setHideListenAgainArtists(hidden) {
    hideListenAgainArtists = Boolean(hidden);
    setStoredValue(HIDE_LISTEN_AGAIN_ARTISTS_STORAGE_KEY, hideListenAgainArtists);
  }

  function saveHiddenArtists() {
    setStoredValue(HIDDEN_ARTISTS_STORAGE_KEY, hiddenArtistKeys);
    setStoredValue(HIDDEN_ARTIST_LABELS_STORAGE_KEY, hiddenArtistLabels);
  }

  function hideArtist(channelId, label) {
    if (!channelId) return;
    if (!hiddenArtistKeys.includes(channelId)) {
      hiddenArtistKeys.push(channelId);
    }
    if (label) {
      hiddenArtistLabels[channelId] = label;
    }
    saveHiddenArtists();
    document.dispatchEvent(new CustomEvent("yt-enhancer:hidden-artists-change"));
  }

  function unhideArtist(channelId) {
    hiddenArtistKeys = hiddenArtistKeys.filter((id) => id !== channelId);
    delete hiddenArtistLabels[channelId];
    saveHiddenArtists();
    document.dispatchEvent(new CustomEvent("yt-enhancer:hidden-artists-change"));
  }

  function unhideAllArtists() {
    hiddenArtistKeys = [];
    hiddenArtistLabels = {};
    saveHiddenArtists();
    document.dispatchEvent(new CustomEvent("yt-enhancer:hidden-artists-change"));
  }

  function isArtistHidden(channelId) {
    return hiddenArtistKeys.includes(channelId);
  }

  function getHiddenArtistList() {
    return hiddenArtistKeys.map((channelId) => ({
      channelId,
      label: hiddenArtistLabels[channelId] || channelId,
    }));
  }

  function saveHiddenMenuItems() {
    setStoredValue(CONTEXT_MENU_HIDDEN_STORAGE_KEY, hiddenContextMenuItems);
  }

  function isContextMenuItemHidden(itemId) {
    return hiddenContextMenuItems.includes(itemId);
  }

  function setContextMenuItemHidden(itemId, hidden) {
    if (hidden && !hiddenContextMenuItems.includes(itemId)) {
      hiddenContextMenuItems.push(itemId);
    } else if (!hidden) {
      hiddenContextMenuItems = hiddenContextMenuItems.filter((id) => id !== itemId);
    }
    saveHiddenMenuItems();
  }

  // === HOMEPAGE SECTIONS DEBLOAT ===
  let hiddenHomepageSections = getStoredValue(HIDDEN_HOMEPAGE_SECTIONS_STORAGE_KEY, []);
  if (!Array.isArray(hiddenHomepageSections)) hiddenHomepageSections = [];

  function saveHiddenHomepageSections() {
    setStoredValue(HIDDEN_HOMEPAGE_SECTIONS_STORAGE_KEY, hiddenHomepageSections);
  }

  function isHomepageSectionHidden(sectionId) {
    return hiddenHomepageSections.includes(sectionId);
  }

  function setHomepageSectionHidden(sectionId, hidden) {
    if (hidden && !hiddenHomepageSections.includes(sectionId)) {
      hiddenHomepageSections.push(sectionId);
    } else if (!hidden) {
      hiddenHomepageSections = hiddenHomepageSections.filter((id) => id !== sectionId);
    }
    saveHiddenHomepageSections();
  }

  // === DYNAMIC (PERSONALIZED) SECTIONS DEBLOAT ===
  let hiddenDynamicSections = getStoredValue(HIDDEN_DYNAMIC_SECTIONS_STORAGE_KEY, []);
  if (!Array.isArray(hiddenDynamicSections)) hiddenDynamicSections = [];

  function saveHiddenDynamicSections() {
    setStoredValue(HIDDEN_DYNAMIC_SECTIONS_STORAGE_KEY, hiddenDynamicSections);
  }

  function isDynamicSectionHidden(normalizedTitle) {
    return hiddenDynamicSections.some((s) => s.title === normalizedTitle);
  }

  function hideDynamicSection(normalizedTitle, displayTitle) {
    if (!isDynamicSectionHidden(normalizedTitle)) {
      hiddenDynamicSections.push({ title: normalizedTitle, displayTitle: displayTitle });
      saveHiddenDynamicSections();
    }
  }

  function unhideDynamicSection(normalizedTitle) {
    hiddenDynamicSections = hiddenDynamicSections.filter((s) => s.title !== normalizedTitle);
    saveHiddenDynamicSections();
  }

  function normalizeMenuText(text) {
    if (!text) return "";
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/["""''«»\u201C\u201D\u2018\u2019]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function matchMenuItemId(menuText) {
    const normalized = normalizeMenuText(menuText);
    if (!normalized) return null;

    for (const item of CONTEXT_MENU_ITEMS) {
      const normalizedLabel = normalizeMenuText(item.label);
      if (normalized.includes(normalizedLabel)) {
        return item.id;
      }
    }
    return null;
  }

  function isPlaylistPinned(keys) {
    const normalizedKeys = normalizePlaylistKeys(keys);
    return normalizedKeys.some((key) => pinnedPlaylistKeys.includes(key));
  }

  function togglePinnedPlaylist(keys) {
    const normalizedKeys = normalizePlaylistKeys(keys).filter(
      (key) => !isLikedSongsPinnedKey(key),
    );
    if (normalizedKeys.length === 0) return false;

    if (isPlaylistPinned(normalizedKeys)) {
      pinnedPlaylistKeys = pinnedPlaylistKeys.filter(
        (currentKey) => !normalizedKeys.includes(currentKey),
      );
      savePinnedPlaylists();
      return false;
    }

    normalizedKeys.forEach((key) => {
      if (!pinnedPlaylistKeys.includes(key)) {
        pinnedPlaylistKeys.push(key);
      }
    });

    savePinnedPlaylists();
    return true;
  }

  function getPinnedIndex(keys) {
    const normalizedKeys = normalizePlaylistKeys(keys);

    let lowestIndex = Number.MAX_SAFE_INTEGER;
    normalizedKeys.forEach((key) => {
      const index = pinnedPlaylistKeys.indexOf(key);
      if (index !== -1) {
        lowestIndex = Math.min(lowestIndex, index);
      }
    });

    return lowestIndex;
  }

  let processLibraryPlaylistsTimer = null;

  function bringItemsToTop(container, items) {
    if (!container) return;

    const orderedItems = items.filter(
      (item, index) => item && items.indexOf(item) === index,
    );
    if (orderedItems.length === 0) return;

    const allChildren = Array.from(container.children);

    let alreadyCorrect = true;
    for (let i = 0; i < orderedItems.length; i++) {
      if (allChildren[i] !== orderedItems[i]) {
        alreadyCorrect = false;
        break;
      }
    }

    if (alreadyCorrect) return;

    let cursor = container.firstElementChild;

    orderedItems.forEach((item) => {
      if (item === cursor) {
        cursor = cursor ? cursor.nextElementSibling : null;
        return;
      }

      container.insertBefore(item, cursor);
    });
  }

  function processLibraryPlaylists() {
    if (!isLibraryPlaylistsPage()) return false;

    const entries = getLibraryPlaylistEntries();
    if (entries.length === 0) return false;

    const visibleEntries = [];

    entries.forEach((entry) => {
      entry.item
        .querySelectorAll(".yt-enhancer-library-pin-toggle")
        .forEach((button) => button.remove());
      ensureLibraryHideButton(entry);

      const hidden = isPlaylistHidden(entry.keys);
      entry.item.style.display = hidden ? "none" : "";

      if (!hidden) {
        visibleEntries.push(entry);
      }
    });

    const entriesByContainer = new Map();
    visibleEntries.forEach((entry) => {
      const container =
        entry.item.closest("#items") ||
        entry.item.closest("#contents") ||
        entry.item.closest(".contents") ||
        entry.item.parentElement;
      if (!container) return;

      const bucket = entriesByContainer.get(container);
      if (bucket) {
        bucket.push(entry);
      } else {
        entriesByContainer.set(container, [entry]);
      }
    });

    entriesByContainer.forEach((containerEntries, container) => {
      const pinnedEntries = containerEntries
        .filter((entry) => isPlaylistPinned(entry.keys))
        .sort((a, b) => getPinnedIndex(a.keys) - getPinnedIndex(b.keys))
        .map((entry) => entry.item)
        .filter((item) => item.parentElement === container);

      const specialItems = getLibrarySpecialItems(container);
      const priorityItems = [
        specialItems.createPlaylist,
        specialItems.likedSongs,
        ...pinnedEntries,
      ].filter(Boolean);

      if (priorityItems.length > 0) {
        bringItemsToTop(container, priorityItems);
      }
    });

    return true;
  }

  function processLibraryPlaylistsDebounced() {
    if (processLibraryPlaylistsTimer) {
      clearTimeout(processLibraryPlaylistsTimer);
    }
    processLibraryPlaylistsTimer = setTimeout(() => {
      processLibraryPlaylists();
      processLibraryPlaylistsTimer = null;
    }, 100);
  }

  function getSidebarPlaylistInfo(item) {
    const title = item.querySelector(".title")?.textContent?.trim() || "";
    const link = item.querySelector("a[href*='list=']")?.href || "";
    const subtitleText = item.querySelector(".subtitle")?.textContent?.trim() || "";
    const hasSubtitleText = Boolean(subtitleText);

    const normalizedName = normalizePlaylistName(title);
    const playlistId = extractPlaylistIdFromUrl(link);

    if (!title || isCreatePlaylistTitle(title) || (!playlistId && !hasSubtitleText)) {
      return { keys: [], title };
    }

    if (playlistId && normalizedName) {
      playlistIdByName.set(normalizedName, playlistId);
    }

    const mappedPlaylistId =
      playlistId ||
      (normalizedName ? playlistIdByName.get(normalizedName) || "" : "");

    return {
      keys: createPlaylistKeys({ id: mappedPlaylistId, name: title }),
      title,
    };
  }

  function getModalPlaylistInfo(item) {
    const titleElement = item.querySelector("yt-formatted-string");
    const titleText = titleElement
      ? (titleElement.dataset.baseTitle || titleElement.textContent || "")
          .replace(/^📌\s*/, "")
          .trim()
      : "";

    if (titleElement) {
      titleElement.dataset.baseTitle = titleText;
      if (titleElement.textContent !== titleText) {
        titleElement.textContent = titleText;
      }
    }

    const normalizedName = normalizePlaylistName(titleText);

    const link = item.querySelector("a[href*='list=']")?.href || "";
    const playlistIdFromLink = extractPlaylistIdFromUrl(link);
    const mappedPlaylistId =
      playlistIdFromLink ||
      item.dataset.playlistId ||
      (normalizedName ? playlistIdByName.get(normalizedName) || "" : "");

    if (!titleText || isCreatePlaylistTitle(titleText)) {
      return {
        keys: [],
        title: titleText,
      };
    }

    return {
      keys: createPlaylistKeys({ id: mappedPlaylistId, name: titleText }),
      title: titleText,
    };
  }

  function isLikedSongsSidebarItem(item) {
    const title = item.querySelector(".title")?.textContent?.trim() || "";
    const subtitle = item.querySelector(".subtitle")?.textContent?.trim() || "";
    const url = item.querySelector("a")?.href || "";

    const isLikedTitle = isLikedSongsTitle(title);
    const normalizedSubtitle = normalizeSearchText(subtitle);
    const isAutoPlaylist =
      normalizedSubtitle.includes("playlist automatica") ||
      normalizedSubtitle.includes("auto");
    const isLikedUrl = url.includes("LM");

    return (isLikedTitle && isAutoPlaylist) || isLikedUrl;
  }

  function isLikedSongsModalItem(item) {
    const playlistInfo = getModalPlaylistInfo(item);
    return isLikedSongsTitle(playlistInfo.title) || hasLikedSongsKey(playlistInfo.keys);
  }

  // === VOLUME DISPLAY ===
  const volumeDisplay = document.createElement("div");
  volumeDisplay.id = "volume-percentage-display";
  volumeDisplay.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 24px;
    font-weight: bold;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    font-family: 'Roboto', sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  document.body.appendChild(volumeDisplay);

  let hideTimeout = null;

  function showVolume(value) {
    volumeDisplay.textContent = `${Math.round(value)}%`;
    volumeDisplay.style.opacity = "1";
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      volumeDisplay.style.opacity = "0";
    }, 1500);
  }

  // === VOLUME SLIDER OBSERVER ===
  function setupVolumeSlider() {
    const slider = document.querySelector("#volume-slider");
    if (!slider) return false;

    if (slider.dataset.enhanced) return true;
    slider.dataset.enhanced = "true";

    console.log("[YT-Enhancer] ✅ Slider de volume encontrado!");

    const observer = new MutationObserver(() => {
      const value =
        slider.getAttribute("value") || slider.getAttribute("aria-valuenow");
      if (value) showVolume(parseFloat(value));
    });

    observer.observe(slider, {
      attributes: true,
      attributeFilter: ["value", "aria-valuenow"],
    });

    slider.addEventListener("wheel", (e) => {
      e.preventDefault();
      let currentVolume = parseFloat(
        slider.getAttribute("value") ||
          slider.getAttribute("aria-valuenow") ||
          0,
      );
      const direction = e.deltaY > 0 ? -1 : 1;
      let newVolume = Math.min(100, Math.max(0, currentVolume + 5 * direction));

      slider.value = newVolume;
      slider.setAttribute("value", newVolume);
      slider.setAttribute("aria-valuenow", newVolume);
      slider.dispatchEvent(new Event("input", { bubbles: true }));
      slider.dispatchEvent(new Event("change", { bubbles: true }));
      showVolume(newVolume);
    });

    const currentValue =
      slider.getAttribute("value") || slider.getAttribute("aria-valuenow");
    if (currentValue)
      console.log(`[YT-Enhancer] Volume atual: ${currentValue}%`);

    return true;
  }

  // === PINNED PLAYLISTS ===
  function ensurePinButtonIcon(button) {
    if (button.querySelector(".yt-enhancer-pin-icon")) return;

    button.innerHTML = `
      <svg class="yt-enhancer-pin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false">
        <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"/>
      </svg>
    `;
  }

  function getHideIconMarkup(hidden) {
    const path = hidden
      ? "M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 272q-146 0-266-81.5T40-500q54-126 174-207.5T480-789q146 0 266 81.5T920-500q-54 126-174 207.5T480-120Z"
      : "m791-55-57-57q-31 16-66.5 24T560-80q-146 0-266-81.5T40-500q26-60 69.5-109.5T210-694L56-848l57-57 736 736-58 57ZM479-240q28 0 53-6.5t46-19.5l-36-37q-13 6-29 9.5t-34 3.5q-75 0-127.5-52.5T299-470q0-18 3.5-34t9.5-29l-36-37q-13 21-19.5 46T250-470q0 95 67 162.5T479-240Zm318-131q36-25 64-57t49-72q-39-106-131.5-173T560-740q-26 0-50 4.5T464-722l-41-41q32-14 66.5-21t70.5-7q146 0 266 81.5T920-500q-11 31-28.5 59T850-387l-53-53ZM487-557Zm-95 7Zm95 150Zm-7-167q-5 0-10 1t-10 3l-72-72q22-13 44.5-19t47.5-6q75 0 127.5 52.5T660-480q0 25-6 47.5T635-388l-72-72q2-5 3-10t1-10q0-36-25.5-61.5T480-567ZM147-622q18-24 40-45.5T236-706l-45-45q-30 23-55.5 51T92-638l55 16Z";

    return `
      <svg class="yt-enhancer-hide-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true" focusable="false">
        <path d="${path}"/>
      </svg>
    `;
  }

  function setHideButtonVisualState(button, hidden) {
    const normalizedHidden = Boolean(hidden);
    if (button.dataset.hidden === String(normalizedHidden)) return;

    button.dataset.hidden = String(normalizedHidden);
    button.innerHTML = getHideIconMarkup(normalizedHidden);
  }

  function setSidebarPinButtonState(button, pinned) {
    button.dataset.pinned = String(pinned);
    ensurePinButtonIcon(button);
    button.title = pinned ? "Desafixar playlist" : "Fixar playlist";
    button.setAttribute("aria-label", button.title);

    const host = button.closest(".yt-enhancer-sidebar-pin-host");
    if (host) {
      host.classList.toggle("yt-enhancer-pin-host-pinned", pinned);
    }
  }

  function getSidebarPinHost(item) {
    const subtitleGroup = item.querySelector(".subtitle-group");
    if (subtitleGroup) return subtitleGroup;

    const subtitle = item.querySelector(".subtitle");
    if (subtitle?.parentElement) return subtitle.parentElement;

    return null;
  }

  function clearSidebarPinHostClass(item) {
    item
      .querySelectorAll(".yt-enhancer-sidebar-pin-host")
      .forEach((element) => {
        element.classList.remove("yt-enhancer-sidebar-pin-host");
        element.classList.remove("yt-enhancer-pin-host-pinned");
        element.classList.remove("yt-enhancer-pin-host-hidden");
      });
  }

  function setSidebarHideButtonState(button, hidden) {
    setHideButtonVisualState(button, hidden);
    button.title = hidden ? "Reexibir playlist" : "Ocultar playlist";
    button.setAttribute("aria-label", button.title);

    const host = button.closest(".yt-enhancer-sidebar-pin-host");
    if (host) {
      host.classList.toggle("yt-enhancer-pin-host-hidden", hidden);
    }
  }

  function ensureSidebarHideButton(item, playlistInfo) {
    const hideButtons = Array.from(item.querySelectorAll(".yt-enhancer-hide-toggle"));
    const existingButton = hideButtons[0] || null;
    hideButtons.slice(1).forEach((button) => button.remove());

    if (
      isLikedSongsSidebarItem(item) ||
      hasLikedSongsKey(playlistInfo.keys) ||
      playlistInfo.keys.length === 0
    ) {
      if (existingButton) {
        existingButton.remove();
      }
      return;
    }

    const hideHost = getSidebarPinHost(item);
    if (!hideHost) {
      if (existingButton) {
        existingButton.remove();
      }
      return;
    }

    hideHost.classList.add("yt-enhancer-sidebar-pin-host");

    let button = existingButton;
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "yt-enhancer-hide-toggle";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const currentInfo = getSidebarPlaylistInfo(item);
        if (
          isLikedSongsSidebarItem(item) ||
          hasLikedSongsKey(currentInfo.keys) ||
          currentInfo.keys.length === 0
        ) {
          return;
        }

        const hidden = toggleHiddenPlaylist(currentInfo.keys, currentInfo.title);
        setSidebarHideButtonState(button, hidden);

        pinPlaylists();
        processLibraryPlaylists();
      });
    }

    if (button.parentElement !== hideHost) {
      hideHost.appendChild(button);
    }

    setSidebarHideButtonState(button, isPlaylistHidden(playlistInfo.keys));
  }

  function ensureSidebarPinButton(item, playlistInfo) {
    item.querySelectorAll("#pinned-badge").forEach((element) => element.remove());

    const sidebarButtons = Array.from(item.querySelectorAll(".yt-enhancer-pin-toggle"));
    const existingButton = sidebarButtons[0] || null;
    sidebarButtons.slice(1).forEach((button) => button.remove());
    if (
      isLikedSongsSidebarItem(item) ||
      hasLikedSongsKey(playlistInfo.keys) ||
      playlistInfo.keys.length === 0
    ) {
      if (existingButton) {
        existingButton.remove();
      }
      clearSidebarPinHostClass(item);
      return;
    }

    const pinHost = getSidebarPinHost(item);
    if (!pinHost) {
      if (existingButton) {
        existingButton.remove();
      }
      return;
    }

    clearSidebarPinHostClass(item);
    pinHost.classList.add("yt-enhancer-sidebar-pin-host");

    let button = existingButton;
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "yt-enhancer-pin-toggle";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const currentInfo = getSidebarPlaylistInfo(item);
        if (
          isLikedSongsSidebarItem(item) ||
          hasLikedSongsKey(currentInfo.keys) ||
          currentInfo.keys.length === 0
        ) {
          return;
        }

        const pinned = togglePinnedPlaylist(currentInfo.keys);
        setSidebarPinButtonState(button, pinned);

        pinPlaylists();
        pinPlaylistsInModal();
      });
    }

    if (button.parentElement !== pinHost) {
      pinHost.appendChild(button);
    }

    setSidebarPinButtonState(button, isPlaylistPinned(playlistInfo.keys));
  }

  function pinPlaylists() {
    const sections = document.querySelectorAll(
      "ytmusic-guide-section-renderer",
    );
    if (sections.length === 0) return false;

    let foundPlaylistContainer = false;

    sections.forEach((section) => {
      const container = section.querySelector("#items");
      if (!container) return;

      const items = Array.from(container.children);
      if (items.length === 0) return;

      foundPlaylistContainer = true;

      const likedSongs = items.find((item) => {
        const playlistInfo = getSidebarPlaylistInfo(item);
        return isLikedSongsSidebarItem(item) || hasLikedSongsKey(playlistInfo.keys);
      });

      const entries = items
        .map((item) => {
          const playlistInfo = getSidebarPlaylistInfo(item);
          const isLikedPlaylist =
            isLikedSongsSidebarItem(item) || hasLikedSongsKey(playlistInfo.keys);

          ensureSidebarHideButton(item, playlistInfo);

          const hidden =
            !isLikedPlaylist &&
            playlistInfo.keys.length > 0 &&
            isPlaylistHidden(playlistInfo.keys);

          if (hidden) {
            item.style.display = "none";
            return { item, ...playlistInfo, hidden: true };
          }

          item.style.display = "";
          ensureSidebarPinButton(item, playlistInfo);

          return { item, ...playlistInfo, hidden: false };
        })
        .filter(
          (entry) =>
            entry.keys.length > 0 &&
            entry.item !== likedSongs &&
            !entry.hidden,
        );

      const pinnedItems = entries
        .filter((entry) => isPlaylistPinned(entry.keys))
        .sort((a, b) => getPinnedIndex(a.keys) - getPinnedIndex(b.keys))
        .map((entry) => entry.item);

      const orderedPinned = pinnedItems.filter((item) => item !== likedSongs);
      const priorityItems = likedSongs
        ? [likedSongs, ...orderedPinned]
        : [...orderedPinned];

      bringItemsToTop(container, priorityItems);
    });

    return foundPlaylistContainer;
  }

  // === LIBRARY HIDDEN PLAYLISTS ===
  function isLibraryPlaylistsPage() {
    const path = window.location.pathname.toLowerCase();
    return path === "/library" || path === "/library/" || path.startsWith("/library/playlists");
  }

  function checkLibraryRedirect() {
    if (!libraryRedirectToPlaylists) return;

    const path = window.location.pathname.toLowerCase();
    if (path === "/library" || path === "/library/") {
      const url = new URL(window.location.href);
      url.pathname = "/library/playlists";
      window.location.replace(url.toString());
    }
  }

  function getLibraryPlaylistEntries() {
    if (!isLibraryPlaylistsPage()) return [];

    const itemSelector =
      "ytmusic-responsive-list-item-renderer, ytmusic-two-row-item-renderer, ytmusic-grid-item-renderer, ytmusic-lockup-view-model";
    const playlistLinks = Array.from(document.querySelectorAll("a[href*='list=']"));
    const seenItems = new Set();

    return playlistLinks
      .map((linkElement) => {
        const item = linkElement.closest(itemSelector);
        if (!item) return null;
        if (seenItems.has(item)) return null;
        seenItems.add(item);

        const linkHref = linkElement.href || "";
        if (!linkHref) return null;

        const title = (
          item.querySelector("#title")?.textContent ||
          item.querySelector(".title")?.textContent ||
          linkElement.textContent ||
          ""
        )
          .replace(/\s+/g, " ")
          .trim();

        const playlistId = extractPlaylistIdFromUrl(linkHref);
        const isLikedPlaylist =
          Boolean(playlistId && playlistId.startsWith("LM"));

        if (!title || isCreatePlaylistTitle(title) || isLikedPlaylist) {
          return null;
        }

        const keys = createPlaylistKeys({ id: playlistId, name: title });
        if (keys.length === 0) return null;

        return {
          item,
          keys,
          title,
        };
      })
      .filter((entry) => entry && !entry.keys.some((key) => key.startsWith("id:LM")));
  }

  function getLibraryHideHost(item) {
    const subtitleHost =
      item.querySelector("#subtitle") ||
      item.querySelector(".subtitle") ||
      item.querySelector("yt-formatted-string.subtitle")?.parentElement ||
      item.querySelector("yt-formatted-string.byline")?.parentElement ||
      item.querySelector("#details");

    if (subtitleHost) {
      return subtitleHost;
    }

    return item.querySelector("#content #details") || item.querySelector("#content") || item;
  }

  function ensureLibraryControlsContainer(item, host) {
    let controls = item.querySelector(".yt-enhancer-library-controls");
    if (!controls) {
      controls = document.createElement("span");
      controls.className = "yt-enhancer-library-controls";
      host.insertAdjacentElement("afterbegin", controls);
    }

    return controls;
  }

  function syncLibraryControlsStateFromButton(button) {
    const controls = button.closest(".yt-enhancer-library-controls");
    if (!controls) return;

    const hasActiveState = Boolean(
      controls.querySelector(".yt-enhancer-library-hide-toggle[data-hidden='true']"),
    );

    controls.classList.toggle("yt-enhancer-library-controls-has-active", hasActiveState);

    const host = controls.parentElement;
    if (host) {
      host.classList.toggle("yt-enhancer-library-hide-host-has-active", hasActiveState);
    }
  }

  function setLibraryHideButtonState(button, hidden) {
    setHideButtonVisualState(button, hidden);
    button.title = hidden ? "Reexibir playlist" : "Ocultar playlist";
    button.setAttribute("aria-label", button.title);
    syncLibraryControlsStateFromButton(button);
  }

  function setLibraryPinButtonState(button, pinned) {
    button.dataset.pinned = String(pinned);
    ensurePinButtonIcon(button);
    button.title = pinned ? "Desafixar playlist" : "Fixar playlist";
    button.setAttribute("aria-label", button.title);
    syncLibraryControlsStateFromButton(button);
  }

  function ensureLibraryPinButton(entry) {
    const libraryButtons = Array.from(
      entry.item.querySelectorAll(".yt-enhancer-library-pin-toggle"),
    );
    const existingButton = libraryButtons[0] || null;
    libraryButtons.slice(1).forEach((button) => button.remove());

    const pinHost = getLibraryHideHost(entry.item);
    if (!pinHost) {
      if (existingButton) {
        existingButton.remove();
      }
      return;
    }

    pinHost.classList.add("yt-enhancer-library-hide-host");
    const controlsContainer = ensureLibraryControlsContainer(entry.item, pinHost);

    let button = existingButton;
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "yt-enhancer-library-pin-toggle";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const pinned = togglePinnedPlaylist(entry.keys);
        setLibraryPinButtonState(button, pinned);

        pinPlaylists();
        pinPlaylistsInModal();
        processLibraryPlaylists();
      });
    }

    if (button.parentElement !== controlsContainer) {
      controlsContainer.insertAdjacentElement("afterbegin", button);
    }

    setLibraryPinButtonState(button, isPlaylistPinned(entry.keys));
  }

  function ensureLibraryHideButton(entry) {
    const libraryButtons = Array.from(
      entry.item.querySelectorAll(".yt-enhancer-library-hide-toggle"),
    );
    const existingButton = libraryButtons[0] || null;
    libraryButtons.slice(1).forEach((button) => button.remove());

    const hideHost = getLibraryHideHost(entry.item);
    if (!hideHost) {
      if (existingButton) {
        existingButton.remove();
      }
      return;
    }

    hideHost.classList.add("yt-enhancer-library-hide-host");
    const controlsContainer = ensureLibraryControlsContainer(entry.item, hideHost);

    let button = existingButton;
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "yt-enhancer-library-hide-toggle";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const hidden = toggleHiddenPlaylist(entry.keys, entry.title);
        setLibraryHideButtonState(button, hidden);

        pinPlaylists();
        processLibraryPlaylists();
      });
    }

    if (button.parentElement !== controlsContainer) {
      controlsContainer.appendChild(button);
    }

    setLibraryHideButtonState(button, isPlaylistHidden(entry.keys));
  }

  function getLibrarySpecialItems(container) {
    const itemSelector =
      "ytmusic-responsive-list-item-renderer, ytmusic-two-row-item-renderer, ytmusic-grid-item-renderer, ytmusic-lockup-view-model";

    const items = Array.from(container.querySelectorAll(itemSelector));
    const specialItems = { createPlaylist: null, likedSongs: null };
    let likedSongsMatchedById = false;

    items.forEach((item) => {
      const title =
        item.querySelector("#title")?.textContent ||
        item.querySelector(".title")?.textContent ||
        "";

      const normalizedTitle = (title || "").replace(/\s+/g, " ").trim();

      if (isCreatePlaylistTitle(normalizedTitle)) {
        specialItems.createPlaylist = item;
        return;
      }

      const link = item.querySelector("a[href*='list=']");
      const playlistId = link ? extractPlaylistIdFromUrl(link.href) : null;

      if (playlistId?.startsWith("LM")) {
        specialItems.likedSongs = item;
        likedSongsMatchedById = true;
      } else if (!likedSongsMatchedById && isLikedSongsTitle(normalizedTitle)) {
        specialItems.likedSongs = item;
      }
    });

    return specialItems;
  }

  // === MODAL DE SALVAR PLAYLIST ===
  let lastModalVisible = false;

  function setModalPinButtonState(button, pinned) {
    button.dataset.pinned = String(pinned);
    ensurePinButtonIcon(button);
    button.title = pinned ? "Desafixar playlist" : "Fixar playlist";
    button.setAttribute("aria-label", button.title);

    const host = button.closest(".yt-enhancer-modal-pin-host");
    if (host) {
      host.classList.toggle("yt-enhancer-modal-pin-host-pinned", pinned);
    }
  }

  function getModalPinHost(item) {
    return (
      item.querySelector("tp-yt-paper-item") ||
      item.querySelector("#content") ||
      item.querySelector(".content") ||
      item.querySelector("yt-formatted-string")?.parentElement ||
      item.firstElementChild ||
      item
    );
  }

  function clearModalPinHostClass(item) {
    item
      .querySelectorAll(".yt-enhancer-modal-pin-host")
      .forEach((element) => {
        element.classList.remove("yt-enhancer-modal-pin-host");
        element.classList.remove("yt-enhancer-modal-pin-host-pinned");
      });
  }

  function ensureModalPinButton(item, playlistInfo) {
    const modalButtons = Array.from(item.querySelectorAll(".yt-enhancer-modal-pin-toggle"));
    const existingButton = modalButtons[0] || null;
    modalButtons.slice(1).forEach((button) => button.remove());
    if (
      isLikedSongsModalItem(item) ||
      hasLikedSongsKey(playlistInfo.keys) ||
      playlistInfo.keys.length === 0
    ) {
      if (existingButton) {
        existingButton.remove();
      }
      item.classList.remove("yt-enhancer-modal-item");
      clearModalPinHostClass(item);
      return;
    }

    item.classList.add("yt-enhancer-modal-item");

    const pinHost = getModalPinHost(item);
    if (!pinHost) return;

    clearModalPinHostClass(item);
    pinHost.classList.add("yt-enhancer-modal-pin-host");

    let button = existingButton;
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "yt-enhancer-modal-pin-toggle";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const currentInfo = getModalPlaylistInfo(item);
        if (
          isLikedSongsModalItem(item) ||
          hasLikedSongsKey(currentInfo.keys) ||
          currentInfo.keys.length === 0
        ) {
          return;
        }

        const pinned = togglePinnedPlaylist(currentInfo.keys);
        setModalPinButtonState(button, pinned);

        pinPlaylists();
        pinPlaylistsInModal();
      });
    }

    if (button.parentElement !== pinHost) {
      pinHost.appendChild(button);
    }

    const pinned = isPlaylistPinned(playlistInfo.keys);
    setModalPinButtonState(button, pinned);
  }

  function pinPlaylistsInModal() {
    const modal = document.querySelector("ytmusic-add-to-playlist-renderer");
    if (!modal || modal.offsetParent === null) return false;

    // Ocultar playlists hidden na seção "Recentes" (carousel de top-shelf)
    const topShelf = modal.querySelector("#top-shelf");
    if (topShelf) {
      const recentItems = topShelf.querySelectorAll("ytmusic-two-row-item-renderer");
      let visibleCount = 0;
      recentItems.forEach((item) => {
        const title = (
          item.querySelector(".title")?.textContent ||
          item.querySelector("#title")?.textContent ||
          ""
        ).replace(/\s+/g, " ").trim();

        if (!title) return;

        const keys = createPlaylistKeys({ name: title });
        if (keys.length > 0 && isPlaylistHidden(keys)) {
          item.style.display = "none";
        } else {
          item.style.display = "";
          visibleCount++;
        }
      });

      if (visibleCount === 0) {
        topShelf.style.display = "none";
      } else {
        topShelf.style.display = "";
        const itemsList = topShelf.querySelector("ul#items");
        if (itemsList) {
          itemsList.classList.add("yt-enhancer-recents-flex");
          // Corrigir overflow: hidden do #items-wrapper que corta itens flex
          const itemsWrapper = itemsList.closest("#items-wrapper");
          if (itemsWrapper) {
            itemsWrapper.classList.add("yt-enhancer-recents-overflow-fix");
          }
          // Esconder setas de navegação do carousel
          const carousel = topShelf.querySelector("ytmusic-carousel");
          if (carousel) {
            const arrows = carousel.querySelectorAll("#left-arrow, #right-arrow");
            arrows.forEach((arrow) => { arrow.style.display = "none"; });
          }
        }
      }
    }

    const playlistItems = modal.querySelectorAll(
      "ytmusic-playlist-add-to-option-renderer",
    );
    if (playlistItems.length === 0) return false;

    const container = playlistItems[0].parentElement;
    if (!container) return false;

    const items = Array.from(playlistItems);
    const likedSongs = items.find((item) => isLikedSongsModalItem(item));

    const entries = items
      .map((item) => {
        const playlistInfo = getModalPlaylistInfo(item);
        ensureModalPinButton(item, playlistInfo);
        return { item, ...playlistInfo };
      })
      .filter((entry) => entry.keys.length > 0 && entry.item !== likedSongs);

    entries.forEach((entry) => {
      const hidden = isPlaylistHidden(entry.keys);
      entry.item.style.display = hidden ? "none" : "";
    });

    const visibleEntries = entries.filter(
      (entry) => entry.item.style.display !== "none",
    );

    const pinnedItems = visibleEntries
      .filter((entry) => isPlaylistPinned(entry.keys))
      .sort((a, b) => getPinnedIndex(a.keys) - getPinnedIndex(b.keys))
      .map((entry) => entry.item);

    const orderedPinned = pinnedItems.filter((item) => item !== likedSongs);
    [...orderedPinned].reverse().forEach((item) => container.prepend(item));
    if (likedSongs) {
      container.prepend(likedSongs);
    }

    return true;
  }

  // === OCULTAR PLAYLISTS HIDDEN NA HOME (carousels como "Ouvir de novo") ===
  function hidePlaylistsOnHome() {
    // Não rodar dentro de modais — só na página principal
    const browseResponse = document.querySelector(
      "ytmusic-browse-response, ytmusic-tabbed-browse-response",
    );
    if (!browseResponse) return;

    const carouselItems = browseResponse.querySelectorAll(
      "ytmusic-carousel-shelf-renderer ytmusic-two-row-item-renderer",
    );
    if (carouselItems.length === 0) return;

    carouselItems.forEach((item) => {
      // Extrair playlist ID do link (só playlists, ignorar channels/albums)
      const link = item.querySelector(
        'a.image-wrapper[href*="playlist?list="], a.image-wrapper[href*="playlist?list="]',
      );
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const listMatch = href.match(/[?&]list=([^&]+)/);
      const playlistId = listMatch ? listMatch[1] : null;

      // Extrair título
      const title = (
        item.querySelector(".title")?.textContent ||
        item.querySelector("#title")?.textContent ||
        ""
      ).replace(/\s+/g, " ").trim();

      if (!playlistId && !title) return;

      const keys = createPlaylistKeys({
        id: playlistId || undefined,
        name: title || undefined,
      });

      if (keys.length > 0 && isPlaylistHidden(keys)) {
        item.style.display = "none";
      } else {
        // Restaurar caso tenha sido mostrado novamente (unhide)
        if (item.style.display === "none") {
          item.style.display = "";
        }
      }
    });
  }

  function checkModal() {
    const modal = document.querySelector("ytmusic-add-to-playlist-renderer");
    const isVisible = Boolean(modal && modal.offsetParent !== null);

    if (isVisible) {
      pinPlaylistsInModal();

      if (!lastModalVisible) {
        // Modal acabou de abrir
        setTimeout(pinPlaylistsInModal, 300);
      }
    }

    lastModalVisible = isVisible;
  }

  // === AUTO-CLOSE NOTIFICAÇÕES ===
  let processingToast = false;

  function checkNotifications() {
    if (processingToast) return;

    const toast = document.querySelector(
      "tp-yt-paper-toast.paper-toast-open:not([data-auto-close])",
    );
    if (!toast) return;

    // Verifica se é notificação de "Salvo" que fica persistente
    const text = toast.querySelector("#text")?.textContent || "";
    const isSaveNotification =
      text.includes("Salvo") ||
      text.includes("Salva") ||
      text.includes("Saved") ||
      text.includes("Adicionad") ||
      text.includes("Added");

    if (isSaveNotification) {
      processingToast = true;
      toast.dataset.autoClose = "true";

      // Fecha após 3 segundos
      setTimeout(() => {
        const closeBtn = toast.querySelector("#close-button button");
        if (closeBtn) {
          closeBtn.click();
        } else {
          toast.classList.remove("paper-toast-open");
        }
        processingToast = false;
      }, 3000);
    }
  }

  function debloatContextMenu() {
    if (hiddenContextMenuItems.length === 0) return;

    const popup = document.querySelector("ytmusic-menu-popup-renderer");
    if (!popup) return;

    let didChange = false;

    const applyVisibility = (item, textEl) => {
      if (!textEl) return;
      const itemId = matchMenuItemId(textEl.textContent);
      if (itemId && isContextMenuItemHidden(itemId)) {
        if (item.style.display !== "none") {
          item.style.display = "none";
          didChange = true;
        }
      } else if (item.style.display === "none") {
        item.style.display = "";
        didChange = true;
      }
    };

    // Standard menu items
    const menuItems = popup.querySelectorAll(
      'ytmusic-menu-navigation-item-renderer[role="menuitem"], ytmusic-menu-service-item-renderer[role="menuitem"]'
    );
    menuItems.forEach((item) => {
      applyVisibility(item, item.querySelector("yt-formatted-string.text"));
    });

    // Download item uses a different renderer
    const downloadItem = popup.querySelector(
      'ytmusic-menu-service-item-download-renderer[role="menuitem"]'
    );
    if (downloadItem) {
      applyVisibility(downloadItem, downloadItem.querySelector("yt-formatted-string"));
    }

    // Toggle items (like/unlike, save/remove from library, pin)
    const toggleItems = popup.querySelectorAll(
      'ytmusic-toggle-menu-service-item-renderer[role="menuitem"]'
    );
    toggleItems.forEach((item) => {
      applyVisibility(item, item.querySelector("yt-formatted-string.text"));
    });

    // Refit the iron-dropdown so the popup repositions after hiding items
    if (didChange) {
      const dropdown = popup.closest("tp-yt-iron-dropdown");
      if (dropdown && typeof dropdown.refit === "function") {
        dropdown.refit();
      }
    }
  }

  function debloatUpgradeButton() {
    const guideEntries = document.querySelectorAll("ytmusic-guide-entry-renderer");

    for (const entry of guideEntries) {
      const titleEl = entry.querySelector("yt-formatted-string.title");
      if (!titleEl) continue;

      const text = titleEl.textContent.trim().toLowerCase();
      if (text === "upgrade") {
        entry.style.display = hideUpgradeButton ? "none" : "";
      }
    }
  }

  function debloatListenAgainArtists() {
    // === Handle homepage carousel ===
    const carouselShelves = document.querySelectorAll("ytmusic-carousel-shelf-renderer");

    for (const shelf of carouselShelves) {
      const headerLink = shelf.querySelector(
        'ytmusic-carousel-shelf-basic-header-renderer yt-formatted-string.title a[href="listen_again"]'
      );
      if (!headerLink) continue;

      processListenAgainItems(shelf.querySelectorAll("ytmusic-two-row-item-renderer"));
    }

    // === Handle /listen_again page (grid layout) ===
    if (location.pathname === "/listen_again" || location.href.includes("listen_again")) {
      const gridItems = document.querySelectorAll(
        "ytmusic-grid-renderer ytmusic-two-row-item-renderer"
      );
      if (gridItems.length > 0) {
        processListenAgainItems(gridItems);
      }
    }
  }

  function processListenAgainItems(items) {
    for (const item of items) {
      // Detect if this item is an artist (has circle-cropped thumbnail)
      const isArtist = item.hasAttribute("has-circle-cropped-thumbnail");
      if (!isArtist) {
        // Not an artist — make sure it's visible and skip
        if (item.style.display === "none" && !item.dataset.yteHiddenArtist) {
          item.style.display = "";
        }
        continue;
      }

      // Extract channel ID from the link
      const link = item.querySelector('a.image-wrapper[href*="channel/"]');
      const href = link?.getAttribute("href") || "";
      const channelMatch = href.match(/channel\/([A-Za-z0-9_-]+)/);
      const channelId = channelMatch ? channelMatch[1] : null;

      // Extract artist name from title
      const titleEl = item.querySelector(".details yt-formatted-string.title");
      const artistName = titleEl?.textContent?.trim() || "";

      // Inject hide button if not already present
      if (!item.classList.contains("yt-enhancer-artist-hide-ready") && channelId) {
        item.classList.add("yt-enhancer-artist-hide-ready");
        item.style.position = "relative";

        const hideBtn = document.createElement("button");
        hideBtn.type = "button";
        hideBtn.className = "yt-enhancer-artist-hide-btn";
        hideBtn.setAttribute("aria-label", `Ocultar ${artistName || "artista"}`);
        hideBtn.textContent = "\u00D7"; // multiplication sign (x)

        hideBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (channelId) {
            hideArtist(channelId, artistName);
            item.style.display = "none";
            item.dataset.yteHiddenArtist = "true";
          }
        });

        item.appendChild(hideBtn);
      }

      // Apply visibility based on settings
      const shouldHide = hideListenAgainArtists || (channelId && isArtistHidden(channelId));

      if (shouldHide) {
        if (item.style.display !== "none") {
          item.style.display = "none";
          item.dataset.yteHiddenArtist = "true";
        }
      } else {
        if (item.dataset.yteHiddenArtist) {
          item.style.display = "";
          delete item.dataset.yteHiddenArtist;
        }
      }
    }
  }

  function collectAllListenAgainArtists() {
    // Scan homepage carousel
    const carouselShelves = document.querySelectorAll("ytmusic-carousel-shelf-renderer");
    for (const shelf of carouselShelves) {
      const headerLink = shelf.querySelector(
        'ytmusic-carousel-shelf-basic-header-renderer yt-formatted-string.title a[href="listen_again"]'
      );
      if (!headerLink) continue;
      collectArtistsFromItems(shelf.querySelectorAll("ytmusic-two-row-item-renderer"));
    }

    // Scan /listen_again grid page
    if (location.pathname === "/listen_again" || location.href.includes("listen_again")) {
      const gridItems = document.querySelectorAll(
        "ytmusic-grid-renderer ytmusic-two-row-item-renderer"
      );
      if (gridItems.length > 0) {
        collectArtistsFromItems(gridItems);
      }
    }
  }

  function collectArtistsFromItems(items) {
    let changed = false;
    for (const item of items) {
      if (!item.hasAttribute("has-circle-cropped-thumbnail")) continue;

      const link = item.querySelector('a.image-wrapper[href*="channel/"]');
      const href = link?.getAttribute("href") || "";
      const channelMatch = href.match(/channel\/([A-Za-z0-9_-]+)/);
      const channelId = channelMatch ? channelMatch[1] : null;
      if (!channelId) continue;

      const titleEl = item.querySelector(".details yt-formatted-string.title");
      const artistName = titleEl?.textContent?.trim() || "";

      if (!hiddenArtistKeys.includes(channelId)) {
        hiddenArtistKeys.push(channelId);
        changed = true;
      }
      if (artistName) {
        hiddenArtistLabels[channelId] = artistName;
      }
    }
    if (changed) {
      saveHiddenArtists();
      document.dispatchEvent(new CustomEvent("yt-enhancer:hidden-artists-change"));
    }
  }

  function debloatHomepageSections() {
    const shelves = document.querySelectorAll("ytmusic-carousel-shelf-renderer");
    for (const shelf of shelves) {
      const headerRenderer = shelf.querySelector("ytmusic-carousel-shelf-basic-header-renderer");
      const titleEl = headerRenderer?.querySelector("yt-formatted-string.title");
      if (!titleEl || !headerRenderer) continue;

      const originalTitle = titleEl.textContent?.trim() || "";
      const rawTitle = normalizeMenuText(originalTitle);

      // Skip "Ouvir de novo" — it has its own artist hiding controls
      const isListenAgain = titleEl.querySelector('a[href="listen_again"]');
      if (isListenAgain) continue;

      const straplineEl = headerRenderer.querySelector("yt-formatted-string.strapline");
      const rawStrapline = normalizeMenuText(straplineEl?.textContent);

      // Try to match a known section
      let matchedId = null;

      for (const section of HOMEPAGE_SECTIONS) {
        const normalizedLabel = normalizeMenuText(section.label);
        const textToMatch = section.matchStrapline ? rawStrapline : rawTitle;

        if (textToMatch === normalizedLabel) {
          matchedId = section.id;
          break;
        }
      }

      // Inject X button if not already present
      if (!shelf.classList.contains("yt-enhancer-section-hide-ready")) {
        const detailsDiv = headerRenderer.querySelector("#details");
        if (!detailsDiv) continue;

        shelf.classList.add("yt-enhancer-section-hide-ready");

        const hideBtn = document.createElement("button");
        hideBtn.type = "button";
        hideBtn.className = "yt-enhancer-section-hide-btn";
        hideBtn.setAttribute("aria-label", `Ocultar "${originalTitle}"`);
        hideBtn.textContent = "\u00D7";

        hideBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();

          if (matchedId) {
            setHomepageSectionHidden(matchedId, true);
          } else if (rawTitle) {
            hideDynamicSection(rawTitle, originalTitle);
          }

          shelf.style.display = "none";
          shelf.dataset.yteHiddenSection = "true";
        });

        detailsDiv.appendChild(hideBtn);
      }

      // Apply visibility
      const shouldHide = matchedId
        ? isHomepageSectionHidden(matchedId)
        : isDynamicSectionHidden(rawTitle);

      if (shouldHide) {
        if (shelf.style.display !== "none") {
          shelf.style.display = "none";
          shelf.dataset.yteHiddenSection = "true";
        }
      } else {
        if (shelf.dataset.yteHiddenSection) {
          shelf.style.display = "";
          delete shelf.dataset.yteHiddenSection;
        }
      }
    }
  }

  function showStartupToast() {
    const host = document.body || document.documentElement;
    if (!host) return;

    const versionLabel =
      SCRIPT_VERSION === "unknown"
        ? "carregado com sucesso"
        : `v${SCRIPT_VERSION} carregado com sucesso`;

    const toast = document.createElement("div");
    toast.className = "yt-enhancer-startup-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.innerHTML = `
      <span class="yt-enhancer-startup-toast__icon" aria-hidden="true">♫</span>
      <span class="yt-enhancer-startup-toast__content">
        <strong>${SCRIPT_NAME}</strong>
        <span>${versionLabel}</span>
      </span>
      <span class="yt-enhancer-startup-toast__progress" aria-hidden="true"></span>
    `;

    host.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => {
        toast.remove();
      }, 260);
    }, 3200);
  }

  function getPinVisibilityModeDescription(mode) {
    if (mode === "always") {
      return "always: o alfinete fica sempre visivel (mais facil de achar e clicar).";
    }

    if (mode === "hover-only") {
      return "hover-only: o alfinete so aparece quando voce passa o mouse ou foca no item.";
    }

    return "dynamic: o alfinete fica visivel de forma suave e destaca no hover/foco.";
  }

  function setPinVisibilityMode(mode) {
    const appliedMode = applyPinVisibilityMode(mode);
    pinPlaylists();
    processLibraryPlaylists();
    pinPlaylistsInModal();
    document.dispatchEvent(
      new CustomEvent("yt-enhancer:pin-mode-change", {
        detail: { mode: appliedMode },
      }),
    );
    console.log(`[YT-Enhancer] 📌 Visibilidade do alfinete: ${appliedMode}`);
    return appliedMode;
  }

  function cyclePinVisibilityMode() {
    const currentIndex = PIN_VISIBILITY_MODES.indexOf(pinVisibilityMode);
    const nextIndex = (currentIndex + 1) % PIN_VISIBILITY_MODES.length;
    return setPinVisibilityMode(PIN_VISIBILITY_MODES[nextIndex]);
  }

  function exposeEnhancerApi() {
    const api = {
      getPinVisibilityMode: () => pinVisibilityMode,
      setPinVisibilityMode,
      cyclePinVisibilityMode,
      pinVisibilityModes: [...PIN_VISIBILITY_MODES],
      getHiddenPlaylists: () => getHiddenPlaylistGroups().map((group) => ({ ...group })),
      unhideAllPlaylists,
      getThemeColors: () => ({ ...settingsTheme }),
      setThemeColors: (partialTheme) =>
        applySettingsTheme({ ...(settingsTheme || {}), ...(partialTheme || {}) }),
      resetThemeColors: () => applySettingsTheme(DEFAULT_SETTINGS_THEME),
      themePresets: { ...SETTINGS_THEME_PRESETS },
      catppuccinVariants: { ...CATPPUCCIN_VARIANT_PRESETS },
      applyThemePreset,
      applyCatppuccinVariant,
    };

    globalThis.YTEnhancer = {
      ...(globalThis.YTEnhancer || {}),
      ...api,
    };

    if (typeof unsafeWindow !== "undefined") {
      unsafeWindow.YTEnhancer = {
        ...(unsafeWindow.YTEnhancer || {}),
        ...api,
      };
    }
  }

  function createSettingsUI() {
    const host = document.body || document.documentElement;
    if (!host || document.querySelector(".yt-enhancer-settings-root")) return;

    const versionText =
      SCRIPT_VERSION === "unknown" ? "versao indisponivel" : `v${SCRIPT_VERSION}`;
    const storageText = hasViolentmonkeyStorage()
      ? "salvo no Violentmonkey"
      : "salvo no localStorage";

    const root = document.createElement("div");
    root.className = "yt-enhancer-settings-root";
    root.innerHTML = `
      <button type="button" class="yt-enhancer-settings-toggle" aria-label="Abrir configuraçoes do YT-Enhancer" aria-expanded="false">⚙</button>
      <div class="yt-enhancer-settings-backdrop"></div>
      <section class="yt-enhancer-settings-modal" role="dialog" aria-label="configuraçoes do YT-Enhancer">
        <header class="yt-enhancer-settings-header">
          <div class="yt-enhancer-settings-header-info">
            <strong class="yt-enhancer-settings-title">${SCRIPT_NAME}</strong>
            <span class="yt-enhancer-settings-meta">${versionText} • ${storageText}</span>
          </div>
          <button type="button" class="yt-enhancer-settings-close" aria-label="Fechar">×</button>
        </header>
        <div class="yt-enhancer-settings-body">
          <div class="yt-enhancer-settings-section">
            <label class="yt-enhancer-settings-label" for="yt-enhancer-pin-mode-select">Visibilidade do alfinete</label>
            <select id="yt-enhancer-pin-mode-select" class="yt-enhancer-settings-select">
              <option value="always">Sempre visivel (always)</option>
              <option value="dynamic">Dinamico (dynamic)</option>
              <option value="hover-only">Apenas no hover (hover-only)</option>
            </select>
            <p class="yt-enhancer-settings-help"></p>
          </div>
          <div class="yt-enhancer-settings-section">
            <label class="yt-enhancer-settings-switch-control">
              <span>Abrir sempre em playlists</span>
              <span class="yt-enhancer-switch">
                <input id="yt-enhancer-library-redirect" type="checkbox" class="yt-enhancer-switch-input" />
                <span class="yt-enhancer-switch-track"></span>
              </span>
            </label>
          </div>
          <div class="yt-enhancer-settings-section">
            <label class="yt-enhancer-settings-label">Aparencia</label>
            <div class="yt-enhancer-settings-presets">
              <button type="button" class="yt-enhancer-settings-preset" data-preset="yt-red">YT Red</button>
              <button type="button" class="yt-enhancer-settings-preset" data-preset="blue-neon">Blue Neon</button>
              <button type="button" class="yt-enhancer-settings-preset" data-preset="monochrome">Monochrome</button>
              <button type="button" class="yt-enhancer-settings-preset" data-preset="catppuccin">Catppuccin</button>
            </div>
            <div class="yt-enhancer-settings-catppuccin" hidden>
              <label class="yt-enhancer-settings-label" for="yt-enhancer-catppuccin-variant">Variante Catppuccin</label>
              <select id="yt-enhancer-catppuccin-variant" class="yt-enhancer-settings-select">
                <option value="latte">Latte</option>
                <option value="frappe">Frappe</option>
                <option value="macchiato">Macchiato</option>
                <option value="mocha">Mocha</option>
              </select>
            </div>
            <div class="yt-enhancer-settings-colors">
              <label class="yt-enhancer-settings-color-control" for="yt-enhancer-popup-accent-color">
                <span class="yt-enhancer-settings-color-label">Destaque do menu <span class="yt-enhancer-settings-hint" data-tip="Define a cor de destaque do menu (borda, botoes e elementos ativos)." title="Define a cor de destaque do menu (borda, botoes e elementos ativos).">?</span></span>
                <input id="yt-enhancer-popup-accent-color" type="color" class="yt-enhancer-settings-color-input" />
              </label>
              <label class="yt-enhancer-settings-color-control" for="yt-enhancer-popup-background-color">
                <span class="yt-enhancer-settings-color-label">Fundo do menu <span class="yt-enhancer-settings-hint" data-tip="Define a cor base do menu (fundo principal e variacoes do painel)." title="Define a cor base do menu (fundo principal e variacoes do painel).">?</span></span>
                <input id="yt-enhancer-popup-background-color" type="color" class="yt-enhancer-settings-color-input" />
              </label>
              <label class="yt-enhancer-settings-color-control" for="yt-enhancer-pin-color">
                <span>Cor do alfinete</span>
                <input id="yt-enhancer-pin-color" type="color" class="yt-enhancer-settings-color-input" />
              </label>
              <label class="yt-enhancer-settings-color-control" for="yt-enhancer-pin-pinned-color">
                <span>Cor do alfinete fixado</span>
                <input id="yt-enhancer-pin-pinned-color" type="color" class="yt-enhancer-settings-color-input" />
              </label>
            </div>
            <button type="button" class="yt-enhancer-settings-reset-theme">Resetar cores</button>
          </div>
          <div class="yt-enhancer-settings-section">
            <label class="yt-enhancer-settings-label">Debloat</label>
            <label class="yt-enhancer-settings-switch-control">
              <span>Remover botao Upgrade</span>
              <span class="yt-enhancer-switch">
                <input id="yt-enhancer-hide-upgrade" type="checkbox" class="yt-enhancer-switch-input" />
                <span class="yt-enhancer-switch-track"></span>
              </span>
            </label>
            <div class="yt-enhancer-settings-debloat-section">
              <button type="button" class="yt-enhancer-settings-debloat-toggle">
                <span class="yt-enhancer-settings-hidden-toggle-arrow">&#9654;</span>
                <span class="yt-enhancer-settings-debloat-summary"></span>
              </button>
              <div class="yt-enhancer-settings-debloat-collapsible" hidden>
                <div class="yt-enhancer-settings-debloat-list"></div>
              </div>
            </div>
            <div class="yt-enhancer-settings-hidden-section">
              <button type="button" class="yt-enhancer-settings-hidden-toggle">
                <span class="yt-enhancer-settings-hidden-toggle-arrow">&#9654;</span>
                <span class="yt-enhancer-settings-hidden-summary"></span>
              </button>
              <div class="yt-enhancer-settings-hidden-collapsible" hidden>
                <div class="yt-enhancer-settings-hidden-list"></div>
                <button type="button" class="yt-enhancer-settings-unhide-all">Reexibir todas</button>
              </div>
            </div>
            <label class="yt-enhancer-settings-sub-label">Homepage</label>
            <label class="yt-enhancer-settings-switch-control">
              <span>Ocultar todos os artistas em "Ouvir de novo"</span>
              <span class="yt-enhancer-switch">
                <input id="yt-enhancer-hide-listen-again-artists" type="checkbox" class="yt-enhancer-switch-input" />
                <span class="yt-enhancer-switch-track"></span>
              </span>
            </label>
            <div class="yt-enhancer-settings-hidden-artists-section">
              <button type="button" class="yt-enhancer-settings-hidden-artists-toggle">
                <span class="yt-enhancer-settings-hidden-toggle-arrow">&#9654;</span>
                <span class="yt-enhancer-settings-hidden-artists-summary"></span>
              </button>
              <div class="yt-enhancer-settings-hidden-artists-collapsible" hidden>
                <div class="yt-enhancer-settings-hidden-artists-list"></div>
                <button type="button" class="yt-enhancer-settings-unhide-all-artists">Reexibir todos</button>
              </div>
            </div>
            <div class="yt-enhancer-settings-sections-debloat-section">
              <button type="button" class="yt-enhancer-settings-sections-debloat-toggle">
                <span class="yt-enhancer-settings-hidden-toggle-arrow">&#9654;</span>
                <span class="yt-enhancer-settings-sections-debloat-summary"></span>
              </button>
              <div class="yt-enhancer-settings-sections-debloat-collapsible" hidden>
                <label class="yt-enhancer-settings-switch-control">
                  <span>Ocultar todas as seções</span>
                  <span class="yt-enhancer-switch">
                    <input id="yt-enhancer-hide-all-sections" type="checkbox" class="yt-enhancer-switch-input" />
                    <span class="yt-enhancer-switch-track"></span>
                  </span>
                </label>
                <div class="yt-enhancer-settings-sections-debloat-list"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    host.appendChild(root);

    const toggleButton = root.querySelector(".yt-enhancer-settings-toggle");
    const closeButton = root.querySelector(".yt-enhancer-settings-close");
    const backdrop = root.querySelector(".yt-enhancer-settings-backdrop");
    const modal = root.querySelector(".yt-enhancer-settings-modal");
    const modeSelect = root.querySelector(".yt-enhancer-settings-select");
    const modeHelp = root.querySelector(".yt-enhancer-settings-help");
    const presetButtons = Array.from(
      root.querySelectorAll(".yt-enhancer-settings-preset"),
    );
    const catppuccinVariantsWrap = root.querySelector(
      ".yt-enhancer-settings-catppuccin",
    );
    const catppuccinVariantSelect = root.querySelector(
      "#yt-enhancer-catppuccin-variant",
    );
    const popupAccentInput = root.querySelector("#yt-enhancer-popup-accent-color");
    const popupBackgroundInput = root.querySelector(
      "#yt-enhancer-popup-background-color",
    );
    const pinColorInput = root.querySelector("#yt-enhancer-pin-color");
    const pinPinnedColorInput = root.querySelector("#yt-enhancer-pin-pinned-color");
    const resetThemeButton = root.querySelector(".yt-enhancer-settings-reset-theme");
    const hiddenToggleButton = root.querySelector(".yt-enhancer-settings-hidden-toggle");
    const hiddenToggleArrow = root.querySelector(".yt-enhancer-settings-hidden-toggle-arrow");
    const hiddenCollapsible = root.querySelector(".yt-enhancer-settings-hidden-collapsible");
    const hiddenSummary = root.querySelector(".yt-enhancer-settings-hidden-summary");
    const hiddenList = root.querySelector(".yt-enhancer-settings-hidden-list");
    const unhideAllButton = root.querySelector(".yt-enhancer-settings-unhide-all");
    const libraryRedirectCheckbox = root.querySelector("#yt-enhancer-library-redirect");
    const debloatToggleButton = root.querySelector(".yt-enhancer-settings-debloat-toggle");
    const debloatToggleArrow = debloatToggleButton?.querySelector(".yt-enhancer-settings-hidden-toggle-arrow");
    const debloatCollapsible = root.querySelector(".yt-enhancer-settings-debloat-collapsible");
    const debloatSummary = root.querySelector(".yt-enhancer-settings-debloat-summary");
    const debloatList = root.querySelector(".yt-enhancer-settings-debloat-list");
    const hideUpgradeCheckbox = root.querySelector("#yt-enhancer-hide-upgrade");
    const hideListenAgainArtistsCheckbox = root.querySelector("#yt-enhancer-hide-listen-again-artists");
    const hiddenArtistsToggleButton = root.querySelector(".yt-enhancer-settings-hidden-artists-toggle");
    const hiddenArtistsToggleArrow = hiddenArtistsToggleButton?.querySelector(".yt-enhancer-settings-hidden-toggle-arrow");
    const hiddenArtistsCollapsible = root.querySelector(".yt-enhancer-settings-hidden-artists-collapsible");
    const hiddenArtistsSummary = root.querySelector(".yt-enhancer-settings-hidden-artists-summary");
    const hiddenArtistsList = root.querySelector(".yt-enhancer-settings-hidden-artists-list");
    const unhideAllArtistsButton = root.querySelector(".yt-enhancer-settings-unhide-all-artists");
    const sectionsDebloatList = root.querySelector(".yt-enhancer-settings-sections-debloat-list");
    const hideAllSectionsCheckbox = root.querySelector("#yt-enhancer-hide-all-sections");
    const sectionsDebloatToggleButton = root.querySelector(".yt-enhancer-settings-sections-debloat-toggle");
    const sectionsDebloatToggleArrow = sectionsDebloatToggleButton?.querySelector(".yt-enhancer-settings-hidden-toggle-arrow");
    const sectionsDebloatCollapsible = root.querySelector(".yt-enhancer-settings-sections-debloat-collapsible");
    const sectionsDebloatSummary = root.querySelector(".yt-enhancer-settings-sections-debloat-summary");

    if (
      !toggleButton ||
      !closeButton ||
      !backdrop ||
      !modal ||
      !modeSelect ||
      !modeHelp ||
      !catppuccinVariantsWrap ||
      !catppuccinVariantSelect ||
      !popupAccentInput ||
      !popupBackgroundInput ||
      !pinColorInput ||
      !pinPinnedColorInput ||
      !resetThemeButton ||
      !hiddenToggleButton ||
      !hiddenToggleArrow ||
      !hiddenCollapsible ||
      !hiddenSummary ||
      !hiddenList ||
      !unhideAllButton ||
      !libraryRedirectCheckbox ||
      !debloatToggleButton ||
      !debloatToggleArrow ||
      !debloatCollapsible ||
      !debloatSummary ||
      !debloatList ||
      !hideUpgradeCheckbox ||
      !hideListenAgainArtistsCheckbox ||
      !hiddenArtistsToggleButton ||
      !hiddenArtistsToggleArrow ||
      !hiddenArtistsCollapsible ||
      !hiddenArtistsSummary ||
      !hiddenArtistsList ||
      !unhideAllArtistsButton ||
      !sectionsDebloatList ||
      !hideAllSectionsCheckbox ||
      !sectionsDebloatToggleButton ||
      !sectionsDebloatToggleArrow ||
      !sectionsDebloatCollapsible ||
      !sectionsDebloatSummary ||
      presetButtons.length === 0
    ) {
      return;
    }

    const DRAG_THRESHOLD = 4;
    const DRAG_MARGIN = 8;
    let dragState = null;
    let suppressNextToggleClick = false;

    const parseSettingsButtonPosition = (value) => {
      const parsedValue =
        typeof value === "string"
          ? (() => {
              try {
                return JSON.parse(value);
              } catch {
                return null;
              }
            })()
          : value;

      if (!parsedValue || typeof parsedValue !== "object") return null;

      const left = Number(parsedValue.left);
      const top = Number(parsedValue.top);
      if (!Number.isFinite(left) || !Number.isFinite(top)) return null;

      return { left, top };
    };

    const loadSettingsButtonPosition = () =>
      parseSettingsButtonPosition(
        getStoredValue(SETTINGS_BUTTON_POSITION_STORAGE_KEY, null),
      );

    const saveSettingsButtonPosition = (position) => {
      setStoredValue(SETTINGS_BUTTON_POSITION_STORAGE_KEY, {
        left: Math.round(position.left),
        top: Math.round(position.top),
      });
    };

    const clampSettingsButtonPosition = (position) => {
      const rect = root.getBoundingClientRect();
      const maxLeft = Math.max(DRAG_MARGIN, window.innerWidth - rect.width - DRAG_MARGIN);
      const maxTop = Math.max(DRAG_MARGIN, window.innerHeight - rect.height - DRAG_MARGIN);

      return {
        left: Math.min(maxLeft, Math.max(DRAG_MARGIN, position.left)),
        top: Math.min(maxTop, Math.max(DRAG_MARGIN, position.top)),
      };
    };

    const applySettingsButtonPosition = (position, persist = false) => {
      if (!position) {
        root.classList.remove("is-custom-position");
        root.style.left = "";
        root.style.top = "";
        root.style.right = "";
        root.style.bottom = "";
        return;
      }

      const clampedPosition = clampSettingsButtonPosition(position);
      root.classList.add("is-custom-position");
      root.style.left = `${clampedPosition.left}px`;
      root.style.top = `${clampedPosition.top}px`;
      root.style.right = "auto";
      root.style.bottom = "auto";

      if (persist) {
        saveSettingsButtonPosition(clampedPosition);
      }
    };

    const initialPosition = loadSettingsButtonPosition();
    if (initialPosition) {
      requestAnimationFrame(() => {
        applySettingsButtonPosition(initialPosition, false);
      });
    }

    const setPanelOpen = (isOpen) => {
      root.classList.toggle("is-open", isOpen);
      toggleButton.setAttribute("aria-expanded", String(isOpen));

      if (isOpen) {
        document.body.style.overflow = "hidden";
        renderSectionsDebloatControls();
      } else {
        document.body.style.overflow = "";
      }
    };

    const syncMode = (mode) => {
      const normalizedMode = normalizePinVisibilityMode(mode);
      modeSelect.value = normalizedMode;
      modeHelp.textContent = getPinVisibilityModeDescription(normalizedMode);
    };

    const syncThemeInputs = (theme) => {
      const normalizedTheme = normalizeSettingsTheme(theme);
      popupAccentInput.value = normalizedTheme.popupAccent;
      popupBackgroundInput.value = normalizedTheme.popupBackground;
      pinColorInput.value = normalizedTheme.pinColor;
      pinPinnedColorInput.value = normalizedTheme.pinPinnedColor;

      const matchedPreset = getMatchingThemePresetName(normalizedTheme);
      const matchedCatppuccinVariant = getMatchingCatppuccinVariant(normalizedTheme);

      catppuccinVariantsWrap.hidden = matchedPreset !== "catppuccin";
      catppuccinVariantSelect.value =
        matchedCatppuccinVariant || DEFAULT_CATPPUCCIN_VARIANT;

      presetButtons.forEach((button) => {
        const isActive = button.dataset.preset === matchedPreset;
        button.classList.toggle("is-active", isActive);
      });
    };

    const renderHiddenPlaylistControls = () => {
      const hiddenGroups = getHiddenPlaylistGroups();

      hiddenSummary.textContent =
        hiddenGroups.length === 0
          ? "Playlists ocultas — nenhuma playlist oculta."
          : `Playlists ocultas — ${hiddenGroups.length} playlist${
              hiddenGroups.length > 1 ? "s" : ""
            } oculta${hiddenGroups.length > 1 ? "s" : ""}.`;

      hiddenList.innerHTML = "";

      hiddenGroups.forEach((group) => {
        const itemButton = document.createElement("button");
        itemButton.type = "button";
        itemButton.className = "yt-enhancer-settings-hidden-item";

        const nameSpan = document.createElement("span");
        nameSpan.className = "yt-enhancer-settings-hidden-name";
        nameSpan.textContent = group.label;

        const actionSpan = document.createElement("span");
        actionSpan.className = "yt-enhancer-settings-hidden-action";
        actionSpan.textContent = "Reexibir";

        itemButton.appendChild(nameSpan);
        itemButton.appendChild(actionSpan);

        itemButton.addEventListener("click", () => {
          unhidePlaylist(group.keys);
          pinPlaylists();
          processLibraryPlaylists();
          renderHiddenPlaylistControls();
        });

        hiddenList.appendChild(itemButton);
      });

      hiddenList.hidden = hiddenGroups.length === 0;
      unhideAllButton.disabled = hiddenGroups.length === 0;
    };

    const renderDebloatControls = () => {
      const hiddenCount = hiddenContextMenuItems.length;
      const totalCount = CONTEXT_MENU_ITEMS.length;

      debloatSummary.textContent =
        hiddenCount === 0
          ? `Menu de contexto — todos os ${totalCount} itens visiveis.`
          : `Menu de contexto — ${hiddenCount} de ${totalCount} iten${hiddenCount > 1 ? "s" : ""} oculto${hiddenCount > 1 ? "s" : ""}.`;

      debloatList.innerHTML = "";

      CONTEXT_MENU_ITEMS.forEach((item) => {
        const isHidden = isContextMenuItemHidden(item.id);

        const row = document.createElement("label");
        row.className = "yt-enhancer-settings-debloat-item";

        const nameSpan = document.createElement("span");
        nameSpan.className = "yt-enhancer-settings-debloat-name";
        nameSpan.textContent = item.label;

        const switchWrap = document.createElement("span");
        switchWrap.className = "yt-enhancer-switch";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "yt-enhancer-switch-input";
        input.checked = !isHidden;

        const track = document.createElement("span");
        track.className = "yt-enhancer-switch-track";

        input.addEventListener("change", () => {
          setContextMenuItemHidden(item.id, !input.checked);
          debloatContextMenu();
          renderDebloatControls();
        });

        switchWrap.appendChild(input);
        switchWrap.appendChild(track);

        row.appendChild(nameSpan);
        row.appendChild(switchWrap);
        debloatList.appendChild(row);
      });
    };

    const renderHiddenArtistControls = () => {
      const hiddenArtists = getHiddenArtistList();

      hiddenArtistsSummary.textContent =
        hiddenArtists.length === 0
          ? "Nenhum artista oculto."
          : `${hiddenArtists.length} artista${hiddenArtists.length > 1 ? "s" : ""} oculto${hiddenArtists.length > 1 ? "s" : ""}.`;

      hiddenArtistsList.innerHTML = "";

      hiddenArtists.forEach((artist) => {
        const itemButton = document.createElement("button");
        itemButton.type = "button";
        itemButton.className = "yt-enhancer-settings-hidden-item";

        const nameSpan = document.createElement("span");
        nameSpan.className = "yt-enhancer-settings-hidden-name";
        nameSpan.textContent = artist.label;

        const actionSpan = document.createElement("span");
        actionSpan.className = "yt-enhancer-settings-hidden-action";
        actionSpan.textContent = "Reexibir";

        itemButton.appendChild(nameSpan);
        itemButton.appendChild(actionSpan);

        itemButton.addEventListener("click", () => {
          unhideArtist(artist.channelId);
          debloatListenAgainArtists();
          renderHiddenArtistControls();
        });

        hiddenArtistsList.appendChild(itemButton);
      });

      hiddenArtistsList.hidden = hiddenArtists.length === 0;
      unhideAllArtistsButton.disabled = hiddenArtists.length === 0;
    };

    const updateSectionsDebloatSummary = () => {
      const knownHidden = hiddenHomepageSections.length;
      const dynamicHidden = hiddenDynamicSections.length;
      const totalKnown = HOMEPAGE_SECTIONS.length;
      const allKnownHidden = knownHidden === totalKnown;
      hideAllSectionsCheckbox.checked = allKnownHidden;

      if (knownHidden === 0 && dynamicHidden === 0) {
        sectionsDebloatSummary.textContent =
          `Ocultar seções — todas as ${totalKnown} seções visíveis.`;
      } else if (dynamicHidden === 0) {
        sectionsDebloatSummary.textContent =
          `Ocultar seções — ${knownHidden} de ${totalKnown} oculta${knownHidden > 1 ? "s" : ""}.`;
      } else if (knownHidden === 0) {
        sectionsDebloatSummary.textContent =
          `Ocultar seções — ${dynamicHidden} personalizada${dynamicHidden > 1 ? "s" : ""} oculta${dynamicHidden > 1 ? "s" : ""}.`;
      } else {
        sectionsDebloatSummary.textContent =
          `Ocultar seções — ${knownHidden} de ${totalKnown} + ${dynamicHidden} personalizada${dynamicHidden > 1 ? "s" : ""} oculta${knownHidden + dynamicHidden > 1 ? "s" : ""}.`;
      }
    };

    const renderSectionsDebloatControls = () => {
      sectionsDebloatList.innerHTML = "";
      updateSectionsDebloatSummary();

      HOMEPAGE_SECTIONS.forEach((section) => {
        const isHidden = isHomepageSectionHidden(section.id);

        const row = document.createElement("label");
        row.className = "yt-enhancer-settings-switch-control";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = `Ocultar "${section.label}"`;

        if (section.hint) {
          const hintSpan = document.createElement("span");
          hintSpan.className = "yt-enhancer-settings-hint";
          hintSpan.textContent = "?";
          hintSpan.setAttribute("data-tip", section.hint);
          hintSpan.setAttribute("title", section.hint);
          nameSpan.appendChild(document.createTextNode(" "));
          nameSpan.appendChild(hintSpan);
        }

        const switchWrap = document.createElement("span");
        switchWrap.className = "yt-enhancer-switch";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "yt-enhancer-switch-input";
        input.checked = isHidden;

        const track = document.createElement("span");
        track.className = "yt-enhancer-switch-track";

        input.addEventListener("change", () => {
          setHomepageSectionHidden(section.id, input.checked);
          debloatHomepageSections();
          updateSectionsDebloatSummary();
        });

        switchWrap.appendChild(input);
        switchWrap.appendChild(track);

        row.appendChild(nameSpan);
        row.appendChild(switchWrap);
        sectionsDebloatList.appendChild(row);
      });

      // Render dynamic (personalized) sections
      if (hiddenDynamicSections.length > 0) {
        const dynamicLabel = document.createElement("span");
        dynamicLabel.className = "yt-enhancer-settings-dynamic-label";
        dynamicLabel.textContent = "Seções personalizadas ocultas";
        sectionsDebloatList.appendChild(dynamicLabel);

        hiddenDynamicSections.forEach((entry) => {
          const itemButton = document.createElement("button");
          itemButton.type = "button";
          itemButton.className = "yt-enhancer-settings-hidden-item";

          const nameSpan = document.createElement("span");
          nameSpan.className = "yt-enhancer-settings-hidden-name";
          nameSpan.textContent = entry.displayTitle;

          const actionSpan = document.createElement("span");
          actionSpan.className = "yt-enhancer-settings-hidden-action";
          actionSpan.textContent = "Reexibir";

          itemButton.appendChild(nameSpan);
          itemButton.appendChild(actionSpan);

          itemButton.addEventListener("click", () => {
            unhideDynamicSection(entry.title);
            debloatHomepageSections();
            renderSectionsDebloatControls();
          });

          sectionsDebloatList.appendChild(itemButton);
        });
      }
    };

    const applyThemeFromInputs = (persist) => {
      const appliedTheme = applySettingsTheme(
        {
          popupAccent: popupAccentInput.value,
          popupBackground: popupBackgroundInput.value,
          pinColor: pinColorInput.value,
          pinPinnedColor: pinPinnedColorInput.value,
        },
        persist,
      );
      syncThemeInputs(appliedTheme);
    };

    syncMode(pinVisibilityMode);
    syncThemeInputs(settingsTheme);
    renderHiddenPlaylistControls();
    renderDebloatControls();
    libraryRedirectCheckbox.checked = Boolean(libraryRedirectToPlaylists);
    hideUpgradeCheckbox.checked = Boolean(hideUpgradeButton);
    hideListenAgainArtistsCheckbox.checked = Boolean(hideListenAgainArtists);
    renderHiddenArtistControls();
    renderSectionsDebloatControls();

    libraryRedirectCheckbox.addEventListener("change", () => {
      setLibraryRedirect(libraryRedirectCheckbox.checked);
    });

    hideUpgradeCheckbox.addEventListener("change", () => {
      setHideUpgradeButton(hideUpgradeCheckbox.checked);
      debloatUpgradeButton();
    });

    hideListenAgainArtistsCheckbox.addEventListener("change", () => {
      setHideListenAgainArtists(hideListenAgainArtistsCheckbox.checked);
      if (hideListenAgainArtistsCheckbox.checked) {
        collectAllListenAgainArtists();
      } else {
        unhideAllArtists();
        renderHiddenArtistControls();
      }
      debloatListenAgainArtists();
    });

    hideAllSectionsCheckbox.addEventListener("change", () => {
      const shouldHide = hideAllSectionsCheckbox.checked;
      const inputs = sectionsDebloatList.querySelectorAll(".yt-enhancer-switch-input");

      inputs.forEach((input, index) => {
        setTimeout(() => {
          if (input.checked !== shouldHide) {
            input.checked = shouldHide;
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }, index * 60);
      });
    });

    toggleButton.addEventListener("click", (event) => {
      if (suppressNextToggleClick) {
        suppressNextToggleClick = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      setPanelOpen(!root.classList.contains("is-open"));
    });

    toggleButton.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;

      const rect = root.getBoundingClientRect();
      dragState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: rect.left,
        startTop: rect.top,
        moved: false,
      };

      root.classList.add("is-dragging");
      suppressNextToggleClick = false;

      try {
        toggleButton.setPointerCapture(event.pointerId);
      } catch {
        // Alguns ambientes podem nao suportar pointer capture
      }
    });

    toggleButton.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;

      if (!dragState.moved && Math.hypot(deltaX, deltaY) >= DRAG_THRESHOLD) {
        dragState.moved = true;
        setPanelOpen(false);
      }

      if (!dragState.moved) return;

      event.preventDefault();
      applySettingsButtonPosition(
        {
          left: dragState.startLeft + deltaX,
          top: dragState.startTop + deltaY,
        },
        false,
      );
    });

    const finishButtonDrag = (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;

      if (dragState.moved) {
        const rect = root.getBoundingClientRect();
        applySettingsButtonPosition(
          {
            left: rect.left,
            top: rect.top,
          },
          true,
        );
        suppressNextToggleClick = true;
      }

      dragState = null;
      root.classList.remove("is-dragging");

      try {
        toggleButton.releasePointerCapture(event.pointerId);
      } catch {
        // Alguns ambientes podem nao suportar pointer capture
      }
    };

    toggleButton.addEventListener("pointerup", finishButtonDrag);
    toggleButton.addEventListener("pointercancel", finishButtonDrag);

    closeButton.addEventListener("click", () => {
      setPanelOpen(false);
    });

    modeSelect.addEventListener("change", () => {
      const appliedMode = setPinVisibilityMode(modeSelect.value);
      syncMode(appliedMode);
    });

    presetButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const presetName = button.dataset.preset;
        const appliedTheme =
          presetName === "catppuccin"
            ? applyCatppuccinVariant(catppuccinVariantSelect.value, true)
            : applyThemePreset(presetName, true);
        syncThemeInputs(appliedTheme);
      });
    });

    catppuccinVariantSelect.addEventListener("change", () => {
      const appliedTheme = applyCatppuccinVariant(catppuccinVariantSelect.value, true);
      syncThemeInputs(appliedTheme);
    });

    [
      popupAccentInput,
      popupBackgroundInput,
      pinColorInput,
      pinPinnedColorInput,
    ].forEach((input) => {
      input.addEventListener("input", () => {
        applyThemeFromInputs(false);
      });

      input.addEventListener("change", () => {
        applyThemeFromInputs(true);
      });
    });

    resetThemeButton.addEventListener("click", () => {
      const defaultTheme = applySettingsTheme(DEFAULT_SETTINGS_THEME, true);
      syncThemeInputs(defaultTheme);
    });

    hiddenToggleButton.addEventListener("click", () => {
      const isOpen = !hiddenCollapsible.hidden;
      hiddenCollapsible.hidden = isOpen;
      hiddenToggleArrow.classList.toggle("is-open", !isOpen);
    });

    unhideAllButton.addEventListener("click", () => {
      unhideAllPlaylists();
      pinPlaylists();
      processLibraryPlaylists();
      renderHiddenPlaylistControls();
    });

    debloatToggleButton.addEventListener("click", () => {
      const isOpen = !debloatCollapsible.hidden;
      debloatCollapsible.hidden = isOpen;
      debloatToggleArrow.classList.toggle("is-open", !isOpen);
    });

    hiddenArtistsToggleButton.addEventListener("click", () => {
      const isOpen = !hiddenArtistsCollapsible.hidden;
      hiddenArtistsCollapsible.hidden = isOpen;
      hiddenArtistsToggleArrow.classList.toggle("is-open", !isOpen);
    });

    sectionsDebloatToggleButton.addEventListener("click", () => {
      const isOpen = !sectionsDebloatCollapsible.hidden;
      sectionsDebloatCollapsible.hidden = isOpen;
      sectionsDebloatToggleArrow.classList.toggle("is-open", !isOpen);
    });

    unhideAllArtistsButton.addEventListener("click", () => {
      unhideAllArtists();
      debloatListenAgainArtists();
      renderHiddenArtistControls();
    });

    backdrop.addEventListener("click", () => {
      setPanelOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setPanelOpen(false);
      }
    });

    document.addEventListener("yt-enhancer:pin-mode-change", (event) => {
      syncMode(event.detail?.mode || pinVisibilityMode);
    });

    document.addEventListener("yt-enhancer:theme-change", (event) => {
      syncThemeInputs(event.detail?.theme || settingsTheme);
    });

    document.addEventListener("yt-enhancer:hidden-playlists-change", () => {
      renderHiddenPlaylistControls();
    });

    document.addEventListener("yt-enhancer:hidden-artists-change", () => {
      renderHiddenArtistControls();
    });

    window.addEventListener("resize", () => {
      if (!root.classList.contains("is-custom-position")) return;

      const rect = root.getBoundingClientRect();
      applySettingsButtonPosition(
        {
          left: rect.left,
          top: rect.top,
        },
        true,
      );
    });
  }

  // === CSS INJECTION ===
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      :root {
        --yte-pin-color: #ff8aa1;
        --yte-pin-pinned-color: #ff2956;
        --yte-pin-glow: rgba(255, 41, 86, 0.42);
        --yte-popup-accent: #ff3f66;
        --yte-popup-accent-strong: #c9163b;
        --yte-popup-accent-soft: rgba(255, 63, 102, 0.18);
        --yte-popup-accent-border: rgba(255, 63, 102, 0.3);
        --yte-popup-bg-top: #14161c;
        --yte-popup-bg-mid: #101116;
        --yte-popup-bg-bottom: #09090c;
        --yte-popup-text: #f5f5f6;
        --yte-popup-muted: rgba(255, 255, 255, 0.76);
        --yte-popup-label: #ff9cb0;
        --yte-popup-select-bg: #20232b;
        --yte-popup-select-border: rgba(255, 63, 102, 0.26);
        --yte-popup-close-color: rgba(255, 255, 255, 0.8);
        --yte-popup-close-hover-bg: #c9163b;
        --yte-popup-toggle-grad-a: #ff4d73;
        --yte-popup-toggle-grad-b: #c9163b;
        --yte-popup-toggle-border: rgba(255, 63, 102, 0.44);
        --yte-popup-toggle-shadow: rgba(255, 63, 102, 0.38);
      }

      .center-content.ytmusic-nav-bar { justify-content: center; }
      ytmusic-search-box .search-container { box-shadow: unset !important; }
      ytmusic-search-box .search-box { border-radius: 40px !important; }
      ytmusic-search-box #input::placeholder { color: transparent; }
      ytmusic-search-box #suggestion-list {
        border-radius: 8px !important;
        top: 53px;
        padding: unset;
        border: none;
      }

      ytmusic-player-bar {
        grid-template-columns: 1fr 0.5fr 1fr !important;
        grid-template-areas: "start middle end" !important;
      }
      ytmusic-player-bar .middle-controls {
        grid-area: start !important;
        justify-content: flex-start !important;
      }
      ytmusic-player-bar #left-controls {
        grid-area: middle !important;
        justify-content: center !important;
      }
      ytmusic-player-bar #left-controls .time-info {
        position: absolute !important;
        bottom: 2px !important;
        margin: 0 0 0 8px !important;
      }
      ytmusic-player-bar #left-controls .rewind-button,
      ytmusic-player-bar #left-controls yt-icon-button:nth-last-of-type(2) {
        display: block !important;
      }
      ytmusic-player-bar #right-controls {
        grid-area: end !important;
        justify-content: center !important;
      }
      ytmusic-player-bar #like-button-renderer { display: none !important; }

      ul#items.yt-enhancer-recents-flex {
        display: flex !important;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
        transform: none !important;
        width: auto !important;
      }
      ul#items.yt-enhancer-recents-flex > ytmusic-two-row-item-renderer:not([style*="display: none"]) {
        flex: 1 1 0 !important;
        min-width: 0 !important;
        max-width: calc(50% - 6px) !important;
        width: auto !important;
      }
      /* Evitar que #items-wrapper corte os itens flex do Recentes */
      .yt-enhancer-recents-overflow-fix {
        overflow: visible !important;
      }
      /* Esconder setas de navegação do carousel quando flex está ativo */
      .yt-enhancer-recents-overflow-fix ~ #left-arrow,
      .yt-enhancer-recents-overflow-fix ~ #right-arrow,
      .yt-enhancer-recents-overflow-fix + #left-arrow,
      .yt-enhancer-recents-overflow-fix + #right-arrow {
        display: none !important;
      }

      .yt-enhancer-sidebar-pin-host,
      .yt-enhancer-modal-pin-host,
      .yt-enhancer-library-hide-host {
        position: relative !important;
        box-sizing: border-box;
      }

      .yt-enhancer-pin-toggle,
      .yt-enhancer-modal-pin-toggle,
      .yt-enhancer-hide-toggle,
      .yt-enhancer-library-hide-toggle,
      .yt-enhancer-library-pin-toggle {
        border: none;
        background: transparent;
        color: var(--yte-pin-color);
        cursor: pointer;
        padding: 0;
        line-height: 0;
        transition: opacity 0.15s ease, transform 0.15s ease, color 0.15s ease;
      }
      .yt-enhancer-pin-icon {
        width: 1em;
        height: 1em;
        display: block;
        fill: currentColor;
      }
      .yt-enhancer-hide-icon {
        width: 1em;
        height: 1em;
        display: block;
        fill: currentColor;
      }

      .yt-enhancer-pin-toggle {
        position: absolute;
        left: -4px;
        right: auto;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        z-index: 2;
      }

      .yt-enhancer-hide-toggle {
        position: absolute;
        left: 13px;
        right: auto;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        z-index: 2;
        color: var(--yte-popup-muted);
      }

      .yt-enhancer-modal-pin-toggle {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 15px;
        z-index: 2;
      }

      .yt-enhancer-library-hide-toggle {
        position: static;
        font-size: 14px;
        color: var(--yte-pin-color);
      }
      .yt-enhancer-library-pin-toggle {
        position: static;
        font-size: 15px;
      }
      .yt-enhancer-library-controls {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        display: inline-flex;
        align-items: center;
        gap: 6px;
        z-index: 2;
        transition: opacity 0.15s ease;
      }

      html[data-yt-enhancer-pin-mode="always"] .yt-enhancer-sidebar-pin-host,
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-sidebar-pin-host {
        padding-left: 34px;
        padding-right: 0;
      }
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-sidebar-pin-host {
        padding-left: 0;
        padding-right: 0;
        transition: padding-left 0.15s ease;
      }
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-sidebar-pin-host.yt-enhancer-pin-host-pinned {
        padding-left: 20px;
      }

      html[data-yt-enhancer-pin-mode="always"] .yt-enhancer-modal-pin-host,
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-modal-pin-host {
        padding-right: 34px;
      }
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-modal-pin-host {
        padding-right: 0;
      }
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-modal-pin-host.yt-enhancer-modal-pin-host-pinned {
        padding-right: 34px;
      }

      .yt-enhancer-library-hide-host {
        padding-left: 0;
        transition: padding-left 0.15s ease;
      }

      html[data-yt-enhancer-pin-mode="always"] .yt-enhancer-pin-toggle,
      html[data-yt-enhancer-pin-mode="always"] .yt-enhancer-modal-pin-toggle {
        opacity: 0.86;
        pointer-events: auto;
        color: var(--yte-pin-color);
        transform: translateY(-50%) scale(1);
      }
      html[data-yt-enhancer-pin-mode="always"] .yt-enhancer-hide-toggle {
        opacity: 0.68;
        pointer-events: auto;
        transform: translateY(-50%) scale(1);
      }
      html[data-yt-enhancer-pin-mode="always"] .yt-enhancer-pin-toggle[data-pinned="true"],
      html[data-yt-enhancer-pin-mode="always"] .yt-enhancer-modal-pin-toggle[data-pinned="true"] {
        opacity: 1;
        color: var(--yte-pin-pinned-color);
        text-shadow: 0 0 8px var(--yte-pin-glow);
        transform: translateY(-50%) scale(1.07);
      }
      html[data-yt-enhancer-pin-mode="always"] .yt-enhancer-hide-toggle[data-hidden="true"] {
        opacity: 1;
        color: var(--yte-pin-pinned-color);
      }

      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-pin-toggle {
        opacity: 0.32;
        pointer-events: auto;
        transform: translateY(-50%) scale(0.9);
      }
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-hide-toggle {
        opacity: 0.24;
        pointer-events: auto;
        transform: translateY(-50%) scale(0.9);
      }
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-modal-pin-toggle {
        opacity: 0.35;
        pointer-events: auto;
      }
      html[data-yt-enhancer-pin-mode="dynamic"] ytmusic-guide-entry-renderer:hover .yt-enhancer-pin-toggle,
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-sidebar-pin-host:hover .yt-enhancer-pin-toggle,
      html[data-yt-enhancer-pin-mode="dynamic"] ytmusic-guide-entry-renderer:hover .yt-enhancer-hide-toggle,
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-sidebar-pin-host:hover .yt-enhancer-hide-toggle,
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-pin-toggle:focus-visible {
        opacity: 1;
        transform: translateY(-50%) scale(1);
      }
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-modal-pin-host:hover .yt-enhancer-modal-pin-toggle,
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-modal-pin-toggle:focus-visible {
        opacity: 1;
      }
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-pin-toggle[data-pinned="true"],
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-modal-pin-toggle[data-pinned="true"] {
        opacity: 0.72;
        color: var(--yte-pin-pinned-color);
        transform: translateY(-50%) scale(0.97);
      }
      html[data-yt-enhancer-pin-mode="dynamic"] .yt-enhancer-hide-toggle[data-hidden="true"] {
        opacity: 0.85;
        color: var(--yte-pin-pinned-color);
      }

      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-pin-toggle,
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-modal-pin-toggle,
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-hide-toggle {
        opacity: 0;
        pointer-events: none;
        transform: translateY(-50%) scale(0.92);
      }
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-sidebar-pin-host .yt-enhancer-pin-toggle {
        left: -4px;
      }
      html[data-yt-enhancer-pin-mode="hover-only"] ytmusic-guide-entry-renderer:hover .yt-enhancer-sidebar-pin-host,
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-sidebar-pin-host:hover,
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-sidebar-pin-host:focus-within {
        padding-left: 34px;
      }
      ytmusic-responsive-list-item-renderer:hover .yt-enhancer-library-hide-host,
      ytmusic-two-row-item-renderer:hover .yt-enhancer-library-hide-host,
      ytmusic-grid-item-renderer:hover .yt-enhancer-library-hide-host,
      ytmusic-lockup-view-model:hover .yt-enhancer-library-hide-host,
      .yt-enhancer-library-hide-host:focus-within,
      .yt-enhancer-library-hide-host.yt-enhancer-library-hide-host-has-active {
        padding-left: 20px;
      }
      html[data-yt-enhancer-pin-mode="hover-only"] ytmusic-guide-entry-renderer:hover .yt-enhancer-pin-toggle,
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-sidebar-pin-host:hover .yt-enhancer-pin-toggle,
      html[data-yt-enhancer-pin-mode="hover-only"] ytmusic-guide-entry-renderer:hover .yt-enhancer-hide-toggle,
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-sidebar-pin-host:hover .yt-enhancer-hide-toggle,
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-modal-pin-host:hover .yt-enhancer-modal-pin-toggle,
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-pin-toggle:focus-visible,
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-modal-pin-toggle:focus-visible,
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-hide-toggle:focus-visible {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(-50%) scale(1);
      }
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-pin-toggle[data-pinned="true"],
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-modal-pin-toggle[data-pinned="true"],
      html[data-yt-enhancer-pin-mode="hover-only"] .yt-enhancer-hide-toggle[data-hidden="true"] {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(-50%) scale(1);
      }

      .yt-enhancer-library-controls {
        opacity: 0;
        pointer-events: none;
      }
      ytmusic-responsive-list-item-renderer:hover .yt-enhancer-library-controls,
      ytmusic-two-row-item-renderer:hover .yt-enhancer-library-controls,
      ytmusic-grid-item-renderer:hover .yt-enhancer-library-controls,
      ytmusic-lockup-view-model:hover .yt-enhancer-library-controls,
      .yt-enhancer-library-controls:focus-within,
      .yt-enhancer-library-controls.yt-enhancer-library-controls-has-active {
        opacity: 0.95;
        pointer-events: auto;
      }

      .yt-enhancer-pin-toggle[data-pinned="true"],
      .yt-enhancer-modal-pin-toggle[data-pinned="true"],
      .yt-enhancer-library-pin-toggle[data-pinned="true"],
      .yt-enhancer-hide-toggle[data-hidden="true"],
      .yt-enhancer-library-hide-toggle[data-hidden="true"] {
        color: var(--yte-pin-pinned-color);
      }

      .yt-enhancer-settings-root {
        position: fixed;
        right: 18px;
        bottom: calc(env(safe-area-inset-bottom) + 104px);
        z-index: 10003;
        font-family: Roboto, sans-serif;
      }
      .yt-enhancer-settings-root.is-custom-position {
        right: auto !important;
        bottom: auto !important;
      }
      .yt-enhancer-settings-root.is-dragging {
        user-select: none;
      }
      .yt-enhancer-settings-toggle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid var(--yte-popup-toggle-border);
        background: linear-gradient(
          145deg,
          var(--yte-popup-toggle-grad-a),
          var(--yte-popup-toggle-grad-b)
        );
        color: #fff;
        font-size: 22px;
        line-height: 1;
        cursor: grab;
        touch-action: none;
        box-shadow:
          0 10px 24px rgba(0, 0, 0, 0.42),
          0 2px 10px var(--yte-popup-toggle-shadow);
        transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
      }
      .yt-enhancer-settings-root.is-dragging .yt-enhancer-settings-toggle {
        cursor: grabbing;
      }
      .yt-enhancer-settings-toggle:hover {
        transform: translateY(-2px) scale(1.02);
        filter: saturate(1.08);
        box-shadow:
          0 12px 26px rgba(0, 0, 0, 0.45),
          0 3px 12px var(--yte-popup-toggle-shadow);
      }
      .yt-enhancer-settings-root.is-open .yt-enhancer-settings-toggle {
        background: linear-gradient(
          145deg,
          var(--yte-popup-accent),
          var(--yte-popup-accent-strong)
        );
        color: #fff;
        border-color: var(--yte-popup-toggle-border);
      }

      /* Backdrop overlay */
      .yt-enhancer-settings-backdrop {
        position: fixed;
        inset: 0;
        z-index: 10004;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(4px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.22s ease;
      }
      .yt-enhancer-settings-root.is-open .yt-enhancer-settings-backdrop {
        opacity: 1;
        pointer-events: auto;
      }

      /* Modal */
      .yt-enhancer-settings-modal {
        position: fixed;
        z-index: 10005;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.96);
        width: min(480px, calc(100vw - 32px));
        max-height: min(640px, calc(100vh - 48px));
        border-radius: 16px;
        border: 1px solid var(--yte-popup-accent-border);
        background:
          radial-gradient(circle at top right, var(--yte-popup-accent-soft), transparent 58%),
          linear-gradient(
            160deg,
            var(--yte-popup-bg-top),
            var(--yte-popup-bg-mid) 72%,
            var(--yte-popup-bg-bottom)
          );
        box-shadow:
          0 24px 48px rgba(0, 0, 0, 0.55),
          0 8px 24px rgba(0, 0, 0, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.06);
        color: var(--yte-popup-text);
        display: flex;
        flex-direction: column;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.22s ease, transform 0.22s ease;
      }
      .yt-enhancer-settings-root.is-open .yt-enhancer-settings-modal {
        opacity: 1;
        pointer-events: auto;
        transform: translate(-50%, -50%) scale(1);
      }

      /* Header */
      .yt-enhancer-settings-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px 12px;
        border-bottom: 1px solid var(--yte-popup-accent-border);
        flex-shrink: 0;
      }
      .yt-enhancer-settings-header-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      /* Scrollable body */
      .yt-enhancer-settings-body {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 16px 20px 20px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .yt-enhancer-settings-body::-webkit-scrollbar {
        width: 6px;
      }
      .yt-enhancer-settings-body::-webkit-scrollbar-track {
        background: transparent;
      }
      .yt-enhancer-settings-body::-webkit-scrollbar-thumb {
        background: var(--yte-popup-select-border);
        border-radius: 3px;
      }
      .yt-enhancer-settings-body::-webkit-scrollbar-thumb:hover {
        background: var(--yte-popup-label);
      }

      /* Sections */
      .yt-enhancer-settings-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px 0;
        border-bottom: 1px solid var(--yte-popup-accent-border);
      }
      .yt-enhancer-settings-section:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
      .yt-enhancer-settings-close {
        width: 32px;
        height: 32px;
        border: 1px solid var(--yte-popup-select-border);
        border-radius: 8px;
        background: transparent;
        color: var(--yte-popup-close-color);
        font-size: 20px;
        line-height: 1;
        cursor: pointer;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: color 0.15s ease, background 0.15s ease;
      }
      .yt-enhancer-settings-close:hover {
        color: #fff;
        background: var(--yte-popup-close-hover-bg);
      }
      .yt-enhancer-settings-title {
        font-size: 14px;
        letter-spacing: 0.2px;
        color: var(--yte-popup-label);
      }
      .yt-enhancer-settings-meta {
        font-size: 11px;
        color: var(--yte-popup-muted);
      }
      .yt-enhancer-settings-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: var(--yte-popup-label);
        margin-top: 4px;
      }
      .yt-enhancer-settings-select {
        width: 100%;
        border: 1px solid var(--yte-popup-select-border);
        background: var(--yte-popup-select-bg);
        color: var(--yte-popup-text);
        border-radius: 8px;
        padding: 7px 8px;
        font-size: 12px;
      }
      .yt-enhancer-settings-help {
        margin: 0;
        font-size: 11px;
        line-height: 1.35;
        color: var(--yte-popup-muted);
      }
      .yt-enhancer-settings-switch-control {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        font-size: 12px;
        color: var(--yte-popup-text);
        cursor: pointer;
        padding: 2px 0;
      }
      .yt-enhancer-switch {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
        flex-shrink: 0;
      }
      .yt-enhancer-switch-input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }
      .yt-enhancer-switch-track {
        position: absolute;
        inset: 0;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
        cursor: pointer;
      }
      .yt-enhancer-switch-track::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transition: transform 0.25s, background 0.25s, box-shadow 0.25s;
      }
      .yt-enhancer-switch-input:checked + .yt-enhancer-switch-track {
        background: var(--yte-popup-accent);
        border-color: var(--yte-popup-accent);
        box-shadow: 0 0 8px var(--yte-popup-toggle-shadow);
      }
      .yt-enhancer-switch-input:checked + .yt-enhancer-switch-track::after {
        transform: translateX(16px);
        background: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      .yt-enhancer-switch-input:focus-visible + .yt-enhancer-switch-track {
        outline: 2px solid var(--yte-popup-accent);
        outline-offset: 2px;
      }
      .yt-enhancer-settings-presets {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
      .yt-enhancer-settings-catppuccin {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .yt-enhancer-settings-catppuccin[hidden] {
        display: none !important;
      }
      .yt-enhancer-settings-preset {
        border: 1px solid var(--yte-popup-select-border);
        background: var(--yte-popup-select-bg);
        color: var(--yte-popup-text);
        border-radius: 8px;
        padding: 6px 8px;
        font-size: 11px;
        cursor: pointer;
        transition: filter 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
      }
      .yt-enhancer-settings-preset:hover {
        filter: brightness(1.08);
        transform: translateY(-1px);
      }
      .yt-enhancer-settings-preset.is-active {
        border-color: var(--yte-popup-accent);
        box-shadow: 0 0 0 1px var(--yte-popup-accent-soft);
      }
      .yt-enhancer-settings-colors {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
      .yt-enhancer-settings-color-control {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 11px;
        color: var(--yte-popup-muted);
      }
      .yt-enhancer-settings-color-label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .yt-enhancer-settings-hint {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1px solid var(--yte-popup-select-border);
        background: var(--yte-popup-select-bg);
        color: var(--yte-popup-text);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 700;
        line-height: 1;
        cursor: help;
        position: relative;
      }
      .yt-enhancer-settings-hint::after {
        content: attr(data-tip);
        position: absolute;
        left: 50%;
        bottom: calc(100% + 6px);
        transform: translate(-50%, 4px);
        width: 200px;
        padding: 6px 8px;
        border-radius: 8px;
        background: var(--yte-popup-select-bg);
        border: 1px solid var(--yte-popup-select-border);
        color: var(--yte-popup-text);
        font-size: 10px;
        line-height: 1.3;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s ease, transform 0.15s ease;
        z-index: 4;
        white-space: normal;
      }
      .yt-enhancer-settings-hint:hover::after,
      .yt-enhancer-settings-hint:focus-visible::after {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      .yt-enhancer-settings-color-input {
        width: 100%;
        height: 28px;
        border-radius: 8px;
        border: 1px solid var(--yte-popup-select-border);
        background: var(--yte-popup-select-bg);
        padding: 2px;
        cursor: pointer;
      }
      .yt-enhancer-settings-color-input::-webkit-color-swatch-wrapper {
        padding: 0;
      }
      .yt-enhancer-settings-color-input::-webkit-color-swatch {
        border: none;
        border-radius: 5px;
      }
      .yt-enhancer-settings-reset-theme {
        border: 1px solid var(--yte-popup-select-border);
        background: var(--yte-popup-select-bg);
        color: var(--yte-popup-text);
        border-radius: 8px;
        padding: 7px 8px;
        font-size: 12px;
        cursor: pointer;
        margin-top: 2px;
        transition: filter 0.15s ease, transform 0.15s ease;
      }
      .yt-enhancer-settings-reset-theme:hover {
        filter: brightness(1.08);
        transform: translateY(-1px);
      }
      .yt-enhancer-settings-hidden-summary {
        margin: 0;
        font-size: 11px;
        line-height: 1.3;
        color: var(--yte-popup-muted);
      }
      .yt-enhancer-settings-hidden-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .yt-enhancer-settings-hidden-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: 1px solid var(--yte-popup-select-border);
        border-radius: 8px;
        padding: 7px 10px;
        cursor: pointer;
        color: var(--yte-popup-text);
        font-size: 12px;
        transition: filter 0.15s ease;
      }
      .yt-enhancer-settings-hidden-toggle:hover {
        filter: brightness(1.08);
      }
      .yt-enhancer-settings-hidden-toggle-arrow {
        display: inline-block;
        font-size: 10px;
        transition: transform 0.2s ease;
        color: var(--yte-popup-label);
      }
      .yt-enhancer-settings-hidden-toggle-arrow.is-open {
        transform: rotate(90deg);
      }
      .yt-enhancer-settings-hidden-collapsible {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .yt-enhancer-settings-hidden-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        max-height: 200px;
        overflow-y: auto;
        padding-right: 4px;
      }
      .yt-enhancer-settings-hidden-list::-webkit-scrollbar {
        width: 6px;
      }
      .yt-enhancer-settings-hidden-list::-webkit-scrollbar-track {
        background: transparent;
      }
      .yt-enhancer-settings-hidden-list::-webkit-scrollbar-thumb {
        background: var(--yte-popup-select-border);
        border-radius: 3px;
      }
      .yt-enhancer-settings-hidden-list::-webkit-scrollbar-thumb:hover {
        background: var(--yte-popup-label);
      }
      .yt-enhancer-settings-hidden-item {
        border: 1px solid var(--yte-popup-select-border);
        background: var(--yte-popup-select-bg);
        color: var(--yte-popup-text);
        border-radius: 8px;
        padding: 6px 8px;
        font-size: 11px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .yt-enhancer-settings-hidden-item:hover {
        filter: brightness(1.07);
      }
      .yt-enhancer-settings-hidden-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .yt-enhancer-settings-hidden-action {
        color: var(--yte-popup-label);
        font-weight: 600;
        flex: 0 0 auto;
      }
      .yt-enhancer-settings-unhide-all {
        border: 1px solid var(--yte-popup-select-border);
        background: var(--yte-popup-select-bg);
        color: var(--yte-popup-text);
        border-radius: 8px;
        padding: 7px 8px;
        font-size: 12px;
        cursor: pointer;
        transition: filter 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
      }
      .yt-enhancer-settings-unhide-all:hover:not(:disabled) {
        filter: brightness(1.08);
        transform: translateY(-1px);
      }
      .yt-enhancer-settings-unhide-all:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .yt-enhancer-settings-debloat-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .yt-enhancer-settings-debloat-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: none;
        color: var(--yte-popup-muted);
        font-size: 11px;
        cursor: pointer;
        padding: 2px 0;
        text-align: left;
      }
      .yt-enhancer-settings-debloat-toggle:hover {
        color: var(--yte-popup-text);
      }
      .yt-enhancer-settings-debloat-summary {
        font-size: 11px;
        color: var(--yte-popup-muted);
      }
      .yt-enhancer-settings-debloat-collapsible {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .yt-enhancer-settings-debloat-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-height: 220px;
        overflow-y: auto;
        padding-right: 4px;
      }
      .yt-enhancer-settings-debloat-list::-webkit-scrollbar {
        width: 5px;
      }
      .yt-enhancer-settings-debloat-list::-webkit-scrollbar-track {
        background: transparent;
      }
      .yt-enhancer-settings-debloat-list::-webkit-scrollbar-thumb {
        background: var(--yte-popup-accent-border);
        border-radius: 4px;
      }
      .yt-enhancer-settings-debloat-list::-webkit-scrollbar-thumb:hover {
        background: var(--yte-popup-accent);
      }
      .yt-enhancer-settings-debloat-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        font-size: 12px;
        color: var(--yte-popup-text);
        cursor: pointer;
        padding: 3px 0;
      }
      .yt-enhancer-settings-debloat-item:hover {
        color: var(--yte-popup-label);
      }
      .yt-enhancer-settings-debloat-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* === Sub-label for Homepage section === */
      .yt-enhancer-settings-sub-label {
        display: block;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--yte-popup-label);
        margin-top: 10px;
        margin-bottom: 2px;
      }

      /* === Hidden artists section (mirrors hidden playlists) === */
      .yt-enhancer-settings-hidden-artists-section {
        margin-top: 4px;
      }
      .yt-enhancer-settings-hidden-artists-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        background: none;
        border: none;
        color: var(--yte-popup-text);
        cursor: pointer;
        font-size: 12px;
        padding: 4px 0;
        text-align: left;
      }
      .yt-enhancer-settings-hidden-artists-toggle:hover {
        color: var(--yte-popup-label);
      }
      .yt-enhancer-settings-hidden-artists-collapsible {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 4px;
      }
      .yt-enhancer-settings-hidden-artists-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-height: 160px;
        overflow-y: auto;
        padding-right: 4px;
      }
      .yt-enhancer-settings-hidden-artists-list::-webkit-scrollbar {
        width: 5px;
      }
      .yt-enhancer-settings-hidden-artists-list::-webkit-scrollbar-track {
        background: transparent;
      }
      .yt-enhancer-settings-hidden-artists-list::-webkit-scrollbar-thumb {
        background: var(--yte-popup-accent-border);
        border-radius: 4px;
      }
      .yt-enhancer-settings-hidden-artists-list::-webkit-scrollbar-thumb:hover {
        background: var(--yte-popup-accent);
      }
      .yt-enhancer-settings-unhide-all-artists {
        align-self: flex-start;
        font-size: 11px;
        color: var(--yte-popup-accent);
        background: none;
        border: 1px solid var(--yte-popup-accent-border);
        border-radius: 4px;
        padding: 3px 10px;
        cursor: pointer;
        transition: background 0.18s ease, color 0.18s ease;
        margin-top: 4px;
      }
      .yt-enhancer-settings-unhide-all-artists:hover:not(:disabled) {
        background: var(--yte-popup-accent);
        color: #fff;
      }
      .yt-enhancer-settings-unhide-all-artists:disabled {
        opacity: 0.4;
        cursor: default;
      }

      /* === Artist hide button on carousel items === */
      .yt-enhancer-artist-hide-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 10;
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: scale(0.8);
        transition: opacity 0.18s ease, transform 0.18s ease, background 0.18s ease;
        pointer-events: none;
      }
      ytmusic-two-row-item-renderer.yt-enhancer-artist-hide-ready:hover .yt-enhancer-artist-hide-btn {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
      }
      .yt-enhancer-artist-hide-btn:hover {
        background: rgba(220, 30, 60, 0.9);
      }

      /* === Sections debloat collapsible (matches Menu de contexto style) === */
      .yt-enhancer-settings-sections-debloat-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .yt-enhancer-settings-sections-debloat-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: none;
        color: var(--yte-popup-muted);
        font-size: 11px;
        cursor: pointer;
        padding: 2px 0;
        text-align: left;
      }
      .yt-enhancer-settings-sections-debloat-toggle:hover {
        color: var(--yte-popup-text);
      }
      .yt-enhancer-settings-sections-debloat-summary {
        font-size: 11px;
        color: var(--yte-popup-muted);
      }
      .yt-enhancer-settings-sections-debloat-collapsible {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .yt-enhancer-settings-sections-debloat-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-height: 220px;
        overflow-y: auto;
        padding-right: 4px;
      }
      .yt-enhancer-settings-sections-debloat-list::-webkit-scrollbar {
        width: 5px;
      }
      .yt-enhancer-settings-sections-debloat-list::-webkit-scrollbar-track {
        background: transparent;
      }
      .yt-enhancer-settings-sections-debloat-list::-webkit-scrollbar-thumb {
        background: var(--yte-popup-accent-border);
        border-radius: 4px;
      }
      .yt-enhancer-settings-sections-debloat-list::-webkit-scrollbar-thumb:hover {
        background: var(--yte-popup-accent);
      }
      .yt-enhancer-settings-dynamic-label {
        display: block;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.3px;
        text-transform: uppercase;
        color: var(--yte-popup-label);
        margin-top: 8px;
        margin-bottom: 2px;
      }

      /* === Section hide button on carousel headers === */
      .yt-enhancer-section-hide-btn {
        flex-shrink: 0;
        margin-left: 8px;
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.18s ease, transform 0.18s ease, background 0.18s ease;
        pointer-events: none;
        transform: scale(0.8);
      }
      ytmusic-carousel-shelf-basic-header-renderer:hover .yt-enhancer-section-hide-btn {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
      }
      .yt-enhancer-section-hide-btn:hover {
        background: rgba(220, 30, 60, 0.9);
      }

      .yt-enhancer-startup-toast {
        position: fixed;
        right: 18px;
        bottom: calc(env(safe-area-inset-bottom) + 172px);
        z-index: 10002;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 240px;
        max-width: min(340px, calc(100vw - 32px));
        padding: 11px 14px 15px;
        border-radius: 14px;
        background:
          radial-gradient(circle at top right, rgba(255, 255, 255, 0.22), transparent 52%),
          linear-gradient(140deg, #ff234e, #d10e3a);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.42);
        box-shadow:
          0 14px 32px rgba(0, 0, 0, 0.45),
          0 2px 12px rgba(255, 40, 84, 0.42),
          inset 0 1px 0 rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(8px);
        opacity: 0;
        transform: translateY(16px) scale(0.97);
        transition: opacity 0.24s ease, transform 0.24s ease;
        pointer-events: none;
        overflow: hidden;
      }
      .yt-enhancer-startup-toast.is-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      .yt-enhancer-startup-toast__icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        background: linear-gradient(145deg, #ffffff, #ffe8ee);
        color: #c20f36;
        box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.55);
        flex: 0 0 auto;
      }
      .yt-enhancer-startup-toast__content {
        display: inline-flex;
        flex-direction: column;
        gap: 2px;
      }
      .yt-enhancer-startup-toast__content strong {
        font-size: 13px;
        line-height: 1.15;
        letter-spacing: 0.2px;
        color: #fff;
      }
      .yt-enhancer-startup-toast__content span {
        font-size: 12px;
        line-height: 1.2;
        color: rgba(255, 255, 255, 0.9);
      }
      .yt-enhancer-startup-toast__progress {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.96), rgba(255, 238, 244, 0.92));
        transform-origin: left center;
        animation: yt-enhancer-toast-progress 3.2s linear forwards;
      }
      @keyframes yt-enhancer-toast-progress {
        to {
          transform: scaleX(0);
          opacity: 0.4;
        }
      }
    `;
    document.head.appendChild(style);
    console.log("[YT-Enhancer] 🎨 Estilos injetados!");
  }

  // === INICIALIZAÇÃO ===
  checkLibraryRedirect();
  applyPinVisibilityMode(pinVisibilityMode);
  applySettingsTheme(settingsTheme, false, false);
  injectStyles();
  exposeEnhancerApi();
  createSettingsUI();
  showStartupToast();
  console.log(
    `[YT-Enhancer] 📌 Playlists fixadas salvas: ${pinnedPlaylistKeys.length}`,
  );
  console.log(
    `[YT-Enhancer] 🙈 Playlists ocultas salvas: ${hiddenPlaylistKeys.length}`,
  );
  console.log(`[YT-Enhancer] 📌 Modo dos alfinetes: ${pinVisibilityMode}`);

  let runtimeInterval = null;

  function startRuntimeChecks() {
    if (runtimeInterval) return;

    runtimeInterval = setInterval(() => {
      checkLibraryRedirect();
      pinPlaylists();
      processLibraryPlaylists();
      hidePlaylistsOnHome();
      checkModal();
      checkNotifications();
      debloatContextMenu();
      debloatUpgradeButton();
      debloatListenAgainArtists();
      debloatHomepageSections();
    }, 500);
  }

  // Verifica periodicamente até encontrar tudo
  const initInterval = setInterval(() => {
    const volumeReady = setupVolumeSlider();
    const playlistsReady = pinPlaylists();
    processLibraryPlaylists();

    // Verifica modal de salvar, home e notificações
    hidePlaylistsOnHome();
    checkModal();
    checkNotifications();
    debloatContextMenu();
    debloatUpgradeButton();
    debloatListenAgainArtists();
    debloatHomepageSections();

    // Para o interval de inicialização quando tudo estiver pronto
    if (volumeReady && playlistsReady) {
      console.log("[YT-Enhancer] ✅ Tudo pronto!");
      clearInterval(initInterval);
      startRuntimeChecks();
    }
  }, 1000);

  // Timeout de segurança - para após 30 segundos
  setTimeout(() => {
    clearInterval(initInterval);
    // Continua verificando mesmo após timeout
    startRuntimeChecks();
    console.log("[YT-Enhancer] Timeout - parando inicialização");
  }, 30000);
})();
