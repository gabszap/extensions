// ==UserScript==
// @name        X Bookmark
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     2.5.6
// @author      Antigravity
// @description Substitui o botão do Grok por um Bookmark interno
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'x_internal_bookmarks';
    const TAGS_KEY = 'x_bookmark_tags';
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
    const BLUE_COLOR = 'rgb(29, 155, 240)';
    const GRAY_COLOR = 'rgb(113, 118, 123)';
    const VERSION = GM_info.script.version;
    const SETTINGS_KEY = 'x_bookmark_settings';
    const AUTOTAG_RULES_KEY = 'x_bookmark_autotag_rules';
    const DEFAULT_SETTINGS = {
        showUserLabel: true,
        listPreviewSize: 80,
        gridPhotoHeight: 300,
        galleryTitle: 'Meus Bookmarks',
        shortcuts: {
            openGallery: 'ctrl+b',
            closeModal: 'escape',
            toggleView: 'g',
            openSettings: 's'
        }
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

    function toggleBookmark(bookmark) {
        let bookmarks = getBookmarks();
        const index = bookmarks.findIndex(b => b.postUrl === bookmark.postUrl);

        if (index !== -1) {
            bookmarks.splice(index, 1);
            saveBookmarks(bookmarks);
            return 'removed';
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
            return 'added';
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

        // Lista de tags como chips flex-wrap
        const tagList = document.createElement('div');
        tagList.style = 'display: flex; flex-wrap: wrap; gap: 10px; max-height: 250px; overflow-y: auto; padding: 5px 0;';

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

            tags.forEach(tag => {
                const chip = document.createElement('div');
                chip.style = `
                    display: flex; align-items: center; gap: 8px;
                    padding: 8px 18px; background: #2d2d2d; border-radius: 20px;
                    font-size: 14px; transition: all 0.2s;
                `;

                const tagText = document.createElement('span');
                tagText.innerText = tag;
                tagText.style = 'color: #fff;';

                const delBtn = document.createElement('button');
                delBtn.innerHTML = ICON_X.replace('width="16"', 'width="14"').replace('height="16"', 'height="14"');
                delBtn.style = 'background: none; border: none; color: #E57373; cursor: pointer; opacity: 0.5; padding: 2px; display: flex; align-items: center; transition: opacity 0.2s;';
                delBtn.onmouseenter = () => delBtn.style.opacity = '1';
                delBtn.onmouseleave = () => delBtn.style.opacity = '0.5';
                delBtn.onclick = () => {
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

                chip.appendChild(tagText);
                chip.appendChild(delBtn);
                tagList.appendChild(chip);
            });
        }
        renderTags();
        modal.appendChild(tagList);

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
        settingsContainer.style = 'display: flex; flex-direction: column; gap: 20px;';

        // === 1. Título da Galeria ===
        const titleRow = document.createElement('div');
        titleRow.style = 'display: flex; flex-direction: column; gap: 8px;';

        const titleLabel = document.createElement('label');
        titleLabel.innerText = 'Título da Galeria';
        titleLabel.style = 'color: #888; font-size: 13px;';

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = settings.galleryTitle;
        titleInput.placeholder = 'Meus Bookmarks';
        titleInput.style = 'padding: 12px 15px; border-radius: 12px; border: 1px solid #333; background: #1a1a1a; color: white; font-size: 14px;';
        titleInput.oninput = () => {
            saveSetting('galleryTitle', titleInput.value || 'Meus Bookmarks');
        };

        titleRow.appendChild(titleLabel);
        titleRow.appendChild(titleInput);
        settingsContainer.appendChild(titleRow);

        // === 2. Toggle Mostrar usuário ===
        const userLabelRow = document.createElement('div');
        userLabelRow.style = 'display: flex; justify-content: space-between; align-items: center;';

        const userLabelInfo = document.createElement('div');
        userLabelInfo.innerHTML = '<span style="color: white; font-size: 14px;">Mostrar usuário</span><br><span style="color: #666; font-size: 12px;">Exibe foto e nome sobre as imagens</span>';

        const userLabelToggle = document.createElement('input');
        userLabelToggle.type = 'checkbox';
        userLabelToggle.checked = settings.showUserLabel;
        userLabelToggle.style = 'width: 20px; height: 20px; cursor: pointer; accent-color: #1d9bf0;';
        userLabelToggle.onchange = () => {
            saveSetting('showUserLabel', userLabelToggle.checked);
        };

        userLabelRow.appendChild(userLabelInfo);
        userLabelRow.appendChild(userLabelToggle);
        settingsContainer.appendChild(userLabelRow);

        // Helper para criar slider + input numérico
        function createSliderRow(label, description, key, min, max, unit) {
            const row = document.createElement('div');
            row.style = 'display: flex; flex-direction: column; gap: 8px;';

            const labelEl = document.createElement('div');
            labelEl.innerHTML = `<span style="color: white; font-size: 14px;">${label}</span><br><span style="color: #666; font-size: 12px;">${description}</span>`;

            const controlRow = document.createElement('div');
            controlRow.style = 'display: flex; align-items: center; gap: 15px;';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = min;
            slider.max = max;
            slider.value = settings[key];
            slider.style = 'flex: 1; cursor: pointer; accent-color: #1d9bf0;';

            const numInput = document.createElement('input');
            numInput.type = 'number';
            numInput.min = min;
            numInput.max = max;
            numInput.value = settings[key];
            numInput.style = 'width: 70px; padding: 8px; border-radius: 8px; border: 1px solid #333; background: #1a1a1a; color: white; text-align: center;';

            const unitLabel = document.createElement('span');
            unitLabel.innerText = unit;
            unitLabel.style = 'color: #666; font-size: 12px;';

            // Botão restaurar padrão
            const resetBtn = document.createElement('button');
            resetBtn.innerText = '↺';
            resetBtn.title = 'Restaurar padrão';
            resetBtn.style = 'background: transparent; border: 1px solid #444; color: #888; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 14px;';
            resetBtn.onmouseenter = () => { resetBtn.style.borderColor = '#1d9bf0'; resetBtn.style.color = '#1d9bf0'; };
            resetBtn.onmouseleave = () => { resetBtn.style.borderColor = '#444'; resetBtn.style.color = '#888'; };
            resetBtn.onclick = () => {
                const defaultVal = DEFAULT_SETTINGS[key];
                slider.value = defaultVal;
                numInput.value = defaultVal;
                saveSetting(key, defaultVal);
            };

            slider.oninput = () => {
                numInput.value = slider.value;
                saveSetting(key, parseInt(slider.value));
            };

            numInput.oninput = () => {
                let val = parseInt(numInput.value) || min;
                val = Math.max(min, Math.min(max, val));
                slider.value = val;
                saveSetting(key, val);
            };

            controlRow.appendChild(slider);
            controlRow.appendChild(numInput);
            controlRow.appendChild(unitLabel);
            controlRow.appendChild(resetBtn);

            row.appendChild(labelEl);
            row.appendChild(controlRow);
            return row;
        }

        // === 3. Atalhos de Teclado ===
        const shortcutsSection = document.createElement('div');
        shortcutsSection.style = 'display: flex; flex-direction: column; gap: 10px; padding: 15px; background: #1a1a1a; border-radius: 12px;';

        const shortcutsTitle = document.createElement('div');
        shortcutsTitle.innerHTML = '<span style="color: white; font-size: 14px; font-weight: 500;">Atalhos de Teclado</span>';
        shortcutsSection.appendChild(shortcutsTitle);

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
                isListeningForShortcut = true; // Flag global
                keyBtn.innerText = '...';
                keyBtn.style.borderColor = '#1d9bf0';

                const handler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    // Ignorar se apenas teclas modificadoras foram pressionadas
                    const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta'];
                    if (modifierKeys.includes(e.key)) {
                        return; // Aguardar tecla principal
                    }

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
                    isListeningForShortcut = false; // Reset flag
                    document.removeEventListener('keydown', handler, true);
                };

                document.addEventListener('keydown', handler, true);
            };

            row.appendChild(labelEl);
            row.appendChild(keyBtn);
            return row;
        }

        Object.keys(shortcutLabels).forEach(key => {
            shortcutsSection.appendChild(createShortcutRow(key, shortcutLabels[key]));
        });

        // Botão restaurar padrões
        const resetShortcutsBtn = document.createElement('button');
        resetShortcutsBtn.innerText = 'Restaurar padrões';
        resetShortcutsBtn.style = 'background: transparent; border: 1px solid #444; color: #888; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 12px; margin-top: 5px;';
        resetShortcutsBtn.onmouseenter = () => { resetShortcutsBtn.style.borderColor = '#1d9bf0'; resetShortcutsBtn.style.color = '#1d9bf0'; };
        resetShortcutsBtn.onmouseleave = () => { resetShortcutsBtn.style.borderColor = '#444'; resetShortcutsBtn.style.color = '#888'; };
        resetShortcutsBtn.onclick = () => {
            saveSetting('shortcuts', DEFAULT_SETTINGS.shortcuts);
            overlay.remove();
            SettingsModal(onSave); // Reabrir para atualizar
        };
        shortcutsSection.appendChild(resetShortcutsBtn);

        settingsContainer.appendChild(shortcutsSection);

        // === 4. Tamanho preview (lista) ===
        settingsContainer.appendChild(createSliderRow(
            'Tamanho do preview (Lista)',
            'Tamanho da miniatura no modo lista',
            'listPreviewSize',
            40, 150, 'px'
        ));

        // === 5. Tamanho fotos (grid) ===
        settingsContainer.appendChild(createSliderRow(
            'Altura das fotos (Grid)',
            'Altura das imagens no modo grid',
            'gridPhotoHeight',
            150, 500, 'px'
        ));

        // === 6. Auto-tag por Pessoa ===
        const autoTagSection = document.createElement('div');
        autoTagSection.style = 'display: flex; flex-direction: column; gap: 10px; padding: 15px; background: #1a1a1a; border-radius: 12px;';

        const autoTagTitle = document.createElement('div');
        autoTagTitle.innerHTML = '<span style="color: white; font-size: 14px; font-weight: 500;">Auto-tag por Pessoa</span><br><span style="color: #666; font-size: 11px;">Aplica tag automaticamente quando salvar bookmark de @pessoa</span>';
        autoTagSection.appendChild(autoTagTitle);

        // Container das regras
        const rulesContainer = document.createElement('div');
        rulesContainer.id = 'autotag-rules-container';
        rulesContainer.style = 'display: flex; flex-direction: column; gap: 6px; max-height: 150px; overflow-y: auto;';

        function renderRules() {
            rulesContainer.innerHTML = '';
            const rules = getAutotagRules();
            if (rules.length === 0) {
                rulesContainer.innerHTML = '<span style="color: #555; font-size: 12px; font-style: italic;">Nenhuma regra configurada</span>';
                return;
            }
            rules.forEach((rule, idx) => {
                const ruleEl = document.createElement('div');
                ruleEl.style = 'display: flex; align-items: center; gap: 8px; background: #2d2d2d; padding: 8px 12px; border-radius: 8px;';
                ruleEl.innerHTML = `
                    <span style="color: #1d9bf0; font-size: 12px;">${rule.username}</span>
                    <span style="color: #555;">→</span>
                    <span style="color: #888; font-size: 12px; flex: 1;">${rule.tag}</span>
                `;
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '×';
                removeBtn.style = 'background: transparent; border: none; color: #666; cursor: pointer; font-size: 16px; padding: 0 5px;';
                removeBtn.onmouseenter = () => removeBtn.style.color = '#e74c3c';
                removeBtn.onmouseleave = () => removeBtn.style.color = '#666';
                removeBtn.onclick = () => {
                    const newRules = rules.filter((_, i) => i !== idx);
                    saveAutotagRules(newRules);
                    renderRules();
                };
                ruleEl.appendChild(removeBtn);
                rulesContainer.appendChild(ruleEl);
            });
        }
        renderRules();
        autoTagSection.appendChild(rulesContainer);

        // Adicionar nova regra
        const addRuleRow = document.createElement('div');
        addRuleRow.style = 'display: flex; gap: 8px; align-items: center; margin-top: 8px;';

        // Input @username com datalist
        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.placeholder = '@usuario';
        userInput.style = 'flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid #333; background: #2d2d2d; color: white; font-size: 12px;';
        userInput.setAttribute('list', 'autotag-usernames');

        // Datalist com usernames existentes
        const datalist = document.createElement('datalist');
        datalist.id = 'autotag-usernames';
        const existingUsernames = new Set();
        getBookmarks().forEach(b => {
            const handle = '@' + extractHandle(b.postUrl);
            existingUsernames.add(handle);
        });
        existingUsernames.forEach(u => {
            const opt = document.createElement('option');
            opt.value = u;
            datalist.appendChild(opt);
        });
        autoTagSection.appendChild(datalist);

        // Select de tags
        const tagSelect = document.createElement('select');
        tagSelect.style = 'flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid #333; background: #2d2d2d; color: white; font-size: 12px;';
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.innerText = 'Selecione tag';
        tagSelect.appendChild(defaultOpt);
        getTags().forEach(tag => {
            const opt = document.createElement('option');
            opt.value = tag;
            opt.innerText = tag;
            tagSelect.appendChild(opt);
        });

        // Botão adicionar
        const addRuleBtn = document.createElement('button');
        addRuleBtn.innerText = '+';
        addRuleBtn.style = 'background: #1d9bf0; border: none; color: white; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;';
        addRuleBtn.onclick = () => {
            const username = userInput.value.trim();
            const tag = tagSelect.value;
            if (!username || !tag) return;
            const formattedUsername = username.startsWith('@') ? username : '@' + username;
            const rules = getAutotagRules();
            // Verificar duplicata
            if (rules.some(r => r.username === formattedUsername && r.tag === tag)) return;
            rules.push({ username: formattedUsername, tag });
            saveAutotagRules(rules);
            userInput.value = '';
            tagSelect.value = '';
            renderRules();
        };

        addRuleRow.appendChild(userInput);
        addRuleRow.appendChild(tagSelect);
        addRuleRow.appendChild(addRuleBtn);
        autoTagSection.appendChild(addRuleRow);

        settingsContainer.appendChild(autoTagSection);

        modal.appendChild(settingsContainer);

        overlay.appendChild(modal);
        overlay.onclick = (e) => { if (e.target === overlay) { overlay.remove(); if (onSave) onSave(); } };
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
                    if (src.includes('name=')) {
                        src = src.replace(/name=[^&]+/, 'name=large');
                    } else if (src.includes('?')) {
                        src += '&name=large';
                    }
                    return src;
                });

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
                    iconContainer.style.color = result === 'added' ? BLUE_COLOR : GRAY_COLOR;
                }
            });
        });
    }

    // ==================== GALLERY ====================
    function createGalleryModal() {
        // Travar scroll da página
        document.body.style.overflow = 'hidden';

        const existing = document.getElementById('x-bookmark-gallery');
        if (existing) {
            existing.style.display = 'flex';
            updateGalleryContent();
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

        // Botão Excluir
        const bulkDelBtn = document.createElement('button');
        bulkDelBtn.innerHTML = `${ICON_TRASH} <span>Excluir</span>`;
        bulkDelBtn.style = 'padding: 8px 15px; border-radius: 20px; border: 1px solid #f4212e; background: transparent; color: #f4212e; cursor: pointer; display: flex; align-items: center; gap: 6px;';
        bulkDelBtn.onclick = bulkDelete;

        bulkContainer.appendChild(bulkInfo);
        bulkContainer.appendChild(bulkSelectAllBtn);
        bulkContainer.appendChild(bulkClearBtn);
        bulkContainer.appendChild(bulkTagBtn);
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
                thumb.src = b.images?.[0] || '';
                thumb.style = `width: ${previewSize}px; height: ${previewSize}px; object-fit: cover; border-radius: 8px; cursor: pointer; flex-shrink: 0;`;
                thumb.onclick = () => b.images?.length > 1 ? showDetails(b) : window.open(b.images[0], '_blank');

                // Preview no hover
                thumb.onmouseenter = (e) => showPreview(e, b.images?.[0]);
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
                imgCount.innerText = `🖼️ ${b.images?.length || 0} foto(s)`;
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

                item.appendChild(checkbox);
                item.appendChild(thumb);
                item.appendChild(info);
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
            const numImgs = b.images ? b.images.length : 1;
            imgContainer.style = `display: grid; grid-template-columns: ${numImgs > 1 ? '1fr 1fr' : '1fr'}; gap: 2px; background: #000; cursor: pointer; height: ${gridHeight}px; position: relative;`;
            imgContainer.title = numImgs > 1 ? 'Clique para ver todas as imagens' : 'Clique para abrir imagem';

            imgContainer.onclick = () => {
                if (numImgs > 1) {
                    showDetails(b);
                } else {
                    window.open(b.images[0], '_blank');
                }
            };

            const displayImages = b.images ? b.images.slice(0, 4) : [];
            displayImages.forEach((src, idx) => {
                const img = document.createElement('img');
                img.src = src;
                let itemHeight = `${gridHeight}px`;
                if (numImgs > 1) {
                    itemHeight = numImgs === 2 ? `${gridHeight}px` : `${Math.floor(gridHeight / 2) - 1}px`;
                }
                img.style = `width: 100%; height: ${itemHeight}; object-fit: cover; display: block; pointer-events: none;`;
                imgContainer.appendChild(img);
            });

            // Tags do bookmark - posicionadas na parte inferior do imgContainer
            if (b.tags && b.tags.length > 0) {
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
            if (settings.showUserLabel) {
                const userBar = document.createElement('div');
                userBar.style = 'position: absolute; top: 10px; left: 10px; display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.7); padding: 5px 10px; border-radius: 20px; max-width: calc(100% - 20px); z-index: 5;';

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
            const viewPostBtn = document.createElement('button');
            viewPostBtn.innerHTML = ICON_EXTERNAL_LINK;
            viewPostBtn.title = 'Abrir post original';
            viewPostBtn.style = 'background: transparent; border: 1px solid #333; color: #888; padding: 8px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;';
            viewPostBtn.onmouseenter = () => { viewPostBtn.style.borderColor = '#1d9bf0'; viewPostBtn.style.color = '#1d9bf0'; };
            viewPostBtn.onmouseleave = () => { viewPostBtn.style.borderColor = '#333'; viewPostBtn.style.color = '#888'; };
            viewPostBtn.onclick = (e) => { e.stopPropagation(); window.open(b.postUrl, '_blank'); };

            actions.appendChild(checkbox);
            actions.appendChild(infoCol);
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

        const header = document.createElement('div');
        header.style = 'width: 100%; max-width: 1200px; display: flex; justify-content: space-between; margin-bottom: 30px;';
        header.innerHTML = '<h3 style="margin:0; font-size: 20px; color: #1d9bf0;">Imagens do Post</h3>';

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Voltar';
        closeBtn.style = 'background: #333; color: white; border: none; padding: 10px 25px; cursor: pointer; border-radius: 9999px; font-weight: bold;';
        closeBtn.onclick = () => detailModal.remove();
        header.appendChild(closeBtn);
        detailModal.appendChild(header);

        const imgList = document.createElement('div');
        imgList.style = 'display: flex; flex-wrap: wrap; gap: 20px; width: 100%; max-width: 1200px; padding-bottom: 50px; justify-content: center;';

        bookmark.images.forEach(src => {
            const item = document.createElement('div');
            item.style = 'background: #15181c; border-radius: 16px; overflow: hidden; border: 1px solid #333; width: 280px;';

            const img = document.createElement('img');
            img.src = src;
            img.style = 'width: 100%; height: 280px; object-fit: cover; cursor: pointer; display: block;';
            img.onclick = () => window.open(src, '_blank');

            item.appendChild(img);
            imgList.appendChild(item);
        });

        detailModal.appendChild(imgList);
        document.body.appendChild(detailModal);
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

    // Atalho de teclado movido para seção KEYBOARD SHORTCUTS (usa atalhos configuráveis)"

    const observer = new MutationObserver(() => {
        injectButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    injectButtons();

    // ==================== FLOATING BUTTON ====================
    function createFloatingButton() {
        if (document.getElementById('x-bookmark-fab')) return;

        const fab = document.createElement('button');
        fab.id = 'x-bookmark-fab';
        fab.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></svg>`;
        fab.style = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9998;
            width: 56px; height: 56px; border-radius: 50%;
            background: #1d9bf0; color: white; border: none;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(29,155,240,0.4);
            transition: transform 0.2s, background 0.2s;
        `;
        const settings = getSettings();
        fab.title = `Abrir Meus Bookmarks (${settings.shortcuts.openGallery.toUpperCase()})`;
        fab.onmouseover = () => fab.style.transform = 'scale(1.1)';
        fab.onmouseout = () => fab.style.transform = 'scale(1)';
        fab.onclick = (e) => {
            // Só responder a clicks reais de mouse/touch, não a eventos sintéticos de teclado
            if (e.detail === 0) return;
            createGalleryModal();
        };

        document.body.appendChild(fab);
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
