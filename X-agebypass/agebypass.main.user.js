// ==UserScript==
// @name         Age Bypass for Twitter
// @namespace    Age Bypass for Twitter
// @version      1.1.3
// @description  Adds a reveal button (eye icon) to bypass X/Twitter age-restricted media via the fxTwitter API. Features grid layout and zoomable lightbox viewer.
// @author       gabszap
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @updateURL    https://github.com/gabszap/extensions/raw/refs/heads/main/X-agebypass/agebypass.main.user.js
// @downloadURL  https://github.com/gabszap/extensions/raw/refs/heads/main/X-agebypass/agebypass.main.user.js
// ==/UserScript==

(function () {
  "use strict";

  var FX_API = "https://api.fxtwitter.com/";
  var LOCAL_FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";
  var ICON_EXTERNAL_LINK = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M15 3h6v6\"/><path d=\"M10 14 21 3\"/><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/></svg>";
  var ICON_DOWNLOAD = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"vertical-align: middle;\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\"/></svg>";

  var VERSION = (typeof GM_info !== "undefined" && GM_info && GM_info.script && GM_info.script.version) || "unknown";

  // ==================== SETTINGS ====================

  var DEFAULT_SETTINGS = {
    debugVerbose: false,
    experimental: {
      autoReveal: false,
      revealOnPost: false,
    },
  };

  function mergeSettings(_base, incoming) {
    return {
      debugVerbose: !!(incoming && incoming.debugVerbose),
      experimental: {
        autoReveal: !!(incoming && incoming.experimental && incoming.experimental.autoReveal),
        revealOnPost: !!(incoming && incoming.experimental && incoming.experimental.revealOnPost),
      },
    };
  }

  function loadSettings() {
    try {
      var raw =
        typeof GM_getValue !== "undefined"
          ? GM_getValue("fx_reveal_settings", null)
          : localStorage.getItem("fx_reveal_settings");

      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

      var parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      return mergeSettings(DEFAULT_SETTINGS, parsed || {});
    } catch (err) {
      return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  function saveSettings(settings) {
    var json = JSON.stringify(settings);
    if (typeof GM_setValue !== "undefined") {
      GM_setValue("fx_reveal_settings", json);
    } else {
      localStorage.setItem("fx_reveal_settings", json);
    }
  }

  var SETTINGS = loadSettings();

  // ==================== API CACHE ====================
  var _apiCache = {};
  var _cacheTimeout = 30 * 60 * 1000; // 30 minutes

  function getCachedResponse(key) {
    if (_apiCache[key] && Date.now() - _apiCache[key].timestamp < _cacheTimeout) {
      logVerbose("Cache hit for:", key);
      return _apiCache[key].data;
    }
    return null;
  }

  function setCachedResponse(key, data) {
    _apiCache[key] = { data: data, timestamp: Date.now() };
    logVerbose("Cached response for:", key);
  }

  // ==================== LOGGER ====================

  function logVerbose() {
    if (!SETTINGS.debugVerbose) return;
    // eslint-disable-next-line prefer-rest-params
    var args = Array.prototype.slice.call(arguments);
    args.unshift("[fx-reveal]");
    console.log.apply(console, args);
  }

  function logAlways() {
    // eslint-disable-next-line prefer-rest-params
    var args = Array.prototype.slice.call(arguments);
    args.unshift("[fx-reveal]");
    console.log.apply(console, args);
  }

  logAlways("Script loaded v" + VERSION);

  // ==================== PAGE CONTEXT ====================

  function isPostPage() {
    return /\/status\/\d+/.test(location.pathname);
  }

  function shouldAutoRevealHere() {
    var exp = SETTINGS.experimental || {};
    if (!exp.autoReveal) return false;
    if (!exp.revealOnPost) return true;
    return isPostPage();
  }

  // ==================== AUTO-REVEAL GUARDS ====================

  function canAutoReveal(tweetNode) {
    if (!tweetNode) return false;
    if (tweetNode.getAttribute("data-fx-auto-revealed") === "1") return false;
    if (tweetNode.getAttribute("data-fx-auto-reveal-pending") === "1") return false;
    return true;
  }

  function markAutoRevealPending(tweetNode) {
    tweetNode.setAttribute("data-fx-auto-reveal-pending", "1");
  }

  function markAutoRevealed(tweetNode) {
    tweetNode.removeAttribute("data-fx-auto-reveal-pending");
    tweetNode.setAttribute("data-fx-auto-revealed", "1");
  }

  function clearAutoRevealPending(tweetNode) {
    tweetNode.removeAttribute("data-fx-auto-reveal-pending");
  }

  // ==================== OVERLAY ====================

  var overlayEl = null;
  var overlayImg = null;
  var overlayVideo = null;
  var overlayClose = null;
  var overlayPrev = null;
  var overlayNext = null;
  var overlayZoomControls = null;
  var overlayZoomPercent = null;
  var overlayZoomIn = null;
  var overlayZoomOut = null;
  var overlayZoomReset = null;
  var overlayOpenOriginal = null;
  var overlayDownload = null;
  var overlayMedia = null;
  var overlayIndex = 0;
  var overlayZoom = 1;
  var overlayPanX = 0;
  var overlayPanY = 0;
  var overlayIsDragging = false;
  var overlayDragStartX = 0;
  var overlayDragStartY = 0;
  var overlayDragOriginX = 0;
  var overlayDragOriginY = 0;
  var overlayDragMoved = false;

  function getOverlayImageSource() {
    if (overlayImg && overlayImg.src && overlayImg.src.indexOf("data:") !== 0) return overlayImg.src;
    if (overlayMedia && overlayMedia[overlayIndex]) return overlayMedia[overlayIndex].url;
    return "";
  }

  function updateOverlayZoomDisplay() {
    if (!overlayZoomPercent) return;
    overlayZoomPercent.textContent = Math.round(overlayZoom * 100) + "%";
  }

  function applyOverlayZoom() {
    if (!overlayImg) return;
    overlayImg.style.transform =
      "translate(" + overlayPanX + "px, " + overlayPanY + "px) scale(" + overlayZoom + ")";
    overlayImg.style.cursor = overlayZoom > 1 ? "grab" : "zoom-in";
    updateOverlayZoomDisplay();
  }

  function setOverlayZoom(nextZoom) {
    overlayZoom = Math.max(0.5, Math.min(nextZoom, 6));
    if (overlayZoom <= 1) {
      overlayPanX = 0;
      overlayPanY = 0;
    }
    applyOverlayZoom();
  }

  function resetOverlayZoom() {
    overlayZoom = 1;
    overlayPanX = 0;
    overlayPanY = 0;
    overlayIsDragging = false;
    overlayDragMoved = false;
    applyOverlayZoom();
  }

  function setOverlayZoomControlsVisible(isVisible) {
    if (!overlayZoomControls) return;
    overlayZoomControls.style.display = isVisible ? "flex" : "none";
  }

  function createOverlayControlButton(label, title) {
    var button = document.createElement("button");
    button.type = "button";
    button.innerHTML = label;
    button.title = title;
    button.style.cssText = [
      "min-width:34px",
      "height:34px",
      "border:none",
      "border-radius:999px",
      "font-family:" + LOCAL_FONT_STACK,
      "background:transparent",
      "color:#fff",
      "cursor:pointer",
      "font-size:14px",
      "font-weight:700",
      "display:inline-flex",
      "align-items:center",
      "justify-content:center",
      "transition:background 0.15s, color 0.15s",
    ].join(";");
    button.addEventListener("mouseenter", function () {
      button.style.background = "rgba(29,155,240,0.24)";
      button.style.color = "#8bd0ff";
    });
    button.addEventListener("mouseleave", function () {
      button.style.background = "transparent";
      button.style.color = "#fff";
    });
    return button;
  }

  function createOverlay() {
    if (overlayEl && document.body.contains(overlayEl)) return;
    overlayEl = null;
    overlayImg = null;
    overlayVideo = null;
    overlayPrev = null;
    overlayNext = null;
    overlayZoomControls = null;
    overlayZoomPercent = null;
    overlayZoomIn = null;
    overlayZoomOut = null;
    overlayZoomReset = null;
    overlayOpenOriginal = null;
    overlayDownload = null;

    overlayEl = document.createElement("div");
    overlayEl.id = "fx-reveal-overlay";
    overlayEl.style.cssText = [
      "position:fixed",
      "top:0",
      "left:0",
      "width:100vw",
      "height:100vh",
      "background:rgba(0,0,0,0.92)",
      "z-index:999999",
      "display:none",
      "justify-content:center",
      "align-items:center",
      "cursor:pointer",
      "user-select:none",
      "overflow:hidden",
      "opacity:0",
      "font-family:" + LOCAL_FONT_STACK,
      "transition:opacity 0.2s ease",
    ].join(";");

    overlayImg = document.createElement("img");
    overlayImg.style.cssText = [
      "max-width:92vw",
      "max-height:92vh",
      "object-fit:contain",
      "border-radius:12px",
      "cursor:zoom-in",
      "position:relative",
      "z-index:2",
      "user-select:none",
      "transform-origin:center center",
      "transition:transform 0.12s ease-out",
      "box-shadow:0 4px 40px rgba(0,0,0,0.5)",
    ].join(";");
    overlayImg.draggable = false;

    overlayVideo = document.createElement("video");
    overlayVideo.style.cssText = [
      "max-width:92vw",
      "max-height:92vh",
      "object-fit:contain",
      "border-radius:12px",
      "position:relative",
      "z-index:2",
      "display:none",
      "box-shadow:0 4px 40px rgba(0,0,0,0.5)",
    ].join(";");
    overlayVideo.controls = true;
    overlayVideo.preload = "metadata";

    overlayZoomControls = document.createElement("div");
    overlayZoomControls.style.cssText = [
      "position:fixed",
      "top:12px",
      "left:50%",
      "transform:translateX(-50%)",
      "z-index:3",
      "display:none",
      "align-items:center",
      "gap:6px",
      "background:rgba(15,20,25,0.78)",
      "border:1px solid rgba(255,255,255,0.14)",
      "border-radius:999px",
      "padding:6px",
      "box-shadow:0 12px 30px rgba(0,0,0,0.35)",
      "font-family:" + LOCAL_FONT_STACK,
      "pointer-events:auto",
    ].join(";");

    overlayZoomPercent = document.createElement("span");
    overlayZoomPercent.style.cssText = [
      "min-width:50px",
      "height:30px",
      "border-radius:999px",
      "background:rgba(255,255,255,0.08)",
      "color:#d7e7f7",
      "display:inline-flex",
      "align-items:center",
      "justify-content:center",
      "font-size:12px",
      "font-weight:800",
      "font-family:" + LOCAL_FONT_STACK,
      "letter-spacing:0.02em",
    ].join(";");

    overlayZoomOut = createOverlayControlButton("&#8722;", "Zoom out");
    overlayZoomIn = createOverlayControlButton("+", "Zoom in");
    overlayZoomReset = createOverlayControlButton("Fit", "Fit to screen");
    overlayZoomReset.style.minWidth = "44px";
    overlayOpenOriginal = createOverlayControlButton(ICON_EXTERNAL_LINK, "Open original");
    overlayDownload = createOverlayControlButton(ICON_DOWNLOAD, "Download media");

    overlayZoomControls.appendChild(overlayZoomPercent);
    overlayZoomControls.appendChild(overlayZoomOut);
    overlayZoomControls.appendChild(overlayZoomIn);
    overlayZoomControls.appendChild(overlayZoomReset);
    overlayZoomControls.appendChild(overlayOpenOriginal);
    overlayZoomControls.appendChild(overlayDownload);

    overlayPrev = document.createElement("button");
    overlayPrev.innerHTML = "&#10094;";
    overlayPrev.style.cssText = [
      "position:fixed",
      "left:16px",
      "top:50%",
      "transform:translateY(-50%)",
      "background:rgba(255,255,255,0.1)",
      "color:#fff",
      "border:none",
      "border-radius:999px",
      "width:44px",
      "height:44px",
      "font-family:" + LOCAL_FONT_STACK,
      "font-size:20px",
      "cursor:pointer",
      "z-index:3",
      "display:none",
      "align-items:center",
      "justify-content:center",
      "transition:background 0.15s",
    ].join(";");
    overlayPrev.addEventListener("mouseenter", function () {
      overlayPrev.style.background = "rgba(255,255,255,0.25)";
    });
    overlayPrev.addEventListener("mouseleave", function () {
      overlayPrev.style.background = "rgba(255,255,255,0.1)";
    });

    overlayNext = document.createElement("button");
    overlayNext.innerHTML = "&#10095;";
    overlayNext.style.cssText = [
      "position:fixed",
      "right:16px",
      "top:50%",
      "transform:translateY(-50%)",
      "background:rgba(255,255,255,0.1)",
      "color:#fff",
      "border:none",
      "border-radius:999px",
      "width:44px",
      "height:44px",
      "font-family:" + LOCAL_FONT_STACK,
      "font-size:20px",
      "cursor:pointer",
      "z-index:3",
      "display:none",
      "align-items:center",
      "justify-content:center",
      "transition:background 0.15s",
    ].join(";");
    overlayNext.addEventListener("mouseenter", function () {
      overlayNext.style.background = "rgba(255,255,255,0.25)";
    });
    overlayNext.addEventListener("mouseleave", function () {
      overlayNext.style.background = "rgba(255,255,255,0.1)";
    });

    var closeBtn = document.createElement("button");
    closeBtn.innerHTML = "&#10005;";
    closeBtn.style.cssText = [
      "position:fixed",
      "top:12px",
      "right:16px",
      "background:rgba(255,255,255,0.1)",
      "color:#fff",
      "border:none",
      "border-radius:999px",
      "width:40px",
      "height:40px",
      "font-family:" + LOCAL_FONT_STACK,
      "font-size:18px",
      "cursor:pointer",
      "z-index:3",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "transition:background 0.15s",
    ].join(";");
    closeBtn.addEventListener("mouseenter", function () {
      closeBtn.style.background = "rgba(255,255,255,0.25)";
    });
    closeBtn.addEventListener("mouseleave", function () {
      closeBtn.style.background = "rgba(255,255,255,0.1)";
    });

    overlayEl.appendChild(overlayPrev);
    overlayEl.appendChild(overlayNext);
    overlayEl.appendChild(overlayImg);
    overlayEl.appendChild(overlayVideo);
    overlayEl.appendChild(overlayZoomControls);
    overlayEl.appendChild(closeBtn);
    document.body.appendChild(overlayEl);

    overlayEl.addEventListener("click", function (e) {
      if (e.target === overlayEl) {
        hideOverlay();
      }
    });
    overlayImg.addEventListener("click", function (e) {
      e.stopPropagation();
      if (overlayDragMoved) {
        overlayDragMoved = false;
        return;
      }
      if (overlayZoom > 1) {
        resetOverlayZoom();
        return;
      }
      setOverlayZoom(2);
    });
    overlayImg.addEventListener("mousedown", function (e) {
      if (overlayZoom <= 1) return;
      e.preventDefault();
      e.stopPropagation();
      overlayIsDragging = true;
      overlayDragMoved = false;
      overlayDragStartX = e.clientX;
      overlayDragStartY = e.clientY;
      overlayDragOriginX = overlayPanX;
      overlayDragOriginY = overlayPanY;
      overlayImg.style.cursor = "grabbing";
    });
    overlayEl.addEventListener("mousemove", function (e) {
      if (!overlayIsDragging) return;
      if (Math.abs(e.clientX - overlayDragStartX) > 3 || Math.abs(e.clientY - overlayDragStartY) > 3) {
        overlayDragMoved = true;
      }
      overlayPanX = overlayDragOriginX + e.clientX - overlayDragStartX;
      overlayPanY = overlayDragOriginY + e.clientY - overlayDragStartY;
      applyOverlayZoom();
    });
    overlayEl.addEventListener("mouseup", function () {
      if (!overlayIsDragging) return;
      overlayIsDragging = false;
      overlayImg.style.cursor = overlayZoom > 1 ? "grab" : "zoom-in";
      if (overlayDragMoved) {
        setTimeout(function () {
          overlayDragMoved = false;
        }, 0);
      }
    });
    overlayEl.addEventListener("mouseleave", function () {
      if (!overlayIsDragging) return;
      overlayIsDragging = false;
      overlayImg.style.cursor = overlayZoom > 1 ? "grab" : "zoom-in";
    });
    overlayEl.addEventListener("wheel", function (e) {
      if (!overlayImg || overlayImg.style.display === "none") return;
      e.preventDefault();
      setOverlayZoom(overlayZoom + (e.deltaY < 0 ? 0.18 : -0.18));
    }, { passive: false });
    overlayPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      navigateOverlay(-1);
    });
    overlayNext.addEventListener("click", function (e) {
      e.stopPropagation();
      navigateOverlay(1);
    });
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      hideOverlay();
    });
    overlayZoomControls.addEventListener("click", function (e) {
      e.stopPropagation();
    });
    overlayZoomOut.addEventListener("click", function (e) {
      e.stopPropagation();
      setOverlayZoom(overlayZoom - 0.25);
    });
    overlayZoomIn.addEventListener("click", function (e) {
      e.stopPropagation();
      setOverlayZoom(overlayZoom + 0.25);
    });
    overlayZoomReset.addEventListener("click", function (e) {
      e.stopPropagation();
      resetOverlayZoom();
    });
    overlayOpenOriginal.addEventListener("click", function (e) {
      var src = getOverlayImageSource();
      e.stopPropagation();
      if (src) window.open(src, "_blank");
    });
    overlayDownload.addEventListener("click", function (e) {
      e.stopPropagation();
      var src = "";
      var isVideo = false;
      var item = overlayMedia && overlayMedia[overlayIndex];
      if (item) {
        isVideo = item.type === "video" || item.type === "animated_gif";
        if (isVideo) {
          src = (item.video && item.video.urls && item.video.urls[0]) || item.url || "";
        } else {
          src = item.url || getOverlayImageSource();
        }
      } else {
        src = getOverlayImageSource();
      }

      if (!src) return;

      var filename = "x_media";
      try {
        var urlObj = new URL(src);
        var pathname = urlObj.pathname;
        var parts = pathname.split("/");
        var lastPart = parts[parts.length - 1];
        if (lastPart) {
          filename = lastPart.split("?")[0].split(":")[0] || "x_media";
        }
        var format = urlObj.searchParams.get("format");
        if (format) {
          if (!filename.endsWith("." + format)) {
            filename += "." + format;
          }
        } else if (!filename.includes(".")) {
          filename += isVideo ? ".mp4" : ".jpg";
        }
      } catch (err) {
        // Fallback
      }

      var originalHTML = overlayDownload.innerHTML;
      overlayDownload.innerHTML = "...";
      overlayDownload.style.pointerEvents = "none";

      GM_xmlhttpRequest({
        method: "GET",
        url: src,
        responseType: "blob",
        onload: function (response) {
          overlayDownload.innerHTML = originalHTML;
          overlayDownload.style.pointerEvents = "auto";
          if (response.status === 200) {
            var blob = response.response;
            var blobUrl = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
          } else {
            alert("Erro ao realizar o download (Status: " + response.status + ")");
          }
        },
        onerror: function (err) {
          overlayDownload.innerHTML = originalHTML;
          overlayDownload.style.pointerEvents = "auto";
          alert("Erro na conexão ao baixar a mídia.");
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (overlayEl && overlayEl.style.display !== "none") {
        if (e.key === "Escape") {
          hideOverlay();
        } else if (e.key === "ArrowLeft") {
          navigateOverlay(-1);
        } else if (e.key === "ArrowRight") {
          navigateOverlay(1);
        } else if (e.key === "+" || e.key === "=") {
          if (overlayImg && overlayImg.style.display !== "none") {
            e.preventDefault();
            setOverlayZoom(overlayZoom + 0.25);
          }
        } else if (e.key === "-") {
          if (overlayImg && overlayImg.style.display !== "none") {
            e.preventDefault();
            setOverlayZoom(overlayZoom - 0.25);
          }
        } else if (e.key === "0") {
          if (overlayImg && overlayImg.style.display !== "none") {
            e.preventDefault();
            resetOverlayZoom();
          }
        }
      }
    });
  }

  function showOverlay(mediaAll, index) {
    createOverlay();
    overlayMedia = mediaAll;
    overlayIndex = index;

    var item = mediaAll[index];
    var isVideo = item.type === "video" || item.type === "animated_gif";
    resetOverlayZoom();

    if (isVideo) {
      overlayImg.style.display = "none";
      overlayVideo.style.display = "block";
      setOverlayZoomControlsVisible(false);

      var videoSrc = (item.video && item.video.urls && item.video.urls[0]) || item.url || "";
      logVerbose("Video source:", videoSrc);

      overlayVideo.poster = "";
      overlayVideo.src = videoSrc;
      overlayVideo.currentTime = 0;
      overlayVideo.play().catch(function (err) {
        logVerbose("Video autoplay prevented:", err);
      });
    } else {
      overlayVideo.style.display = "none";
      overlayVideo.pause();
      overlayVideo.src = "";
      overlayVideo.poster = "";
      overlayImg.style.display = "block";
      overlayImg.src = item.url;
      setOverlayZoomControlsVisible(true);
    }

    overlayEl.style.display = "flex";
    setTimeout(function () {
      overlayEl.style.opacity = "1";
    }, 10);

    var showPrev = mediaAll.length > 1;
    overlayPrev.style.display = showPrev ? "flex" : "none";
    overlayNext.style.display = showPrev ? "flex" : "none";
  }

  function hideOverlay() {
    resetOverlayZoom();
    overlayImg.src = "";
    overlayVideo.pause();
    overlayVideo.src = "";
    overlayVideo.poster = "";
    overlayEl.style.opacity = "0";
    setTimeout(function () {
      overlayEl.style.display = "none";
    }, 200);
    overlayMedia = null;
    overlayIndex = 0;
  }

  function navigateOverlay(direction) {
    if (!overlayMedia || overlayMedia.length < 2) return;
    overlayIndex = (overlayIndex + direction + overlayMedia.length) % overlayMedia.length;
    showOverlay(overlayMedia, overlayIndex);
  }

  // ==================== HELPERS ====================

  function extractTweetData(tweetNode) {
    var link = tweetNode.querySelector('a[href*="/status/"]');
    if (!link) return null;
    var m = link.href.match(/(?:twitter|x)\.com\/([^/]+)\/status\/(\d+)/);
    return m ? { user: m[1], id: m[2] } : null;
  }

  function findShowButton(tweetNode) {
    var buttons = tweetNode.querySelectorAll('button[role="button"]');
    for (var i = 0; i < buttons.length; i++) {
      var txt = (buttons[i].textContent || "").trim();
      // Exact match only — avoids false positives on "Show more", "Show replies", etc.
      if (txt === "Show" || txt === "Mostrar") {
        return buttons[i];
      }
    }
    return null;
  }

  function isRestrictionMatch(text) {
    var normalized = text.replace(/\s+/g, " ").toLowerCase();
    return (
      normalized.indexOf("adult content") !== -1 ||
      normalized.indexOf("age restriction") !== -1 ||
      normalized.indexOf("conteudo adulto") !== -1 ||
      normalized.indexOf("conte\u00fado adulto") !== -1 ||
      normalized.indexOf("restricao de idade") !== -1 ||
      normalized.indexOf("restri\u00e7\u00e3o de idade") !== -1 ||
      normalized.indexOf("contenido para adultos") !== -1 ||
      normalized.indexOf("contenu adulte") !== -1 ||
      normalized.indexOf("sensitive media") !== -1 ||
      normalized.indexOf("sensitive content") !== -1
    );
  }

  function findRestrictionText(tweetNode) {
    var divs = tweetNode.querySelectorAll("div");
    var deepest = null;

    // querySelectorAll returns elements in document order (parents before children).
    // We want the DEEPEST (most nested) div whose text matches the restriction
    // keywords, so we iterate through ALL matches and keep the last one that
    // has no child divs that also match — i.e. the leaf-most match.
    for (var i = 0; i < divs.length; i++) {
      var txt = divs[i].innerText || divs[i].textContent || "";
      if (isRestrictionMatch(txt)) {
        deepest = divs[i];
      }
    }
    return deepest;
  }

  function hasAgeRestriction(tweetNode) {
    var restrictionText = findRestrictionText(tweetNode);
    var showBtn = findShowButton(tweetNode);

    // If we have restriction text, it's definitely age-restricted
    if (restrictionText) return true;

    // A "Show" button alone (without restriction text) is not enough evidence —
    // it could be a generic "Show" button on a normal post.
    // Only accept if the button text is EXACTLY "Show" or "Mostrar" (already
    // guaranteed by findShowButton) AND restriction text is present nearby.
    // Without restriction text, a bare "Show" button is too risky.
    if (showBtn) {
      logVerbose("Show button found but no restriction text — skipping (not age-restricted)");
    }

    return false;
  }

  function findMediaContainer(tweetNode) {
    var btn = findShowButton(tweetNode);
    var textDiv = findRestrictionText(tweetNode);

    // Guard: Ensure we have a tweet article context
    var tweetArticle = tweetNode.closest("article");
    if (!tweetArticle) return null;

    var mediaRoot = null;

    // Find the outer media wrapper (r-9aw3ui) that contains both blur and overlay

    // Strategy 1: Climb up from restriction text or Show button
    var startEl = textDiv || btn;
    if (startEl) {
      var el = startEl;

      for (var i = 0; i < 15 && el && el !== tweetArticle; i++) {
        el = el.parentElement;
        if (!el || el === tweetArticle) break;

        // Check if this element has aria-labelledby (media container marker)
        var ariaLabelledBy = el.getAttribute("aria-labelledby");
        var cls = el.className || "";

        if (ariaLabelledBy && cls.indexOf("r-9aw3ui") !== -1) {
          mediaRoot = el;
          logVerbose("Media container found via aria-labelledby + r-9aw3ui");
          break;
        }

        // Stop if we've gone too high (into tweet text or header area)
        if (el.querySelector('[data-testid="tweetText"]') ||
            el.querySelector('[data-testid="caret"]')) {
          break;
        }
      }
    }

    // Strategy 2: Direct DOM query for aria-labelledby candidates
    if (!mediaRoot) {
      var candidates = tweetNode.querySelectorAll('div[aria-labelledby]');
      for (var j = 0; j < candidates.length; j++) {
        var c = candidates[j];
        var cCls = c.className || "";
        if (cCls.indexOf("r-9aw3ui") !== -1) {
          // Verify this container has restriction content inside
          if (findRestrictionText(c) || findShowButton(c)) {
            mediaRoot = c;
            logVerbose("Media container found via aria-labelledby query");
            break;
          }
        }
      }
    }

    // Strategy 3: Climb and keep last valid candidate
    //    (Stops before tweetText or caret territory)
    if (!mediaRoot && startEl) {
      var el2 = startEl;
      var candidate = null;

      for (var k = 0; k < 12 && el2 && el2 !== tweetArticle; k++) {
        el2 = el2.parentElement;
        if (!el2 || el2 === tweetArticle) break;

        // Stop climbing when we reach a container that's too broad
        if (el2.querySelector('[data-testid="tweetText"]') ||
            el2.querySelector('[data-testid="caret"]')) {
          break;
        }

        candidate = el2;
        logVerbose("Media container candidate at depth", k, "tag:", el2.tagName,
          "classes:", (el2.className || "").substring(0, 80));
      }

      if (candidate) {
        mediaRoot = candidate;
        logVerbose("Media container found (climb strategy)");
      }
    }

    // Strategy 4: Fallback to data-testid media wrappers
    if (!mediaRoot) {
      mediaRoot = tweetNode.querySelector('[data-testid="tweetPhoto"]');
      if (!mediaRoot) {
        mediaRoot = tweetNode.querySelector('[data-testid="videoPlayer"]');
      }
      if (mediaRoot) {
        logVerbose("Media container found via data-testid");
      }
    }

    // Final validation: reject if too large or contains unrelated elements
    if (mediaRoot) {
      if (mediaRoot.querySelector('[data-testid="tweetText"]')) {
        logVerbose("Media container rejected: contains tweetText");
        return null;
      }
      if (mediaRoot.querySelectorAll("article").length > 1) {
        logVerbose("Media container rejected: contains multiple articles");
        return null;
      }
      if (mediaRoot === tweetArticle) {
        logVerbose("Media container rejected: is the article itself");
        return null;
      }
      if (mediaRoot.querySelector('[data-testid="caret"]')) {
        logVerbose("Media container rejected: contains action bar");
        return null;
      }
    }

    return mediaRoot;
  }

  /**
   * Removes any residual blur filters and restriction overlay siblings
   * that may remain in or above the container after reveal.
   */
  function cleanupAfterReveal(container, tweetNode) {
    if (!container || !tweetNode) return;

    var tweetArticle = tweetNode.closest("article");

    // Remove blur/filter from all ancestors up to the article
    var ancestor = container.parentElement;
    while (ancestor && ancestor !== tweetArticle) {
      var style = window.getComputedStyle(ancestor);
      if (style.filter && style.filter !== "none") {
        ancestor.style.filter = "none";
        ancestor.style.webkitFilter = "none";
        logVerbose("Removed filter from ancestor:", ancestor.tagName);
      }
      ancestor = ancestor.parentElement;
    }
  }

  function isVideoMediaItem(item) {
    if (!item) return false;
    return item.type === "video" || item.type === "animated_gif";
  }

  function getVideoMediaSource(item) {
    if (!item) return "";
    if (item.video && item.video.urls && item.video.urls[0]) return item.video.urls[0];
    return item.url || "";
  }

  function markRevealedMediaForPinboard(wrapper, item) {
    if (!wrapper || !item) return;

    wrapper.setAttribute("data-fx-revealed-media", "1");
    wrapper.setAttribute("data-testid", isVideoMediaItem(item) ? "videoPlayer" : "tweetPhoto");

    if (isVideoMediaItem(item)) {
      wrapper.setAttribute("data-fx-media-type", "video");
      return;
    }

    wrapper.setAttribute("data-fx-media-type", "photo");
  }

  function createPinboardVideoMarker(item) {
    var marker = document.createElement("video");
    var source = getVideoMediaSource(item);

    marker.setAttribute("data-fx-pinboard-marker", "1");
    marker.preload = "metadata";
    marker.muted = true;
    marker.src = source;
    marker.poster = item && item.thumbnail_url ? item.thumbnail_url : "";
    marker.style.cssText = [
      "position:absolute",
      "width:1px",
      "height:1px",
      "opacity:0",
      "pointer-events:none",
      "left:0",
      "top:0",
    ].join(";");

    return marker;
  }

  function notifyPinboardMediaRevealed(container, mediaAll, tweetNode) {
    if (!container || !mediaAll || mediaAll.length === 0) return;

    // Pinboard listens through normal DOM mutations today; this namespaced event is
    // a lightweight integration hook for media rescans without depending on Pinboard internals.
    var detail = {
      container: container,
      article: tweetNode || container.closest("article"),
      mediaCount: mediaAll.length,
    };

    try {
      container.dispatchEvent(new CustomEvent("pinboard:media-revealed", { bubbles: true, detail: detail }));
      container.dispatchEvent(new CustomEvent("fx-reveal:media-revealed", { bubbles: true, detail: detail }));
    } catch (err) {
      logVerbose("Media reveal event dispatch failed:", err);
    }
  }

  function findActionBar(tweetNode) {
    var moreBtn = tweetNode.querySelector('[data-testid="caret"]');
    if (moreBtn) {
      var el = moreBtn;
      for (var s = 0; s < 5; s++) {
        if (!el.parentElement) break;
        el = el.parentElement;
        var cls = el.className || "";
        if (cls.indexOf("r-1cmwbt1") !== -1) {
          logVerbose("Action bar found via caret/r-1cmwbt1");
          return el;
        }
      }
      if (moreBtn.parentElement) {
        logVerbose("Action bar found via caret/parent");
        return moreBtn.parentElement;
      }
    }

    var grokBtn = tweetNode.querySelector('button[aria-label*="Grok" i]');
    if (grokBtn) {
      var el2 = grokBtn;
      for (var s2 = 0; s2 < 5; s2++) {
        if (!el2.parentElement) break;
        el2 = el2.parentElement;
        var cls2 = el2.className || "";
        if (cls2.indexOf("r-1cmwbt1") !== -1) {
          logVerbose("Action bar found via Grok/r-1cmwbt1");
          return el2;
        }
      }
      if (grokBtn.parentElement) {
        logVerbose("Action bar found via Grok/parent");
        return grokBtn.parentElement;
      }
    }

    var allDivs = tweetNode.querySelectorAll("div");
    for (var i = 0; i < allDivs.length; i++) {
      var cn = allDivs[i].className || "";
      if (cn.indexOf("r-1kkk96v") !== -1) {
        var flexRow = allDivs[i].querySelector('[class*="r-1cmwbt1"]');
        if (flexRow) {
          logVerbose("Action bar found via r-1kkk96v/r-1cmwbt1");
          return flexRow;
        }
        var firstChild = allDivs[i].firstElementChild;
        if (firstChild) {
          logVerbose("Action bar found via r-1kkk96v/first-child");
          return firstChild;
        }
        logVerbose("Action bar found via r-1kkk96v/self");
        return allDivs[i];
      }
    }

    return null;
  }

  // ==================== TRIGGER REVEAL ====================

  function triggerReveal(mediaContainer, tweetData, btn, source, onSuccess, tweetNode) {
    logVerbose("Reveal source:", source, "tweet:", tweetData && tweetData.id);
    fetchAndReplace(mediaContainer, tweetData, btn, onSuccess, tweetNode);
  }

  // ==================== EYE BUTTON ====================

  function createEyeButton(actionBar, mediaContainer, tweetData) {
    var existing = actionBar.querySelector(".fx-reveal-btn");
    if (existing) return existing;

    var btn = document.createElement("button");
    btn.className = "fx-reveal-btn";
    btn.title = "Reveal image";

    btn.innerHTML = [
      '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;display:block">',
      '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>',
      '<circle cx="12" cy="12" r="3"/>',
      "</svg>",
    ].join("");

    btn.style.cssText = [
      "display:inline-flex",
      "align-items:center",
      "justify-content:center",
      "background:transparent",
      "color:rgb(113,118,123)",
      "border:none",
      "border-radius:9999px",
      "width:34px",
      "height:34px",
      "padding:0",
      "margin:0",
      "cursor:pointer",
      "line-height:1",
      "transition:color 0.15s, background 0.15s",
      "pointer-events:auto",
    ].join(";");

    btn.addEventListener("mouseenter", function () {
      btn.style.background = "rgba(239,243,244,0.1)";
      btn.style.color = "rgb(29,155,240)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.background = "transparent";
      btn.style.color = "rgb(113,118,123)";
    });

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      var parentArticle = btn.closest("article");
      triggerReveal(mediaContainer, tweetData, btn, "manual", null, parentArticle);
    });

    actionBar.insertBefore(btn, actionBar.firstChild);
    logVerbose("Eye button added to action bar");
    return btn;
  }

  // ==================== API FETCH & REPLACE ====================

  function fetchAndReplace(container, tweetData, btn, onSuccess, tweetNode) {
    var url = FX_API + tweetData.user + "/status/" + tweetData.id;

    var cacheKey = tweetData.user + "/" + tweetData.id;
    var cached = getCachedResponse(cacheKey);
    if (cached) {
      var mediaAll = cached.tweet && cached.tweet.media && cached.tweet.media.all;
      if (mediaAll && mediaAll.length > 0) {
        logVerbose("Using cached media:", mediaAll.length, "item(s)");
        replaceWithGrid(container, mediaAll, tweetNode);
        if (btn && btn.parentElement) {
          btn.remove();
        }
        if (onSuccess) onSuccess();
        return;
      }
    }

    logVerbose("Fetching:", url);
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function (res) {
        try {
          var data = JSON.parse(res.responseText);
          var mediaAll = data.tweet && data.tweet.media && data.tweet.media.all;
          if (!mediaAll || mediaAll.length === 0) {
            logVerbose("No media found in API response");
            showError(container, "No media found");
            return;
          }

          logVerbose("Media found:", mediaAll.length, "item(s)");
          if (mediaAll.length > 0 && (mediaAll[0].type === "video" || mediaAll[0].type === "animated_gif")) {
            logVerbose(
              "Video item details:",
              mediaAll[0].url,
              "video.urls:",
              mediaAll[0].video && mediaAll[0].video.urls,
            );
          }
          setCachedResponse(cacheKey, data);
          replaceWithGrid(container, mediaAll, tweetNode);

          // Remove button ONLY on success
          if (btn && btn.parentElement) {
            btn.remove();
          }
          if (onSuccess) onSuccess();
        } catch (err) {
          console.error("[fx-reveal] API parse error:", err);
          showError(container, "API parse error");
          // Button stays for manual retry
        }
      },
      onerror: function () {
        console.error("[fx-reveal] Network error");
        showError(container, "Network error");
        // Button stays for manual retry
      },
    });
  }

  function replaceWithGrid(container, mediaAll, tweetNode) {
    var count = mediaAll.length;
    logVerbose("Replacing with grid layout, count:", count);

    container.innerHTML = "";

    // Mark this container as FX-revealed
    container.setAttribute("data-fx-revealed", "1");

    var containerRules = [
      "background:none",
      "filter:none",
      "position:relative",
    ];

    if (count === 1) {
      containerRules.push("display:block");
      container.style.cssText = containerRules.join(";");

      var singleItem = mediaAll[0];
      var isSingleVideo = singleItem.type === "video" || singleItem.type === "animated_gif";

      // Replicate Twitter's inner wrapper (r-k200y) for proper max-width
      var maxContainerHeight = 510; // Twitter's max media height in feed
      var innerMaxWidth = "100%";

      // Use API dimensions to calculate proper max-width
      var imgWidth = singleItem.width || 0;
      var imgHeight = singleItem.height || 0;
      if (imgWidth > 0 && imgHeight > 0) {
        // Calculate the width the image would need at max height
        var aspectRatio = imgWidth / imgHeight;
        innerMaxWidth = Math.round(maxContainerHeight * aspectRatio) + "px";
        logVerbose("Single image dimensions:", imgWidth, "x", imgHeight, "-> max-width:", innerMaxWidth);
      }

      var innerWrapper = document.createElement("div");
      innerWrapper.style.cssText = "max-width:" + innerMaxWidth;

      var mediaWrapper = document.createElement("div");
      mediaWrapper.style.cssText = [
        "border-radius:16px",
        "overflow:hidden",
        "border:1px solid rgb(47,51,54)",
        "position:relative",
      ].join(";");
      markRevealedMediaForPinboard(mediaWrapper, singleItem);

      var singleImg = makeGridImage(mediaAll, 0, !!isSingleVideo);
      if (isSingleVideo) {
        singleImg.style.minHeight = "200px";
        singleImg.style.width = "100%";
      } else {
        singleImg.style.width = "100%";
        singleImg.style.height = "auto";
      }

      mediaWrapper.appendChild(singleImg);
      innerWrapper.appendChild(mediaWrapper);
      container.appendChild(innerWrapper);

      // Badge goes inside mediaWrapper for proper positioning
      var badge = document.createElement("div");
      badge.textContent = "FX";
      badge.style.cssText = [
        "position:absolute",
        "top:6px",
        "right:6px",
        "background:rgba(29,155,240,0.85)",
        "color:#fff",
        "font-size:10px",
        "font-weight:700",
        "padding:2px 5px",
        "border-radius:4px",
        "z-index:10",
        "pointer-events:none",
        "letter-spacing:0.5px",
      ].join(";");
      mediaWrapper.appendChild(badge);
    } else if (count === 2) {
      containerRules.push("display:grid");
      containerRules.push("grid-template-columns:1fr 1fr");
      containerRules.push("gap:2px");
      containerRules.push("border-radius:16px");
      containerRules.push("overflow:hidden");
      containerRules.push("border:1px solid rgb(47,51,54)");
      container.style.cssText = containerRules.join(";");

      for (var i = 0; i < count; i++) {
        var item = makeGridImage(mediaAll, i, true);
        container.appendChild(item);
      }
    } else if (count === 3) {
      containerRules.push("display:grid");
      containerRules.push("grid-template-columns:1fr 1fr");
      containerRules.push("grid-template-rows:1fr 1fr");
      containerRules.push("gap:2px");
      containerRules.push("border-radius:16px");
      containerRules.push("overflow:hidden");
      containerRules.push("border:1px solid rgb(47,51,54)");
      container.style.cssText = containerRules.join(";");
      container.style.maxHeight = "320px";

      var leftUrl = mediaAll[0].url;
      var leftCell = document.createElement("div");
      leftCell.style.cssText = "display:flex;width:100%;height:100%;overflow:hidden;cursor:pointer;position:relative";
      leftCell.style.gridRow = "1 / -1";
      leftCell.style.gridColumn = "1 / 2";
      markRevealedMediaForPinboard(leftCell, mediaAll[0]);

      var leftImg = document.createElement("img");
      leftImg.src = leftUrl;
      leftImg.alt = "";
      leftImg.draggable = false;
      leftImg.style.cssText =
        "display:block;width:100%;height:100%;object-fit:cover;pointer-events:none;min-width:0;min-height:0";

      leftCell.appendChild(leftImg);
      leftCell.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        showOverlay(mediaAll, 0);
      });
      container.appendChild(leftCell);

      var img1 = makeGridImage(mediaAll, 1, true);
      img1.style.gridRow = "1 / 2";
      img1.style.gridColumn = "2 / 3";
      container.appendChild(img1);

      var img2 = makeGridImage(mediaAll, 2, true);
      img2.style.gridRow = "2 / 3";
      img2.style.gridColumn = "2 / 3";
      container.appendChild(img2);
    } else if (count >= 4) {
      containerRules.push("display:grid");
      containerRules.push("grid-template-columns:1fr 1fr");
      containerRules.push("gap:2px");
      containerRules.push("border-radius:16px");
      containerRules.push("overflow:hidden");
      containerRules.push("border:1px solid rgb(47,51,54)");
      container.style.cssText = containerRules.join(";");
      container.style.maxHeight = "320px";

      for (var j = 0; j < Math.min(count, 4); j++) {
        var item2 = makeGridImage(mediaAll, j, true);
        container.appendChild(item2);
      }
    }

    // Add subtle FX badge to indicate media was revealed by the script
    // (single images already have their badge added inside the mediaWrapper)
    if (count > 1) {
      var badge = document.createElement("div");
      badge.textContent = "FX";
      badge.style.cssText = [
        "position:absolute",
        "top:6px",
        "right:6px",
        "background:rgba(29,155,240,0.85)",
        "color:#fff",
        "font-size:10px",
        "font-weight:700",
        "padding:2px 5px",
        "border-radius:4px",
        "z-index:10",
        "pointer-events:none",
        "letter-spacing:0.5px",
      ].join(";");
      container.appendChild(badge);
    }

    // Clean up the restriction overlay elements (blur, text, Show button)
    // that may still be visible as sibling elements in the DOM
    if (tweetNode) {
      cleanupAfterReveal(container, tweetNode);
    }

    logVerbose("Grid layout applied, images:", count);
    notifyPinboardMediaRevealed(container, mediaAll, tweetNode);
  }

  function makeGridImage(mediaAll, index, square) {
    var mediaUrl = mediaAll[index].url;
    var isVideo = mediaAll[index].type === "video" || mediaAll[index].type === "animated_gif";
    var urlIsVideo =
      mediaUrl.match(/\.(mp4|webm|mov)(\?|$)/i) ||
      mediaUrl.indexOf("/amplify_video/") !== -1 ||
      mediaUrl.indexOf("/video_tweet/") !== -1;

    var containerDiv = document.createElement("div");
    containerDiv.style.cssText = [
      "display:flex",
      "width:100%",
      "height:100%",
      "overflow:hidden",
      "cursor:pointer",
      "position:relative",
    ].join(";");
    markRevealedMediaForPinboard(containerDiv, mediaAll[index]);

    if (isVideo && urlIsVideo) {
      containerDiv.style.background = "#1a1a2e";
      containerDiv.style.justifyContent = "center";
      containerDiv.style.alignItems = "center";
      containerDiv.appendChild(createPinboardVideoMarker(mediaAll[index]));
    } else {
      var img = document.createElement("img");
      img.src = mediaUrl;
      img.alt = "";
      img.draggable = false;

      var imgRules = [
        "display:block",
        "width:100%",
        "height:100%",
        "object-fit:cover",
        "pointer-events:none",
        "min-width:0",
        "min-height:0",
      ];

      if (!square) {
        imgRules.push("object-fit:contain");
        imgRules.push("height:auto");
      } else {
        imgRules.push("aspect-ratio:1 / 1");
      }

      img.style.cssText = imgRules.join(";");

      img.onerror = function () {
        logVerbose("Thumbnail failed to load:", mediaUrl);
        img.style.display = "none";
        containerDiv.style.background = "#1a1a2e";
        containerDiv.style.justifyContent = "center";
        containerDiv.style.alignItems = "center";
      };

      containerDiv.appendChild(img);
    }

    if (isVideo) {
      var playBtn = document.createElement("div");
      playBtn.innerHTML = "&#9654;";
      playBtn.style.cssText = [
        "position:absolute",
        "top:50%",
        "left:50%",
        "transform:translate(-50%,-50%)",
        "background:rgba(0,0,0,0.65)",
        "color:#fff",
        "border-radius:50%",
        "width:44px",
        "height:44px",
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "font-size:20px",
        "pointer-events:none",
        "z-index:2",
        "box-shadow:0 2px 8px rgba(0,0,0,0.3)",
      ].join(";");
      containerDiv.appendChild(playBtn);
    }

    containerDiv.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      logVerbose((isVideo ? "Video" : "Image") + " clicked, opening overlay index:", index);
      showOverlay(mediaAll, index);
    });

    return containerDiv;
  }

  function showError(container, msg) {
    var el = document.createElement("div");
    el.textContent = "\u26A0 fxTwitter: " + msg;
    el.style.cssText = [
      "padding:8px 12px",
      "margin:4px",
      "color:#fff",
      "background:rgba(200,0,0,0.8)",
      "font-size:13px",
      "border-radius:6px",
      "text-align:center",
    ].join(";");
    container.appendChild(el);
  }

  // ==================== SETTINGS MODAL ====================

  var _settingsModalOpen = false;

  function injectSettingsStyles() {
    if (document.getElementById("fx-reveal-settings-style")) return;

    var style = document.createElement("style");
    style.id = "fx-reveal-settings-style";
    style.textContent = [
      "#fx-reveal-settings-overlay {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: 1000000;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-backdrop {",
      "  position: absolute;",
      "  inset: 0;",
      "  background: rgba(0,0,0,0.72);",
      "  backdrop-filter: blur(6px);",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-modal {",
      "  position: relative;",
      "  width: min(560px, calc(100vw - 32px));",
      "  max-height: calc(100vh - 32px);",
      "  overflow: auto;",
      "  border-radius: 20px;",
      "  background: rgba(15,20,25,0.96);",
      "  color: rgb(231,233,234);",
      "  border: 1px solid rgba(255,255,255,0.08);",
      "  box-shadow: 0 20px 80px rgba(0,0,0,0.45);",
      "  padding: 20px;",
      "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-header {",
      "  display: flex;",
      "  justify-content: space-between;",
      "  align-items: flex-start;",
      "  margin-bottom: 20px;",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-header h2 {",
      "  margin: 0 0 4px 0;",
      "  font-size: 20px;",
      "  font-weight: 700;",
      "  color: rgb(231,233,234);",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-header p {",
      "  margin: 0;",
      "  font-size: 13px;",
      "  color: rgb(113,118,123);",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-close {",
      "  background: transparent;",
      "  border: none;",
      "  color: rgb(113,118,123);",
      "  font-size: 18px;",
      "  cursor: pointer;",
      "  padding: 4px 8px;",
      "  border-radius: 999px;",
      "  line-height: 1;",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-close:hover {",
      "  background: rgba(239,243,244,0.1);",
      "  color: rgb(231,233,234);",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-body {",
      "  display: flex;",
      "  flex-direction: column;",
      "  gap: 20px;",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-section h3 {",
      "  margin: 0 0 12px 0;",
      "  font-size: 14px;",
      "  font-weight: 600;",
      "  color: rgb(231,233,234);",
      "  text-transform: uppercase;",
      "  letter-spacing: 0.5px;",
      "}",
      "#fx-reveal-settings-overlay .fx-toggle-row {",
      "  display: flex;",
      "  justify-content: space-between;",
      "  align-items: center;",
      "  padding: 8px 0;",
      "  cursor: pointer;",
      "  font-size: 14px;",
      "  color: rgb(231,233,234);",
      "}",
      "#fx-reveal-settings-overlay .fx-toggle-row input[type='checkbox'] {",
      "  appearance: none;",
      "  -webkit-appearance: none;",
      "  width: 40px;",
      "  height: 22px;",
      "  border-radius: 11px;",
      "  background: rgba(113,118,123,0.4);",
      "  border: none;",
      "  cursor: pointer;",
      "  position: relative;",
      "  transition: background 0.15s;",
      "  flex-shrink: 0;",
      "}",
      "#fx-reveal-settings-overlay .fx-toggle-row input[type='checkbox']::after {",
      "  content: '';",
      "  position: absolute;",
      "  top: 2px;",
      "  left: 2px;",
      "  width: 18px;",
      "  height: 18px;",
      "  border-radius: 50%;",
      "  background: rgb(231,233,234);",
      "  transition: transform 0.15s;",
      "}",
      "#fx-reveal-settings-overlay .fx-toggle-row input[type='checkbox']:checked {",
      "  background: rgb(29,155,240);",
      "}",
      "#fx-reveal-settings-overlay .fx-toggle-row input[type='checkbox']:checked::after {",
      "  transform: translateX(18px);",
      "}",
      "#fx-reveal-settings-overlay .fx-toggle-row input[type='checkbox']:disabled {",
      "  opacity: 0.4;",
      "  cursor: not-allowed;",
      "}",
      "#fx-reveal-settings-overlay .fx-toggle-row.is-disabled span {",
      "  color: rgb(113,118,123);",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-help {",
      "  margin: 0 0 8px 0;",
      "  font-size: 12px;",
      "  color: rgb(113,118,123);",
      "  line-height: 1.4;",
      "}",
      "#fx-reveal-settings-overlay .fx-settings-footer {",
      "  display: flex;",
      "  justify-content: flex-end;",
      "  gap: 8px;",
      "  margin-top: 20px;",
      "  padding-top: 16px;",
      "  border-top: 1px solid rgba(255,255,255,0.08);",
      "}",
      "#fx-reveal-settings-overlay .fx-btn {",
      "  padding: 8px 16px;",
      "  border-radius: 999px;",
      "  font-size: 14px;",
      "  font-weight: 600;",
      "  cursor: pointer;",
      "  border: none;",
      "  transition: background 0.15s;",
      "}",
      "#fx-reveal-settings-overlay .fx-btn-secondary {",
      "  background: rgba(239,243,244,0.1);",
      "  color: rgb(231,233,234);",
      "}",
      "#fx-reveal-settings-overlay .fx-btn-secondary:hover {",
      "  background: rgba(239,243,244,0.2);",
      "}",
      "#fx-reveal-settings-overlay .fx-btn-primary {",
      "  background: rgb(29,155,240);",
      "  color: #fff;",
      "}",
      "#fx-reveal-settings-overlay .fx-btn-primary:hover {",
      "  background: rgb(26,140,216);",
      "}",
    ].join("\n");
    document.head.appendChild(style);
  }

  function createSettingsModal() {
    var root = document.createElement("div");
    root.id = "fx-reveal-settings-overlay";

    var backdrop = document.createElement("div");
    backdrop.className = "fx-settings-backdrop";

    var modal = document.createElement("div");
    modal.className = "fx-settings-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "fx-settings-title");

    var header = document.createElement("div");
    header.className = "fx-settings-header";

    var titleGroup = document.createElement("div");

    var title = document.createElement("h2");
    title.id = "fx-settings-title";
    title.textContent = "Age Bypass Settings";

    var subtitle = document.createElement("p");
    subtitle.textContent = "Configure reveal behavior and debugging.";

    titleGroup.appendChild(title);
    titleGroup.appendChild(subtitle);

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "fx-settings-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "\u2715";

    header.appendChild(titleGroup);
    header.appendChild(closeBtn);

    var body = document.createElement("div");
    body.className = "fx-settings-body";

    // Debug section
    var debugSection = document.createElement("section");
    debugSection.className = "fx-settings-section";

    var debugTitle = document.createElement("h3");
    debugTitle.textContent = "Debug";

    var debugLabel = document.createElement("label");
    debugLabel.className = "fx-toggle-row";

    var debugSpan = document.createElement("span");
    debugSpan.textContent = "Verbose logging";

    var debugInput = document.createElement("input");
    debugInput.type = "checkbox";
    debugInput.setAttribute("data-setting", "debugVerbose");

    debugLabel.appendChild(debugSpan);
    debugLabel.appendChild(debugInput);

    debugSection.appendChild(debugTitle);
    debugSection.appendChild(debugLabel);

    // Experimental section
    var expSection = document.createElement("section");
    expSection.className = "fx-settings-section";

    var expTitle = document.createElement("h3");
    expTitle.textContent = "Experimental";

    var autoRevealLabel = document.createElement("label");
    autoRevealLabel.className = "fx-toggle-row";
    autoRevealLabel.setAttribute("data-toggle-row", "autoReveal");

    var autoRevealSpan = document.createElement("span");
    autoRevealSpan.textContent = "Auto-reveal";

    var autoRevealInput = document.createElement("input");
    autoRevealInput.type = "checkbox";
    autoRevealInput.setAttribute("data-setting", "experimental.autoReveal");

    autoRevealLabel.appendChild(autoRevealSpan);
    autoRevealLabel.appendChild(autoRevealInput);

    var autoRevealHelp = document.createElement("p");
    autoRevealHelp.className = "fx-settings-help";
    autoRevealHelp.textContent = "Automatically reveals restricted media where allowed by the current mode.";

    var revealOnPostLabel = document.createElement("label");
    revealOnPostLabel.className = "fx-toggle-row";
    revealOnPostLabel.setAttribute("data-toggle-row", "revealOnPost");

    var revealOnPostSpan = document.createElement("span");
    revealOnPostSpan.textContent = "Reveal on post";

    var revealOnPostInput = document.createElement("input");
    revealOnPostInput.type = "checkbox";
    revealOnPostInput.setAttribute("data-setting", "experimental.revealOnPost");

    revealOnPostLabel.appendChild(revealOnPostSpan);
    revealOnPostLabel.appendChild(revealOnPostInput);

    var revealOnPostHelp = document.createElement("p");
    revealOnPostHelp.className = "fx-settings-help";
    revealOnPostHelp.textContent =
      "When enabled together with Auto-reveal, single post pages auto-reveal while feed stays manual.";

    expSection.appendChild(expTitle);
    expSection.appendChild(autoRevealLabel);
    expSection.appendChild(autoRevealHelp);
    expSection.appendChild(revealOnPostLabel);
    expSection.appendChild(revealOnPostHelp);

    body.appendChild(debugSection);
    body.appendChild(expSection);

    var footer = document.createElement("div");
    footer.className = "fx-settings-footer";

    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "fx-btn fx-btn-secondary";
    resetBtn.setAttribute("data-action", "reset");
    resetBtn.textContent = "Reset";

    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "fx-btn fx-btn-primary";
    saveBtn.setAttribute("data-action", "save");
    saveBtn.textContent = "Save";

    footer.appendChild(resetBtn);
    footer.appendChild(saveBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);

    root.appendChild(backdrop);
    root.appendChild(modal);

    return root;
  }

  function renderSettingsIntoModal(root) {
    var inputs = root.querySelectorAll("input[data-setting]");
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var key = input.getAttribute("data-setting");
      var value = false;

      if (key === "debugVerbose") {
        value = SETTINGS.debugVerbose;
      } else if (key === "experimental.autoReveal") {
        value = SETTINGS.experimental && SETTINGS.experimental.autoReveal;
      } else if (key === "experimental.revealOnPost") {
        value = SETTINGS.experimental && SETTINGS.experimental.revealOnPost;
      }

      input.checked = !!value;
    }

    // Disable revealOnPost when autoReveal is off
    var autoRevealInput = root.querySelector('input[data-setting="experimental.autoReveal"]');
    var revealOnPostInput = root.querySelector('input[data-setting="experimental.revealOnPost"]');
    var revealOnPostLabel = root.querySelector('[data-toggle-row="revealOnPost"]');
    if (autoRevealInput && revealOnPostInput && revealOnPostLabel) {
      if (!autoRevealInput.checked) {
        revealOnPostInput.disabled = true;
        revealOnPostLabel.className = "fx-toggle-row is-disabled";
      } else {
        revealOnPostInput.disabled = false;
        revealOnPostLabel.className = "fx-toggle-row";
      }
    }
  }

  function readSettingsFromModal(root) {
    var inputs = root.querySelectorAll("input[data-setting]");
    var result = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      var key = input.getAttribute("data-setting");
      var checked = input.checked;

      if (key === "debugVerbose") {
        result.debugVerbose = checked;
      } else if (key === "experimental.autoReveal") {
        result.experimental.autoReveal = checked;
      } else if (key === "experimental.revealOnPost") {
        result.experimental.revealOnPost = checked;
      }
    }

    return result;
  }

  function openSettingsModal() {
    if (_settingsModalOpen) return;

    injectSettingsStyles();

    var overlay = createSettingsModal();
    document.body.appendChild(overlay);
    renderSettingsIntoModal(overlay);
    _settingsModalOpen = true;

    // Wire up autoReveal change listener to toggle revealOnPost disabled state
    var autoRevealInput = overlay.querySelector('input[data-setting="experimental.autoReveal"]');
    var revealOnPostInput = overlay.querySelector('input[data-setting="experimental.revealOnPost"]');
    var revealOnPostLabel = overlay.querySelector('[data-toggle-row="revealOnPost"]');
    if (autoRevealInput && revealOnPostInput && revealOnPostLabel) {
      autoRevealInput.addEventListener("change", function () {
        if (!autoRevealInput.checked) {
          revealOnPostInput.disabled = true;
          revealOnPostLabel.className = "fx-toggle-row is-disabled";
        } else {
          revealOnPostInput.disabled = false;
          revealOnPostLabel.className = "fx-toggle-row";
        }
      });
    }

    // Backdrop click closes modal
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.classList.contains("fx-settings-backdrop")) {
        closeSettingsModal();
      }
    });

    // Close button (X) closes modal
    var closeBtn = overlay.querySelector(".fx-settings-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        closeSettingsModal();
      });
    }

    // Save button
    var saveBtn = overlay.querySelector('[data-action="save"]');
    saveBtn.addEventListener("click", function () {
      var newSettings = readSettingsFromModal(overlay);
      saveSettings(newSettings);
      SETTINGS.debugVerbose = newSettings.debugVerbose;
      SETTINGS.experimental.autoReveal = newSettings.experimental.autoReveal;
      SETTINGS.experimental.revealOnPost = newSettings.experimental.revealOnPost;
      logAlways("Settings saved");
      closeSettingsModal();
    });

    // Reset button
    var resetBtn = overlay.querySelector('[data-action="reset"]');
    resetBtn.addEventListener("click", function () {
      var defaults = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      saveSettings(defaults);
      SETTINGS.debugVerbose = defaults.debugVerbose;
      SETTINGS.experimental.autoReveal = defaults.experimental.autoReveal;
      SETTINGS.experimental.revealOnPost = defaults.experimental.revealOnPost;
      renderSettingsIntoModal(overlay);
      logAlways("Settings reset to defaults");
    });

    logAlways("Settings modal opened");
  }

  function closeSettingsModal() {
    var overlay = document.getElementById("fx-reveal-settings-overlay");
    if (overlay) {
      overlay.remove();
    }
    _settingsModalOpen = false;
    logVerbose("Settings modal closed");
  }

  // ESC to close modal
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var modal = document.getElementById("fx-reveal-settings-overlay");
      if (modal) closeSettingsModal();
    }
  });

  // ==================== MENU COMMAND ====================

  if (typeof GM_registerMenuCommand !== "undefined") {
    GM_registerMenuCommand("Age Bypass Settings", function () {
      openSettingsModal();
    });
  }

  // ==================== MAIN ====================

  var PROCESSED_CLASS = "fx-rvl-processed";

  function processTweet(tweetNode) {
    if (!tweetNode || tweetNode.classList.contains(PROCESSED_CLASS)) return;
    if (!hasAgeRestriction(tweetNode)) return;

    var tweetData = extractTweetData(tweetNode);
    if (!tweetData) {
      logVerbose("Could not extract tweet data");
      return;
    }

    var actionBar = findActionBar(tweetNode);
    if (!actionBar) {
      logVerbose("Could not find action bar for:", tweetData.user, tweetData.id);
      return;
    }

    var mediaContainer = findMediaContainer(tweetNode);
    if (!mediaContainer) {
      logVerbose("Could not find media container for:", tweetData.user, tweetData.id);
      return;
    }

    tweetNode.classList.add(PROCESSED_CLASS);
    logVerbose("Processing tweet:", tweetData.user, tweetData.id);

    var btn = createEyeButton(actionBar, mediaContainer, tweetData);

    if (shouldAutoRevealHere() && canAutoReveal(tweetNode)) {
      markAutoRevealPending(tweetNode);

      var delay = isPostPage() ? 0 : 50;
      setTimeout(function () {
        try {
          triggerReveal(mediaContainer, tweetData, btn, "auto", function () {
            markAutoRevealed(tweetNode);
          }, tweetNode);
        } catch (err) {
          clearAutoRevealPending(tweetNode);
          logVerbose("Auto-reveal failed", err);
        }
      }, delay);
    }
  }

  var observer = new MutationObserver(function (mutations) {
    for (var m = 0; m < mutations.length; m++) {
      var nodes = mutations[m].addedNodes;
      for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        if (node.nodeType !== 1) continue;
        if (node.matches && node.matches("article")) {
          processTweet(node);
        } else if (node.querySelector) {
          var article = node.querySelector("article");
          if (article) processTweet(article);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  var allArticles = document.querySelectorAll("article");
  for (var k = 0; k < allArticles.length; k++) {
    allArticles[k].classList.remove("fx-processed");
    processTweet(allArticles[k]);
  }
})();
