// ==UserScript==
// @name        X Bookmark
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @connect     catbox.moe
// @version     2.6.67
// @author      Antigravity
// @description Substitui o botão do Grok por um Bookmark interno
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'x_internal_bookmarks';
    const TAGS_KEY = 'x_bookmark_tags';
    const DEAD_REPORT_KEY = 'x_bookmark_dead_links_report';
    const KNOWN_DEAD_FILE_IDS_KEY = 'x_bookmark_known_dead_file_ids';
    const BOOKMARK_ICON_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></g></svg>`;
    const ICON_TAG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>`;
    const ICON_TRASH = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
    const ICON_X = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    const ICON_BROOM = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M12 2v11"/><rect x="8" y="13" width="8" height="3" rx=".5"/><path d="m8 16-3 6h14l-3-6"/></svg>`;
    const ICON_SETTINGS = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`;
    const ICON_LIST = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M3 5h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg>`;
    const ICON_GRID = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`;
    const ICON_EXTERNAL_LINK = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
    const ICON_CALENDAR = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`;
    const ICON_DOWNLOAD = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>`;
    const ICON_MERGE = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="10" height="10" rx="2"/><rect x="11" y="11" width="10" height="10" rx="2"/></svg>`;
    const ICON_PENCIL_SMALL = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
    const ICON_USER = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    const ICON_CLOUD = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
    const ICON_CLOUD_OFF = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="m2 2 20 20"/><path d="M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193"/><path d="M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7 7 0 0 0 8 5.17"/></svg>`;
    const ICON_CATBOX = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 135 169" fill="currentColor" style="vertical-align: middle;"><path d="M48 36.3c-14.2 7.2-27.5 15.2-30.1 18.3-1 1.3-.9 2.8.9 8.7 1.2 4 3.3 10.7 4.6 14.9l2.3 7.8-5.2 2.9c-13.7 7.7-17.1 22.2-7.9 32.9 7.6 9 25 9.7 26.9 1.3.9-4-1.2-8-5.5-10.8-6.9-4.4-8-5.4-8-7.2 0-1.6 2.9-5.1 4.2-5.1.3 0 1.3 1.8 2.3 4 1.2 2.6 3.4 5 6.4 6.9 2.5 1.6 8 5.3 12.1 8.2 8.2 5.7 35.8 19.9 38.7 19.9.9 0 5.5-2.6 10.1-5.7 7.2-5 8.5-5.6 10.2-4.5 1.1.7 2.7 1.2 3.5 1.2 4 0 12.5-7.8 12.5-11.4 0-1.1-.7-2.9-1.5-3.9-1.2-1.7-1-2.4 1.6-6 2.8-4.1 2.9-4.7 3.9-22.7.5-10.2 1-22.6 1-27.7v-9.1l-3.7-2.9c-4.1-3.1-7.6-5.3-19.2-11.6l-7.3-4-5.4 2.2-5.3 2.2-12.5-3C70.7 30.4 64.5 29 63.8 29c-.7.1-7.8 3.3-15.8 7.3m28.3-1.7c4.8.9 8.7 2 8.7 2.4 0 .9-11.5 8.7-16.9 11.4-5 2.6-12.8 8.5-13.4 10.1-.3.7.3 2.5 1.4 3.9 1.9 2.4 1.9 2.5 0 3.1-1.1.3-7-.5-13.2-1.9s-11.5-2.4-11.7-2.1c-.3.2.4.7 1.4 1.1 1 .3 9.1 4 17.9 8.1 8.8 4.2 19.2 9 23 10.8 11.4 5.4 12.3 5.4 21.8-.1 7.9-4.5 15.3-9.9 22.7-16.3 6.5-5.7.7-3.3-10.8 4.4C101 73.6 95.8 77 95.6 77c-.3 0-2.8 1.4-5.6 3.2l-5 3.1-2.8-2.5c-1.5-1.4-3.8-3.2-5.2-4.2-4-2.7-17-15.8-17-17.2 0-2.2 23.5-17.7 35-23 5.3-2.5 5.5-2.5 8.5-.8 4.9 2.9 16.8 11.9 19.5 14.8l2.5 2.8.3 25.3c.3 23.4.2 25.6-1.5 27.9-2.4 3.4-4.5 3.3-4.1-.2.3-2.3-.1-2.7-2.3-3-1.9-.2-4.6 1.1-9.5 4.9-8.1 6.1-10.3 8.6-10.4 11.6 0 1.8.6 2.3 2.5 2.3 1.5 0 2.5.6 2.5 1.4 0 1.9-10.8 8.6-13.8 8.6-6.2 0-41.8-17.9-49.6-24.9-1.6-1.4-3.9-4.9-5.1-7.6-2.7-6-10.7-37.8-10.3-40.8.4-2.9 13-11.7 31.3-22.2 4.7-2.6 8.8-4.3 10-4.1 1.1.3 5.9 1.2 10.8 2.2M28.8 90.2c2.1 2.1 1.3 4.8-2.3 8.2-2.7 2.6-3.5 4.1-3.5 6.9 0 4.2 1.3 5.6 8 9.3 5.7 3.1 7 5.6 4.4 8.5-2.2 2.5-10.5 2.6-15.4.1-4.1-2-7.7-7-8.6-12-1.3-6.6 3.5-15.3 11-19.7 4.8-2.9 4.8-2.9 6.4-1.3m88.5 21c1.8 1.1 3.8 2.8 4.5 3.6 1.4 1.8 1.6 6.2.3 6.2-.5 0-1.1.9-1.4 2s-1.4 2-2.4 2-2.4.5-3 1.1c-1.4 1.4-4.5-.2-8.4-4.4-3.5-3.8-3.2-7.1.9-10.4 3.4-2.9 5.5-2.9 9.5-.1"/></svg>`;
    const ICON_TWITTER = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32" fill="currentColor" style="vertical-align: middle;"><path d="M25.2 1.54h4.91l-10.72 12.25L32 30.46h-9.87l-7.73-10.11-8.85 10.11H0.63l11.47-13.11L0 1.54h10.13l6.99 9.24ZM23.48 27.53h2.72L8.65 4.32H5.73Z"/></svg>`;
    const ICON_CHEVRON_DOWN = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    const ICON_CHEVRON_UP = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`;
    const ICON_EYE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const ICON_EYE_OFF = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
    const ICON_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    const ICON_PALETTE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>`;
    const BLUE_COLOR = 'rgb(29, 155, 240)';
    const GRAY_COLOR = 'rgb(113, 118, 123)';
    const VERSION = GM_info.script.version;
    const SETTINGS_KEY = 'x_bookmark_settings';
    const AUTOTAG_RULES_KEY = 'x_bookmark_autotag_rules';
    const DEFAULT_SETTINGS = {
        showUserLabel: true,
        hideOverlays: false,
        listPreviewSize: 80,
        gridPhotoHeight: 300,
        galleryTitle: 'Meus Bookmarks',
        shortcuts: {
            openGallery: 'ctrl+b',
            closeModal: 'escape',
            toggleView: 'g',
            openSettings: 's'
        },
        catboxUserhash: '',
        catboxAlbumShort: '',
        catboxAutoBackup: true,
        catboxFilterTags: [],
        collapsedSections: [],
        debugMode: false
    };

    // Estado da galeria
    let currentFilter = { tag: null, search: '', sort: 'newest_added' };
    let viewMode = GM_getValue('x_bookmark_view_mode', 'grid');
    let selectedItems = new Set();
    let isListeningForShortcut = false; // Flag para evitar conflito ao definir novos atalhos

    // ==================== STORAGE ====================
    function getBookmarks() {
        return GM_getValue(STORAGE_KEY, []);
    }

    function saveBookmarks(bookmarks) {
        GM_setValue(STORAGE_KEY, bookmarks);
    }

    function getTags() {
        return GM_getValue(TAGS_KEY, []);
    }

    function saveTags(tags) {
        GM_setValue(TAGS_KEY, tags);
    }

    function getSettings() {
        const saved = GM_getValue(SETTINGS_KEY, {});
        // Deep merge para objetos aninhados como shortcuts
        return {
            ...DEFAULT_SETTINGS,
            ...saved,
            shortcuts: { ...DEFAULT_SETTINGS.shortcuts, ...(saved.shortcuts || {}) }
        };
    }

    function saveSetting(key, value) {
        const settings = getSettings();
        settings[key] = value;
        GM_setValue(SETTINGS_KEY, settings);
    }

    function getAutotagRules() {
        return GM_getValue(AUTOTAG_RULES_KEY, []);
    }

    function saveAutotagRules(rules) {
        GM_setValue(AUTOTAG_RULES_KEY, rules);
    }

    // ==================== FEEDBACK VISUAL ====================
    function showSaveIndicator(inputElement) {
        if (!inputElement) return;

        // Adicionar estilos de animação se não existirem
        if (!document.getElementById('x-bookmark-save-indicator-style')) {
            const style = document.createElement('style');
            style.id = 'x-bookmark-save-indicator-style';
            style.textContent = `
                @keyframes saveGlow {
                    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                    50% { box-shadow: 0 0 8px 2px rgba(34, 197, 94, 0.3); }
                    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }
                @keyframes checkFadeIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes checkFadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        // Aplicar glow verde no input
        inputElement.style.animation = 'saveGlow 1s ease';
        setTimeout(() => inputElement.style.animation = '', 1000);

        // Criar checkmark indicator
        const existingCheck = inputElement.parentElement?.querySelector('.save-check-indicator');
        if (existingCheck) existingCheck.remove();

        const checkmark = document.createElement('span');
        checkmark.className = 'save-check-indicator';
        checkmark.innerHTML = ICON_CHECK;
        checkmark.style = `
            position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
            color: #22c55e; display: flex; align-items: center;
            animation: checkFadeIn 0.2s ease;
        `;

        // Garantir que o parent tem position relative
        const parent = inputElement.parentElement;
        if (parent && getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        if (parent) {
            parent.appendChild(checkmark);
            setTimeout(() => {
                checkmark.style.animation = 'checkFadeOut 0.3s ease forwards';
                setTimeout(() => checkmark.remove(), 300);
            }, 1200);
        }
    }

    // ==================== USERHASH VALIDATION ====================
    async function validateCatboxUserhash(hash) {
        const testImageUrl = 'https://i.imgur.com/iXv1SG6.png';

        try {
            // 1. Upload de teste
            const formData = new FormData();
            formData.append('reqtype', 'urlupload');
            formData.append('userhash', hash);
            formData.append('url', testImageUrl);

            console.log('[X-Bookmark] Validating userhash...');

            const uploadResult = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://catbox.moe/user/api.php',
                    data: formData,
                    onload: (r) => resolve(r),
                    onerror: (e) => reject(e)
                });
            });

            console.log('[X-Bookmark] Upload response:', uploadResult.responseText);

            if (!uploadResult.responseText.startsWith('https://')) {
                throw new Error(uploadResult.responseText || 'Invalid userhash');
            }

            // 2. Deletar imagem de teste
            const fileId = uploadResult.responseText.split('/').pop();
            const deleteForm = new FormData();
            deleteForm.append('reqtype', 'deletefiles');
            deleteForm.append('userhash', hash);
            deleteForm.append('files', fileId);

            console.log('[X-Bookmark] Deleting test file:', fileId);

            await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://catbox.moe/user/api.php',
                    data: deleteForm,
                    onload: (r) => {
                        console.log('[X-Bookmark] Delete response:', r.responseText);
                        resolve(r);
                    },
                    onerror: (e) => {
                        console.warn('[X-Bookmark] Delete failed (non-critical):', e);
                        resolve(e); // Ignora erros de delete
                    }
                });
            });

            console.log('[X-Bookmark] Userhash validated successfully');
            return { valid: true };
        } catch (error) {
            console.error('[X-Bookmark] Userhash validation failed:', error.message || error);
            return { valid: false, error: error.message || 'Validation failed' };
        }
    }

    // ==================== CATBOX BACKUP ====================
    // Normaliza URLs do Twitter para máxima qualidade (4096x4096)
    function formatTwitterUrl(src) {
        if (!src) return '';
        // Limpar formatos antigos (pipe fallback)
        if (src.includes('|')) src = src.split('|')[0];

        if (src.includes('twimg.com')) {
            // Forçar resolução máxima 4k
            if (src.includes('name=')) return src.replace(/name=[^&]+/, 'name=4096x4096');
            if (src.includes('?')) return src + '&name=4096x4096';
        }
        return src;
    }

    function extractCatboxFileId(url) {
        if (!url || typeof url !== 'string') return '';
        const clean = url.split('?')[0].split('#')[0];
        const parts = clean.split('/');
        return parts.length ? (parts[parts.length - 1] || '') : '';
    }

    function getKnownDeadFileIds() {
        const raw = GM_getValue(KNOWN_DEAD_FILE_IDS_KEY, []);
        if (!Array.isArray(raw)) return [];
        return raw.filter(Boolean).map(String);
    }

    function saveKnownDeadFileIds(fileIds) {
        const unique = [...new Set((fileIds || []).filter(Boolean).map(String))];
        GM_setValue(KNOWN_DEAD_FILE_IDS_KEY, unique);
    }

    function rememberDeadFileIds(fileIds) {
        const existing = getKnownDeadFileIds();
        saveKnownDeadFileIds([...existing, ...(fileIds || [])]);
    }

    function isKnownDeadCatboxUrl(url) {
        const fileId = extractCatboxFileId(url);
        if (!fileId) return false;
        const known = getKnownDeadFileIds();
        return known.includes(fileId);
    }

    function isLikelyImageBuffer(buffer) {
        if (!buffer || !(buffer instanceof ArrayBuffer) || buffer.byteLength < 12) return false;
        const bytes = new Uint8Array(buffer);

        // JPEG
        if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
        // PNG
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true;
        // GIF
        if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true;
        // WEBP: RIFF....WEBP
        if (
            bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
            bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
        ) {
            return true;
        }

        return false;
    }

    async function probeImageUrl(url, timeoutMs = 7000, attempts = 1) {
        if (!url) return false;

        for (let i = 0; i < attempts; i++) {
            const ok = await new Promise((resolve) => {
                let settled = false;
                const img = new Image();
                const done = (result) => {
                    if (settled) return;
                    settled = true;
                    resolve(result);
                };

                const timer = setTimeout(() => done(false), timeoutMs);
                img.onload = () => {
                    clearTimeout(timer);
                    const w = img.naturalWidth || 0;
                    const h = img.naturalHeight || 0;
                    done(w > 1 && h > 1);
                };
                img.onerror = () => {
                    clearTimeout(timer);
                    done(false);
                };

                const sep = url.includes('?') ? '&' : '?';
                img.src = `${url}${sep}x_bm_probe=${Date.now()}_${i}`;
            });

            if (ok) return true;
        }

        return false;
    }

    async function probeImageUrlByRequest(url, timeoutMs = 12000) {
        if (!url) return { ok: false, reason: 'empty-url' };

        const requestUrl = `${url}${url.includes('?') ? '&' : '?'}x_bm_req=${Date.now()}`;

        const runProbe = (method) => new Promise((resolve) => {
            GM_xmlhttpRequest({
                method,
                url: requestUrl,
                timeout: timeoutMs,
                responseType: method === 'GET' ? 'arraybuffer' : undefined,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                onload: (response) => {
                    const contentType = (getHeaderValue(response.responseHeaders || '', 'content-type') || '').toLowerCase();
                    const okStatus = response.status >= 200 && response.status < 300;
                    const bodySize = response.response && response.response.byteLength ? response.response.byteLength : 0;
                    const typeIsImage = contentType.includes('image/') || contentType.includes('application/octet-stream');
                    const bytesLookImage = method === 'GET' && isLikelyImageBuffer(response.response);
                    const enoughBody = method !== 'GET' || bodySize >= 1024;
                    const okType = method === 'HEAD'
                        ? typeIsImage
                        : (typeIsImage || bytesLookImage) && enoughBody;

                    resolve({
                        ok: okStatus && okType,
                        method,
                        status: response.status,
                        contentType,
                        bodySize,
                        bytesLookImage
                    });
                },
                onerror: () => resolve({ ok: false, method, reason: 'network-error' }),
                ontimeout: () => resolve({ ok: false, method, reason: 'timeout' })
            });
        });

        const headResult = await runProbe('HEAD');
        if (headResult.ok) return headResult;

        const getResult = await runProbe('GET');
        return getResult.ok ? getResult : {
            ok: false,
            method: getResult.method || headResult.method,
            status: getResult.status || headResult.status,
            contentType: getResult.contentType || headResult.contentType,
            reason: getResult.reason || headResult.reason || 'request-failed'
        };
    }

    async function validateFinalCatboxUrl(url) {
        if (!url) return { ok: false, reason: 'empty-url' };

        // Pequeno atraso para evitar falso negativo logo apos upload
        await new Promise(resolve => setTimeout(resolve, 1200));

        const imageProbeOk = await probeImageUrl(url, 12000, 3);
        if (imageProbeOk) {
            return { ok: true, method: 'image' };
        }

        return await probeImageUrlByRequest(url, 15000);
    }

    function getHeaderValue(rawHeaders, headerName) {
        if (!rawHeaders) return '';
        const escaped = headerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`^${escaped}:\\s*(.+)$`, 'im');
        const match = rawHeaders.match(re);
        return match ? match[1].trim() : '';
    }

    function guessImageExtension(mimeType, fallbackUrl) {
        const type = (mimeType || '').toLowerCase();
        if (type.includes('png')) return 'png';
        if (type.includes('webp')) return 'webp';
        if (type.includes('gif')) return 'gif';
        if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';

        const cleanUrl = (fallbackUrl || '').split('?')[0].toLowerCase();
        if (cleanUrl.endsWith('.png')) return 'png';
        if (cleanUrl.endsWith('.webp')) return 'webp';
        if (cleanUrl.endsWith('.gif')) return 'gif';
        return 'jpg';
    }

    function downloadUrlAsBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'arraybuffer',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                onload: (response) => {
                    if (response.status < 200 || response.status >= 300 || !response.response) {
                        reject(new Error(`Falha ao baixar original (${response.status})`));
                        return;
                    }

                    const contentType = getHeaderValue(response.responseHeaders || '', 'content-type') || 'application/octet-stream';
                    resolve(new Blob([response.response], { type: contentType }));
                },
                onerror: () => reject(new Error('Erro de rede ao baixar imagem original'))
            });
        });
    }

    function uploadBlobToCatbox(blob, fileName) {
        return new Promise((resolve, reject) => {
            const settings = getSettings();
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            if (settings.catboxUserhash) formData.append('userhash', settings.catboxUserhash);
            formData.append('fileToUpload', blob, fileName);

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                data: formData,
                onload: (response) => {
                    const body = (response.responseText || '').trim();
                    if (response.status === 200 && body.startsWith('https://')) {
                        resolve(body);
                    } else {
                        reject(new Error(body || 'Upload de arquivo falhou'));
                    }
                },
                onerror: () => reject(new Error('Falha de rede no upload de arquivo'))
            });
        });
    }

    async function reencodeBlobForNewHash(blob, salt = 0) {
        const objectUrl = URL.createObjectURL(blob);

        try {
            const image = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Falha ao decodificar imagem para reencode'));
                img.src = objectUrl;
            });

            const width = image.naturalWidth || image.width;
            const height = image.naturalHeight || image.height;
            if (!width || !height) return null;

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            ctx.drawImage(image, 0, 0, width, height);

            // Muta 1 pixel para forcar hash diferente sem impacto visual perceptivel
            const nonce = (Date.now() + salt) & 0xffff;
            const px = Math.max(0, width - 1);
            const py = Math.max(0, height - 1);
            const imageData = ctx.getImageData(px, py, 1, 1);
            imageData.data[0] = (imageData.data[0] + (nonce & 0x0f) + 1) % 256;
            imageData.data[1] = (imageData.data[1] + ((nonce >> 4) & 0x0f) + 1) % 256;
            ctx.putImageData(imageData, px, py);

            const targetType = (blob.type || '').includes('png') ? 'image/png' : 'image/jpeg';
            const quality = targetType === 'image/jpeg' ? 0.96 : undefined;

            const recodedBlob = await new Promise((resolve) => {
                canvas.toBlob((result) => resolve(result || null), targetType, quality);
            });

            return recodedBlob;
        } finally {
            URL.revokeObjectURL(objectUrl);
        }
    }

    async function forceUploadWithNewHash(originalUrl, deadCatboxUrl) {
        const candidates = [];
        const normalized = formatTwitterUrl(originalUrl);
        if (normalized) candidates.push(normalized);

        if (normalized && normalized.includes('name=4096x4096')) {
            candidates.push(normalized.replace('name=4096x4096', 'name=large'));
        }

        if (originalUrl && !candidates.includes(originalUrl)) {
            candidates.push(originalUrl);
        }

        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];

            try {
                console.log(`[X-Bookmark] Fallback binario ${i + 1}/${candidates.length}:`, candidate);
                const blob = await downloadUrlAsBlob(candidate);
                const ext = guessImageExtension(blob.type, candidate);

                const directName = `xbm_${Date.now()}_${i}_direct.${ext}`;
                const directUrl = await uploadBlobToCatbox(blob, directName);
                console.log('[X-Bookmark] Upload binario direto retornou:', directUrl);

                const directIsKnownDead = directUrl === deadCatboxUrl || isKnownDeadCatboxUrl(directUrl);
                if (directIsKnownDead) {
                    console.warn('[X-Bookmark] Upload binario direto retornou ID morto conhecido. Pulando:', directUrl);
                } else {
                    const directValidation = await validateFinalCatboxUrl(directUrl);
                    if (directValidation.ok) {
                        return directUrl;
                    }
                    console.warn('[X-Bookmark] Upload binario direto nao validou:', directValidation);
                }

                for (let recodeTry = 0; recodeTry < 2; recodeTry++) {
                    const recodedBlob = await reencodeBlobForNewHash(blob, i * 100 + recodeTry);
                    if (!recodedBlob) continue;

                    const recodedExt = guessImageExtension(recodedBlob.type, candidate);
                    const recodedName = `xbm_${Date.now()}_${i}_recoded_${recodeTry + 1}.${recodedExt}`;
                    const recodedUrl = await uploadBlobToCatbox(recodedBlob, recodedName);
                    console.log(`[X-Bookmark] Upload binario recodificado #${recodeTry + 1} retornou:`, recodedUrl);

                    const recodedIsKnownDead = recodedUrl === deadCatboxUrl || isKnownDeadCatboxUrl(recodedUrl);
                    if (recodedIsKnownDead) {
                        console.warn('[X-Bookmark] Upload recodificado ainda retornou ID morto conhecido.');
                        continue;
                    }

                    const recodedValidation = await validateFinalCatboxUrl(recodedUrl);
                    if (recodedValidation.ok) {
                        return recodedUrl;
                    }
                    console.warn(`[X-Bookmark] Upload binario recodificado #${recodeTry + 1} nao validou:`, recodedValidation);
                }
            } catch (error) {
                console.warn('[X-Bookmark] Fallback binario falhou:', error.message || error);
            }
        }

        return null;
    }

    function uploadToCatboxSingle(imageUrl) {
        return new Promise((resolve, reject) => {
            const settings = getSettings();
            const formData = new FormData();
            formData.append('reqtype', 'urlupload');
            formData.append('url', imageUrl);
            if (settings.catboxUserhash) {
                formData.append('userhash', settings.catboxUserhash);
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                data: formData,
                onload: (response) => {
                    if (response.status === 200 && response.responseText.startsWith('https://')) {
                        resolve(response.responseText.trim());
                    } else {
                        reject(new Error(response.responseText || 'Upload failed'));
                    }
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        });
    }

    // Tenta upload com URL primária (4k), fallback para large se falhar
    async function uploadToCatbox(url) {
        // Normalizar URL para 4k
        const url4k = formatTwitterUrl(url);

        try {
            // Tentar URL 4k
            return await uploadToCatboxSingle(url4k);
        } catch (primaryError) {
            console.log('[X-Bookmark] 4k upload failed, trying large:', primaryError.message);
            // Se falhou e é URL do Twitter, tentar versão large
            if (url4k.includes('name=4096x4096')) {
                const urlLarge = url4k.replace('name=4096x4096', 'name=large');
                try {
                    return await uploadToCatboxSingle(urlLarge);
                } catch (fallbackError) {
                    console.error('[X-Bookmark] Large fallback also failed:', fallbackError.message);
                    throw fallbackError;
                }
            }
            throw primaryError;
        }
    }

    function addToCatboxAlbum(fileIds) {
        return new Promise((resolve, reject) => {
            const settings = getSettings();
            if (!settings.catboxUserhash || !settings.catboxAlbumShort) {
                resolve(); // Não faz nada se não tiver userhash ou album
                return;
            }

            const formData = new FormData();
            formData.append('reqtype', 'addtoalbum');
            formData.append('userhash', settings.catboxUserhash);
            formData.append('short', settings.catboxAlbumShort);
            formData.append('files', fileIds.join(' '));

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                data: formData,
                onload: (response) => {
                    resolve(response.responseText);
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        });
    }

    // Deleta arquivos do Catbox (requer userhash)
    async function deleteFromCatbox(fileIds) {
        const settings = getSettings();
        if (!settings.catboxUserhash || !fileIds.length) return null;

        const normalizedIds = fileIds
            .map(id => extractCatboxFileId(id))
            .filter(Boolean);

        if (!normalizedIds.length) return null;

        console.log('[X-Bookmark] Solicitando exclusão de arquivos no Catbox:', normalizedIds.join(', '));

        const formData = new FormData();
        formData.append('reqtype', 'deletefiles');
        formData.append('userhash', settings.catboxUserhash);
        formData.append('files', normalizedIds.join(' '));

        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                data: formData,
                onload: (r) => {
                    const body = (r.responseText || '').trim();
                    console.log(`[X-Bookmark] Resposta de exclusão (${normalizedIds.join(', ')}):`, body);
                    if (body.toLowerCase().includes("file doesn't exist")) {
                        console.warn('[X-Bookmark] Catbox recusou a exclusão. Normalmente isso indica userhash diferente do dono do arquivo.');
                    }
                    resolve(r.responseText);
                },
                onerror: () => resolve(null)
            });
        });
    }

    async function backupBookmarkImages(bookmarkId, options = {}) {
        const { isManual = false, progressInfo = null } = options;
        const bookmarks = getBookmarks();
        const bookmark = bookmarks.find(b => b.id === bookmarkId);
        if (!bookmark || !bookmark.images || bookmark.images.length === 0) return;

        // Se ja existe mescla salva, nao faz backup das imagens cortadas
        if (bookmark.mergedImageUrl && bookmark.mergedImageUrl.startsWith('https://')) {
            if (isManual) {
                showToast('Post com mescla salva: backup das cortadas ignorado');
            }
            return;
        }

        // Verificar filtro de tags (apenas para backup automático)
        const settings = getSettings();
        if (!isManual && settings.catboxFilterTags && settings.catboxFilterTags.length > 0) {
            const hasTags = bookmark.tags?.some(t => settings.catboxFilterTags.includes(t));
            if (!hasTags) {
                console.log('[X-Bookmark] Backup skipped: no matching filter tags');
                return;
            }
        }

        // Se já tem catboxUrls completo, não faz nada
        if (bookmark.catboxUrls && bookmark.catboxUrls.length === bookmark.images.length) {
            const allValid = bookmark.catboxUrls.every(url => url && url.startsWith('https://'));
            if (allValid) return;
        }

        const catboxUrls = bookmark.catboxUrls || [];
        const fileIds = [];

        for (let i = 0; i < bookmark.images.length; i++) {
            if (catboxUrls[i] && catboxUrls[i].startsWith('https://')) continue; // Já tem

            let progressText;
            if (progressInfo) {
                progressInfo.current++;
                progressText = `Fazendo backup ${progressInfo.current}/${progressInfo.total}...`;
            } else {
                progressText = `Fazendo backup ${i + 1}/${bookmark.images.length}...`;
            }
            showToast(progressText);

            try {
                const catboxUrl = await uploadToCatbox(bookmark.images[i]);
                catboxUrls[i] = catboxUrl;

                // Extrair file ID para album (ex: "abc123.jpg" de "https://files.catbox.moe/abc123.jpg")
                const fileId = catboxUrl.split('/').pop();
                if (fileId) fileIds.push(fileId);
            } catch (error) {
                console.error('Catbox upload error:', error);
                catboxUrls[i] = null; // Marca como falha
            }
        }

        // Atualizar bookmark com URLs do Catbox
        const updatedBookmarks = getBookmarks();
        const idx = updatedBookmarks.findIndex(b => b.id === bookmarkId);
        if (idx !== -1) {
            updatedBookmarks[idx].catboxUrls = catboxUrls;
            saveBookmarks(updatedBookmarks);
            console.log('[X-Bookmark] Saved catboxUrls:', catboxUrls);
        }

        // Adicionar ao álbum se configurado
        if (fileIds.length > 0) {
            try {
                await addToCatboxAlbum(fileIds);
            } catch (error) {
                console.error('Catbox album error:', error);
            }
        }

        const successCount = catboxUrls.filter(u => u && u.startsWith('https://')).length;
        showToast(`Backup concluído: ${successCount}/${bookmark.images.length} imagens`);
    }

    function getImageUrl(bookmark, index) {
        // Prioriza Twitter (CDN mais rápido) com 4k, fallback para Catbox
        if (bookmark.images && bookmark.images[index]) {
            const hasCatboxBackup = bookmark.catboxUrls?.[index]?.startsWith('https://');
            // Usar formatTwitterUrl para garantir 4k
            const url4k = formatTwitterUrl(bookmark.images[index]);
            return { url: url4k, fallbackUrl: null, isFallback: false, hasCatboxBackup };
        }
        // Se não tem Twitter, usa Catbox
        if (bookmark.catboxUrls && bookmark.catboxUrls[index] && bookmark.catboxUrls[index].startsWith('https://')) {
            return { url: bookmark.catboxUrls[index], fallbackUrl: null, isFallback: true, hasCatboxBackup: true };
        }
        return { url: null, fallbackUrl: null, isFallback: true, hasCatboxBackup: false };
    }

    function getMergedImageFilename(bookmark) {
        const handle = extractHandle(bookmark.postUrl) || 'unknown';
        const postId = bookmark.postUrl.match(/status\/(\d+)/)?.[1] || bookmark.id;
        return `@${handle}_${postId}_merged.jpg`;
    }

    // ==================== LOCAL DOWNLOAD ====================
    function downloadImage(url, filename) {
        GM_download({
            url: url,
            name: filename,
            saveAs: false,
            onload: () => showToast(`Download concluído: ${filename}`),
            onerror: (err) => {
                console.error('[X-Bookmark] Download failed:', err);
                showToast('Erro no download');
            }
        });
    }

    async function loadImageFromBlob(blob) {
        const objectUrl = URL.createObjectURL(blob);

        try {
            const image = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Falha ao decodificar imagem para mescla'));
                img.src = objectUrl;
            });

            return {
                image,
                revoke: () => URL.revokeObjectURL(objectUrl)
            };
        } catch (error) {
            URL.revokeObjectURL(objectUrl);
            throw error;
        }
    }

    function getMergeCandidates(bookmark, index) {
        const candidates = [];
        const original = bookmark?.images?.[index];

        if (original) {
            const url4k = formatTwitterUrl(original);
            if (url4k) candidates.push(url4k);

            if (url4k && url4k.includes('name=4096x4096')) {
                candidates.push(url4k.replace('name=4096x4096', 'name=large'));
            }

            if (original !== url4k) candidates.push(original);
        }

        const catbox = bookmark?.catboxUrls?.[index];
        if (catbox && catbox.startsWith('https://')) candidates.push(catbox);

        return [...new Set(candidates.filter(Boolean))];
    }

    const mergeInProgressIds = new Set();

    async function mergeBookmarkImages(bookmark) {
        if (!bookmark || !Array.isArray(bookmark.images) || bookmark.images.length < 2) {
            showToast('Este post precisa ter 2+ imagens para mesclar');
            return null;
        }

        if (mergeInProgressIds.has(bookmark.id)) {
            showToast('Mescla já em andamento para este post');
            return null;
        }

        mergeInProgressIds.add(bookmark.id);

        const decoded = [];
        const failedIndexes = [];

        try {
            showToast(`Mesclando ${bookmark.images.length} imagens...`);

            for (let idx = 0; idx < bookmark.images.length; idx++) {
                const candidates = getMergeCandidates(bookmark, idx);
                let loaded = null;

                for (const candidate of candidates) {
                    try {
                        const blob = await downloadUrlAsBlob(candidate);
                        const decodedImage = await loadImageFromBlob(blob);
                        loaded = {
                            image: decodedImage.image,
                            revoke: decodedImage.revoke,
                            source: candidate
                        };
                        break;
                    } catch (error) {
                        console.warn(`[X-Bookmark] Merge: falha ao carregar imagem ${idx + 1} de`, candidate, error.message || error);
                    }
                }

                if (!loaded) {
                    failedIndexes.push(idx + 1);
                } else {
                    decoded.push(loaded);
                }
            }

            if (failedIndexes.length > 0) {
                throw new Error(`Falha ao carregar imagem(ns): ${failedIndexes.join(', ')}`);
            }

            const targetWidth = Math.max(...decoded.map(item => item.image.naturalWidth || item.image.width || 0));
            const drawHeights = decoded.map(item => {
                const w = item.image.naturalWidth || item.image.width || 1;
                const h = item.image.naturalHeight || item.image.height || 1;
                return Math.max(1, Math.round(h * (targetWidth / w)));
            });
            const totalHeight = drawHeights.reduce((sum, h) => sum + h, 0);

            if (targetWidth < 2 || totalHeight < 2) {
                throw new Error('Dimensões inválidas para mescla');
            }

            if (targetWidth > 16384 || totalHeight > 32767) {
                throw new Error('Imagem final muito grande para o navegador');
            }

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = totalHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Não foi possível criar canvas para mescla');

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, targetWidth, totalHeight);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            let y = 0;
            decoded.forEach((item, idx) => {
                ctx.drawImage(item.image, 0, y, targetWidth, drawHeights[idx]);
                y += drawHeights[idx];
            });

            const outBlob = await new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Falha ao exportar imagem mesclada'));
                        return;
                    }
                    resolve(blob);
                }, 'image/jpeg', 0.96);
            });

            const handle = extractHandle(bookmark.postUrl) || 'unknown';
            const postId = bookmark.postUrl.match(/status\/(\d+)/)?.[1] || bookmark.id;
            const filename = `@${handle}_${postId}_merged.jpg`;

            console.log('[X-Bookmark] Merge concluido:', {
                bookmarkId: bookmark.id,
                imagens: bookmark.images.length,
                arquivo: filename,
                fontes: decoded.map(item => item.source)
            });

            return {
                blob: outBlob,
                filename,
                width: targetWidth,
                height: totalHeight
            };
        } catch (error) {
            console.error('[X-Bookmark] Falha ao mesclar imagens:', error);
            showToast(`Erro na mescla: ${error.message || 'falha desconhecida'}`);
            return null;
        } finally {
            decoded.forEach(item => {
                try {
                    item.revoke();
                } catch (_) {
                    // ignore
                }
            });
            mergeInProgressIds.delete(bookmark.id);
        }
    }

    async function saveMergedImageToGallery(bookmark, mergeInfo) {
        if (!bookmark || !mergeInfo || !mergeInfo.blob) return null;

        const handle = extractHandle(bookmark.postUrl) || 'unknown';
        const postId = bookmark.postUrl.match(/status\/(\d+)/)?.[1] || bookmark.id;
        const fileName = `@${handle}_${postId}_merged_${Date.now()}.jpg`;

        const mergedUrl = await uploadBlobToCatbox(mergeInfo.blob, fileName);
        if (!mergedUrl || !mergedUrl.startsWith('https://files.catbox.moe/')) {
            throw new Error('Catbox não retornou URL válida para a imagem mesclada');
        }

        const bookmarks = getBookmarks();
        const bmIdx = bookmarks.findIndex(b => b.id === bookmark.id);
        if (bmIdx !== -1) {
            bookmarks[bmIdx].mergedImageUrl = mergedUrl;
            bookmarks[bmIdx].mergedImageUpdatedAt = new Date().toISOString();
            saveBookmarks(bookmarks);
        }

        bookmark.mergedImageUrl = mergedUrl;
        bookmark.mergedImageUpdatedAt = new Date().toISOString();

        const settings = getSettings();
        const mergedFileId = extractCatboxFileId(mergedUrl);
        if (settings.catboxAlbumShort && mergedFileId) {
            try {
                await addToCatboxAlbum([mergedFileId]);
            } catch (albumError) {
                console.warn('[X-Bookmark] Falha ao adicionar mescla no album:', albumError.message || albumError);
            }
        }

        console.log('[X-Bookmark] Mescla salva na galeria:', {
            bookmarkId: bookmark.id,
            mergedUrl
        });

        return mergedUrl;
    }

    function downloadBookmarkImages(bookmark) {
        if (!bookmark || !bookmark.images || bookmark.images.length === 0) {
            showToast('Nenhuma imagem para baixar');
            return;
        }

        if (bookmark.mergedImageUrl) {
            const mergedFilename = getMergedImageFilename(bookmark);
            downloadImage(bookmark.mergedImageUrl, mergedFilename);
            showToast('Baixando imagem mesclada...');
            selectedItems.clear();
            return;
        }

        const handle = extractHandle(bookmark.postUrl) || 'unknown';
        const postId = bookmark.postUrl.match(/status\/(\d+)/)?.[1] || bookmark.id;

        bookmark.images.forEach((img, idx) => {
            const { url } = getImageUrl(bookmark, idx);
            const ext = url.includes('.png') ? 'png' : 'jpg';
            const filename = `${handle}_${postId}_${idx + 1}.${ext}`;

            // Delay para evitar sobrecarga
            setTimeout(() => downloadImage(url, filename), idx * 300);
        });

        showToast(`Baixando ${bookmark.images.length} imagem(ns)...`);
			selectedItems.clear();
    }

    function downloadSelectedItems() {
        if (selectedItems.size === 0) {
            showToast('Nenhum item selecionado');
            return;
        }

        const bookmarks = getBookmarks();
        let totalFiles = 0;
        let delayOffset = 0;

        selectedItems.forEach(id => {
            const bookmark = bookmarks.find(b => b.id === id);
            if (bookmark && bookmark.images) {
                if (bookmark.mergedImageUrl) {
                    const mergedFilename = getMergedImageFilename(bookmark);
                    setTimeout(() => downloadImage(bookmark.mergedImageUrl, mergedFilename), delayOffset * 300);
                    delayOffset++;
                    totalFiles++;
                    return;
                }

                const handle = extractHandle(bookmark.postUrl) || 'unknown';
                const postId = bookmark.postUrl.match(/status\/(\d+)/)?.[1] || bookmark.id;

                bookmark.images.forEach((img, idx) => {
                    const { url } = getImageUrl(bookmark, idx);
                    const ext = url.includes('.png') ? 'png' : 'jpg';
                    const filename = `@${handle}_${postId}_${idx + 1}.${ext}`;

                    setTimeout(() => downloadImage(url, filename), delayOffset * 300);
                    delayOffset++;
                    totalFiles++;
                });
            }
        });

        showToast(`Baixando ${totalFiles} arquivo(s) de ${selectedItems.size} bookmark(s)...`);
        selectedItems.clear();
        updateGalleryContent();
        updateBulkUI();
    }


    function toggleBookmark(bookmark) {
        let bookmarks = getBookmarks();
        const index = bookmarks.findIndex(b => b.postUrl === bookmark.postUrl);

        if (index !== -1) {
            bookmarks.splice(index, 1);
            saveBookmarks(bookmarks);
            return { action: 'removed', bookmarkId: null };
        } else {
            // Auto-tag por regras (@username → tag)
            const rules = getAutotagRules();
            const handle = '@' + extractHandle(bookmark.postUrl);
            if (!bookmark.tags) bookmark.tags = [];
            rules.forEach(rule => {
                if (rule.username === handle && !bookmark.tags.includes(rule.tag)) {
                    bookmark.tags.push(rule.tag);
                }
            });
            bookmarks.push(bookmark);
            saveBookmarks(bookmarks);
            return { action: 'added', bookmarkId: bookmark.id };
        }
    }

    function isBookmarked(postUrl) {
        return getBookmarks().some(b => b.postUrl === postUrl);
    }

    function extractHandle(postUrl) {
        const match = postUrl.match(/x\.com\/([^\/]+)\//);
        return match ? match[1] : '';
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `${date} ${time}`;
    }

    function showToast(message) {
        const existing = document.getElementById('x-bookmark-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'x-bookmark-toast';
        toast.innerText = message;
        toast.style = `
            position: fixed; bottom: 90px; right: 20px; z-index: 10003;
            background: #1d9bf0; color: white; padding: 12px 20px;
            border-radius: 10px; font-size: 14px; font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        // Add animation keyframes
        if (!document.getElementById('x-bookmark-toast-style')) {
            const style = document.createElement('style');
            style.id = 'x-bookmark-toast-style';
            style.textContent = `
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(50px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideOut {
                    from { opacity: 1; transform: translateX(0); }
                    to { opacity: 0; transform: translateX(50px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // Toast centralizado estilo X (para adicionar/remover bookmarks)
    function showBookmarkToast(message, showButton = false) {
        const existing = document.getElementById('x-bookmark-center-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'x-bookmark-center-toast';
        toast.style = `
            position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%);
            z-index: 10004; display: flex; align-items: center;
            background: #1d9bf0; color: white;
            border-radius: 4px; font-size: 15px; font-weight: 400;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            animation: toastSlideUp 0.25s ease;
            overflow: hidden;
        `;

        const textSpan = document.createElement('span');
        textSpan.innerText = message;
        textSpan.style = 'padding: 12px 16px;';
        toast.appendChild(textSpan);

        if (showButton) {
            const divider = document.createElement('div');
            divider.style = 'width: 1px; height: 100%; background: rgba(255,255,255,0.3); align-self: stretch;';
            toast.appendChild(divider);

            const actionBtn = document.createElement('button');
            actionBtn.innerText = 'Ver galeria';
            actionBtn.style = `
                background: transparent; border: none; color: white;
                padding: 12px 16px; font-size: 15px; font-weight: 600;
                cursor: pointer; transition: background 0.2s;
            `;
            actionBtn.onmouseenter = () => actionBtn.style.background = 'rgba(255,255,255,0.1)';
            actionBtn.onmouseleave = () => actionBtn.style.background = 'transparent';
            actionBtn.onclick = () => {
                toast.remove();
                createGalleryModal();
            };
            toast.appendChild(actionBtn);
        }

        // Adicionar animação
        if (!document.getElementById('x-bookmark-center-toast-style')) {
            const style = document.createElement('style');
            style.id = 'x-bookmark-center-toast-style';
            style.textContent = `
                @keyframes toastSlideUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
                @keyframes toastSlideDown {
                    from { opacity: 1; transform: translateX(-50%) translateY(0); }
                    to { opacity: 0; transform: translateX(-50%) translateY(20px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideDown 0.25s ease';
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    }

    function showConfirmModal(message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10002;
            display: flex; justify-content: center; align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background: #15181c; padding: 25px; border-radius: 16px;
            width: 350px; max-width: 90%; color: white; border: 1px solid #333;
            text-align: center;
        `;

        const icon = document.createElement('div');
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f4212e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
        icon.style = 'margin-bottom: 15px;';
        modal.appendChild(icon);

        const text = document.createElement('p');
        text.innerText = message;
        text.style = 'margin: 0 0 20px 0; font-size: 16px; color: #ccc;';
        modal.appendChild(text);

        const btnRow = document.createElement('div');
        btnRow.style = 'display: flex; gap: 10px;';

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancelar';
        cancelBtn.style = 'flex: 1; background: #333; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px;';
        cancelBtn.onclick = () => overlay.remove();

        const confirmBtn = document.createElement('button');
        confirmBtn.innerText = 'Excluir';
        confirmBtn.style = 'flex: 1; background: #f4212e; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;';
        confirmBtn.onclick = () => {
            overlay.remove();
            onConfirm();
        };

        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(confirmBtn);
        modal.appendChild(btnRow);

        overlay.appendChild(modal);
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        document.body.appendChild(overlay);
    }

    // Modal de escolha assíncrona com múltiplas opções - Interface melhorada
    function showChoiceModal(message, options) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.style = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.85); z-index: 10002;
                display: flex; justify-content: center; align-items: center;
                animation: fadeIn 0.15s ease;
            `;

            const modal = document.createElement('div');
            modal.style = `
                background: linear-gradient(145deg, #15181c 0%, #1a1d21 100%);
                padding: 0; border-radius: 16px;
                width: 380px; max-width: 90%; color: white;
                border: 1px solid #2a2a2a; overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                animation: slideUp 0.2s ease;
            `;

            // Header com ícone
            const header = document.createElement('div');
            header.style = `
                padding: 24px 24px 16px 24px; text-align: center;
                background: linear-gradient(180deg, rgba(234,179,8,0.08) 0%, transparent 100%);
            `;

            const iconCircle = document.createElement('div');
            iconCircle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
            iconCircle.style = `
                width: 56px; height: 56px; border-radius: 14px;
                background: linear-gradient(135deg, #667292 0%, #4a5568 100%);
                display: flex; align-items: center; justify-content: center;
                margin: 0 auto 16px auto;
                box-shadow: 0 4px 12px rgba(102,114,146,0.3);
            `;
            header.appendChild(iconCircle);

            const title = document.createElement('h3');
            title.innerText = 'Backup no Catbox';
            title.style = 'margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: white;';
            header.appendChild(title);

            const text = document.createElement('p');
            text.innerText = message;
            text.style = 'margin: 0; font-size: 14px; color: #888; line-height: 1.4;';
            header.appendChild(text);

            modal.appendChild(header);

            // Botões
            const btnContainer = document.createElement('div');
            btnContainer.style = 'padding: 16px 24px 24px 24px; display: flex; flex-direction: column; gap: 10px;';

            options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.innerText = opt.label;

                // Estilo diferenciado baseado no tipo
                let btnStyle = '';
                if (opt.value === 'delete') {
                    btnStyle = `
                        background: #dc2626; color: white; border: none;
                        font-weight: 600;
                    `;
                } else if (opt.value === 'keep') {
                    btnStyle = `
                        background: #2a2a2a; color: white; border: none;
                        font-weight: 500;
                    `;
                } else {
                    btnStyle = `
                        background: transparent; color: #666; border: 1px solid #333;
                        font-weight: 400;
                    `;
                }

                btn.style = `
                    width: 100%; padding: 12px 16px; border-radius: 10px; cursor: pointer;
                    font-size: 14px; transition: all 0.2s; text-align: center;
                    ${btnStyle}
                `;

                btn.onmouseenter = () => {
                    if (opt.value === 'delete') btn.style.background = '#b91c1c';
                    else if (opt.value === 'keep') btn.style.background = '#3a3a3a';
                    else { btn.style.borderColor = '#555'; btn.style.color = '#999'; }
                };
                btn.onmouseleave = () => {
                    if (opt.value === 'delete') btn.style.background = '#dc2626';
                    else if (opt.value === 'keep') btn.style.background = '#2a2a2a';
                    else { btn.style.borderColor = '#333'; btn.style.color = '#666'; }
                };

                btn.onclick = () => {
                    overlay.remove();
                    resolve(opt.value);
                };
                btnContainer.appendChild(btn);
            });

            modal.appendChild(btnContainer);
            overlay.appendChild(modal);
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                    resolve(null);
                }
            };
            document.body.appendChild(overlay);
        });
    }

    // ==================== TAG MANAGEMENT ======================================
    function createTagModal(onSave) {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10001;
            display: flex; justify-content: center; align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background: #15181c; padding: 25px; border-radius: 16px;
            width: 450px; max-width: 90%; color: white; border: 1px solid #333;
            position: relative;
        `;

        // Botão X no canto superior direito
        const closeX = document.createElement('button');
        closeX.innerHTML = ICON_X;
        closeX.style = 'position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: #888; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center;';
        closeX.onclick = () => { overlay.remove(); if (onSave) onSave(); };
        closeX.onmouseenter = () => closeX.style.color = 'white';
        closeX.onmouseleave = () => closeX.style.color = '#888';
        modal.appendChild(closeX);

        // Título com mais destaque
        const title = document.createElement('h3');
        title.innerText = 'Gerenciar Tags';
        title.style = 'margin: 0 0 20px 0; color: #1d9bf0; font-size: 20px; font-weight: 600;';
        modal.appendChild(title);

        // Input para nova tag (inline com botão)
        const inputRow = document.createElement('div');
        inputRow.style = 'display: flex; gap: 10px; margin-bottom: 20px;';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Nova tag...';
        input.style = 'flex: 1; padding: 12px 15px; border-radius: 12px; border: 1px solid #333; background: #1a1a1a; color: white; font-size: 14px;';
        input.onkeypress = (e) => { if (e.key === 'Enter') addBtn.click(); };

        const addBtn = document.createElement('button');
        addBtn.innerHTML = `<span>Criar</span>`;
        addBtn.style = 'background: #2d2d2d; color: rgba(255,255,255,0.8); border: 1px solid #444; padding: 12px 18px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 14px;';
        addBtn.onclick = () => {
            const newTag = input.value.trim();
            if (newTag && !getTags().includes(newTag)) {
                saveTags([...getTags(), newTag]);
                input.value = '';
                renderTags();
            }
        };

        inputRow.appendChild(input);
        inputRow.appendChild(addBtn);
        modal.appendChild(inputRow);

        // Lista de tags como chips horizontais (com drag and drop para reordenar)
        const tagList = document.createElement('div');
        tagList.style = 'display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; max-height: 300px; overflow-y: auto; padding: 5px 0;';

        let draggedTag = null;
        let draggedElement = null;

        function renderTags() {
            const tags = getTags();
            tagList.innerHTML = '';

            if (tags.length === 0) {
                const emptyMsg = document.createElement('p');
                emptyMsg.innerText = 'Nenhuma tag criada ainda';
                emptyMsg.style = 'color: #666; text-align: center; width: 100%; font-size: 14px; padding: 20px 0;';
                tagList.appendChild(emptyMsg);
                return;
            }

            tags.forEach((tag, index) => {
                const chip = document.createElement('div');
                chip.draggable = true;
                chip.dataset.tag = tag;
                chip.dataset.index = index;
                chip.style = `
                    display: flex; align-items: center; gap: 6px;
                    padding: 8px 14px; background: #2d2d2d; border-radius: 20px;
                    font-size: 13px; transition: all 0.2s; cursor: grab;
                    border: 1px solid transparent;
                `;

                // Ícone grip para arrastar (menor para layout horizontal)
                const gripIcon = document.createElement('span');
                gripIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>`;
                gripIcon.style = 'color: #555; display: flex; align-items: center; flex-shrink: 0;';

                const tagText = document.createElement('span');
                tagText.innerText = tag;
                tagText.style = 'color: #fff; flex: 1;';

                const delBtn = document.createElement('button');
                delBtn.innerHTML = ICON_X.replace('width="16"', 'width="14"').replace('height="16"', 'height="14"');
                delBtn.style = 'background: none; border: none; color: #E57373; cursor: pointer; opacity: 0.5; padding: 2px; display: flex; align-items: center; transition: opacity 0.2s; flex-shrink: 0;';
                delBtn.onmouseenter = () => delBtn.style.opacity = '1';
                delBtn.onmouseleave = () => delBtn.style.opacity = '0.5';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    showConfirmModal(`Excluir tag "${tag}"?`, () => {
                        const updated = getTags().filter(t => t !== tag);
                        saveTags(updated);
                        const bookmarks = getBookmarks().map(b => ({
                            ...b,
                            tags: (b.tags || []).filter(t => t !== tag)
                        }));
                        saveBookmarks(bookmarks);
                        renderTags();
                    });
                };

                // Drag events
                chip.ondragstart = (e) => {
                    draggedTag = tag;
                    draggedElement = chip;
                    chip.style.opacity = '0.5';
                    chip.style.cursor = 'grabbing';
                    e.dataTransfer.effectAllowed = 'move';
                };

                chip.ondragend = () => {
                    chip.style.opacity = '1';
                    chip.style.cursor = 'grab';
                    draggedTag = null;
                    draggedElement = null;
                    tagList.querySelectorAll('[data-tag]').forEach(el => {
                        el.style.borderColor = 'transparent';
                        el.style.background = '#2d2d2d';
                    });
                };

                chip.ondragover = (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (chip !== draggedElement) {
                        chip.style.borderColor = '#1d9bf0';
                        chip.style.background = 'rgba(29,155,240,0.1)';
                    }
                };

                chip.ondragleave = () => {
                    chip.style.borderColor = 'transparent';
                    chip.style.background = '#2d2d2d';
                };

                chip.ondrop = (e) => {
                    e.preventDefault();
                    chip.style.borderColor = 'transparent';
                    chip.style.background = '#2d2d2d';

                    if (draggedTag && draggedTag !== tag) {
                        const currentTags = getTags();
                        const fromIndex = currentTags.indexOf(draggedTag);
                        const toIndex = currentTags.indexOf(tag);

                        if (fromIndex !== -1 && toIndex !== -1) {
                            currentTags.splice(fromIndex, 1);
                            currentTags.splice(toIndex, 0, draggedTag);
                            saveTags(currentTags);
                            renderTags();
                            showToast('Tags reordenadas');
                        }
                    }
                };

                chip.appendChild(gripIcon);
                chip.appendChild(tagText);
                chip.appendChild(delBtn);
                tagList.appendChild(chip);
            });
        }
        renderTags();
        modal.appendChild(tagList);

        // Dica de reordenação
        const reorderHint = document.createElement('div');
        reorderHint.innerHTML = '↕️ Arraste para reordenar';
        reorderHint.style = 'color: #555; font-size: 12px; text-align: center; margin-top: 15px;';
        modal.appendChild(reorderHint);

        overlay.appendChild(modal);
        overlay.onclick = (e) => { if (e.target === overlay) { overlay.remove(); if (onSave) onSave(); } };
        document.body.appendChild(overlay);
    }

    function showTagSelector(bookmark, onUpdate) {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10001;
            display: flex; justify-content: center; align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background: #15181c; padding: 25px; border-radius: 16px;
            width: 350px; max-width: 90%; color: white; border: 1px solid #333;
        `;

        const title = document.createElement('h3');
        title.innerText = 'Selecionar Tags';
        title.style = 'margin: 0 0 20px 0; color: #1d9bf0;';
        modal.appendChild(title);

        const tags = getTags();
        const selectedTags = new Set(bookmark.tags || []);

        if (tags.length === 0) {
            modal.innerHTML += '<p style="color: #888; text-align: center;">Nenhuma tag disponível. Crie uma primeiro!</p>';
        } else {
            const tagContainer = document.createElement('div');
            tagContainer.style = 'display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;';

            tags.forEach(tag => {
                const chip = document.createElement('button');
                chip.innerText = tag;
                chip.style = `
                    padding: 8px 16px; border-radius: 20px; border: 1px solid #333;
                    cursor: pointer; transition: all 0.2s;
                    background: ${selectedTags.has(tag) ? '#1d9bf0' : '#222'};
                    color: ${selectedTags.has(tag) ? 'white' : '#888'};
                `;
                chip.onclick = () => {
                    if (selectedTags.has(tag)) {
                        selectedTags.delete(tag);
                        chip.style.background = '#222';
                        chip.style.color = '#888';
                    } else {
                        selectedTags.add(tag);
                        chip.style.background = '#1d9bf0';
                        chip.style.color = 'white';
                    }
                };
                tagContainer.appendChild(chip);
            });
            modal.appendChild(tagContainer);
        }

        const btnRow = document.createElement('div');
        btnRow.style = 'display: flex; gap: 10px;';

        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'Salvar';
        saveBtn.style = 'flex: 1; background: #1d9bf0; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; text-align: center;';
        saveBtn.onclick = () => {
            const bookmarks = getBookmarks();
            const idx = bookmarks.findIndex(b => b.id === bookmark.id);
            if (idx !== -1) {
                bookmarks[idx].tags = Array.from(selectedTags);
                saveBookmarks(bookmarks);
            }
            overlay.remove();
            if (onUpdate) onUpdate();
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancelar';
        cancelBtn.style = 'flex: 1; background: #333; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; text-align: center;';
        cancelBtn.onclick = () => overlay.remove();

        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(saveBtn);
        modal.appendChild(btnRow);

        overlay.appendChild(modal);
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        document.body.appendChild(overlay);
    }

    // ==================== SETTINGS MODAL ====================
    function SettingsModal(onSave) {
        // Evitar múltiplos modais
        if (document.getElementById('x-bookmark-settings-overlay')) return;

        const settings = getSettings();

        const overlay = document.createElement('div');
        overlay.id = 'x-bookmark-settings-overlay';
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10001;
            display: flex; justify-content: center; align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background: #15181c; padding: 25px; border-radius: 16px;
            width: 500px; max-width: 90%; max-height: 85vh; overflow-y: auto;
            color: white; border: 1px solid #333; position: relative;
        `;

        // Botão X no canto superior direito
        const closeX = document.createElement('button');
        closeX.innerHTML = ICON_X;
        closeX.style = 'position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: #888; cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center;';
        closeX.onclick = () => { overlay.remove(); if (onSave) onSave(); };
        closeX.onmouseenter = () => closeX.style.color = 'white';
        closeX.onmouseleave = () => closeX.style.color = '#888';
        modal.appendChild(closeX);

        // Título
        const title = document.createElement('h3');
        title.innerText = 'Configurações';
        title.style = 'margin: 0 0 25px 0; color: #1d9bf0; font-size: 20px; font-weight: 600;';
        modal.appendChild(title);

        // Container de settings
        const settingsContainer = document.createElement('div');
        settingsContainer.style = 'display: flex; flex-direction: column; gap: 12px;';

        // Helper para criar seção colapsável
        function createCollapsibleSection(sectionId, icon, titleText, contentBuilder) {
            const section = document.createElement('div');
            section.style = 'background: #1a1a1a; border: 1px solid #333; border-radius: 12px; overflow: hidden;';

            const collapsed = settings.collapsedSections || [];
            // Por padrão, todas as seções vêm fechadas (exceto se explicitamente abertas)
            const isCollapsed = !collapsed.includes(sectionId);

            // Header
            const header = document.createElement('div');
            header.style = 'display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer; transition: background 0.2s;';
            header.onmouseenter = () => header.style.background = '#222';
            header.onmouseleave = () => header.style.background = 'transparent';

            const headerLeft = document.createElement('div');
            headerLeft.style = 'display: flex; align-items: center; gap: 10px; color: white; font-size: 14px; font-weight: 500;';
            headerLeft.innerHTML = `${icon} <span>${titleText}</span>`;

            const chevron = document.createElement('span');
            chevron.innerHTML = isCollapsed ? ICON_CHEVRON_DOWN : ICON_CHEVRON_UP;
            chevron.style = 'color: #666; display: flex;';

            header.appendChild(headerLeft);
            header.appendChild(chevron);

            // Content
            const content = document.createElement('div');
            content.style = `padding: ${isCollapsed ? '0 16px' : '16px'}; display: flex; flex-direction: column; gap: 15px; border-top: ${isCollapsed ? 'none' : '1px solid #333'}; overflow: hidden; max-height: ${isCollapsed ? '0' : '2000px'}; opacity: ${isCollapsed ? '0' : '1'}; transition: all 0.3s ease;`;

            contentBuilder(content);

            // Toggle
            header.onclick = () => {
                const cols = getSettings().collapsedSections || [];
                const idx = cols.indexOf(sectionId);
                if (idx > -1) {
                    // Está na lista de abertas -> fechar (remover da lista)
                    cols.splice(idx, 1);
                    content.style.padding = '0 16px';
                    content.style.maxHeight = '0';
                    content.style.opacity = '0';
                    content.style.borderTop = 'none';
                    chevron.innerHTML = ICON_CHEVRON_DOWN;
                } else {
                    // Não está na lista -> abrir (adicionar à lista)
                    cols.push(sectionId);
                    content.style.padding = '16px';
                    content.style.maxHeight = '2000px';
                    content.style.opacity = '1';
                    content.style.borderTop = '1px solid #333';
                    chevron.innerHTML = ICON_CHEVRON_UP;
                }
                saveSetting('collapsedSections', cols);
            };

            section.appendChild(header);
            section.appendChild(content);
            return section;
        }

        // Helper para criar toggle row
        function createToggleRow(labelText, description, key) {
            const row = document.createElement('div');
            row.style = 'display: flex; justify-content: space-between; align-items: center;';

            const info = document.createElement('div');
            info.innerHTML = `<span style="color: white; font-size: 13px;">${labelText}</span><br><span style="color: #666; font-size: 11px;">${description}</span>`;

            const toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.checked = settings[key];
            toggle.style = 'width: 18px; height: 18px; cursor: pointer; accent-color: #1d9bf0;';
            toggle.onchange = () => saveSetting(key, toggle.checked);

            row.appendChild(info);
            row.appendChild(toggle);
            return row;
        }

        // === SEÇÃO 1: APARÊNCIA ===
        settingsContainer.appendChild(createCollapsibleSection('appearance', ICON_PALETTE, 'Aparência', (content) => {
            // Título da Galeria
            const titleRow = document.createElement('div');
            titleRow.style = 'display: flex; flex-direction: column; gap: 6px;';
            const titleLabel = document.createElement('label');
            titleLabel.innerText = 'Título da Galeria';
            titleLabel.style = 'color: #888; font-size: 12px;';

            const titleInputWrapper = document.createElement('div');
            titleInputWrapper.style = 'position: relative;';

            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = settings.galleryTitle;
            titleInput.placeholder = 'Meus Bookmarks';
            titleInput.style = 'width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid #333; background: #15181c; color: white; font-size: 13px; box-sizing: border-box; transition: all 0.3s ease;';
            titleInput.oninput = () => {
                saveSetting('galleryTitle', titleInput.value || 'Meus Bookmarks');
                showSaveIndicator(titleInput);
            };

            titleInputWrapper.appendChild(titleInput);
            titleRow.appendChild(titleLabel);
            titleRow.appendChild(titleInputWrapper);
            content.appendChild(titleRow);

            // Toggle Mostrar usuário
            content.appendChild(createToggleRow('Mostrar usuário', 'Exibe foto e nome sobre as imagens', 'showUserLabel'));

            // Toggle Esconder overlays
            content.appendChild(createToggleRow('Esconder overlays', 'Oculta perfil, nome, tags e badge de backup', 'hideOverlays'));

            // Sliders serão adicionados após a função createSliderRow
        }));

        // Helper para criar slider + input numérico (layout refinado)
        function createSliderRow(label, description, key, min, max, unit) {
            const row = document.createElement('div');
            row.style = 'display: flex; flex-direction: column; gap: 8px;';

            const defaultVal = DEFAULT_SETTINGS[key];
            const currentVal = settings[key];

            // Header: título + input numérico inline + botão reset condicional
            const headerRow = document.createElement('div');
            headerRow.style = 'display: flex; align-items: center; justify-content: space-between; gap: 10px;';

            const titleSection = document.createElement('div');
            titleSection.style = 'display: flex; align-items: baseline; gap: 8px; flex: 1;';

            const labelText = document.createElement('span');
            labelText.innerText = label;
            labelText.style = 'color: white; font-size: 14px;';

            // Input numérico integrado (seamless)
            const numInput = document.createElement('input');
            numInput.type = 'number';
            numInput.min = min;
            numInput.max = max;
            numInput.value = currentVal;
            numInput.style = `
                width: 50px; padding: 2px 4px; border-radius: 4px;
                border: none; background: transparent; color: #1d9bf0;
                text-align: center; font-size: 14px; font-weight: 500;
                outline: none; transition: background 0.2s;
                -moz-appearance: textfield;
            `;
            numInput.onmouseenter = () => numInput.style.background = 'rgba(29,155,240,0.1)';
            numInput.onmouseleave = () => { if (document.activeElement !== numInput) numInput.style.background = 'transparent'; };
            numInput.onfocus = () => numInput.style.background = 'rgba(29,155,240,0.15)';
            numInput.onblur = () => numInput.style.background = 'transparent';
            numInput.onkeydown = (e) => {
                // Permitir: teclas de controle e navegação
                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
                if (allowedKeys.includes(e.key) || (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()))) {
                    return;
                }
                // Bloquear se não for número
                if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                }
            };

            const unitLabel = document.createElement('span');
            unitLabel.innerText = unit;
            unitLabel.style = 'color: #666; font-size: 12px;';

            titleSection.appendChild(labelText);
            titleSection.appendChild(numInput);
            titleSection.appendChild(unitLabel);

            // Botão restaurar padrão (condicional - só mostra se valor != padrão)
            const resetBtn = document.createElement('button');
            resetBtn.innerText = '↺';
            resetBtn.title = 'Restaurar padrão';
            resetBtn.style = `
                background: transparent; border: 1px solid #444; color: #888;
                padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 12px;
                transition: all 0.2s; opacity: ${currentVal !== defaultVal ? '1' : '0'};
                pointer-events: ${currentVal !== defaultVal ? 'auto' : 'none'};
            `;
            resetBtn.onmouseenter = () => { resetBtn.style.borderColor = '#1d9bf0'; resetBtn.style.color = '#1d9bf0'; };
            resetBtn.onmouseleave = () => { resetBtn.style.borderColor = '#444'; resetBtn.style.color = '#888'; };

            headerRow.appendChild(titleSection);
            headerRow.appendChild(resetBtn);

            // Descrição
            const descEl = document.createElement('span');
            descEl.innerText = description;
            descEl.style = 'color: #666; font-size: 12px; margin-top: -4px;';

            // Slider container (visual unificado)
            const sliderContainer = document.createElement('div');
            sliderContainer.style = 'display: flex; align-items: center; gap: 10px; background: #1a1a1a; padding: 8px 12px; border-radius: 8px;';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = min;
            slider.max = max;
            slider.value = currentVal;
            slider.style = 'flex: 1; cursor: pointer; accent-color: #1d9bf0;';

            // Função para atualizar visibilidade do botão reset
            const updateResetVisibility = () => {
                const isModified = parseInt(numInput.value) !== defaultVal;
                resetBtn.style.opacity = isModified ? '1' : '0';
                resetBtn.style.pointerEvents = isModified ? 'auto' : 'none';
            };

            resetBtn.onclick = () => {
                slider.value = defaultVal;
                numInput.value = defaultVal;
                saveSetting(key, defaultVal);
                updateResetVisibility();
            };

            slider.oninput = () => {
                numInput.value = slider.value;
                saveSetting(key, parseInt(slider.value));
                updateResetVisibility();
            };

            numInput.oninput = () => {
                let val = parseInt(numInput.value) || min;
                val = Math.max(min, Math.min(max, val));
                slider.value = val;
                saveSetting(key, val);
                updateResetVisibility();
            };

            sliderContainer.appendChild(slider);

            row.appendChild(headerRow);
            row.appendChild(descEl);
            row.appendChild(sliderContainer);
            return row;
        }

        // === SEÇÃO 2: ATALHOS ===
        settingsContainer.appendChild(createCollapsibleSection('shortcuts', ICON_SETTINGS, 'Atalhos de Teclado', (content) => {
            const shortcuts = settings.shortcuts || DEFAULT_SETTINGS.shortcuts;
            const shortcutLabels = {
                openGallery: 'Abrir galeria',
                closeModal: 'Fechar modal',
                toggleView: 'Alternar Grid/Lista',
                openSettings: 'Abrir configurações'
            };

            function createShortcutRow(key, label) {
                const row = document.createElement('div');
                row.style = 'display: flex; justify-content: space-between; align-items: center;';

                const labelEl = document.createElement('span');
                labelEl.innerText = label;
                labelEl.style = 'color: #888; font-size: 13px;';

                const keyBtn = document.createElement('button');
                keyBtn.innerText = shortcuts[key]?.toUpperCase() || '—';
                keyBtn.style = 'background: #2d2d2d; border: 1px solid #444; color: #1d9bf0; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: bold; min-width: 80px;';

                let listening = false;
                keyBtn.onclick = () => {
                    if (listening) return;
                    listening = true;
                    isListeningForShortcut = true;
                    keyBtn.innerText = '...';
                    keyBtn.style.borderColor = '#1d9bf0';

                    const handler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();

                        const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta'];
                        if (modifierKeys.includes(e.key)) return;

                        let combo = [];
                        if (e.ctrlKey) combo.push('ctrl');
                        if (e.shiftKey) combo.push('shift');
                        if (e.altKey) combo.push('alt');
                        combo.push(e.key.toLowerCase());

                        const newShortcut = combo.join('+');
                        shortcuts[key] = newShortcut;
                        saveSetting('shortcuts', shortcuts);

                        keyBtn.innerText = newShortcut.toUpperCase();
                        keyBtn.style.borderColor = '#444';
                        listening = false;
                        isListeningForShortcut = false;
                        document.removeEventListener('keydown', handler, true);
                    };
                    document.addEventListener('keydown', handler, true);
                };

                row.appendChild(labelEl);
                row.appendChild(keyBtn);
                return row;
            }

            Object.keys(shortcutLabels).forEach(key => {
                content.appendChild(createShortcutRow(key, shortcutLabels[key]));
            });

            const resetBtn = document.createElement('button');
            resetBtn.innerText = 'Restaurar padrões';
            resetBtn.style = 'background: transparent; border: 1px solid #444; color: #888; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 12px; margin-top: 5px;';
            resetBtn.onmouseenter = () => { resetBtn.style.borderColor = '#1d9bf0'; resetBtn.style.color = '#1d9bf0'; };
            resetBtn.onmouseleave = () => { resetBtn.style.borderColor = '#444'; resetBtn.style.color = '#888'; };
            resetBtn.onclick = () => {
                saveSetting('shortcuts', DEFAULT_SETTINGS.shortcuts);
                overlay.remove();
                SettingsModal(onSave);
            };
            content.appendChild(resetBtn);
        }));

        // Sliders para Aparência (adicionados após seção Aparência existente)
        const appearanceSection = settingsContainer.querySelector('div');
        if (appearanceSection) {
            const appearanceContent = appearanceSection.querySelector('div:last-child');
            if (appearanceContent && appearanceContent.style.display === 'flex') {
                appearanceContent.appendChild(createSliderRow('Tamanho do preview (Lista)', 'Tamanho da miniatura no modo lista', 'listPreviewSize', 40, 150, 'px'));
                appearanceContent.appendChild(createSliderRow('Altura das fotos (Grid)', 'Altura das imagens no modo grid', 'gridPhotoHeight', 150, 500, 'px'));
            }
        }

        // === SEÇÃO 3: BACKUP NA NUVEM ===
        settingsContainer.appendChild(createCollapsibleSection('backup', ICON_CLOUD, 'Backup na Nuvem (Catbox)', (content) => {
            // Indicador de status de conexão
            const statusIndicator = document.createElement('div');
            statusIndicator.style = 'display: flex; align-items: center; gap: 8px; margin-bottom: 10px;';

            const statusDot = document.createElement('span');
            const hasUserhash = !!settings.catboxUserhash;
            statusDot.style = `
                width: 8px; height: 8px; border-radius: 50%;
                background: ${hasUserhash ? '#22c55e' : '#ef4444'};
                transition: background 0.3s ease;
            `;

            const statusText = document.createElement('span');
            statusText.innerText = hasUserhash ? 'Configurado' : 'Hash não configurado';
            statusText.style = `color: ${hasUserhash ? '#22c55e' : '#ef4444'}; font-size: 11px; transition: color 0.3s ease;`;

            statusIndicator.appendChild(statusDot);
            statusIndicator.appendChild(statusText);
            content.appendChild(statusIndicator);

            const desc = document.createElement('p');
            desc.innerText = 'Faça backup das imagens no Catbox para evitar perda quando deletadas do Twitter.';
            desc.style = 'color: #666; font-size: 11px; margin: 0;';
            content.appendChild(desc);

            // Toggle backup automático
            const autoRow = document.createElement('div');
            autoRow.style = 'display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #15181c; border-radius: 8px; margin-top: 10px;';
            autoRow.innerHTML = '<div><span style="color: white; font-size: 13px;">Backup automático</span><br><span style="color: #666; font-size: 11px;">Envia imagens ao salvar bookmark</span></div>';

            const autoToggle = document.createElement('button');
            let isOn = settings.catboxAutoBackup;
            autoToggle.innerHTML = isOn ? 'On' : 'Off';
            autoToggle.style = `padding: 8px 18px; border-radius: 20px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; background: ${isOn ? '#1d9bf0' : '#333'}; color: ${isOn ? 'white' : '#888'}; transition: all 0.2s;`;

            // Userhash input com toggle de visibilidade
            const hashRow = document.createElement('div');
            hashRow.style = 'margin-top: 10px;';
            hashRow.innerHTML = '<label style="display: block; color: #888; font-size: 11px; margin-bottom: 4px;">Userhash <span style="color: #555;">(opcional)</span></label>';

            const hashInputWrapper = document.createElement('div');
            hashInputWrapper.style = 'position: relative; display: flex; align-items: center;';

            const hashInput = document.createElement('input');
            hashInput.type = 'password';
            hashInput.placeholder = 'Deixe vazio para upload anônimo';
            hashInput.value = settings.catboxUserhash || '';
            hashInput.disabled = !isOn;
            hashInput.style = `
                width: 100%; padding: 10px 40px 10px 12px; border-radius: 8px;
                border: 1px solid #333; background: #15181c; color: white;
                font-size: 12px; box-sizing: border-box; font-family: monospace;
                opacity: ${isOn ? '1' : '0.5'}; transition: all 0.3s ease;
            `;

            // Toggle de visibilidade (eye icon)
            const toggleVisibility = document.createElement('button');
            toggleVisibility.innerHTML = ICON_EYE;
            toggleVisibility.title = 'Mostrar/ocultar userhash';
            toggleVisibility.style = `
                position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
                background: transparent; border: none; color: #666; cursor: pointer;
                padding: 4px; display: flex; align-items: center; justify-content: center;
                transition: color 0.2s;
            `;
            toggleVisibility.onmouseenter = () => toggleVisibility.style.color = '#1d9bf0';
            toggleVisibility.onmouseleave = () => toggleVisibility.style.color = '#666';
            toggleVisibility.onclick = () => {
                const isPassword = hashInput.type === 'password';
                hashInput.type = isPassword ? 'text' : 'password';
                toggleVisibility.innerHTML = isPassword ? ICON_EYE_OFF : ICON_EYE;
            };

            hashInputWrapper.appendChild(hashInput);
            hashInputWrapper.appendChild(toggleVisibility);

            // Container de erro para validação
            const errorContainer = document.createElement('div');
            errorContainer.style = 'color: #ef4444; font-size: 11px; margin-top: 4px; display: none;';

            // Variáveis de debounce
            let validationTimeout = null;
            let isValidating = false;

            // Função para atualizar status visual
            const updateStatus = (state, message) => {
                const colors = {
                    valid: '#22c55e',
                    invalid: '#ef4444',
                    validating: '#eab308',
                    empty: '#ef4444'
                };
                statusDot.style.background = colors[state] || colors.empty;
                statusText.style.color = colors[state] || colors.empty;
                statusText.innerText = message;

                // Atualizar borda do input baseado no estado
                if (state === 'valid') {
                    hashInput.style.borderColor = '#22c55e';
                } else if (state === 'invalid') {
                    hashInput.style.borderColor = '#ef4444';
                } else if (state === 'validating') {
                    hashInput.style.borderColor = '#eab308';
                } else {
                    hashInput.style.borderColor = '#333';
                }
            };

            // Album input
            const albumRow = document.createElement('div');
            albumRow.style = 'margin-top: 8px;';
            albumRow.innerHTML = '<label style="display: block; color: #888; font-size: 11px; margin-bottom: 4px;">Album Short <span style="color: #555;">(opcional)</span></label>';
            const albumInput = document.createElement('input');
            albumInput.type = 'text';
            albumInput.placeholder = 'ID do álbum (ex: pd412w)';
            albumInput.value = settings.catboxAlbumShort || '';
            albumInput.disabled = !hashInput.value || !isOn;
            albumInput.style = `width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #333; background: #15181c; color: white; font-size: 12px; box-sizing: border-box; opacity: ${(hashInput.value && isOn) ? '1' : '0.5'};`;

            autoToggle.onclick = () => {
                isOn = !isOn;
                saveSetting('catboxAutoBackup', isOn);
                autoToggle.innerHTML = isOn ? 'On' : 'Off';
                autoToggle.style.background = isOn ? '#1d9bf0' : '#333';
                autoToggle.style.color = isOn ? 'white' : '#888';
                hashInput.disabled = !isOn;
                hashInput.style.opacity = isOn ? '1' : '0.5';
                albumInput.disabled = !isOn || !hashInput.value;
                albumInput.style.opacity = (isOn && hashInput.value) ? '1' : '0.5';
            };

            // Handler de input com debounce e validação
            hashInput.oninput = () => {
                const value = hashInput.value.trim();

                // Limpar timeout anterior
                if (validationTimeout) {
                    clearTimeout(validationTimeout);
                }

                // Esconder erro anterior
                errorContainer.style.display = 'none';

                // Atualizar estado do album input
                albumInput.disabled = !value || !isOn;
                albumInput.style.opacity = (value && isOn) ? '1' : '0.5';

                if (!value) {
                    updateStatus('empty', 'Hash não configurado');
                    hashInput.style.borderColor = '#333';
                    return;
                }

                // Debounce de 1.5s antes de validar
                updateStatus('validating', 'Aguardando...');

                validationTimeout = setTimeout(async () => {
                    if (isValidating) return;
                    isValidating = true;

                    updateStatus('validating', 'Validando...');

                    const result = await validateCatboxUserhash(value);

                    isValidating = false;

                    if (result.valid) {
                        updateStatus('valid', 'Userhash válido ✓');
                        saveSetting('catboxUserhash', value);
                        showSaveIndicator(hashInput);
                        errorContainer.style.display = 'none';
                    } else {
                        updateStatus('invalid', 'Userhash inválido');
                        errorContainer.innerText = `❌ ${result.error || 'Falha na validação. Verifique se o userhash está correto.'}`;
                        errorContainer.style.display = 'block';
                        // Não salva se a validação falhou
                    }
                }, 1500);
            };

            albumInput.onchange = () => {
                saveSetting('catboxAlbumShort', albumInput.value.trim());
                showSaveIndicator(albumInput);
            };

            // Tooltip sobre userhash
            const hint = document.createElement('div');
            hint.innerHTML = '💡 <span style="color: #555;">Sem userhash: upload anônimo. Com userhash: gerencie/delete uploads na sua conta Catbox.</span>';
            hint.style = 'font-size: 11px; color: #666; margin-top: 8px;';

            // Selective Backup - Filtro de tags
            const filterRow = document.createElement('div');
            filterRow.style = 'margin-top: 12px; padding-top: 12px; border-top: 1px solid #2a2a2a;';
            filterRow.innerHTML = '<label style="display: block; color: #888; font-size: 11px; margin-bottom: 4px;">Filtro de Tags <span style="color: #555;">(opcional)</span></label>';

            const filterHint = document.createElement('div');
            filterHint.innerText = 'Se preenchido, só faz backup de bookmarks com estas tags:';
            filterHint.style = 'color: #555; font-size: 10px; margin-bottom: 8px;';
            filterRow.appendChild(filterHint);

            const filterTagsContainer = document.createElement('div');
            filterTagsContainer.style = 'display: flex; flex-wrap: wrap; gap: 6px;';

            const allTags = getTags();
            const selectedFilterTags = new Set(settings.catboxFilterTags || []);

            if (allTags.length === 0) {
                const noTagsMsg = document.createElement('span');
                noTagsMsg.innerText = 'Nenhuma tag criada ainda';
                noTagsMsg.style = 'color: #555; font-size: 11px; font-style: italic;';
                filterTagsContainer.appendChild(noTagsMsg);
            } else {
                allTags.forEach(tag => {
                    const tagChip = document.createElement('button');
                    const isSelected = selectedFilterTags.has(tag);
                    tagChip.innerText = tag;
                    tagChip.style = `
                        padding: 4px 10px; border-radius: 12px; border: none;
                        cursor: pointer; font-size: 11px; transition: all 0.2s;
                        background: ${isSelected ? '#22c55e' : '#2d2d2d'};
                        color: ${isSelected ? 'white' : '#888'};
                    `;
                    tagChip.onclick = () => {
                        if (selectedFilterTags.has(tag)) {
                            selectedFilterTags.delete(tag);
                            tagChip.style.background = '#2d2d2d';
                            tagChip.style.color = '#888';
                        } else {
                            selectedFilterTags.add(tag);
                            tagChip.style.background = '#22c55e';
                            tagChip.style.color = 'white';
                        }
                        saveSetting('catboxFilterTags', Array.from(selectedFilterTags));
                    };
                    filterTagsContainer.appendChild(tagChip);
                });
            }

            filterRow.appendChild(filterTagsContainer);

            autoRow.appendChild(autoToggle);
            hashRow.appendChild(hashInputWrapper);
            hashRow.appendChild(errorContainer);
            albumRow.appendChild(albumInput);
            content.appendChild(autoRow);
            content.appendChild(hashRow);
            content.appendChild(albumRow);
            content.appendChild(hint);
            content.appendChild(filterRow);
        }));

        // === SEÇÃO 4: AUTOMAÇÃO ===
        settingsContainer.appendChild(createCollapsibleSection('automation', ICON_USER, 'Automação', (content) => {
            const autoTagBtn = document.createElement('button');
            autoTagBtn.innerHTML = `${ICON_USER} <span>Gerenciar Auto-tags por Pessoa</span>`;
            autoTagBtn.style = 'width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid #333; background: #15181c; color: rgba(255,255,255,0.8); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; transition: all 0.2s;';
            autoTagBtn.onmouseenter = () => { autoTagBtn.style.borderColor = '#1d9bf0'; autoTagBtn.style.color = '#1d9bf0'; };
            autoTagBtn.onmouseleave = () => { autoTagBtn.style.borderColor = '#333'; autoTagBtn.style.color = 'rgba(255,255,255,0.8)'; };
            autoTagBtn.onclick = () => AutotagModal();
            content.appendChild(autoTagBtn);
        }));

        // === SEÇÃO 5: DESENVOLVEDOR ===
        const ICON_CODE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
        settingsContainer.appendChild(createCollapsibleSection('developer', ICON_CODE, 'Desenvolvedor', (content) => {
            content.appendChild(createToggleRow('Modo Debug', 'Mostra logs detalhados no console do navegador', 'debugMode'));

            // Botão para verificar links Catbox mortos
            const checkCatboxRow = document.createElement('div');
            checkCatboxRow.style = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #2a2a2a;';

            const checkCatboxLabel = document.createElement('div');
            checkCatboxLabel.innerHTML = `
                <div style="font-weight: 500; margin-bottom: 2px;">Verificar Links Catbox</div>
                <div style="font-size: 12px; color: #71767b;">Verifica quais backups do Catbox estão mortos/inacessíveis</div>
            `;

            const checkCatboxBtn = document.createElement('button');
            checkCatboxBtn.innerText = 'Verificar';
            checkCatboxBtn.style = `
                padding: 8px 16px; border-radius: 20px;
                background: #667292; border: none;
                color: white; cursor: pointer; font-size: 13px;
                transition: all 0.2s ease;
            `;
            checkCatboxBtn.onmouseenter = () => checkCatboxBtn.style.background = '#778399';
            checkCatboxBtn.onmouseleave = () => checkCatboxBtn.style.background = '#667292';
            checkCatboxBtn.onclick = () => {
                overlay.remove();
                checkDeadCatboxLinks();
            };

            checkCatboxRow.appendChild(checkCatboxLabel);
            checkCatboxRow.appendChild(checkCatboxBtn);
            content.appendChild(checkCatboxRow);

            // Botão Ver Último Relatório
            const lastReport = GM_getValue(DEAD_REPORT_KEY, null);
            if (lastReport) {
                const viewReportRow = document.createElement('div');
                viewReportRow.style = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 0;';

                const viewReportLabel = document.createElement('div');
                viewReportLabel.innerHTML = `
                    <div style="font-weight: 500; margin-bottom: 2px;">Último Relatório</div>
                    <div style="font-size: 11px; color: #71767b;">Gerado em: ${new Date(lastReport.timestamp).toLocaleString()}</div>
                `;

                const viewReportBtn = document.createElement('button');
                viewReportBtn.innerText = 'Ver Relatório';
                viewReportBtn.style = `
                    padding: 6px 12px; border-radius: 20px;
                    background: transparent; border: 1px solid #333;
                    color: #e7e9ea; cursor: pointer; font-size: 12px;
                    transition: all 0.2s ease;
                `;
                viewReportBtn.onmouseenter = () => viewReportBtn.style.background = '#ffffff11';
                viewReportBtn.onmouseleave = () => viewReportBtn.style.background = 'transparent';
                viewReportBtn.onclick = () => {
                    const freshReport = GM_getValue(DEAD_REPORT_KEY, null);
                    if (freshReport) {
                        const safeDeadLinks = Array.isArray(freshReport.deadLinks) ? freshReport.deadLinks : [];
                        const safeTotalChecked = Number.isFinite(freshReport.totalChecked) ? freshReport.totalChecked : safeDeadLinks.length;
                        overlay.remove();
                        showDeadLinksReport(safeDeadLinks, safeTotalChecked);
                    }
                };

                viewReportRow.appendChild(viewReportLabel);
                viewReportRow.appendChild(viewReportBtn);
                content.appendChild(viewReportRow);
            }
        }));

        modal.appendChild(settingsContainer);

        overlay.appendChild(modal);
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
                if (onSave) onSave();
            }
        };
        document.body.appendChild(overlay);
    }

    // ==================== AUTOTAG MODAL ====================
    function AutotagModal() {
        // Evitar múltiplos modais
        if (document.getElementById('x-bookmark-autotag-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'x-bookmark-autotag-overlay';
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 10002;
            display: flex; justify-content: center; align-items: center;
            animation: fadeIn 0.2s ease;
        `;

        // Adicionar animações
        if (!document.getElementById('autotag-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'autotag-modal-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes ruleSlideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .autotag-rule-card:hover {
                    border-color: #444 !important;
                    background: #252525 !important;
                }
                .autotag-rule-card .remove-btn {
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .autotag-rule-card:hover .remove-btn {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }

        const modal = document.createElement('div');
        modal.style = `
            background: linear-gradient(145deg, #15181c 0%, #1a1d21 100%);
            padding: 0; border-radius: 20px;
            width: 550px; max-width: 95%; max-height: 85vh;
            color: white; border: 1px solid #2a2a2a;
            position: relative; overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            animation: slideUp 0.3s ease;
        `;

        // Header do modal
        const header = document.createElement('div');
        header.style = `
            padding: 25px 25px 20px 25px;
            border-bottom: 1px solid #2a2a2a;
            background: linear-gradient(180deg, rgba(29,155,240,0.1) 0%, transparent 100%);
        `;

        const headerTop = document.createElement('div');
        headerTop.style = 'display: flex; justify-content: space-between; align-items: flex-start;';

        const titleSection = document.createElement('div');

        const titleRow = document.createElement('div');
        titleRow.style = 'display: flex; align-items: center; gap: 12px; margin-bottom: 8px;';

        const iconCircle = document.createElement('div');
        iconCircle.innerHTML = ICON_USER.replace('width="16"', 'width="22"').replace('height="16"', 'height="22"');
        iconCircle.style = `
            width: 44px; height: 44px; border-radius: 12px;
            background: linear-gradient(135deg, #1d9bf0 0%, #0d8bd9 100%);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(29,155,240,0.3);
        `;

        const title = document.createElement('h3');
        title.innerText = 'Auto-tag por Pessoa';
        title.style = 'margin: 0; color: white; font-size: 22px; font-weight: 600;';

        titleRow.appendChild(iconCircle);
        titleRow.appendChild(title);
        titleSection.appendChild(titleRow);

        const subtitle = document.createElement('p');
        subtitle.innerText = 'Configure tags automáticas para usuários específicos';
        subtitle.style = 'margin: 0; color: #666; font-size: 13px; margin-left: 56px;';
        titleSection.appendChild(subtitle);

        headerTop.appendChild(titleSection);

        // Botão X de fechar
        const closeX = document.createElement('button');
        closeX.innerHTML = ICON_X.replace('width="16"', 'width="20"').replace('height="16"', 'height="20"');
        closeX.style = `
            background: rgba(255,255,255,0.05); border: none; color: #666;
            cursor: pointer; padding: 10px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
        `;
        closeX.onmouseenter = () => { closeX.style.color = 'white'; closeX.style.background = 'rgba(255,255,255,0.1)'; };
        closeX.onmouseleave = () => { closeX.style.color = '#666'; closeX.style.background = 'rgba(255,255,255,0.05)'; };
        closeX.onclick = () => overlay.remove();
        headerTop.appendChild(closeX);

        header.appendChild(headerTop);
        modal.appendChild(header);

        // Corpo do modal
        const body = document.createElement('div');
        body.style = 'padding: 25px; overflow-y: auto; max-height: calc(85vh - 200px);';

        // Seção de adicionar nova regra
        const addSection = document.createElement('div');
        addSection.style = `
            background: #1e2126; border-radius: 16px; padding: 20px;
            margin-bottom: 25px; border: 1px solid #2a2a2a;
        `;

        const addTitle = document.createElement('div');
        addTitle.innerText = 'Adicionar Nova Regra';
        addTitle.style = 'color: white; font-size: 14px; font-weight: 500; margin-bottom: 15px;';
        addSection.appendChild(addTitle);

        const inputRow = document.createElement('div');
        inputRow.style = 'display: flex; gap: 12px; align-items: stretch;';

        // Input @username com autocomplete customizado
        const userInputWrapper = document.createElement('div');
        userInputWrapper.style = 'flex: 1; position: relative;';

        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.placeholder = 'usuario';
        userInput.autocomplete = 'off';
        userInput.style = `
            width: 100%; padding: 14px 16px; padding-left: 40px;
            border-radius: 12px; border: 1px solid #333;
            background: #2d2d2d; color: white; font-size: 14px;
            transition: border-color 0.2s, box-shadow 0.2s;
            box-sizing: border-box;
        `;

        // Ícone @ dentro do input
        const atIcon = document.createElement('span');
        atIcon.innerText = '@';
        atIcon.style = `
            position: absolute; left: 16px; top: 14px;
            color: #1d9bf0; font-weight: bold; font-size: 14px;
            pointer-events: none;
        `;

        // Dropdown customizado
        const dropdown = document.createElement('div');
        dropdown.style = `
            position: absolute; top: calc(100% + 4px); left: 0; right: 0;
            background: #1e2126; border: 1px solid #333; border-radius: 12px;
            max-height: 200px; overflow-y: auto; overflow-x: hidden; z-index: 10005;
            display: none; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        `;

        // Lista de usernames existentes
        const existingUsernames = [];
        getBookmarks().forEach(b => {
            const handle = extractHandle(b.postUrl);
            if (handle && !existingUsernames.includes(handle)) {
                existingUsernames.push(handle);
            }
        });

        function renderDropdown(filter = '') {
            dropdown.innerHTML = '';

            // Smart Selector: esconder usuários que já têm regras
            const existingRuleUsers = getAutotagRules().map(r => r.username.replace('@', '').toLowerCase());

            let filtered = existingUsernames.filter(u =>
                !existingRuleUsers.includes(u.toLowerCase())
            );

            if (filter) {
                filtered = filtered.filter(u => u.toLowerCase().includes(filter.toLowerCase()));
            }

            if (filtered.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            filtered.forEach(username => {
                const item = document.createElement('div');
                item.style = `
                    padding: 12px 16px; cursor: pointer;
                    display: flex; align-items: center; gap: 10px;
                    transition: background 0.15s;
                    border-bottom: 1px solid #2a2a2a;
                `;
                item.onmouseenter = () => item.style.background = '#2d2d2d';
                item.onmouseleave = () => item.style.background = 'transparent';

                const avatarIcon = document.createElement('div');
                avatarIcon.innerHTML = ICON_USER.replace('width="16"', 'width="16"').replace('height="16"', 'height="16"');
                avatarIcon.style = `
                    width: 32px; height: 32px; border-radius: 50%;
                    background: linear-gradient(135deg, #333 0%, #252525 100%);
                    display: flex; align-items: center; justify-content: center;
                    color: #888; flex-shrink: 0;
                `;

                const usernameText = document.createElement('span');
                usernameText.innerHTML = `<span style="color: #1d9bf0;">@</span><span style="color: white;">${username}</span>`;
                usernameText.style = 'font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0;';

                item.appendChild(avatarIcon);
                item.appendChild(usernameText);

                item.onclick = () => {
                    userInput.value = username;
                    dropdown.style.display = 'none';
                    userInput.focus();
                };

                dropdown.appendChild(item);
            });

            // Remove last border
            if (dropdown.lastChild) {
                dropdown.lastChild.style.borderBottom = 'none';
            }

            dropdown.style.display = 'block';
        }

        userInput.onfocus = () => {
            userInput.style.borderColor = '#1d9bf0';
            userInput.style.boxShadow = '0 0 0 3px rgba(29,155,240,0.15)';
            if (existingUsernames.length > 0) {
                renderDropdown(userInput.value);
            }
        };

        userInput.onblur = () => {
            userInput.style.borderColor = '#333';
            userInput.style.boxShadow = 'none';
            // Delay para permitir click no dropdown
            setTimeout(() => dropdown.style.display = 'none', 150);
        };

        userInput.oninput = () => {
            renderDropdown(userInput.value);
        };

        userInputWrapper.appendChild(userInput);
        userInputWrapper.appendChild(atIcon);
        userInputWrapper.appendChild(dropdown);



        // Seletor de múltiplas tags
        const tagSelectWrapper = document.createElement('div');
        tagSelectWrapper.style = 'flex: 1.5; position: relative;';

        const selectedTags = new Set();

        // Container que parece um input com chips
        const tagContainer = document.createElement('div');
        tagContainer.style = `
            min-height: 48px; padding: 8px 12px;
            border-radius: 12px; border: 1px solid #333;
            background: #2d2d2d; color: white; font-size: 14px;
            cursor: pointer; display: flex; flex-wrap: wrap; gap: 6px;
            align-items: center; transition: border-color 0.2s;
        `;

        const placeholder = document.createElement('span');
        placeholder.innerText = 'Clique para selecionar tags...';
        placeholder.style = 'color: #666; font-size: 13px;';

        // Dropdown de tags
        const tagDropdown = document.createElement('div');
        tagDropdown.style = `
            position: absolute; top: calc(100% + 4px); left: 0; right: 0;
            background: #1e2126; border: 1px solid #333; border-radius: 12px;
            max-height: 180px; overflow-y: auto; z-index: 10005;
            display: none; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        `;

        function renderTagChips() {
            tagContainer.innerHTML = '';

            if (selectedTags.size === 0) {
                tagContainer.appendChild(placeholder);
                return;
            }

            selectedTags.forEach(tag => {
                const chip = document.createElement('div');
                chip.style = `
                    display: flex; align-items: center; gap: 4px;
                    background: #1d9bf0; padding: 4px 10px;
                    border-radius: 14px; font-size: 12px; color: white;
                `;

                const tagText = document.createElement('span');
                tagText.innerText = tag;

                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '×';
                removeBtn.style = `
                    background: none; border: none; color: rgba(255,255,255,0.7);
                    cursor: pointer; font-size: 14px; padding: 0 2px;
                    display: flex; align-items: center;
                `;
                removeBtn.onmouseenter = () => removeBtn.style.color = 'white';
                removeBtn.onmouseleave = () => removeBtn.style.color = 'rgba(255,255,255,0.7)';
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    selectedTags.delete(tag);
                    renderTagChips();
                    renderTagDropdown();
                };

                chip.appendChild(tagText);
                chip.appendChild(removeBtn);
                tagContainer.appendChild(chip);
            });
        }

        function renderTagDropdown() {
            tagDropdown.innerHTML = '';
            const allTags = getTags();

            if (allTags.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.innerText = 'Nenhuma tag criada ainda';
                emptyMsg.style = 'padding: 16px; color: #666; font-size: 13px; text-align: center;';
                tagDropdown.appendChild(emptyMsg);
                return;
            }

            allTags.forEach(tag => {
                const isSelected = selectedTags.has(tag);

                const item = document.createElement('div');
                item.style = `
                    padding: 12px 16px; cursor: pointer;
                    display: flex; align-items: center; justify-content: space-between;
                    transition: background 0.15s;
                    border-bottom: 1px solid #2a2a2a;
                    background: ${isSelected ? 'rgba(29,155,240,0.1)' : 'transparent'};
                `;
                item.onmouseenter = () => item.style.background = isSelected ? 'rgba(29,155,240,0.15)' : '#2d2d2d';
                item.onmouseleave = () => item.style.background = isSelected ? 'rgba(29,155,240,0.1)' : 'transparent';

                const tagText = document.createElement('span');
                tagText.innerText = tag;
                tagText.style = `color: ${isSelected ? '#1d9bf0' : 'white'}; font-size: 14px;`;

                const checkIcon = document.createElement('span');
                checkIcon.innerHTML = isSelected
                    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d9bf0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
                    : '';
                checkIcon.style = 'display: flex; align-items: center;';

                item.appendChild(tagText);
                item.appendChild(checkIcon);

                item.onclick = (e) => {
                    e.stopPropagation();
                    if (selectedTags.has(tag)) {
                        selectedTags.delete(tag);
                    } else {
                        selectedTags.add(tag);
                    }
                    renderTagChips();
                    renderTagDropdown();
                };

                tagDropdown.appendChild(item);
            });

            // Remove last border
            if (tagDropdown.lastChild) {
                tagDropdown.lastChild.style.borderBottom = 'none';
            }
        }

        renderTagChips();
        renderTagDropdown();

        let tagDropdownOpen = false;
        tagContainer.onclick = () => {
            tagDropdownOpen = !tagDropdownOpen;
            tagDropdown.style.display = tagDropdownOpen ? 'block' : 'none';
            tagContainer.style.borderColor = tagDropdownOpen ? '#1d9bf0' : '#333';
        };

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (!tagSelectWrapper.contains(e.target)) {
                tagDropdownOpen = false;
                tagDropdown.style.display = 'none';
                tagContainer.style.borderColor = '#333';
            }
        });

        tagSelectWrapper.appendChild(tagContainer);
        tagSelectWrapper.appendChild(tagDropdown);

        // Botão adicionar
        const addRuleBtn = document.createElement('button');
        addRuleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>`;
        addRuleBtn.style = `
            background: linear-gradient(135deg, #1d9bf0 0%, #0d8bd9 100%);
            border: none; color: white; width: 48px; min-width: 48px; height: 48px;
            border-radius: 12px; cursor: pointer; font-size: 20px;
            display: flex; align-items: center; justify-content: center;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 12px rgba(29,155,240,0.3);
        `;
        addRuleBtn.onmouseenter = () => { addRuleBtn.style.transform = 'scale(1.05)'; addRuleBtn.style.boxShadow = '0 6px 16px rgba(29,155,240,0.4)'; };
        addRuleBtn.onmouseleave = () => { addRuleBtn.style.transform = 'scale(1)'; addRuleBtn.style.boxShadow = '0 4px 12px rgba(29,155,240,0.3)'; };
        addRuleBtn.onclick = () => {
            let username = userInput.value.trim();

            if (!username) {
                showToast('Digite um @usuário');
                return;
            }

            if (selectedTags.size === 0) {
                showToast('Selecione ao menos uma tag');
                return;
            }

            // Remover @ se o usuário já digitou (pois vamos adicionar)
            username = username.replace(/^@/, '');
            const formattedUsername = '@' + username;

            const rules = getAutotagRules();
            let addedCount = 0;

            selectedTags.forEach(tag => {
                if (!rules.some(r => r.username === formattedUsername && r.tag === tag)) {
                    rules.push({ username: formattedUsername, tag });
                    addedCount++;
                }
            });

            if (addedCount === 0) {
                showToast('Todas as regras já existem!');
                return;
            }

            saveAutotagRules(rules);
            userInput.value = '';
            selectedTags.clear();
            renderTagChips();
            renderRules();
            showToast(`${addedCount} regra${addedCount > 1 ? 's' : ''} adicionada${addedCount > 1 ? 's' : ''} para ${formattedUsername}`);
        };

        // Enter para adicionar
        userInput.onkeypress = (e) => { if (e.key === 'Enter') addRuleBtn.click(); };

        inputRow.appendChild(userInputWrapper);
        inputRow.appendChild(tagSelectWrapper);
        inputRow.appendChild(addRuleBtn);
        addSection.appendChild(inputRow);

        // Dica
        const hint = document.createElement('div');
        hint.innerHTML = `💡 <span style="color: #666;">Dica: Selecione múltiplas tags para aplicar todas automaticamente ao salvar bookmark de @usuário.</span>`;
        hint.style = 'margin-top: 12px; font-size: 12px; color: #888;';
        addSection.appendChild(hint);

        body.appendChild(addSection);

        // Seção de regras existentes
        const rulesSection = document.createElement('div');

        const rulesTitleRow = document.createElement('div');
        rulesTitleRow.style = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;';

        const rulesTitle = document.createElement('div');
        rulesTitle.style = 'color: white; font-size: 14px; font-weight: 500;';

        const rulesCount = document.createElement('span');
        rulesCount.id = 'autotag-rules-count';
        rulesCount.style = `
            background: #2d2d2d; color: #888; padding: 4px 10px;
            border-radius: 20px; font-size: 12px;
        `;

        rulesTitleRow.appendChild(rulesTitle);
        rulesTitleRow.appendChild(rulesCount);
        rulesSection.appendChild(rulesTitleRow);

        // Container das regras
        const rulesContainer = document.createElement('div');
        rulesContainer.id = 'autotag-rules-list';
        rulesContainer.style = 'display: flex; flex-direction: column; gap: 10px;';

        function renderRules() {
            rulesContainer.innerHTML = '';
            const rules = getAutotagRules();

            rulesTitle.innerText = 'Regras Configuradas';
            rulesCount.innerText = rules.length + ' regra' + (rules.length !== 1 ? 's' : '');

            if (rules.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.style = `
                    text-align: center; padding: 40px 20px;
                    background: #1e2126; border-radius: 16px;
                    border: 1px dashed #333;
                `;
                emptyState.innerHTML = `
                    <div style="font-size: 40px; margin-bottom: 12px;">📋</div>
                    <div style="color: #666; font-size: 14px;">Nenhuma regra configurada</div>
                    <div style="color: #555; font-size: 12px; margin-top: 4px;">Adicione sua primeira regra acima</div>
                `;
                rulesContainer.appendChild(emptyState);
                return;
            }

            // Agrupar regras por usuário
            const groupedRules = {};
            rules.forEach((rule, idx) => {
                if (!groupedRules[rule.username]) {
                    groupedRules[rule.username] = [];
                }
                groupedRules[rule.username].push({ ...rule, originalIndex: idx });
            });

            Object.keys(groupedRules).forEach(username => {
                const userRules = groupedRules[username];

                const card = document.createElement('div');
                card.className = 'autotag-rule-card';
                card.style = `
                    background: #1e2126; border-radius: 14px; padding: 16px;
                    border: 1px solid #2a2a2a; transition: all 0.2s;
                    animation: ruleSlideIn 0.3s ease;
                `;

                const cardHeader = document.createElement('div');
                cardHeader.style = 'display: flex; align-items: center; gap: 12px;';

                // Avatar placeholder
                const avatar = document.createElement('div');
                avatar.innerHTML = ICON_USER.replace('width="16"', 'width="18"').replace('height="16"', 'height="18"');
                avatar.style = `
                    width: 40px; height: 40px; border-radius: 10px;
                    background: linear-gradient(135deg, #2d2d2d 0%, #252525 100%);
                    display: flex; align-items: center; justify-content: center;
                    color: #1d9bf0; flex-shrink: 0;
                `;

                const userInfo = document.createElement('div');
                userInfo.style = 'flex: 1; min-width: 0;';

                const usernameEl = document.createElement('div');
                usernameEl.innerText = username;
                usernameEl.style = 'color: #1d9bf0; font-size: 15px; font-weight: 500;';

                const tagsList = document.createElement('div');
                tagsList.style = 'display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;';

                userRules.forEach(ruleData => {
                    const tagChip = document.createElement('div');
                    tagChip.style = `
                        display: flex; align-items: center; gap: 6px;
                        background: #2d2d2d; padding: 6px 12px;
                        border-radius: 20px; font-size: 13px; color: #ccc;
                    `;

                    const tagText = document.createElement('span');
                    tagText.innerText = ruleData.tag;

                    const removeTagBtn = document.createElement('button');
                    removeTagBtn.className = 'remove-btn';
                    removeTagBtn.innerHTML = ICON_X.replace('width="16"', 'width="12"').replace('height="16"', 'height="12"');
                    removeTagBtn.style = `
                        background: none; border: none; color: #666;
                        cursor: pointer; padding: 2px;
                        display: flex; align-items: center;
                        transition: color 0.2s;
                    `;
                    removeTagBtn.onmouseenter = () => removeTagBtn.style.color = '#e74c3c';
                    removeTagBtn.onmouseleave = () => removeTagBtn.style.color = '#666';
                    removeTagBtn.onclick = (e) => {
                        e.stopPropagation();
                        const allRules = getAutotagRules();
                        allRules.splice(ruleData.originalIndex, 1);
                        saveAutotagRules(allRules);
                        renderRules();
                        showToast(`Regra removida: ${username} → ${ruleData.tag}`);
                    };

                    tagChip.appendChild(tagText);
                    tagChip.appendChild(removeTagBtn);
                    tagsList.appendChild(tagChip);
                });

                userInfo.appendChild(usernameEl);
                userInfo.appendChild(tagsList);

                // Botão Delete Person
                const deletePersonBtn = document.createElement('button');
                deletePersonBtn.innerHTML = ICON_TRASH;
                deletePersonBtn.title = 'Remover todas as regras deste usuário';
                deletePersonBtn.style = `
                    background: transparent; border: 1px solid #333;
                    color: #666; padding: 8px; border-radius: 8px;
                    cursor: pointer; display: flex; align-items: center;
                    justify-content: center; transition: all 0.2s;
                    flex-shrink: 0;
                `;
                deletePersonBtn.onmouseenter = () => {
                    deletePersonBtn.style.borderColor = '#f4212e';
                    deletePersonBtn.style.color = '#f4212e';
                };
                deletePersonBtn.onmouseleave = () => {
                    deletePersonBtn.style.borderColor = '#333';
                    deletePersonBtn.style.color = '#666';
                };
                deletePersonBtn.onclick = (e) => {
                    e.stopPropagation();
                    showConfirmModal(`Remover todas as ${userRules.length} regra(s) de ${username}?`, () => {
                        const allRules = getAutotagRules();
                        const filteredRules = allRules.filter(r => r.username !== username);
                        saveAutotagRules(filteredRules);
                        renderRules();
                        showToast(`Todas as regras de ${username} removidas`);
                    });
                };

                cardHeader.appendChild(avatar);
                cardHeader.appendChild(userInfo);
                cardHeader.appendChild(deletePersonBtn);
                card.appendChild(cardHeader);

                rulesContainer.appendChild(card);
            });
        }

        renderRules();
        rulesSection.appendChild(rulesContainer);
        body.appendChild(rulesSection);

        modal.appendChild(body);
        overlay.appendChild(modal);
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        document.body.appendChild(overlay);
    }

    // ==================== UI INJECTION ====================
    function injectButtons() {
        const grokButtons = document.querySelectorAll('button[aria-label="Ações do Grok"]:not([data-x-bookmark-injected])');

        grokButtons.forEach(button => {
            button.setAttribute('data-x-bookmark-injected', 'true');

            const article = button.closest('article');
            if (!article) return;

            const quotedArea = article.querySelector('[data-testid="quotedTweet"]')
                || article.querySelector('[data-testid="testCondensedMedia"]')?.closest('[role="link"]');

            let postUrlElement = null;
            let postDate = null;
            const allTimeElements = article.querySelectorAll('time');
            for (const timeEl of allTimeElements) {
                const link = timeEl.parentElement;
                if (quotedArea && quotedArea.contains(timeEl)) continue;
                if (link && link.getAttribute('href')) {
                    postUrlElement = link;
                    postDate = timeEl.getAttribute('datetime');
                    break;
                }
            }

            let postUrl = null;
            if (postUrlElement && postUrlElement.getAttribute('href')) {
                postUrl = `https://x.com${postUrlElement.getAttribute('href')}`;
            } else {
                const currentUrl = window.location.href;
                if (currentUrl.match(/x\.com\/\w+\/status\/\d+/)) {
                    postUrl = currentUrl.split('?')[0];
                }
            }

            const iconContainer = button.querySelector('svg').parentElement;
            if (iconContainer) {
                iconContainer.innerHTML = BOOKMARK_ICON_SVG;
                iconContainer.style.transition = 'color 0.2s';
                iconContainer.style.color = GRAY_COLOR;

                if (postUrl && isBookmarked(postUrl)) {
                    iconContainer.style.color = BLUE_COLOR;
                }
            }

            button.setAttribute('aria-label', 'Bookmark Interno');
            button.title = 'Salvar/Remover Bookmark Interno';

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!postUrl) return;

                const allImgElements = article.querySelectorAll('div[data-testid="tweetPhoto"] img');
                const quotedContainer = article.querySelector('[data-testid="quotedTweet"]')
                    || article.querySelector('[data-testid="testCondensedMedia"]')
                    || article.querySelector('[role="link"][tabindex="0"] > div');

                const images = Array.from(allImgElements).filter(img => {
                    if (quotedContainer && quotedContainer.contains(img)) return false;
                    return true;
                }).map(img => {
                    let src = img.src;
                    // Criar URL com 4096x4096 (máxima qualidade)
                    if (src.includes('name=')) {
                        return src.replace(/name=[^&]+/, 'name=4096x4096');
                    } else if (src.includes('?')) {
                        return src + '&name=4096x4096';
                    } else {
                        return src;
                    }
                });

                // Fallback: Se não encontrou imagens no article, tentar buscar do lightbox
                if (images.length === 0) {
                    // Lightbox do Twitter geralmente tem a imagem em um layer separado
                    const lightboxImg = document.querySelector('[data-testid="swipe-to-dismiss"] img[src*="pbs.twimg.com/media"]')
                        || document.querySelector('[role="dialog"] img[src*="pbs.twimg.com/media"]')
                        || document.querySelector('div[aria-modal="true"] img[src*="pbs.twimg.com/media"]');

                    if (lightboxImg) {
                        let src = lightboxImg.src;
                        let primaryUrl;
                        if (src.includes('name=')) {
                            primaryUrl = src.replace(/name=[^&]+/, 'name=4096x4096');
                        } else if (src.includes('?')) {
                            primaryUrl = src + '&name=4096x4096';
                        } else {
                            primaryUrl = src;
                        }
                        images.push(primaryUrl);
                    }
                }

                if (images.length === 0 && !isBookmarked(postUrl)) {
                    alert('Nenhuma imagem encontrada no seu post principal.');
                    return;
                }

                // Extrair nome e avatar do usuário
                let userName = '';
                let userAvatar = '';
                const userCell = article.querySelector('[data-testid="User-Name"]');
                if (userCell) {
                    const nameSpans = userCell.querySelectorAll('span');
                    for (const span of nameSpans) {
                        if (span.textContent && !span.textContent.startsWith('@') && span.textContent.trim()) {
                            userName = span.textContent.trim();
                            break;
                        }
                    }
                }
                const avatarImg = article.querySelector('img[src*="profile_images"]');
                if (avatarImg) {
                    userAvatar = avatarImg.src.replace('_normal.', '_400x400.');
                }

                const result = toggleBookmark({
                    id: Date.now(),
                    postUrl,
                    images,
                    tags: [],
                    timestamp: new Date().toISOString(),
                    postDate: postDate || null,
                    userName: userName || '',
                    userAvatar: userAvatar || ''
                });

                if (iconContainer) {
                    iconContainer.style.color = result.action === 'added' ? BLUE_COLOR : GRAY_COLOR;
                }

                // Toast centralizado estilo X
                if (result.action === 'added') {
                    showBookmarkToast('Adicionado aos itens salvos', true);

                    // Backup automático no Catbox se configurado
                    const settings = getSettings();
                    if (settings.catboxAutoBackup && result.bookmarkId) {
                        backupBookmarkImages(result.bookmarkId);
                    }
                } else {
                    showBookmarkToast('Removido dos itens salvos');
                }
            });
        });
    }

    // ==================== GALLERY ====================
    function createGalleryModal() {
        // Focus Fix: salvar posição de scroll antes de modificar
        const scrollPos = window.scrollY;

        // Função para restaurar scroll (chamada múltiplas vezes para garantir)
        const restoreScroll = () => {
            window.scrollTo(0, scrollPos);
        };

        // Travar scroll da página
        document.body.style.overflow = 'hidden';

        const existing = document.getElementById('x-bookmark-gallery');
        if (existing) {
            existing.style.display = 'flex';
            updateGalleryContent();
            // Restaurar posição de scroll com múltiplos attempts
            restoreScroll();
            setTimeout(restoreScroll, 0);
            setTimeout(restoreScroll, 50);
            setTimeout(restoreScroll, 100);
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'x-bookmark-gallery';
        modal.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 9999;
            display: flex; flex-direction: column; align-items: center;
            padding: 20px; overflow-y: auto; color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;

        // Header
        const header = document.createElement('div');
        header.id = 'x-bookmark-header';
        header.style = 'width: 100%; max-width: 1200px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;';

        const titleArea = document.createElement('div');
        titleArea.style = 'display: flex; align-items: center; gap: 10px;';

        const title = document.createElement('h2');
        title.id = 'x-bookmark-title';
        title.style = 'margin: 0; font-size: 24px; color: #1d9bf0;';
        title.innerText = getSettings().galleryTitle;
        titleArea.appendChild(title);

        const counter = document.createElement('span');
        counter.id = 'x-bookmark-counter';
        counter.style = 'background: #1d9bf0; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold;';
        counter.innerText = getBookmarks().length;
        titleArea.appendChild(counter);

        const versionText = document.createElement('span');
        versionText.style = 'font-size: 12px; color: #555;';
        versionText.innerText = `v${VERSION}`;
        titleArea.appendChild(versionText);

        header.appendChild(titleArea);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = ICON_X.replace('width="16"', 'width="24"').replace('height="16"', 'height="24"');
        closeBtn.style = 'background: transparent; color: white; border: none; padding: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;';
        closeBtn.title = 'Fechar';
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        };
        header.appendChild(closeBtn);
        modal.appendChild(header);

        // Toolbar (Busca + Ordenação + Tags)
        const toolbar = document.createElement('div');
        toolbar.id = 'x-bookmark-toolbar';
        toolbar.style = 'width: 100%; max-width: 1200px; display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #333;';

        // Busca
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar por @usuário...';
        searchInput.style = 'flex: 1; min-width: 200px; padding: 10px 15px; border-radius: 20px; border: 1px solid #333; background: #000; color: white;';
        searchInput.oninput = (e) => {
            currentFilter.search = e.target.value;
            updateGalleryContent();
        };
        toolbar.appendChild(searchInput);

        // Ordenação
        const sortContainer = document.createElement('div');
        sortContainer.style = 'display: flex; align-items: center; gap: 8px;';

        const sortLabel = document.createElement('span');
        sortLabel.innerText = 'Ordenar por:';
        sortLabel.style = 'color: #888; font-size: 13px;';

        const sortSelect = document.createElement('select');
        sortSelect.style = 'padding: 10px 15px; border-radius: 20px; border: 1px solid #333; background: #000; color: white; cursor: pointer;';
        sortSelect.innerHTML = `
            <option value="newest_added">Adicionado (Recente)</option>
            <option value="oldest_added">Adicionado (Antigo)</option>
            <option value="newest_post">Postado (Recente)</option>
            <option value="oldest_post">Postado (Antigo)</option>
            <option value="most_images">Mais Fotos</option>
        `;
        sortSelect.onchange = (e) => {
            currentFilter.sort = e.target.value;
            updateGalleryContent();
        };

        sortContainer.appendChild(sortLabel);
        sortContainer.appendChild(sortSelect);
        toolbar.appendChild(sortContainer);

        // Botão gerenciar tags
        const manageTagsBtn = document.createElement('button');
        manageTagsBtn.innerHTML = `${ICON_TAG} <span>Tags</span>`;
        manageTagsBtn.style = 'padding: 10px 20px; border-radius: 20px; border: 1px solid #333; background: #222; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; gap: 6px;';
        manageTagsBtn.onclick = () => createTagModal(updateGalleryContent);
        toolbar.appendChild(manageTagsBtn);

        // Botão configurações
        const settingsBtn = document.createElement('button');
        settingsBtn.innerHTML = `${ICON_SETTINGS} <span>Configurações</span>`;
        settingsBtn.style = 'padding: 10px 20px; border-radius: 20px; border: 1px solid #333; background: #222; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; gap: 6px;';
        settingsBtn.onclick = () => SettingsModal(updateGalleryContent);
        toolbar.appendChild(settingsBtn);

        // Toggle Grid/Lista
        const viewToggle = document.createElement('button');
        viewToggle.id = 'x-bookmark-view-toggle';
        viewToggle.innerHTML = viewMode === 'grid' ? `${ICON_LIST} <span>Lista</span>` : `${ICON_GRID} <span>Grid</span>`;
        viewToggle.style = 'padding: 10px 20px; border-radius: 20px; border: 1px solid #333; background: #222; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; gap: 6px;';
        viewToggle.onclick = () => {
            viewMode = viewMode === 'grid' ? 'list' : 'grid';
            GM_setValue('x_bookmark_view_mode', viewMode);
            viewToggle.innerHTML = viewMode === 'grid' ? `${ICON_LIST} <span>Lista</span>` : `${ICON_GRID} <span>Grid</span>`;
            updateGalleryContent();
        };
        toolbar.appendChild(viewToggle);

        // Bulk Actions Container
        const bulkContainer = document.createElement('div');
        bulkContainer.id = 'x-bookmark-bulk-actions';
        bulkContainer.style = 'display: none; align-items: center; gap: 10px; margin-left: auto;';

        const bulkInfo = document.createElement('span');
        bulkInfo.id = 'x-bookmark-bulk-info';
        bulkInfo.style = 'color: #888; font-size: 13px;';
        bulkInfo.innerText = '0 selecionados';

        // Botão Selecionar Tudo - azul
        const bulkSelectAllBtn = document.createElement('button');
        bulkSelectAllBtn.id = 'x-bookmark-select-all';
        bulkSelectAllBtn.innerHTML = `<span>Selecionar Tudo</span>`;
        bulkSelectAllBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #1d9bf0; background: transparent; color: #1d9bf0; cursor: pointer; display: flex; align-items: center; gap: 6px;';
        bulkSelectAllBtn.onclick = () => {
            const bookmarks = getBookmarks();
            let filtered = bookmarks;
            if (currentFilter.tag) {
                filtered = filtered.filter(b => (b.tags || []).includes(currentFilter.tag));
            }
            if (currentFilter.search) {
                const search = currentFilter.search.toLowerCase().replace('@', '');
                filtered = filtered.filter(b => extractHandle(b.postUrl).toLowerCase().includes(search));
            }
            filtered.forEach(b => selectedItems.add(b.id));
            updateGalleryContent();
            updateBulkUI();
            showToast(`${filtered.length} item(s) selecionado(s)`);
        };

        // Botão Limpar Seleção - com ícone de vassoura
        const bulkClearBtn = document.createElement('button');
        bulkClearBtn.innerHTML = `${ICON_BROOM} <span>Limpar Seleção</span>`;
        bulkClearBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #3a3a3a; background: transparent; color: rgba(255,255,255,0.7); cursor: pointer; display: flex; align-items: center; gap: 6px;';
        bulkClearBtn.onclick = () => { selectedItems.clear(); updateGalleryContent(); updateBulkUI(); showToast('Seleção limpa'); };

        // Botão Gerenciar Tags - azul
        const bulkTagBtn = document.createElement('button');
        bulkTagBtn.innerHTML = `${ICON_TAG} <span>Gerenciar Tags</span>`;
        bulkTagBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #1d9bf0; background: transparent; color: #1d9bf0; cursor: pointer; display: flex; align-items: center; gap: 6px;';
        bulkTagBtn.onclick = bulkAddTag;

        // Botão Download - verde
        const bulkDownloadBtn = document.createElement('button');
        bulkDownloadBtn.innerHTML = `${ICON_DOWNLOAD} <span>Download</span>`;
        bulkDownloadBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #22c55e; background: transparent; color: #22c55e; cursor: pointer; display: flex; align-items: center; gap: 6px;';
        bulkDownloadBtn.onclick = downloadSelectedItems;

        // Botão Backup - roxo/catbox
        const bulkBackupBtn = document.createElement('button');
        bulkBackupBtn.innerHTML = `${ICON_CATBOX} <span>Backup</span>`;
        bulkBackupBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #667292; background: transparent; color: #667292; cursor: pointer; display: flex; align-items: center; gap: 6px;';
        bulkBackupBtn.onclick = async () => {
            if (selectedItems.size === 0) {
                showToast('Nenhum item selecionado');
                return;
            }
            const settings = getSettings();
            if (!settings.catboxUserhash) {
                showToast('Configure o Userhash do Catbox primeiro');
                return;
            }

            // Calcular total de imagens para progresso
            const allBookmarks = getBookmarks();
            let totalImages = 0;
            const idsArray = [...selectedItems];
            for (const id of idsArray) {
                const bm = allBookmarks.find(b => b.id === id);
                if (bm?.images) {
                    if (bm.mergedImageUrl && bm.mergedImageUrl.startsWith('https://')) {
                        continue;
                    }

                    // Contar apenas imagens sem backup
                    const needsBackup = bm.images.filter((_, idx) =>
                        !(bm.catboxUrls?.[idx]?.startsWith('https://'))
                    ).length;
                    totalImages += needsBackup;
                }
            }

            if (totalImages === 0) {
                const count = selectedItems.size;
                showToast(count === 1 ? 'Este item já tem backup!' : 'Todos os itens já têm backup!');
                return;
            }

            // Objeto mutável para rastrear progresso entre bookmarks
            const progressInfo = { current: 0, total: totalImages };
            for (const id of idsArray) {
                await backupBookmarkImages(id, {
                    isManual: true,
                    progressInfo
                });
            }
            showToast('Backup concluído!');
            updateGalleryContent();
        };

        // Botão Excluir
        const bulkDelBtn = document.createElement('button');
        bulkDelBtn.innerHTML = `${ICON_TRASH} <span>Excluir</span>`;
        bulkDelBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #f4212e; background: transparent; color: #f4212e; cursor: pointer; display: flex; align-items: center; gap: 6px;';
        bulkDelBtn.onclick = bulkDelete;

        bulkContainer.appendChild(bulkInfo);
        bulkContainer.appendChild(bulkSelectAllBtn);
        bulkContainer.appendChild(bulkClearBtn);
        bulkContainer.appendChild(bulkTagBtn);
        bulkContainer.appendChild(bulkDownloadBtn);
        bulkContainer.appendChild(bulkBackupBtn);
        bulkContainer.appendChild(bulkDelBtn);
        toolbar.appendChild(bulkContainer);

        modal.appendChild(toolbar);

        // Tag filters
        const tagFilters = document.createElement('div');
        tagFilters.id = 'x-bookmark-tag-filters';
        tagFilters.style = 'width: 100%; max-width: 1200px; display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;';
        modal.appendChild(tagFilters);

        // Container
        const container = document.createElement('div');
        container.id = 'x-bookmark-container';
        container.style = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; width: 100%; max-width: 1200px; align-items: start;';
        modal.appendChild(container);

        document.body.appendChild(modal);
        updateGalleryContent();
    }

    function updateGalleryContent() {
        const container = document.getElementById('x-bookmark-container');
        const tagFiltersEl = document.getElementById('x-bookmark-tag-filters');
        const counterEl = document.getElementById('x-bookmark-counter');
        const titleEl = document.getElementById('x-bookmark-title');
        if (!container) return;

        // Atualizar título da galeria
        if (titleEl) {
            titleEl.innerText = getSettings().galleryTitle;
        }

        // Atualizar estilo do container baseado no viewMode
        if (viewMode === 'list') {
            container.style.gridTemplateColumns = '1fr';
            container.style.maxWidth = '800px';
        } else {
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
            container.style.maxWidth = '1200px';
        }

        // Render tag filter chips
        if (tagFiltersEl) {
            const allTags = getTags();
            tagFiltersEl.innerHTML = '';

            // Chip "Todos"
            const allChip = document.createElement('button');
            allChip.innerText = 'Todos';
            allChip.style = `
                padding: 6px 16px; border-radius: 20px; border: none; cursor: pointer;
                background: ${currentFilter.tag === null ? '#1d9bf0' : '#222'};
                color: ${currentFilter.tag === null ? 'white' : '#888'};
            `;
            allChip.onclick = () => { currentFilter.tag = null; updateGalleryContent(); };
            tagFiltersEl.appendChild(allChip);

            allTags.forEach(tag => {
                const chip = document.createElement('button');
                chip.innerText = tag;
                chip.style = `
                    padding: 6px 16px; border-radius: 20px; border: none; cursor: pointer;
                    background: ${currentFilter.tag === tag ? '#1d9bf0' : '#222'};
                    color: ${currentFilter.tag === tag ? 'white' : '#888'};
                `;
                chip.onclick = () => { currentFilter.tag = tag; updateGalleryContent(); };
                tagFiltersEl.appendChild(chip);
            });
        }

        // Filter bookmarks
        let bookmarks = getBookmarks();

        // Filtrar por tag
        if (currentFilter.tag) {
            bookmarks = bookmarks.filter(b => (b.tags || []).includes(currentFilter.tag));
        }

        // Filtrar por busca (handle)
        if (currentFilter.search) {
            const search = currentFilter.search.toLowerCase().replace('@', '');
            bookmarks = bookmarks.filter(b => extractHandle(b.postUrl).toLowerCase().includes(search));
        }

        // Ordenar
        switch (currentFilter.sort) {
            case 'oldest_added':
                bookmarks.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                break;
            case 'newest_post':
                bookmarks.sort((a, b) => new Date(b.postDate || 0) - new Date(a.postDate || 0));
                break;
            case 'oldest_post':
                bookmarks.sort((a, b) => new Date(a.postDate || 0) - new Date(b.postDate || 0));
                break;
            case 'most_images':
                bookmarks.sort((a, b) => {
                    const diff = (b.images?.length || 0) - (a.images?.length || 0);
                    if (diff !== 0) return diff;
                    // Desempate por data de adição (mais recente primeiro)
                    return new Date(b.timestamp) - new Date(a.timestamp);
                });
                break;
            case 'newest_added':
            default:
                bookmarks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }

        container.innerHTML = bookmarks.length === 0
            ? '<p style="text-align:center; width: 100%; font-size: 18px; color: #888;">Nenhum bookmark encontrado.</p>'
            : '';

        // Atualizar contador
        if (counterEl) counterEl.innerText = bookmarks.length;

        bookmarks.forEach(b => {
            const item = document.createElement('div');

            if (viewMode === 'list') {
                // Modo Lista
                const settings = getSettings();
                const previewSize = settings.listPreviewSize;
                item.style = 'background: #15181c; border-radius: 12px; overflow: hidden; border: 1px solid #333; display: flex; gap: 15px; padding: 12px; align-items: center;';

                const thumb = document.createElement('img');
                const hasMerged = !!b.mergedImageUrl;
                const thumbData = hasMerged
                    ? { url: b.mergedImageUrl, isFallback: false, hasCatboxBackup: true }
                    : getImageUrl(b, 0);
                thumb.src = thumbData.url || '';
                thumb.style = `width: ${previewSize}px; height: ${previewSize}px; object-fit: cover; border-radius: 8px; cursor: pointer; flex-shrink: 0; ${thumbData.isFallback && b.catboxUrls ? 'border: 2px solid #f59e0b;' : ''}`;
                if (hasMerged) {
                    thumb.title = '🧩 Usando imagem mesclada salva';
                } else if (thumbData.isFallback && b.catboxUrls) {
                    thumb.title = '⚠️ Usando imagem do Twitter (backup falhou)';
                }
                // Fallback chain: 4096x4096 → large → Catbox
                thumb.onerror = () => {
                    if (hasMerged) {
                        const fallbackThumb = getImageUrl(b, 0).url || b.images?.[0];
                        if (fallbackThumb && thumb.src !== fallbackThumb) {
                            thumb.src = fallbackThumb;
                            thumb.title = '⚠️ Mescla indisponível, mostrando original';
                            return;
                        }
                    }

                    const catboxUrl = b.catboxUrls?.[0];
                    const failedUrl = thumb.src;
                    const debugMode = getSettings().debugMode;

                    // Se estava usando 4096x4096 e falhou, tentar large
                    if (thumb.src.includes('name=4096x4096')) {
                        if (debugMode) {
                            console.log('[X-Bookmark] List: 4k failed, trying large | URL:', failedUrl);
                        } else {
                            console.log('[X-Bookmark] List: 4k failed, trying large');
                        }
                        thumb.src = thumb.src.replace('name=4096x4096', 'name=large');
                        return;
                    }

                    // Se large também falhou e temos Catbox, usar Catbox
                    if (catboxUrl && !thumb.src.includes('catbox.moe')) {
                        if (debugMode) {
                            console.log('[X-Bookmark] List: Large failed, using Catbox | Failed URL:', failedUrl, '| Catbox:', catboxUrl);
                        } else {
                            console.log('[X-Bookmark] List: Large failed, using Catbox');
                        }
                        thumb.src = catboxUrl;
                        thumb.style.border = '2px solid #f59e0b';
                        thumb.title = '⚠️ Usando backup do Catbox (Twitter indisponível)';
                    }
                };
                thumb.onclick = () => (b.images?.length > 1 || b.mergedImageUrl) ? showDetails(b) : window.open(thumbData.url, '_blank');

                // Preview no hover
                thumb.onmouseenter = (e) => showPreview(e, b.mergedImageUrl || b.images?.[0]);
                thumb.onmouseleave = hidePreview;

                const info = document.createElement('div');
                info.style = 'flex: 1; display: flex; flex-direction: column; gap: 4px; overflow: hidden;';

                const handle = document.createElement('a');
                handle.href = b.postUrl;
                handle.target = '_blank';
                const displayName = b.userName || '';
                const handleText = extractHandle(b.postUrl);
                handle.innerText = displayName ? `${displayName} (@${handleText})` : `@${handleText}`;
                handle.style = 'color: #1d9bf0; text-decoration: none; font-weight: bold; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';

                const dates = document.createElement('div');
                dates.style = 'color: #666; font-size: 11px; display: flex; align-items: center; gap: 4px;';
                dates.innerHTML = `${ICON_CALENDAR} ${formatDate(b.postDate)} &nbsp;•&nbsp; ${ICON_DOWNLOAD} ${formatDate(b.timestamp)}`;

                const tags = document.createElement('div');
                tags.style = 'display: flex; gap: 5px; flex-wrap: wrap;';
                (b.tags || []).forEach(tag => {
                    const badge = document.createElement('span');
                    badge.innerText = tag;
                    badge.style = 'background: rgba(29,155,240,0.3); color: #1d9bf0; padding: 2px 8px; border-radius: 10px; font-size: 10px;';
                    tags.appendChild(badge);
                });

                const imgCount = document.createElement('span');
                imgCount.innerText = b.mergedImageUrl
                    ? `🖼️ ${b.images?.length || 0} foto(s) • mesclada`
                    : `🖼️ ${b.images?.length || 0} foto(s)`;
                imgCount.style = 'color: #888; font-size: 11px;';

                info.appendChild(handle);
                info.appendChild(dates);
                if ((b.tags || []).length > 0) info.appendChild(tags);
                info.appendChild(imgCount);

                // Checkbox de seleção para modo lista
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = selectedItems.has(b.id);
                checkbox.style = 'width: 18px; height: 18px; cursor: pointer; accent-color: #1d9bf0; flex-shrink: 0;';
                checkbox.onclick = (e) => {
                    e.stopPropagation();
                    if (checkbox.checked) {
                        selectedItems.add(b.id);
                    } else {
                        selectedItems.delete(b.id);
                    }
                    updateBulkUI();
                };

                // Botão Ver Post (modo lista)
                const viewPostBtn = document.createElement('button');
                viewPostBtn.innerHTML = ICON_EXTERNAL_LINK;
                viewPostBtn.title = 'Abrir post original';
                viewPostBtn.style = 'background: transparent; border: 1px solid #333; color: #888; padding: 8px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;';
                viewPostBtn.onmouseenter = () => { viewPostBtn.style.borderColor = '#1d9bf0'; viewPostBtn.style.color = '#1d9bf0'; };
                viewPostBtn.onmouseleave = () => { viewPostBtn.style.borderColor = '#333'; viewPostBtn.style.color = '#888'; };
                viewPostBtn.onclick = (e) => { e.stopPropagation(); window.open(b.postUrl, '_blank'); };

                // Botão Download (modo lista)
                const downloadBtn = document.createElement('button');
                downloadBtn.innerHTML = ICON_DOWNLOAD;
                downloadBtn.title = 'Baixar imagens';
                downloadBtn.style = 'background: transparent; border: 1px solid #333; color: #888; padding: 8px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;';
                downloadBtn.onmouseenter = () => { downloadBtn.style.borderColor = '#22c55e'; downloadBtn.style.color = '#22c55e'; };
                downloadBtn.onmouseleave = () => { downloadBtn.style.borderColor = '#333'; downloadBtn.style.color = '#888'; };
                downloadBtn.onclick = (e) => { e.stopPropagation(); downloadBookmarkImages(b); };

                item.appendChild(checkbox);
                item.appendChild(thumb);
                item.appendChild(info);
                item.appendChild(downloadBtn);
                item.appendChild(viewPostBtn);
                container.appendChild(item);
                return;
            }

            // Modo Grid (original)
            const settings = getSettings();
            const gridHeight = settings.gridPhotoHeight;
            item.style = 'background: #15181c; border-radius: 16px; overflow: hidden; position: relative; border: 1px solid #333; transition: transform 0.2s;';
            item.onmouseover = () => item.style.transform = 'scale(1.02)';
            item.onmouseout = () => item.style.transform = 'scale(1)';

            const imgContainer = document.createElement('div');
            const hasMerged = !!b.mergedImageUrl;
            const numImgs = hasMerged ? 1 : (b.images ? b.images.length : 1);
            const originalNumImgs = b.images ? b.images.length : 0;
            imgContainer.style = `display: grid; grid-template-columns: ${numImgs > 1 ? '1fr 1fr' : '1fr'}; gap: 2px; background: #000; cursor: pointer; height: ${gridHeight}px; position: relative;`;
            imgContainer.title = numImgs > 1 ? 'Clique para ver todas as imagens' : 'Clique para abrir imagem';

            imgContainer.onclick = () => {
                if (numImgs > 1 || hasMerged) {
                    showDetails(b);
                } else {
                    // Usar URL atual da imagem (pode ser Catbox ou Twitter após fallback)
                    const currentImg = imgContainer.querySelector('img');
                    const urlToOpen = currentImg ? currentImg.src : (getImageUrl(b, 0).url || b.images[0]);
                    window.open(urlToOpen, '_blank');
                }
            };

            const displayImages = hasMerged ? [b.mergedImageUrl] : (b.images ? b.images.slice(0, 4) : []);
            let backupCount = 0;
            let fallbackCount = 0;

            for (let i = 0; i < originalNumImgs; i++) {
                if (b.catboxUrls?.[i]?.startsWith('https://')) {
                    backupCount++;
                } else {
                    fallbackCount++;
                }
            }

            displayImages.forEach((src, idx) => {
                const img = document.createElement('img');
                const imgData = hasMerged
                    ? { url: b.mergedImageUrl, hasCatboxBackup: true }
                    : getImageUrl(b, idx);
                img.src = imgData.url;
                let itemHeight = `${gridHeight}px`;
                if (numImgs > 1) {
                    itemHeight = numImgs === 2 ? `${gridHeight}px` : `${Math.floor(gridHeight / 2) - 1}px`;
                }
                img.style = `width: 100%; height: ${itemHeight}; object-fit: cover; display: block; pointer-events: none;`;
                // Fallback chain: 4096x4096 → large → Catbox
                img.onerror = () => {
                    if (hasMerged) {
                        const fallbackThumb = getImageUrl(b, 0).url || b.images?.[0];
                        if (fallbackThumb && img.src !== fallbackThumb) {
                            img.src = fallbackThumb;
                            item.style.border = '1px solid #f59e0b';
                            return;
                        }
                    }

                    const catboxUrl = b.catboxUrls?.[idx];
                    const failedUrl = img.src;
                    const debugMode = getSettings().debugMode;

                    // Se estava usando 4096x4096 e falhou, tentar large
                    if (img.src.includes('name=4096x4096')) {
                        if (debugMode) {
                            console.log('[X-Bookmark] Grid: 4k failed, trying large | URL:', failedUrl);
                        } else {
                            console.log('[X-Bookmark] Grid: 4k failed, trying large');
                        }
                        img.src = img.src.replace('name=4096x4096', 'name=large');
                        return;
                    }

                    // Se large também falhou e temos Catbox, usar Catbox
                    if (catboxUrl && !img.src.includes('catbox.moe')) {
                        if (debugMode) {
                            console.log('[X-Bookmark] Grid: Large failed, using Catbox | Failed URL:', failedUrl, '| Catbox:', catboxUrl);
                        } else {
                            console.log('[X-Bookmark] Grid: Large failed, using Catbox');
                        }
                        img.src = catboxUrl;
                        item.style.border = '1px solid #f59e0b';
                        // Badge de warning
                        if (!imgContainer.querySelector('.fallback-badge')) {
                            const fallbackBadge = document.createElement('div');
                            fallbackBadge.className = 'fallback-badge';
                            fallbackBadge.innerHTML = '⚠️';
                            fallbackBadge.title = 'Usando backup do Catbox (Twitter indisponível)';
                            fallbackBadge.style = 'position: absolute; top: 10px; right: 50px; background: rgba(245,158,11,0.95); color: white; padding: 4px 6px; border-radius: 6px; font-size: 12px; z-index: 7;';
                            imgContainer.appendChild(fallbackBadge);
                        }
                        // Atualizar badge principal para Catbox
                        const mainBadge = imgContainer.querySelector('.main-badge');
                        if (mainBadge) {
                            mainBadge.innerHTML = ICON_CATBOX;
                            mainBadge.title = 'Usando backup do Catbox (Twitter indisponível)';
                            mainBadge.style.background = '#667292';
                        }
                    }
                };
                imgContainer.appendChild(img);
            });

            // Indicador de status do backup
            if (!settings.hideOverlays) {
                const backupBadge = document.createElement('div');
                backupBadge.className = 'main-badge';
                if (hasMerged) {
                    // Mescla salva conta como backup principal
                    backupBadge.innerHTML = ICON_CATBOX;
                    backupBadge.title = 'Mescla salva no Catbox';
                    backupBadge.style = 'position: absolute; top: 10px; right: 10px; background: #667292; color: white; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 6; cursor: help;';
                    imgContainer.appendChild(backupBadge);
                } else if (backupCount > 0 && fallbackCount === 0) {
                    // Todo backup OK (Catbox)
                    backupBadge.innerHTML = ICON_CATBOX;
                    backupBadge.title = 'Imagens salvas no Catbox';
                    backupBadge.style = 'position: absolute; top: 10px; right: 10px; background: #667292; color: white; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 6; cursor: help;';
                    imgContainer.appendChild(backupBadge);
                } else if (fallbackCount > 0 && backupCount > 0) {
                    // Mix de backup e fallback
                    backupBadge.innerHTML = `${ICON_CLOUD_OFF} <span style="margin-left: 4px;">${backupCount}/${originalNumImgs}</span>`;
                    backupBadge.title = `${backupCount} de ${originalNumImgs} imagens no Catbox`;
                    backupBadge.style = 'position: absolute; top: 10px; right: 10px; background: rgba(245,158,11,0.95); color: white; padding: 6px 8px; border-radius: 8px; font-size: 10px; display: flex; align-items: center; z-index: 6; cursor: help;';
                    imgContainer.appendChild(backupBadge);
                } else if (fallbackCount > 0) {
                    // Sem backup (Twitter)
                    backupBadge.innerHTML = ICON_TWITTER;
                    backupBadge.title = 'Usando imagens do Twitter (sem backup)';
                    backupBadge.style = 'position: absolute; top: 10px; right: 10px; background: rgba(113,118,123,0.95); color: white; padding: 6px; border-radius: 8px; font-size: 10px; display: flex; align-items: center; justify-content: center; z-index: 6; cursor: help;';
                    imgContainer.appendChild(backupBadge);
                }

                if (hasMerged) {
                    const mergeBadge = document.createElement('div');
                    mergeBadge.className = 'merge-badge';
                    mergeBadge.innerHTML = ICON_MERGE;
                    mergeBadge.title = 'Imagem mesclada salva';
                    mergeBadge.style = 'position: absolute; top: 10px; right: 10px; background: rgba(245,158,11,0.95); color: white; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center; z-index: 7; cursor: help;';

                    const hasMainBadge = !!imgContainer.querySelector('.main-badge');
                    if (hasMainBadge) {
                        mergeBadge.style.right = '46px';
                    }

                    imgContainer.appendChild(mergeBadge);
                }
            }

            // Tags do bookmark - posicionadas na parte inferior do imgContainer
            if (!settings.hideOverlays && b.tags && b.tags.length > 0) {
                const tagBadges = document.createElement('div');
                tagBadges.style = 'position: absolute; bottom: 10px; left: 10px; display: flex; flex-wrap: wrap; gap: 5px; max-width: calc(100% - 20px); z-index: 5;';
                b.tags.forEach(tag => {
                    const badge = document.createElement('span');
                    badge.innerText = tag;
                    badge.style = 'background: rgba(29,155,240,0.7); color: white; padding: 3px 8px; border-radius: 10px; font-size: 11px; text-align: center; display: inline-flex; align-items: center; justify-content: center;';
                    tagBadges.appendChild(badge);
                });
                imgContainer.appendChild(tagBadges);
            }

            // User info bar (Nome + @ com avatar) - posicionado no topo da imagem
            if (!settings.hideOverlays && settings.showUserLabel) {
                const userBar = document.createElement('div');
                userBar.style = 'position: absolute; top: 10px; left: 10px; display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.7); padding: 5px 10px; border-radius: 20px; max-width: calc(100% - 110px); z-index: 5;';

                if (b.userAvatar) {
                    const avatar = document.createElement('img');
                    avatar.src = b.userAvatar;
                    avatar.style = 'width: 24px; height: 24px; border-radius: 50%; object-fit: cover;';
                    userBar.appendChild(avatar);
                }

                const userText = document.createElement('span');
                const displayName = b.userName || '';
                const handle = extractHandle(b.postUrl);
                userText.innerText = displayName ? `${displayName} (@${handle})` : `@${handle}`;
                userText.style = 'color: white; font-size: 12px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
                userBar.appendChild(userText);

                imgContainer.appendChild(userBar);
            }

            const actions = document.createElement('div');
            actions.style = 'padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; background: #15181c; gap: 8px;';

            const infoCol = document.createElement('div');
            infoCol.style = 'display: flex; flex-direction: column; gap: 2px; overflow: hidden; flex: 1;';

            const postDateInfo = document.createElement('span');
            postDateInfo.innerHTML = `${ICON_CALENDAR} Postado: ${formatDate(b.postDate)}`;
            postDateInfo.style = 'color: #666; font-size: 10px; display: flex; align-items: center; gap: 4px;';

            const addDateInfo = document.createElement('span');
            addDateInfo.innerHTML = `${ICON_DOWNLOAD} Adicionado: ${formatDate(b.timestamp)}`;
            addDateInfo.style = 'color: #666; font-size: 10px; display: flex; align-items: center; gap: 4px;';

            infoCol.appendChild(postDateInfo);
            infoCol.appendChild(addDateInfo);

            // Checkbox de seleção
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = selectedItems.has(b.id);
            checkbox.style = 'width: 18px; height: 18px; cursor: pointer; accent-color: #1d9bf0;';
            checkbox.onclick = (e) => {
                e.stopPropagation();
                if (checkbox.checked) {
                    selectedItems.add(b.id);
                } else {
                    selectedItems.delete(b.id);
                }
                updateBulkUI();
            };

            // Botão Ver Post
            const ICON_LINK_SMALL = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
            const viewPostBtn = document.createElement('button');
            viewPostBtn.innerHTML = ICON_LINK_SMALL;
            viewPostBtn.title = 'Abrir post original';
            viewPostBtn.style = 'background: transparent; border: 1px solid #333; color: #888; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;';
            viewPostBtn.onmouseenter = () => { viewPostBtn.style.borderColor = '#1d9bf0'; viewPostBtn.style.color = '#1d9bf0'; };
            viewPostBtn.onmouseleave = () => { viewPostBtn.style.borderColor = '#333'; viewPostBtn.style.color = '#888'; };
            viewPostBtn.onclick = (e) => { e.stopPropagation(); window.open(b.postUrl, '_blank'); };

            // Botão Editar Links
            const editLinksBtn = document.createElement('button');
            editLinksBtn.innerHTML = ICON_PENCIL_SMALL;
            editLinksBtn.title = 'Editar links das imagens';
            editLinksBtn.style = 'background: transparent; border: 1px solid #333; color: #888; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;';
            editLinksBtn.onmouseenter = () => { editLinksBtn.style.borderColor = '#f97316'; editLinksBtn.style.color = '#f97316'; };
            editLinksBtn.onmouseleave = () => { editLinksBtn.style.borderColor = '#333'; editLinksBtn.style.color = '#888'; };
            editLinksBtn.onclick = (e) => {
                e.stopPropagation();
                showEditLinksModal(b, () => {
                    updateGalleryContent();
                });
            };

            actions.appendChild(checkbox);
            actions.appendChild(infoCol);
            actions.appendChild(editLinksBtn);
            actions.appendChild(viewPostBtn);
            item.appendChild(imgContainer);
            item.appendChild(actions);
            container.appendChild(item);
        });
    }

    // ==================== BULK ACTIONS ====================
    function updateBulkUI() {
        const bulkContainer = document.getElementById('x-bookmark-bulk-actions');
        const bulkInfo = document.getElementById('x-bookmark-bulk-info');
        if (bulkContainer && bulkInfo) {
            const count = selectedItems.size;
            if (count > 0) {
                bulkContainer.style.display = 'flex';
                bulkInfo.innerText = count === 1 ? '1 item selecionado' : `${count} itens selecionados`;
            } else {
                bulkContainer.style.display = 'none';
            }
        }
    }

    function bulkDelete() {
        if (selectedItems.size === 0) return;
        const count = selectedItems.size;

        showConfirmModal(`Deseja excluir ${count} bookmark(s)?`, () => {
            const bookmarks = getBookmarks().filter(b => !selectedItems.has(b.id));
            saveBookmarks(bookmarks);
            selectedItems.clear();
            updateGalleryContent();
            updateBulkUI();
            showToast(`${count} bookmark(s) excluído(s)`);
        });
    }

    function bulkAddTag() {
        if (selectedItems.size === 0) return;

        const tags = getTags();
        if (tags.length === 0) {
            alert('Nenhuma tag disponível. Crie uma primeiro!');
            return;
        }

        // Encontrar tags comuns a TODOS os itens selecionados
        const bookmarks = getBookmarks();
        const selectedBookmarks = bookmarks.filter(b => selectedItems.has(b.id));
        const commonTags = new Set();
        tags.forEach(tag => {
            if (selectedBookmarks.every(b => (b.tags || []).includes(tag))) {
                commonTags.add(tag);
            }
        });

        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10001;
            display: flex; justify-content: center; align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background: #15181c; padding: 25px; border-radius: 16px;
            width: 400px; max-width: 90%; color: white; border: 1px solid #333;
        `;

        const title = document.createElement('h3');
        title.innerText = `Gerenciar Tags (${selectedItems.size} item(s))`;
        title.style = 'margin: 0 0 10px 0; color: #1d9bf0;';
        modal.appendChild(title);

        const hint = document.createElement('p');
        hint.innerText = 'Clique para adicionar/remover tag de todos os selecionados';
        hint.style = 'margin: 0 0 20px 0; color: #888; font-size: 12px;';
        modal.appendChild(hint);

        const tagContainer = document.createElement('div');
        tagContainer.style = 'display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;';

        const selectedTags = new Set(commonTags);

        tags.forEach(tag => {
            const chip = document.createElement('button');
            chip.innerText = tag;
            const isSelected = selectedTags.has(tag);
            chip.style = `
                padding: 8px 16px; border-radius: 20px; border: 1px solid #333;
                cursor: pointer; transition: all 0.2s;
                background: ${isSelected ? '#1d9bf0' : '#222'};
                color: ${isSelected ? 'white' : '#888'};
            `;
            chip.onclick = () => {
                if (selectedTags.has(tag)) {
                    selectedTags.delete(tag);
                    chip.style.background = '#222';
                    chip.style.color = '#888';
                } else {
                    selectedTags.add(tag);
                    chip.style.background = '#1d9bf0';
                    chip.style.color = 'white';
                }
            };
            tagContainer.appendChild(chip);
        });
        modal.appendChild(tagContainer);

        const btnRow = document.createElement('div');
        btnRow.style = 'display: flex; gap: 10px;';

        const applyBtn = document.createElement('button');
        applyBtn.innerText = 'Aplicar';
        applyBtn.style = 'flex: 1; background: #1d9bf0; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; text-align: center;';
        applyBtn.onclick = () => {
            const count = selectedItems.size;
            const bks = getBookmarks();
            let added = 0, removed = 0;

            bks.forEach(b => {
                if (selectedItems.has(b.id)) {
                    if (!b.tags) b.tags = [];

                    // Adicionar novas tags
                    selectedTags.forEach(tag => {
                        if (!b.tags.includes(tag)) {
                            b.tags.push(tag);
                            added++;
                        }
                    });

                    // Remover tags desmarcadas (que estavam em commonTags)
                    commonTags.forEach(tag => {
                        if (!selectedTags.has(tag) && b.tags.includes(tag)) {
                            b.tags = b.tags.filter(t => t !== tag);
                            removed++;
                        }
                    });
                }
            });

            saveBookmarks(bks);
            selectedItems.clear();
            overlay.remove();
            updateGalleryContent();
            updateBulkUI();

            let msg = 'Tags atualizadas';
            if (added > 0 && removed > 0) msg = `${added} tag(s) adicionada(s), ${removed} removida(s)`;
            else if (added > 0) msg = `${added} tag(s) adicionada(s)`;
            else if (removed > 0) msg = `${removed} tag(s) removida(s)`;
            showToast(msg);
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancelar';
        cancelBtn.style = 'flex: 1; background: #333; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; text-align: center;';
        cancelBtn.onclick = () => overlay.remove();

        btnRow.appendChild(cancelBtn);
        btnRow.appendChild(applyBtn);
        modal.appendChild(btnRow);

        overlay.appendChild(modal);
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        document.body.appendChild(overlay);
    }

    function showDetails(bookmark) {
        const detailModal = document.createElement('div');
        detailModal.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.98); z-index: 10000;
            display: flex; flex-direction: column; align-items: center;
            padding: 40px; overflow-y: auto; color: white;
        `;

        let mergedPreviewObjectUrl = null;
        let showingMerged = false;

        const cleanupMergedPreview = () => {
            if (mergedPreviewObjectUrl) {
                URL.revokeObjectURL(mergedPreviewObjectUrl);
                mergedPreviewObjectUrl = null;
            }
        };

        const header = document.createElement('div');
        header.style = 'width: 100%; max-width: 1200px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;';

        const titleEl = document.createElement('h3');
        titleEl.innerText = 'Imagens do Post';
        titleEl.style = 'margin: 0; font-size: 20px; color: #1d9bf0;';
        header.appendChild(titleEl);

        const btnContainer = document.createElement('div');
        btnContainer.style = 'display: flex; gap: 10px;';

        // Botão Editar Links
        const editLinksBtn = document.createElement('button');
        editLinksBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> <span>Editar Links</span>`;
        editLinksBtn.style = 'background: transparent; color: #1d9bf0; border: 1px solid #1d9bf0; padding: 10px 20px; cursor: pointer; border-radius: 9999px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: all 0.2s;';
        editLinksBtn.onmouseenter = () => { editLinksBtn.style.background = 'rgba(29,155,240,0.1)'; };
        editLinksBtn.onmouseleave = () => { editLinksBtn.style.background = 'transparent'; };
        editLinksBtn.onclick = () => showEditLinksModal(bookmark, () => {
            cleanupMergedPreview();
            detailModal.remove();
            // Reabrir com dados atualizados
            const updatedBookmarks = getBookmarks();
            const updatedBookmark = updatedBookmarks.find(b => b.id === bookmark.id);
            if (updatedBookmark) showDetails(updatedBookmark);
            updateGalleryContent();
        });
        btnContainer.appendChild(editLinksBtn);

        const imgList = document.createElement('div');
        imgList.style = 'display: flex; flex-wrap: wrap; gap: 20px; width: 100%; max-width: 1200px; padding-bottom: 50px; justify-content: center;';

        const renderOriginalImages = () => {
            imgList.innerHTML = '';

            bookmark.images.forEach((src, idx) => {
                const item = document.createElement('div');
                item.style = 'background: #15181c; border-radius: 16px; overflow: hidden; border: 1px solid #333; width: 280px;';

                const img = document.createElement('img');
                // Usar formatTwitterUrl para garantir 4k
                img.src = formatTwitterUrl(src);
                img.style = 'width: 100%; height: 280px; object-fit: cover; cursor: pointer; display: block;';

                // Chain fallback: 4k → large → Catbox
                img.onerror = () => {
                    const failedUrl = img.src;
                    const debugMode = getSettings().debugMode;

                    if (img.src.includes('name=4096x4096')) {
                        // Tentar large
                        if (debugMode) {
                            console.log('[X-Bookmark] Details: 4k failed, trying large | URL:', failedUrl);
                        } else {
                            console.log('[X-Bookmark] Details: 4k failed, trying large');
                        }
                        img.src = img.src.replace('name=4096x4096', 'name=large');
                    } else if (bookmark.catboxUrls?.[idx]) {
                        // Fallback para Catbox
                        if (debugMode) {
                            console.log('[X-Bookmark] Details: Large failed, using Catbox | Failed URL:', failedUrl, '| Catbox:', bookmark.catboxUrls[idx]);
                        } else {
                            console.log('[X-Bookmark] Details: Large failed, using Catbox');
                        }
                        img.src = bookmark.catboxUrls[idx];
                    }
                };

                img.onclick = () => window.open(img.src, '_blank');

                item.appendChild(img);
                imgList.appendChild(item);
            });
        };

        const renderMergedPreview = (url, mergeInfo = null) => {
            imgList.innerHTML = '';

            const item = document.createElement('div');
            item.style = 'background: #15181c; border-radius: 16px; overflow: hidden; border: 1px solid #333; width: min(100%, 1200px);';

            const meta = document.createElement('div');
            meta.style = 'padding: 12px 16px; color: #f59e0b; font-size: 12px; border-bottom: 1px solid #2a2a2a;';
            if (mergeInfo && mergeInfo.width && mergeInfo.height) {
                meta.innerText = `${bookmark.images.length} imagens mescladas • ${mergeInfo.width}x${mergeInfo.height}`;
            } else {
                meta.innerText = `${bookmark.images.length} imagens mescladas • versão salva`;
            }

            const img = document.createElement('img');
            img.src = url;
            img.style = 'width: 100%; height: auto; display: block; cursor: pointer;';
            img.onclick = () => window.open(url, '_blank');

            item.appendChild(meta);
            item.appendChild(img);
            imgList.appendChild(item);
        };

        if ((bookmark.images?.length || 0) > 1) {
            const mergeBtn = document.createElement('button');
            const getMergeIdleLabel = () => bookmark.mergedImageUrl
                ? `${ICON_MERGE} <span>Ver Mesclada Salva</span>`
                : `${ICON_MERGE} <span>Mesclar Imagens</span>`;

            mergeBtn.innerHTML = getMergeIdleLabel();
            mergeBtn.style = 'background: transparent; color: #f59e0b; border: 1px solid #f59e0b; padding: 10px 20px; cursor: pointer; border-radius: 9999px; font-weight: bold; display: flex; align-items: center; gap: 6px; transition: all 0.2s;';
            mergeBtn.onmouseenter = () => { mergeBtn.style.background = 'rgba(245,158,11,0.12)'; };
            mergeBtn.onmouseleave = () => { mergeBtn.style.background = 'transparent'; };
            mergeBtn.onclick = async () => {
                if (showingMerged) {
                    showingMerged = false;
                    titleEl.innerText = 'Imagens do Post';
                    mergeBtn.innerHTML = getMergeIdleLabel();
                    renderOriginalImages();
                    return;
                }

                if (bookmark.mergedImageUrl) {
                    showingMerged = true;
                    titleEl.innerText = 'Imagem Mesclada Salva';
                    renderMergedPreview(bookmark.mergedImageUrl, null);
                    mergeBtn.innerHTML = `${ICON_GRID} <span>Ver Originais</span>`;
                    return;
                }

                mergeBtn.disabled = true;
                mergeBtn.style.opacity = '0.65';
                mergeBtn.innerHTML = `${ICON_MERGE} <span>Mesclando...</span>`;

                try {
                    const mergeInfo = await mergeBookmarkImages(bookmark);
                    if (!mergeInfo) {
                        mergeBtn.innerHTML = getMergeIdleLabel();
                        return;
                    }

                    mergeBtn.innerHTML = `${ICON_CLOUD} <span>Salvando...</span>`;
                    const savedMergedUrl = await saveMergedImageToGallery(bookmark, mergeInfo);

                    cleanupMergedPreview();
                    let previewUrl = savedMergedUrl;
                    if (!previewUrl) {
                        mergedPreviewObjectUrl = URL.createObjectURL(mergeInfo.blob);
                        previewUrl = mergedPreviewObjectUrl;
                    }

                    showingMerged = true;
                    titleEl.innerText = savedMergedUrl ? 'Imagem Mesclada Salva' : 'Imagem Mesclada';
                    renderMergedPreview(previewUrl, mergeInfo);
                    mergeBtn.innerHTML = `${ICON_GRID} <span>Ver Originais</span>`;
                    showToast(savedMergedUrl ? 'Mescla salva na galeria' : 'Mescla criada (não foi possível salvar)');
                    updateGalleryContent();
                } catch (saveError) {
                    console.error('[X-Bookmark] Falha ao salvar mescla na galeria:', saveError);
                    showToast(`Erro ao salvar mescla: ${saveError.message || 'falha desconhecida'}`);
                    mergeBtn.innerHTML = getMergeIdleLabel();
                } finally {
                    mergeBtn.disabled = false;
                    mergeBtn.style.opacity = '1';
                }
            };

            if (bookmark.mergedImageUrl) {
                showingMerged = true;
                titleEl.innerText = 'Imagem Mesclada Salva';
                renderMergedPreview(bookmark.mergedImageUrl, null);
                mergeBtn.innerHTML = `${ICON_GRID} <span>Ver Originais</span>`;
            }

            btnContainer.appendChild(mergeBtn);
        }

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Voltar';
        closeBtn.style = 'background: #333; color: white; border: none; padding: 10px 25px; cursor: pointer; border-radius: 9999px; font-weight: bold;';
        closeBtn.onclick = () => {
            cleanupMergedPreview();
            detailModal.remove();
        };
        btnContainer.appendChild(closeBtn);

        header.appendChild(btnContainer);
        detailModal.appendChild(header);

        if (!showingMerged) {
            renderOriginalImages();
        }

        detailModal.appendChild(imgList);
        document.body.appendChild(detailModal);
    }

    // Modal de edição de links do bookmark - Interface melhorada
    async function showEditLinksModal(bookmark, onSave) {
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 10001;
            display: flex; justify-content: center; align-items: center;
            animation: fadeIn 0.2s ease;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background: linear-gradient(145deg, #15181c 0%, #1a1d21 100%);
            padding: 0; border-radius: 20px;
            width: 650px; max-width: 95%; max-height: 85vh;
            color: white; border: 1px solid #2a2a2a;
            position: relative; display: flex; flex-direction: column;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            animation: slideUp 0.3s ease;
        `;

        // Header do modal
        const header = document.createElement('div');
        header.style = `
            padding: 25px 25px 20px 25px;
            border-bottom: 1px solid #2a2a2a;
            background: linear-gradient(180deg, rgba(29,155,240,0.08) 0%, transparent 100%);
            flex-shrink: 0;
        `;

        const headerTop = document.createElement('div');
        headerTop.style = 'display: flex; justify-content: space-between; align-items: flex-start;';

        const titleSection = document.createElement('div');

        const titleRow = document.createElement('div');
        titleRow.style = 'display: flex; align-items: center; gap: 12px; margin-bottom: 8px;';

        const iconCircle = document.createElement('div');
        iconCircle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
        iconCircle.style = `
            width: 44px; height: 44px; border-radius: 12px;
            background: linear-gradient(135deg, #1d9bf0 0%, #0d8bd9 100%);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(29,155,240,0.3);
        `;

        const title = document.createElement('h3');
        title.innerText = 'Editar Links';
        title.style = 'margin: 0; color: white; font-size: 20px; font-weight: 600;';

        titleRow.appendChild(iconCircle);
        titleRow.appendChild(title);
        titleSection.appendChild(titleRow);

        const subtitle = document.createElement('p');
        subtitle.innerText = 'Gerencie as URLs das imagens deste bookmark';
        subtitle.style = 'margin: 0; color: #666; font-size: 13px; margin-left: 56px;';
        titleSection.appendChild(subtitle);

        headerTop.appendChild(titleSection);

        // Botão X de fechar
        const closeX = document.createElement('button');
        closeX.innerHTML = ICON_X.replace('width="16"', 'width="20"').replace('height="16"', 'height="20"');
        closeX.style = `
            background: rgba(255,255,255,0.05); border: none; color: #666;
            cursor: pointer; padding: 10px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s;
        `;
        closeX.onmouseenter = () => { closeX.style.color = 'white'; closeX.style.background = 'rgba(255,255,255,0.1)'; };
        closeX.onmouseleave = () => { closeX.style.color = '#666'; closeX.style.background = 'rgba(255,255,255,0.05)'; };
        closeX.onclick = () => overlay.remove();
        headerTop.appendChild(closeX);

        header.appendChild(headerTop);
        modal.appendChild(header);

        // Corpo do modal
        const body = document.createElement('div');
        body.style = 'padding: 25px; overflow-y: auto; flex: 1; min-height: 0;';

        // Estado local das URLs
        let editedImages = [...(bookmark.images || [])];
        let hasChanges = false;

        // Container das URLs
        const urlContainer = document.createElement('div');
        urlContainer.style = 'display: flex; flex-direction: column; gap: 12px;';

        function renderUrls() {
            urlContainer.innerHTML = '';

            if (editedImages.length === 0) {
                const emptyState = document.createElement('div');
                emptyState.style = 'text-align: center; padding: 30px; color: #555;';
                emptyState.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px; opacity: 0.5;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <p style="margin: 0; font-size: 14px;">Nenhuma imagem adicionada</p>
                `;
                urlContainer.appendChild(emptyState);
                return;
            }

            editedImages.forEach((url, idx) => {
                const card = document.createElement('div');
                card.style = `
                    background: #1e2126; border: 1px solid #2a2a2a; border-radius: 12px;
                    padding: 14px; display: flex; gap: 12px; align-items: center;
                    transition: all 0.2s; animation: ruleSlideIn 0.2s ease;
                `;
                card.onmouseenter = () => { card.style.borderColor = '#3a3a3a'; card.style.background = '#252830'; };
                card.onmouseleave = () => { card.style.borderColor = '#2a2a2a'; card.style.background = '#1e2126'; };

                // Thumbnail preview
                const thumbContainer = document.createElement('div');
                thumbContainer.style = `
                    width: 60px; height: 60px; border-radius: 8px; overflow: hidden;
                    background: #15181c; flex-shrink: 0; position: relative;
                `;

                const thumb = document.createElement('img');
                thumb.src = formatTwitterUrl(url) || '';
                thumb.style = 'width: 100%; height: 100%; object-fit: cover;';
                thumb.onerror = () => {
                    thumbContainer.innerHTML = `
                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #2a2a2a;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </div>
                    `;
                };
                thumbContainer.appendChild(thumb);

                // Número do índice
                const indexBadge = document.createElement('div');
                indexBadge.innerText = idx + 1;
                indexBadge.style = `
                    position: absolute; top: 4px; left: 4px;
                    background: rgba(0,0,0,0.7); color: white;
                    font-size: 10px; font-weight: bold;
                    padding: 2px 6px; border-radius: 4px;
                `;
                thumbContainer.appendChild(indexBadge);

                card.appendChild(thumbContainer);

                // Input container
                const inputContainer = document.createElement('div');
                inputContainer.style = 'flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0;';

                const inputLabel = document.createElement('label');
                inputLabel.innerText = `Imagem ${idx + 1}`;
                inputLabel.style = 'color: #888; font-size: 11px; font-weight: 500;';
                inputContainer.appendChild(inputLabel);

                const input = document.createElement('input');
                input.type = 'text';
                input.value = url;
                input.placeholder = 'Cole a URL da imagem...';
                input.style = `
                    width: 100%; padding: 10px 12px; border-radius: 8px;
                    border: 1px solid #333; background: #15181c; color: white;
                    font-size: 12px; font-family: monospace; box-sizing: border-box;
                    transition: border-color 0.2s, box-shadow 0.2s;
                `;
                input.onfocus = () => { input.style.borderColor = '#1d9bf0'; input.style.boxShadow = '0 0 0 3px rgba(29,155,240,0.15)'; };
                input.onblur = () => { input.style.borderColor = '#333'; input.style.boxShadow = 'none'; };
                input.oninput = () => {
                    editedImages[idx] = input.value.trim();
                    hasChanges = true;
                    // Atualizar thumbnail
                    if (input.value.trim()) {
                        thumb.src = formatTwitterUrl(input.value.trim());
                    }
                };
                inputContainer.appendChild(input);

                card.appendChild(inputContainer);

                // Botões de ação
                const actionsContainer = document.createElement('div');
                actionsContainer.style = 'display: flex; gap: 6px; flex-shrink: 0;';

                // Botão de abrir em nova aba
                const openBtn = document.createElement('button');
                openBtn.innerHTML = ICON_EXTERNAL_LINK;
                openBtn.title = 'Abrir em nova aba';
                openBtn.style = `
                    background: transparent; border: 1px solid #333; color: #666;
                    padding: 10px; border-radius: 8px; cursor: pointer; display: flex;
                    transition: all 0.2s;
                `;
                openBtn.onmouseenter = () => { openBtn.style.borderColor = '#1d9bf0'; openBtn.style.color = '#1d9bf0'; };
                openBtn.onmouseleave = () => { openBtn.style.borderColor = '#333'; openBtn.style.color = '#666'; };
                openBtn.onclick = () => {
                    if (input.value.trim()) window.open(formatTwitterUrl(input.value.trim()), '_blank');
                };
                actionsContainer.appendChild(openBtn);

                // Botão de remover
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = ICON_TRASH;
                removeBtn.title = 'Remover imagem';
                removeBtn.style = `
                    background: transparent; border: 1px solid #333; color: #666;
                    padding: 10px; border-radius: 8px; cursor: pointer; display: flex;
                    transition: all 0.2s;
                `;
                removeBtn.onmouseenter = () => { removeBtn.style.borderColor = '#f4212e'; removeBtn.style.color = '#f4212e'; removeBtn.style.background = 'rgba(244,33,46,0.1)'; };
                removeBtn.onmouseleave = () => { removeBtn.style.borderColor = '#333'; removeBtn.style.color = '#666'; removeBtn.style.background = 'transparent'; };
                removeBtn.onclick = () => {
                    editedImages.splice(idx, 1);
                    hasChanges = true;
                    renderUrls();
                };
                actionsContainer.appendChild(removeBtn);

                card.appendChild(actionsContainer);
                urlContainer.appendChild(card);
            });
        }
        renderUrls();
        body.appendChild(urlContainer);

        // Botão adicionar nova URL
        const addBtn = document.createElement('button');
        addBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            <span>Adicionar Nova Imagem</span>
        `;
        addBtn.style = `
            width: 100%; margin-top: 16px; padding: 14px;
            background: transparent; border: 2px dashed #333;
            border-radius: 12px; color: #666; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            font-size: 14px; transition: all 0.2s;
        `;
        addBtn.onmouseenter = () => { addBtn.style.borderColor = '#1d9bf0'; addBtn.style.color = '#1d9bf0'; addBtn.style.background = 'rgba(29,155,240,0.05)'; };
        addBtn.onmouseleave = () => { addBtn.style.borderColor = '#333'; addBtn.style.color = '#666'; addBtn.style.background = 'transparent'; };
        addBtn.onclick = () => {
            editedImages.push('');
            hasChanges = true;
            renderUrls();
            // Scroll to bottom
            setTimeout(() => body.scrollTop = body.scrollHeight, 100);
        };
        body.appendChild(addBtn);

        modal.appendChild(body);

        // Footer com aviso e botões
        const footer = document.createElement('div');
        footer.style = 'padding: 20px 25px; border-top: 1px solid #2a2a2a; background: #15181c; flex-shrink: 0;';

        // Aviso sobre catbox - AMARELO para chamar atenção
        if (bookmark.catboxUrls && bookmark.catboxUrls.some(u => u && u.startsWith('https://'))) {
            const warning = document.createElement('div');
            warning.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    <div>
                        <div style="color: #eab308; font-size: 13px; font-weight: 500;">Backup detectado</div>
                        <div style="color: #a3a310; font-size: 11px;">Editar links invalidará os backups atuais do Catbox</div>
                    </div>
                </div>
            `;
            warning.style = `
                background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.3);
                border-radius: 10px; padding: 12px 14px; margin-bottom: 16px;
            `;
            footer.appendChild(warning);
        }

        // Botões de ação
        const btnRow = document.createElement('div');
        btnRow.style = 'display: flex; gap: 12px;';

        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = 'Cancelar';
        cancelBtn.style = `
            flex: 1; background: #2a2a2a; color: white; border: none;
            padding: 12px 20px; border-radius: 10px; cursor: pointer;
            font-size: 14px; font-weight: 500; transition: all 0.2s;
            text-align: center;
        `;
        cancelBtn.onmouseenter = () => { cancelBtn.style.background = '#3a3a3a'; };
        cancelBtn.onmouseleave = () => { cancelBtn.style.background = '#2a2a2a'; };
        cancelBtn.onclick = () => overlay.remove();
        btnRow.appendChild(cancelBtn);

        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'Salvar';
        saveBtn.style = `
            flex: 1; background: #1d9bf0; color: white; border: none;
            padding: 12px 20px; border-radius: 10px; cursor: pointer;
            font-size: 14px; font-weight: 600; transition: all 0.2s;
            text-align: center;
        `;
        saveBtn.onmouseenter = () => { saveBtn.style.background = '#1a8cd8'; };
        saveBtn.onmouseleave = () => { saveBtn.style.background = '#1d9bf0'; };
        saveBtn.onclick = async () => {
            // Filtrar URLs vazias
            const cleanedImages = editedImages.filter(u => u && u.trim() !== '');

            if (cleanedImages.length === 0) {
                showToast('Adicione pelo menos uma URL');
                return;
            }

            // Verificar se há backups antigos que precisam ser tratados
            const oldCatboxUrls = bookmark.catboxUrls || [];
            const hasOldBackups = oldCatboxUrls.some(u => u && u.startsWith('https://'));

            if (hasChanges && hasOldBackups) {
                const settings = getSettings();

                if (settings.catboxUserhash) {
                    // Perguntar o que fazer com backups antigos
                    const choice = await showChoiceModal('O que fazer com os arquivos antigos no Catbox?', [
                        { label: 'Deletar arquivos antigos', value: 'delete', bg: '#f4212e', bold: true },
                        { label: 'Manter arquivos no Catbox', value: 'keep', bg: '#333' },
                        { label: 'Cancelar', value: 'cancel', color: '#888' }
                    ]);

                    if (choice === 'cancel' || choice === null) return;

                    if (choice === 'delete') {
                        // Extrair file IDs e deletar
                        const filesToDelete = oldCatboxUrls.filter(u => u && u.startsWith('https://'));
                        const fileIds = filesToDelete.map(u => u.split('/').pop());

                        if (fileIds.length > 0) {
                            // Log das imagens sendo deletadas
                            console.log('[X-Bookmark] Deleting old Catbox files:');
                            filesToDelete.forEach((url, i) => {
                                console.log(`[X-Bookmark]   ${i + 1}. ${url}`);
                            });
                            console.log(`[X-Bookmark] File IDs to delete: ${fileIds.join(', ')}`);

                            showToast('Deletando arquivos antigos...');
                            const result = await deleteFromCatbox(fileIds);
                            console.log('[X-Bookmark] Delete completed:', result);
                        }
                    }
                }
            }

            // Atualizar bookmark
            const bookmarks = getBookmarks();
            const idx = bookmarks.findIndex(b => b.id === bookmark.id);
            if (idx !== -1) {
                // Normalizar URLs para 4k
                bookmarks[idx].images = cleanedImages.map(formatTwitterUrl);
                // Limpar catboxUrls pois o conteúdo mudou
                if (hasChanges) {
                    bookmarks[idx].catboxUrls = [];
                }
                saveBookmarks(bookmarks);
                showToast('Links atualizados com sucesso');
            }

            overlay.remove();
            if (onSave) onSave();
        };
        btnRow.appendChild(saveBtn);

        footer.appendChild(btnRow);
        modal.appendChild(footer);

        overlay.appendChild(modal);
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        document.body.appendChild(overlay);
    }

    // ==================== PREVIEW POPUP ====================
    let previewEl = null;

    function showPreview(e, src) {
        if (!src) return;
        hidePreview();

        previewEl = document.createElement('div');
        previewEl.style = `
            position: fixed; z-index: 10002; pointer-events: none;
            background: #000; border: 2px solid #1d9bf0; border-radius: 12px;
            padding: 5px; box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        `;

        const img = document.createElement('img');
        img.src = src;
        img.style = 'max-width: 400px; max-height: 400px; border-radius: 8px; display: block;';
        previewEl.appendChild(img);

        document.body.appendChild(previewEl);

        // Posicionar - garantir que fique dentro da tela
        const rect = e.target.getBoundingClientRect();
        const previewHeight = 410; // max-height + padding
        const previewWidth = 420;

        let left = rect.right + 10;
        let top = rect.top;

        // Se não cabe à direita, mostra à esquerda
        if (left + previewWidth > window.innerWidth) {
            left = rect.left - previewWidth - 10;
        }

        // Se não cabe embaixo, ajusta pra cima
        if (top + previewHeight > window.innerHeight) {
            top = window.innerHeight - previewHeight - 10;
        }

        // Garantir que não fique negativo
        if (top < 10) top = 10;
        if (left < 10) left = 10;

        previewEl.style.left = left + 'px';
        previewEl.style.top = top + 'px';
    }

    function hidePreview() {
        if (previewEl) {
            previewEl.remove();
            previewEl = null;
        }
    }

    // ==================== INIT ====================
    GM_registerMenuCommand('Ver Meus Bookmarks', createGalleryModal);

    const observer = new MutationObserver(() => {
        injectButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    injectButtons();

    // ==================== PERIODIC BACKUP SCAN ====================
    // Varredura periódica para fazer backup de bookmarks que têm auto-tag configurado
    async function periodicBackupScan(isInitial = false) {
        const settings = getSettings();

        // Só executa se backup automático estiver habilitado
        if (!settings.catboxAutoBackup || !settings.catboxUserhash) {
            console.log('[X-Bookmark] Periodic scan skipped: auto backup not configured');
            return;
        }

        const rules = getAutotagRules();
        if (rules.length === 0) {
            console.log('[X-Bookmark] Periodic scan skipped: no auto-tag rules');
            return;
        }

        // Notificação de início da varredura
        if (isInitial) {
            showToast('Varredura inicial de backup iniciada...');
        }

        // Coletar todos os @usernames das regras
        const autotagUsers = new Set(rules.map(r => r.username));

        const bookmarks = getBookmarks();
        const pendingBookmarks = [];

        console.log('[X-Bookmark] Scan config:', {
            autotagUsers: [...autotagUsers],
            filterTags: settings.catboxFilterTags || [],
            totalBookmarks: bookmarks.length
        });

        for (const bookmark of bookmarks) {
            const handle = '@' + extractHandle(bookmark.postUrl);
            const isAutotagUser = autotagUsers.has(handle);

            // Verificar se tem tags no filtro (se configurado)
            let matchesFilterTag = false;
            if (settings.catboxFilterTags && settings.catboxFilterTags.length > 0) {
                matchesFilterTag = bookmark.tags?.some(t => settings.catboxFilterTags.includes(t));
            }

            // Bookmark deve ser de usuário com auto-tag OU ter tag do filtro
            if (!isAutotagUser && !matchesFilterTag) {
                continue;
            }

            // Verificar se precisa de backup
            if (!bookmark.images || bookmark.images.length === 0) continue;

            // Verificar se já tem backup completo
            const needsBackup = !bookmark.catboxUrls ||
                bookmark.catboxUrls.length !== bookmark.images.length ||
                !bookmark.catboxUrls.every(url => url && url.startsWith('https://'));

            if (!needsBackup) continue;

            console.log('[X-Bookmark] Found pending:', {
                handle,
                tags: bookmark.tags,
                hasImages: bookmark.images?.length,
                hasCatbox: bookmark.catboxUrls?.length || 0,
                isAutotagUser,
                matchesFilterTag
            });

            pendingBookmarks.push(bookmark);
        }

        if (pendingBookmarks.length === 0) {
            console.log('[X-Bookmark] Periodic scan: all bookmarks already backed up');
            if (isInitial) {
                showToast('Varredura concluída: todos os backups em dia');
            }
            return;
        }

        console.log(`[X-Bookmark] Periodic scan: found ${pendingBookmarks.length} bookmark(s) needing backup`);
        showToast(`Varredura: ${pendingBookmarks.length} bookmark(s) pendente(s)`);

        // Fazer backup de cada um (com delay para não sobrecarregar)
        for (const bookmark of pendingBookmarks) {
            try {
                await backupBookmarkImages(bookmark.id);
                // Delay entre backups para evitar rate-limit
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error(`[X-Bookmark] Periodic backup failed for ${bookmark.id}:`, error);
            }
        }

        console.log('[X-Bookmark] Periodic scan completed');
        showToast(`Varredura concluída: ${pendingBookmarks.length} backup(s)`);
    }

    const BACKUP_SCAN_INTERVAL = 5 * 60 * 1000;

    // ==================== MIGRAÇÃO: Limpar URLs com pipe ====================
    function migrateCleanPipeUrls() {
        const bookmarks = getBookmarks();
        let migrated = 0;

        bookmarks.forEach(bookmark => {
            if (bookmark.images && Array.isArray(bookmark.images)) {
                bookmark.images = bookmark.images.map(url => {
                    if (url && url.includes('|')) {
                        migrated++;
                        // Pegar apenas a primeira URL (4k), ignorar o fallback
                        return url.split('|')[0];
                    }
                    return url;
                });
            }
        });

        if (migrated > 0) {
            saveBookmarks(bookmarks);
            console.log(`[X-Bookmark] Migração: ${migrated} URL(s) com pipe corrigida(s)`);
        }
    }

    // Executar migração imediatamente
    migrateCleanPipeUrls();

    // ==================== VERIFICAR LINKS CATBOX MORTOS ====================
    async function checkDeadCatboxLinks() {
        const bookmarks = getBookmarks();
        const catboxUrls = [];

        // Coletar todas as URLs do Catbox
        bookmarks.forEach(bookmark => {
            if (bookmark.catboxUrls && Array.isArray(bookmark.catboxUrls)) {
                bookmark.catboxUrls.forEach((url, idx) => {
                    if (url && url.startsWith('https://')) {
                        catboxUrls.push({
                        bookmarkId: bookmark.id,
                        postUrl: bookmark.postUrl,
                        imageIndex: idx,
                        deadCatboxUrl: url,
                        catboxUrl: url,
                        status: 'dead'
                    });
                    }
                });
            }
        });

        if (catboxUrls.length === 0) {
            showToast('Nenhum backup Catbox encontrado');
            return;
        }

        // Criar modal de progresso
        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 10003;
            display: flex; justify-content: center; align-items: center;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background: #15181c; padding: 30px; border-radius: 16px;
            width: 500px; max-width: 95%; color: white; text-align: center;
            border: 1px solid #2a2a2a;
        `;

        const title = document.createElement('h3');
        title.innerText = 'Verificando Links Catbox';
        title.style = 'margin: 0 0 20px 0;';

        const progressText = document.createElement('div');
        progressText.style = 'margin-bottom: 15px; color: #71767b;';
        progressText.innerText = `0 / ${catboxUrls.length}`;

        const progressBar = document.createElement('div');
        progressBar.style = 'width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden;';

        const progressFill = document.createElement('div');
        progressFill.style = 'width: 0%; height: 100%; background: #1d9bf0; transition: width 0.2s;';
        progressBar.appendChild(progressFill);

        const warningMsg = document.createElement('div');
        warningMsg.style = 'margin-top: 15px; font-size: 11px; color: #f59e0b; font-style: italic;';
        warningMsg.innerText = '⚠️ Isso pode demorar alguns minutos dependendo da quantidade de fotos. Não feche a aba.';

        const statusText = document.createElement('div');
        statusText.style = 'margin-top: 10px; font-size: 12px; color: #71767b;';

        modal.appendChild(title);
        modal.appendChild(progressText);
        modal.appendChild(progressBar);
        modal.appendChild(warningMsg);
        modal.appendChild(statusText);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const deadLinks = [];
        let checked = 0;
        let skipScan = false;

        // Atalho para pular scan (apenas para debug)
        const skipHandler = (e) => {
            if (e.key.toLowerCase() === 'd') {
                skipScan = true;
                statusText.innerText = 'PULANDO VERIFICAÇÃO...';
                document.removeEventListener('keydown', skipHandler);
            }
        };
        document.addEventListener('keydown', skipHandler);

        // Verificar cada URL
        for (const item of catboxUrls) {
            if (skipScan) {
                // Ao pular, marcar itens restantes como mortos para popular o relatório no debug
                deadLinks.push(item);
            } else {
                try {
                    statusText.innerText = `Verificando: ${item.catboxUrl.split('/').pop()}`;

                    const response = await fetch(item.catboxUrl, { method: 'HEAD', mode: 'no-cors' });
                    // Com no-cors não conseguimos ver o status, então vamos tentar de outra forma
                    // Usar uma imagem para testar
                    const isAlive = await new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve(true);
                        img.onerror = () => resolve(false);
                        img.src = item.catboxUrl;
                        // Timeout de 10 segundos
                        setTimeout(() => resolve(false), 10000);
                    });

                    if (!isAlive) {
                        deadLinks.push(item);
                    }
                } catch (e) {
                    deadLinks.push(item);
                }
            }

            checked++;
            progressText.innerText = `${checked} / ${catboxUrls.length}`;
            progressFill.style.width = `${(checked / catboxUrls.length) * 100}%`;
            
            // Pequeno delay para permitir o event loop processar a tecla D
            if (!skipScan) await new Promise(r => setTimeout(r, 50));
        }

        document.removeEventListener('keydown', skipHandler);
        overlay.remove();

        // Limpar relatório anterior e salvar apenas o atual (v2.6.45 - Sem duplicatas)
        // Garantir que todos os mortos tenham o status 'dead'
        deadLinks.forEach(item => item.status = 'dead');

        // Persistir IDs mortos conhecidos para bloquear reuso em uploads futuros
        const deadFileIds = deadLinks
            .map(item => extractCatboxFileId(item.deadCatboxUrl || item.catboxUrl))
            .filter(Boolean);
        if (deadFileIds.length) {
            rememberDeadFileIds(deadFileIds);
            console.log('[X-Bookmark] IDs mortos memorizados:', deadFileIds.join(', '));
        }

        // Salvar novo relatório (limpa o histórico de scans anteriores)
        GM_setValue(DEAD_REPORT_KEY, {
            timestamp: new Date().toISOString(),
            deadLinks: deadLinks,
            totalChecked: catboxUrls.length
        });

        // Mostrar resultado
        if (deadLinks.length === 0) {
            showToast(`Todos os ${catboxUrls.length} links estão funcionando!`);
        } else {
            showDeadLinksReport(deadLinks, catboxUrls.length);
        }
    }

    // Modal para mostrar relatório de links mortos - Versão Melhorada com Previews e Re-upload
    function showDeadLinksReport(deadLinks, totalChecked) {
        const safeDeadLinks = Array.isArray(deadLinks) ? deadLinks : [];
        const safeTotalChecked = Number.isFinite(totalChecked) ? totalChecked : safeDeadLinks.length;

        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 10003;
            display: flex; justify-content: center; align-items: center;
            animation: fadeIn 0.2s ease;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background: #15181c; padding: 0; border-radius: 20px;
            width: 700px; max-width: 95%; max-height: 85vh; color: white;
            border: 1px solid #2a2a2a; display: flex; flex-direction: column;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            animation: slideUp 0.3s ease;
        `;

        // Header
        const header = document.createElement('div');
        header.style = 'padding: 25px; border-bottom: 1px solid #2a2a2a; background: linear-gradient(180deg, rgba(244,33,46,0.08) 0%, transparent 100%);';
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(244,33,46,0.1); display: flex; align-items: center; justify-content: center; color: #f4212e;">
                    ${ICON_CLOUD_OFF}
                </div>
                <div>
                    <h3 style="margin: 0; color: #f4212e; font-size: 20px;">Relatório de Links Mortos</h3>
                    <p style="margin: 5px 0 0 0; color: #71767b; font-size: 13px;">
                        ${safeDeadLinks.length} de ${safeTotalChecked} links do Catbox estão inacessíveis
                    </p>
                </div>
            </div>
        `;

        // Body
        const body = document.createElement('div');
        body.style = 'padding: 0; overflow-y: auto; flex: 1;';

        const listContainer = document.createElement('div');
        listContainer.style = 'padding: 20px;';

        safeDeadLinks.forEach((item, reportIdx) => {
            const row = document.createElement('div');
            row.style = `
                display: flex; gap: 15px; padding: 15px;
                background: #1a1d21; border-radius: 12px;
                margin-bottom: 12px; border: 1px solid #333;
                align-items: center;
            `;

            // Preview Thumbnail
            const thumb = document.createElement('div');
            thumb.style = `
                width: 80px; height: 80px; border-radius: 8px;
                overflow: hidden; background: #000; flex-shrink: 0;
                border: 1px solid #444;
            `;
            const img = document.createElement('img');
            // Tentar pegar do Twitter original para o preview
            const bookmarks = getBookmarks();
            const bm = bookmarks.find(b => b.id === item.bookmarkId);
            img.src = bm ? formatTwitterUrl(bm.images[item.imageIndex]) : '';
            img.style = 'width: 100%; height: 100%; object-fit: cover;';
            img.onerror = () => {
                // Se o 4k falhar no preview, tenta o large
                if (img.src.includes('name=4096x4096')) {
                    img.src = img.src.replace('name=4096x4096', 'name=large');
                } else {
                    img.style.display = 'none';
                    thumb.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#444;font-size:20px;">X</div>';
                }
            };
            thumb.appendChild(img);

            // Info
            const info = document.createElement('div');
            info.style = 'flex: 1; min-width: 0;';

            const postLink = document.createElement('a');
            postLink.href = item.postUrl;
            postLink.target = '_blank';
            postLink.innerText = `Post Original: ${item.postUrl}`;
            postLink.style = 'color: #1d9bf0; font-size: 13px; font-weight: 600; text-decoration: none; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 4px;';

            const deadUrl = item.deadCatboxUrl || item.catboxUrl || '';
            const fixedUrl = item.fixedCatboxUrl || '';

            const detail = document.createElement('div');
            detail.style = 'color: #71767b; font-size: 11px; margin-bottom: 8px;';
            const deadFile = deadUrl ? extractCatboxFileId(deadUrl) : 'desconhecido';
            const fixedFile = fixedUrl ? extractCatboxFileId(fixedUrl) : '';
            detail.innerText = item.status === 'fixed' && fixedFile
                ? `Imagem ${item.imageIndex + 1} | Link morto: ${deadFile} | Novo link: ${fixedFile}`
                : `Imagem ${item.imageIndex + 1} | Link morto: ${deadFile}`;

            const statusBadge = document.createElement('span');
            statusBadge.id = `status-badge-${reportIdx}`;
            
            if (item.status === 'fixed') {
                statusBadge.innerText = '✅ Reupado com sucesso';
                statusBadge.style = 'font-size: 10px; padding: 2px 8px; border-radius: 4px; background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.2);';
            } else {
                statusBadge.innerText = '❌ Inacessível';
                statusBadge.style = 'font-size: 10px; padding: 2px 8px; border-radius: 4px; background: rgba(244,33,46,0.1); color: #f4212e; border: 1px solid rgba(244,33,46,0.2);';
            }

            info.appendChild(postLink);
            info.appendChild(detail);
            info.appendChild(statusBadge);

            // Botões de Ação
            const actionGroup = document.createElement('div');
            actionGroup.style = 'display: flex; gap: 8px; align-items: center;';

            // Botão Editar Manual (v2.6.51)
            const manualBtn = document.createElement('button');
            manualBtn.innerHTML = ICON_PENCIL_SMALL;
            manualBtn.title = 'Editar link manualmente';
            manualBtn.style = `
                padding: 8px; border-radius: 50%;
                background: rgba(255,255,255,0.05); border: 1px solid #333;
                color: #888; cursor: pointer; display: flex; align-items: center; justify-content: center;
                transition: all 0.2s;
            `;
            manualBtn.onmouseenter = () => { manualBtn.style.borderColor = '#1d9bf0'; manualBtn.style.color = '#1d9bf0'; };
            manualBtn.onmouseleave = () => { manualBtn.style.borderColor = '#333'; manualBtn.style.color = '#888'; };
            manualBtn.onclick = () => {
                const newUrl = prompt('Cole a nova URL da imagem (Ex: Imgur, Catbox, etc):', item.catboxUrl);
                if (newUrl && newUrl !== item.catboxUrl) {
                    handleManualFix(item, newUrl, statusBadge, manualBtn, reuploadBtn);
                }
            };

            // Botão Reupar
            const reuploadBtn = document.createElement('button');
            reuploadBtn.id = `reupload-btn-${reportIdx}`;
            reuploadBtn.innerHTML = `<span>Reupar</span>`;
            reuploadBtn.style = `
                padding: 8px 16px; border-radius: 20px;
                background: #1d9bf0; border: none;
                color: white; cursor: pointer; font-size: 12px; font-weight: 600;
                transition: all 0.2s; flex-shrink: 0;
                display: ${item.status === 'fixed' ? 'none' : 'block'};
            `;
            reuploadBtn.onclick = async () => {
                reuploadBtn.disabled = true;
                reuploadBtn.style.opacity = '0.5';
                reuploadBtn.innerText = 'Processando...';

                const success = await handleReupload(item, statusBadge);
                if (success) {
                    reuploadBtn.style.display = 'none';
                    manualBtn.style.display = 'none';
                } else {
                    reuploadBtn.disabled = false;
                    reuploadBtn.style.opacity = '1';
                    reuploadBtn.innerText = 'Tentar Novamente';
                }
            };

            if (item.status === 'fixed') manualBtn.style.display = 'none';

            actionGroup.appendChild(manualBtn);
            actionGroup.appendChild(reuploadBtn);

            row.appendChild(thumb);
            row.appendChild(info);
            row.appendChild(actionGroup);
            listContainer.appendChild(row);
        });

        body.appendChild(listContainer);

        // Footer
        const footer = document.createElement('div');
        footer.style = 'padding: 20px 25px; border-top: 1px solid #2a2a2a; display: flex; justify-content: space-between; align-items: center;';

        const leftBtns = document.createElement('div');
        leftBtns.style = 'display: flex; gap: 10px;';

        const copyBtn = document.createElement('button');
        copyBtn.innerHTML = `<span>Copiar Lista</span>`;
        copyBtn.style = 'padding: 10px 20px; background: #2a2a2a; border: 1px solid #333; border-radius: 20px; color: #e7e9ea; cursor: pointer; font-size: 14px;';
        copyBtn.onclick = () => {
            const text = safeDeadLinks.map(item =>
                `Post: ${item.postUrl}\nImagem ${item.imageIndex + 1}\nLink morto: ${item.deadCatboxUrl || item.catboxUrl}${item.fixedCatboxUrl ? `\nNovo link: ${item.fixedCatboxUrl}` : ''}`
            ).join('\n\n');
            navigator.clipboard.writeText(text);
            showToast('Lista copiada!');
        };

        const reuploadAllBtn = document.createElement('button');
        reuploadAllBtn.innerHTML = `<span>Reupar Todos</span>`;
        reuploadAllBtn.style = 'padding: 10px 24px; background: #22c55e; border: none; border-radius: 20px; color: white; cursor: pointer; font-size: 14px; font-weight: 600;';
        reuploadAllBtn.onclick = async () => {
            if (!confirm(`Deseja tentar reupar os ${safeDeadLinks.length} itens?`)) return;
            reuploadAllBtn.disabled = true;
            reuploadAllBtn.style.opacity = '0.5';
            reuploadAllBtn.innerText = 'Reupando tudo...';

            let count = 0;
            for (let i = 0; i < safeDeadLinks.length; i++) {
                const badge = document.getElementById(`status-badge-${i}`);
                const btn = document.getElementById(`reupload-btn-${i}`);
                if (btn && btn.style.display !== 'none') {
                    const success = await handleReupload(safeDeadLinks[i], badge);
                    if (success) {
                        btn.style.display = 'none';
                        count++;
                    }
                }
            }
            showToast(`${count} imagens reupadas com sucesso!`);
            reuploadAllBtn.innerText = 'Concluído';
        };

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Fechar';
        closeBtn.style = 'padding: 10px 24px; background: transparent; border: 1px solid #333; border-radius: 20px; color: #e7e9ea; cursor: pointer; font-size: 14px;';
        closeBtn.onclick = () => overlay.remove();

        leftBtns.appendChild(copyBtn);
        leftBtns.appendChild(reuploadAllBtn);
        footer.appendChild(leftBtns);
        footer.appendChild(closeBtn);

        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        document.body.appendChild(overlay);
    }

    // Lógica para reupar uma imagem específica
    async function handleReupload(item, statusBadge) {
        try {
            console.log('[X-Bookmark] Iniciando re-upload para:', item);
            const deadUrl = item.deadCatboxUrl || item.catboxUrl;
            statusBadge.innerText = '⏳ Baixando original...';
            statusBadge.style.background = 'rgba(29,155,240,0.1)';
            statusBadge.style.color = '#1d9bf0';
            statusBadge.style.borderColor = 'rgba(29,155,240,0.2)';

            const bookmarks = getBookmarks();
            const bmIdx = bookmarks.findIndex(b => b.id === item.bookmarkId);
            if (bmIdx === -1) throw new Error('Bookmark não encontrado no banco de dados');

            const originalUrl = bookmarks[bmIdx].images[item.imageIndex];
            
            // 1. Primeira tentativa de Upload
            statusBadge.innerText = '⏳ Subindo para Catbox...';
            let newCatboxUrl = await uploadToCatbox(originalUrl);
            console.log('[X-Bookmark] URL retornada no upload inicial:', newCatboxUrl);
            
            if (!newCatboxUrl || !newCatboxUrl.startsWith('https://files.catbox.moe/')) {
                throw new Error('Catbox retornou uma URL inválida');
            }

            // 2. Se o link for suspeito (igual ao morto ou conhecido como morto), forçar novo link
            const initialKnownDead = isKnownDeadCatboxUrl(newCatboxUrl);
            if (initialKnownDead) {
                console.warn('[X-Bookmark] Catbox retornou uma URL conhecida como morta. Forcando fallback:', newCatboxUrl);
            }

            let mustForceFallback = initialKnownDead;

            if (newCatboxUrl === deadUrl) {
                console.log('[X-Bookmark] Catbox retornou o mesmo link. Verificando se voltou a funcionar...');
                const isNowAlive = await probeImageUrl(newCatboxUrl, 7000, 2);
                if (!isNowAlive) {
                    mustForceFallback = true;
                }
            }

            if (mustForceFallback) {
                console.warn('[X-Bookmark] O link continua suspeito/morto. Tentando forçar NOVO LINK com qualidade alternativa...');

                // Tenta deletar o antigo (mesmo que falhe, tentamos)
                const fileId = extractCatboxFileId(deadUrl);
                if (fileId) {
                    const delResult = await deleteFromCatbox([fileId]);
                    if (typeof delResult === 'string' && delResult.toLowerCase().includes("file doesn't exist")) {
                        console.warn('[X-Bookmark] O arquivo existe, mas a API nao deixou deletar. Seguindo com fallback sem depender da delecao.');
                    }
                }

                // MUDA O HASH: Se 4k falhou, tenta Large.
                let forceNewUrl;
                if (originalUrl.includes('name=4096x4096')) {
                    forceNewUrl = originalUrl.replace('name=4096x4096', 'name=large');
                } else {
                    forceNewUrl = originalUrl.includes('?') ? originalUrl + '&name=4096x4096' : originalUrl + '?name=4096x4096';
                }

                console.log('[X-Bookmark] Reupando versão alternativa para mudar o hash:', forceNewUrl);
                try {
                    newCatboxUrl = await uploadToCatboxSingle(forceNewUrl);
                    console.log('[X-Bookmark] URL retornada no fallback por URL:', newCatboxUrl);
                } catch (uploadError) {
                    console.warn('[X-Bookmark] Fallback por URL alternada falhou:', uploadError.message || uploadError);
                }

                const altValidation = await validateFinalCatboxUrl(newCatboxUrl);
                const altKnownDead = isKnownDeadCatboxUrl(newCatboxUrl);
                if (altKnownDead) {
                    console.warn('[X-Bookmark] Fallback por URL retornou ID conhecido como morto:', newCatboxUrl);
                }
                if (!altValidation.ok || altKnownDead) {
                    console.warn('[X-Bookmark] Fallback por URL nao validou:', altValidation);
                    console.warn('[X-Bookmark] Fallback por URL ainda falhou. Tentando upload binario recodificado...');
                    const binaryFallbackUrl = await forceUploadWithNewHash(originalUrl, deadUrl);
                    if (binaryFallbackUrl) {
                        newCatboxUrl = binaryFallbackUrl;
                        console.log('[X-Bookmark] URL retornada no fallback binario:', newCatboxUrl);
                    }
                }
            }

            // 3. Validação Final REAL (Aumentado para 10s)
            statusBadge.innerText = '⏳ Validando link final...';
            const finalValidation = await validateFinalCatboxUrl(newCatboxUrl);
            const finalFileId = extractCatboxFileId(newCatboxUrl) || 'sem-id';

            if (isKnownDeadCatboxUrl(newCatboxUrl)) {
                throw new Error(`Catbox retornou URL marcada como morta (${finalFileId})`);
            }

            if (!finalValidation.ok) {
                throw new Error(newCatboxUrl === deadUrl
                    ? 'Catbox manteve a mesma URL morta mesmo apos fallback (provavel cache/deduplicacao)'
                    : `O novo link (${finalFileId}) nao validou (${finalValidation.method || 'desconhecido'}${finalValidation.status ? ` ${finalValidation.status}` : ''})`);
            }

            // 4. ATUALIZAÇÃO SÓ OCORRE SE PASSAR NA VALIDAÇÃO
            if (!bookmarks[bmIdx].catboxUrls) bookmarks[bmIdx].catboxUrls = [];
            bookmarks[bmIdx].catboxUrls[item.imageIndex] = newCatboxUrl;
            saveBookmarks(bookmarks);

            // Atualizar UI e Histórico
            item.status = 'fixed';
            item.deadCatboxUrl = deadUrl;
            item.fixedCatboxUrl = newCatboxUrl;
            const report = GM_getValue(DEAD_REPORT_KEY);
            if (report && report.deadLinks) {
                const reportItem = report.deadLinks.find(dl => dl.bookmarkId === item.bookmarkId && dl.imageIndex === item.imageIndex);
                if (reportItem) {
                    reportItem.status = 'fixed';
                    reportItem.deadCatboxUrl = reportItem.deadCatboxUrl || reportItem.catboxUrl || deadUrl;
                    reportItem.fixedCatboxUrl = newCatboxUrl;
                    GM_setValue(DEAD_REPORT_KEY, report);
                }
            }

            console.log('[X-Bookmark] Reupload concluido:', {
                dead: deadUrl,
                novo: newCatboxUrl,
                bookmarkId: item.bookmarkId,
                imageIndex: item.imageIndex
            });

            // Álbum
            const settings = getSettings();
            const newFileId = newCatboxUrl.split('/').pop();
            if (settings.catboxAlbumShort && newFileId) {
                await addToCatboxAlbum([newFileId]);
            }

            statusBadge.innerText = '✅ Reupado com sucesso';
            statusBadge.style.background = 'rgba(34,197,94,0.1)';
            statusBadge.style.color = '#22c55e';
            statusBadge.style.borderColor = 'rgba(34,197,94,0.2)';

            updateGalleryContent();
            return true;

        } catch (e) {
            console.error('[X-Bookmark] Falha no Reupload:', e);
            statusBadge.innerText = '❌ ' + (e.message || 'Erro no upload');
            statusBadge.style.background = 'rgba(244,33,46,0.1)';
            statusBadge.style.color = '#f4212e';
            statusBadge.style.borderColor = 'rgba(244,33,46,0.2)';
            return false;
        }
    }

    // Função para correção manual via prompt
    function handleManualFix(item, newUrl, statusBadge, manualBtn, reuploadBtn) {
        const bookmarks = getBookmarks();
        const bmIdx = bookmarks.findIndex(b => b.id === item.bookmarkId);
        if (bmIdx === -1) return;
        const deadUrl = item.deadCatboxUrl || item.catboxUrl;

        if (!bookmarks[bmIdx].catboxUrls) bookmarks[bmIdx].catboxUrls = [];
        bookmarks[bmIdx].catboxUrls[item.imageIndex] = newUrl;
        saveBookmarks(bookmarks);

        item.status = 'fixed';
        item.deadCatboxUrl = deadUrl;
        item.fixedCatboxUrl = newUrl;

        const report = GM_getValue(DEAD_REPORT_KEY);
        if (report && report.deadLinks) {
            const reportItem = report.deadLinks.find(dl => dl.bookmarkId === item.bookmarkId && dl.imageIndex === item.imageIndex);
            if (reportItem) {
                reportItem.status = 'fixed';
                reportItem.deadCatboxUrl = reportItem.deadCatboxUrl || reportItem.catboxUrl || deadUrl;
                reportItem.fixedCatboxUrl = newUrl;
                GM_setValue(DEAD_REPORT_KEY, report);
            }
        }

        statusBadge.innerText = '✅ Corrigido manualmente';
        statusBadge.style.background = 'rgba(34,197,94,0.1)';
        statusBadge.style.color = '#22c55e';
        statusBadge.style.borderColor = 'rgba(34,197,94,0.2)';
        
        manualBtn.style.display = 'none';
        reuploadBtn.style.display = 'none';
        updateGalleryContent();
        showToast('Bookmark atualizado com sucesso');
    }


    // Primeira varredura após 30 segundos para não impactar carregamento inicial
    setTimeout(() => {
        periodicBackupScan(true); // isInitial = true

        // Depois continua a cada X minutos
        setInterval(() => periodicBackupScan(false), BACKUP_SCAN_INTERVAL);
    }, 30000);

    // ==================== FLOATING BUTTON ====================
    function createFloatingButton() {
        if (document.getElementById('x-bookmark-fab')) return;

        const settings = getSettings();

        // Criar o botão com estilo nativo do X
        const fab = document.createElement('button');
        fab.id = 'x-bookmark-fab';
        fab.setAttribute('role', 'button');
        fab.setAttribute('type', 'button');
        fab.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></svg>`;
        fab.title = `Abrir Meus Bookmarks (${settings.shortcuts.openGallery.toUpperCase()})`;
        fab.onclick = (e) => {
            if (e.detail === 0) return;
            createGalleryModal();
        };

        // Estilo nativo do X - fundo preto com bordas arredondadas e glow
        fab.style.cssText = `
            position: fixed; bottom: 20px; right: 80px; z-index: 9998;
            width: 57px; height: 57px; border-radius: 16px;
            background: rgb(0, 0, 0); color: rgb(231, 233, 234);
            border: 1px solid rgba(255, 255, 255, 0.3);
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s, transform 0.2s;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        `;
        fab.onmouseover = () => fab.style.background = 'rgb(22, 24, 28)';
        fab.onmouseout = () => fab.style.background = 'rgb(0, 0, 0)';

        document.body.appendChild(fab);

        // Sincronizar posição com o GrokDrawer
        function syncPosition() {
            const grokDrawer = document.querySelector('[data-testid="GrokDrawer"]');
            if (grokDrawer) {
                const grokRect = grokDrawer.getBoundingClientRect();
                // Posicionar em cima do Grok (mesmo right, mas acima)
                const grokRightFromEdge = window.innerWidth - grokRect.right;
                fab.style.bottom = (window.innerHeight - grokRect.top + 12) + 'px';
                fab.style.right = grokRightFromEdge + 'px';
            }
        }

        // Sincronizar imediatamente e quando houver mudanças
        syncPosition();
        const posObserver = new MutationObserver(syncPosition);
        posObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

        // Também sincronizar no scroll e resize
        window.addEventListener('scroll', syncPosition, { passive: true });
        window.addEventListener('resize', syncPosition, { passive: true });
    }

    createFloatingButton();

    // ==================== KEYBOARD SHORTCUTS ====================
    function matchesShortcut(e, shortcut) {
        if (!shortcut) return false;
        const parts = shortcut.toLowerCase().split('+');
        const needsCtrl = parts.includes('ctrl');
        const needsShift = parts.includes('shift');
        const needsAlt = parts.includes('alt');
        const key = parts.filter(p => !['ctrl', 'shift', 'alt'].includes(p))[0];

        if (needsCtrl !== e.ctrlKey) return false;
        if (needsShift !== e.shiftKey) return false;
        if (needsAlt !== e.altKey) return false;
        if (key === 'escape') return e.key === 'Escape';
        return e.key.toLowerCase() === key;
    }

    // Usar capture: true para interceptar antes do site
    document.addEventListener('keydown', (e) => {
        // Ignorar se estamos definindo um novo atalho
        if (isListeningForShortcut) return;

        const settings = getSettings();
        const shortcuts = settings.shortcuts || DEFAULT_SETTINGS.shortcuts;
        const gallery = document.getElementById('x-bookmark-gallery');
        const isGalleryOpen = gallery && gallery.style.display !== 'none';
        const isInputFocused = document.activeElement?.tagName === 'INPUT' ||
            document.activeElement?.tagName === 'TEXTAREA' ||
            document.activeElement?.isContentEditable;

        // Abrir/fechar galeria
        if (matchesShortcut(e, shortcuts.openGallery)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (isGalleryOpen) {
                gallery.style.display = 'none';
                document.body.style.overflow = '';
            } else {
                createGalleryModal();
            }
            return;
        }

        // Fechar modal ativo (ESC só fecha, nunca abre)
        if (matchesShortcut(e, shortcuts.closeModal)) {
            // Primeiro tenta fechar modais internos (settings, tags, etc)
            const overlays = document.querySelectorAll('[style*="z-index: 10001"], [style*="z-index: 10002"]');
            if (overlays.length > 0) {
                e.preventDefault();
                overlays[overlays.length - 1].remove();
                return;
            }
            // Depois fecha a galeria se estiver aberta
            if (isGalleryOpen) {
                e.preventDefault();
                gallery.style.display = 'none';
                document.body.style.overflow = '';
                return;
            }
            // Se nada está aberto, não faz nada
            return;
        }

        // Atalhos que só funcionam na galeria e sem foco em input
        if (!isGalleryOpen || isInputFocused) return;

        // Toggle Grid/Lista
        if (matchesShortcut(e, shortcuts.toggleView)) {
            e.preventDefault();
            const viewToggle = document.getElementById('x-bookmark-view-toggle');
            if (viewToggle) viewToggle.click();
            return;
        }

        // Abrir configurações
        if (matchesShortcut(e, shortcuts.openSettings)) {
            e.preventDefault();
            SettingsModal(updateGalleryContent);
            return;
        }
    }, true);

})();
