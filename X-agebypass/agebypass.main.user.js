// ==UserScript==
// @name         Age Bypass for Twitter
// @namespace    Age Bypass for Twitter
// @version      1.0.0
// @description  Adds a reveal button (eye icon) to bypass X/Twitter age-restricted media via the fxTwitter API. Features grid layout and lightbox viewer.
// @author       gabszap
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @updateURL    https://github.com/gabszap/extensions/raw/refs/heads/main/X-agebypass/agebypass.main.user.js
// @downloadURL  https://github.com/gabszap/extensions/raw/refs/heads/main/X-agebypass/agebypass.main.user.js
// ==/UserScript==

(function () {
    "use strict";

    var FX_API = "https://api.fxtwitter.com/";

    var VERSION = (typeof GM_info !== "undefined" && GM_info && GM_info.script && GM_info.script.version) || "unknown";
    console.log("[fx-reveal] Script loaded v" + VERSION);

    // ==================== OVERLAY ====================

    var overlayEl = null;
    var overlayImg = null;
    var overlayVideo = null;
    var overlayClose = null;
    var overlayPrev = null;
    var overlayNext = null;
    var overlayMedia = null; // full mediaAll array
    var overlayIndex = 0;

    function createOverlay() {
        if (overlayEl) return;

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
            "opacity:0",
            "transition:opacity 0.2s ease"
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
            "box-shadow:0 4px 40px rgba(0,0,0,0.5)"
        ].join(";");

        overlayVideo = document.createElement("video");
        overlayVideo.style.cssText = [
            "max-width:92vw",
            "max-height:92vh",
            "object-fit:contain",
            "border-radius:12px",
            "position:relative",
            "z-index:2",
            "display:none",
            "box-shadow:0 4px 40px rgba(0,0,0,0.5)"
        ].join(";");
        overlayVideo.controls = true;
        overlayVideo.preload = "metadata";

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
            "font-size:20px",
            "cursor:pointer",
            "z-index:3",
            "display:none",
            "align-items:center",
            "justify-content:center",
            "transition:background 0.15s"
        ].join(";");
        overlayPrev.addEventListener("mouseenter", function () { overlayPrev.style.background = "rgba(255,255,255,0.25)"; });
        overlayPrev.addEventListener("mouseleave", function () { overlayPrev.style.background = "rgba(255,255,255,0.1)"; });

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
            "font-size:20px",
            "cursor:pointer",
            "z-index:3",
            "display:none",
            "align-items:center",
            "justify-content:center",
            "transition:background 0.15s"
        ].join(";");
        overlayNext.addEventListener("mouseenter", function () { overlayNext.style.background = "rgba(255,255,255,0.25)"; });
        overlayNext.addEventListener("mouseleave", function () { overlayNext.style.background = "rgba(255,255,255,0.1)"; });

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
            "font-size:18px",
            "cursor:pointer",
            "z-index:3",
            "display:flex",
            "align-items:center",
            "justify-content:center",
            "transition:background 0.15s"
        ].join(";");
        closeBtn.addEventListener("mouseenter", function () { closeBtn.style.background = "rgba(255,255,255,0.25)"; });
        closeBtn.addEventListener("mouseleave", function () { closeBtn.style.background = "rgba(255,255,255,0.1)"; });

        overlayEl.appendChild(overlayPrev);
        overlayEl.appendChild(overlayNext);
        overlayEl.appendChild(overlayImg);
        overlayEl.appendChild(overlayVideo);
        overlayEl.appendChild(closeBtn);
        document.body.appendChild(overlayEl);

        // Events
        overlayEl.addEventListener("click", function (e) {
            if (e.target === overlayEl) {
                hideOverlay();
            }
        });
        overlayImg.addEventListener("click", function () {
            // Open current image in new tab
            if (overlayImg.src && overlayImg.src.indexOf("data:") !== 0) {
                window.open(overlayImg.src, "_blank");
            } else if (overlayMedia && overlayMedia[overlayIndex]) {
                window.open(overlayMedia[overlayIndex].url, "_blank");
            }
        });
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

        // Keyboard
        document.addEventListener("keydown", function (e) {
            if (overlayEl && overlayEl.style.display !== "none") {
                if (e.key === "Escape") {
                    hideOverlay();
                } else if (e.key === "ArrowLeft") {
                    navigateOverlay(-1);
                } else if (e.key === "ArrowRight") {
                    navigateOverlay(1);
                }
            }
        });
    }

    function showOverlay(mediaAll, index) {
        createOverlay();
        overlayMedia = mediaAll;
        overlayIndex = index;

        var item = mediaAll[index];
        var isVideo = (item.type === "video" || item.type === "animated_gif");

        if (isVideo) {
            overlayImg.style.display = "none";
            overlayVideo.style.display = "block";

            // Determine video source: prefer item.video.urls[0], fallback to item.url (direct MP4)
            var videoSrc = (item.video && item.video.urls && item.video.urls[0]) || item.url || "";
            console.log("[fx-reveal] Video source:", videoSrc);

            overlayVideo.poster = "";
            overlayVideo.src = videoSrc;
            overlayVideo.currentTime = 0;
            overlayVideo.play().catch(function (err) {
                console.log("[fx-reveal] Video autoplay prevented:", err);
            });
        } else {
            overlayVideo.style.display = "none";
            overlayVideo.pause();
            overlayVideo.src = "";
            overlayVideo.poster = "";
            overlayImg.style.display = "block";
            overlayImg.src = item.url;
        }

        overlayEl.style.display = "flex";
        setTimeout(function () { overlayEl.style.opacity = "1"; }, 10);

        var showPrev = mediaAll.length > 1;
        overlayPrev.style.display = showPrev ? "flex" : "none";
        overlayNext.style.display = showPrev ? "flex" : "none";
    }

    function hideOverlay() {
        overlayImg.src = "";
        overlayVideo.pause();
        overlayVideo.src = "";
        overlayVideo.poster = "";
        overlayEl.style.opacity = "0";
        setTimeout(function () { overlayEl.style.display = "none"; }, 200);
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
            var txt = buttons[i].textContent || "";
            if (txt.indexOf("Mostrar") !== -1 || txt.indexOf("Show") !== -1) {
                return buttons[i];
            }
        }
        return null;
    }

    function findRestrictionText(tweetNode) {
        var divs = tweetNode.querySelectorAll("div");
        for (var i = 0; i < divs.length; i++) {
            var txt = divs[i].innerText || divs[i].textContent || "";
            if (
                txt.indexOf("Conte\u00fado adulto com restri\u00e7\u00e3o de idade") !== -1 ||
                txt.indexOf("Adult content with age restriction") !== -1
            ) {
                return divs[i];
            }
        }
        return null;
    }

    function hasAgeRestriction(tweetNode) {
        if (findShowButton(tweetNode)) return true;
        if (findRestrictionText(tweetNode)) return true;
        return false;
    }

    function findMediaContainer(tweetNode) {
        var btn = findShowButton(tweetNode);
        if (btn) {
            var el = btn.parentElement;
            if (el) el = el.parentElement;
            if (el) el = el.parentElement;
            if (el) {
                console.log("[fx-reveal] Media container found via button:", el.className.slice(0, 80));
                return el;
            }
        }

        var textDiv = findRestrictionText(tweetNode);
        if (textDiv) {
            var el2 = textDiv.parentElement;
            if (el2) el2 = el2.parentElement;
            if (el2) el2 = el2.parentElement;
            if (el2) el2 = el2.parentElement;
            if (el2) {
                console.log("[fx-reveal] Media container found via text:", el2.className.slice(0, 80));
                return el2;
            }
        }

        return null;
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
                    console.log("[fx-reveal] Action bar found via caret/r-1cmwbt1");
                    return el;
                }
            }
            if (moreBtn.parentElement) {
                console.log("[fx-reveal] Action bar found via caret/parent");
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
                    console.log("[fx-reveal] Action bar found via Grok/r-1cmwbt1");
                    return el2;
                }
            }
            if (grokBtn.parentElement) {
                console.log("[fx-reveal] Action bar found via Grok/parent");
                return grokBtn.parentElement;
            }
        }

        var allDivs = tweetNode.querySelectorAll("div");
        for (var i = 0; i < allDivs.length; i++) {
            var cn = allDivs[i].className || "";
            if (cn.indexOf("r-1kkk96v") !== -1) {
                var flexRow = allDivs[i].querySelector('[class*="r-1cmwbt1"]');
                if (flexRow) {
                    console.log("[fx-reveal] Action bar found via r-1kkk96v/r-1cmwbt1");
                    return flexRow;
                }
                var firstChild = allDivs[i].firstElementChild;
                if (firstChild) {
                    console.log("[fx-reveal] Action bar found via r-1kkk96v/first-child");
                    return firstChild;
                }
                console.log("[fx-reveal] Action bar found via r-1kkk96v/self");
                return allDivs[i];
            }
        }

        return null;
    }

    // ==================== EYE BUTTON ====================

    function createEyeButton(actionBar, mediaContainer, tweetData) {
        if (actionBar.querySelector(".fx-reveal-btn")) return;

        var btn = document.createElement("button");
        btn.className = "fx-reveal-btn";
        btn.title = "Reveal image";

        btn.innerHTML = [
            '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;display:block">',
            '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>',
            '<circle cx="12" cy="12" r="3"/>',
            '</svg>'
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
            "pointer-events:auto"
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
            console.log("[fx-reveal] Eye button clicked for tweet:", tweetData.user, tweetData.id);
            fetchAndReplace(mediaContainer, tweetData, btn);
        });

        actionBar.insertBefore(btn, actionBar.firstChild);
        console.log("[fx-reveal] Eye button added to action bar");
    }

    // ==================== API FETCH & REPLACE ====================

    function fetchAndReplace(container, tweetData, btn) {
        var url = FX_API + tweetData.user + "/status/" + tweetData.id;
        console.log("[fx-reveal] Fetching:", url);

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (res) {
                try {
                    var data = JSON.parse(res.responseText);
                    var mediaAll = data.tweet && data.tweet.media && data.tweet.media.all;
                    if (!mediaAll || mediaAll.length === 0) {
                        console.log("[fx-reveal] No media found in API response");
                        showError(container, "No media found");
                        return;
                    }

                    console.log("[fx-reveal] Media found:", mediaAll.length, "item(s)");
                    if (mediaAll.length > 0 && (mediaAll[0].type === "video" || mediaAll[0].type === "animated_gif")) {
                        console.log("[fx-reveal] Video item details:", mediaAll[0].url, "video.urls:", mediaAll[0].video && mediaAll[0].video.urls);
                    }
                    replaceWithGrid(container, mediaAll);
                } catch (err) {
                    console.error("[fx-reveal] API parse error:", err);
                    showError(container, "API parse error");
                }
            },
            onerror: function () {
                console.error("[fx-reveal] Network error");
                showError(container, "Network error");
            }
        });

        if (btn && btn.parentElement) {
            btn.remove();
        }
    }

    function replaceWithGrid(container, mediaAll) {
        var count = mediaAll.length;
        console.log("[fx-reveal] Replacing with grid layout, count:", count);

        container.innerHTML = "";

        var containerRules = [
            "background:none",
            "filter:none",
            "position:relative",
            "border-radius:16px",
            "overflow:hidden"
        ];

        if (count === 1) {
            containerRules.push("display:block");
            container.style.cssText = containerRules.join(";");

            var singleItem = mediaAll[0];
            var isSingleVideo = (singleItem.type === "video" || singleItem.type === "animated_gif");
            var singleImg = makeGridImage(mediaAll, 0, isSingleVideo ? true : false);
            if (isSingleVideo) {
                singleImg.style.minHeight = "200px";
                singleImg.style.width = "100%";
            } else {
                singleImg.style.width = "100%";
                singleImg.style.height = "auto";
            }
            container.appendChild(singleImg);
        } else if (count === 2) {
            containerRules.push("display:grid");
            containerRules.push("grid-template-columns:1fr 1fr");
            containerRules.push("gap:2px");
            container.style.cssText = containerRules.join(";");

            for (var i = 0; i < count; i++) {
                var item = makeGridImage(mediaAll, i, true);
                container.appendChild(item);
            }
        } else if (count === 3) {
            // 1 large left (spans full height, cropped via cover), 2 stacked right (square)
            containerRules.push("display:grid");
            containerRules.push("grid-template-columns:1fr 1fr");
            containerRules.push("grid-template-rows:1fr 1fr");
            containerRules.push("gap:2px");
            container.style.cssText = containerRules.join(";");
            container.style.maxHeight = "320px";

            // LEFT: spans both rows, fills cell with object-fit:cover (may crop)
            var leftUrl = mediaAll[0].url;
            var leftCell = document.createElement("div");
            leftCell.style.cssText = "display:flex;width:100%;height:100%;overflow:hidden;cursor:pointer;position:relative";
            leftCell.style.gridRow = "1 / -1";
            leftCell.style.gridColumn = "1 / 2";

            var leftImg = document.createElement("img");
            leftImg.src = leftUrl;
            leftImg.alt = "";
            leftImg.draggable = false;
            leftImg.style.cssText = "display:block;width:100%;height:100%;object-fit:cover;pointer-events:none;min-width:0;min-height:0";

            leftCell.appendChild(leftImg);
            leftCell.addEventListener("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
                showOverlay(mediaAll, 0);
            });
            container.appendChild(leftCell);

            // RIGHT TOP: square cell
            var img1 = makeGridImage(mediaAll, 1, true);
            img1.style.gridRow = "1 / 2";
            img1.style.gridColumn = "2 / 3";
            container.appendChild(img1);

            // RIGHT BOTTOM: square cell
            var img2 = makeGridImage(mediaAll, 2, true);
            img2.style.gridRow = "2 / 3";
            img2.style.gridColumn = "2 / 3";
            container.appendChild(img2);
        } else if (count >= 4) {
            // 2x2 grid for 4+ images
            containerRules.push("display:grid");
            containerRules.push("grid-template-columns:1fr 1fr");
            containerRules.push("gap:2px");
            container.style.cssText = containerRules.join(";");
            container.style.maxHeight = "320px";

            for (var j = 0; j < Math.min(count, 4); j++) {
                var item2 = makeGridImage(mediaAll, j, true);
                container.appendChild(item2);
            }
        }

        console.log("[fx-reveal] Grid layout applied, images:", count);
    }

    function makeGridImage(mediaAll, index, square) {
        var mediaUrl = mediaAll[index].url;
        var isVideo = (mediaAll[index].type === "video" || mediaAll[index].type === "animated_gif");
        var urlIsVideo = mediaUrl.match(/\.(mp4|webm|mov)(\?|$)/i) || mediaUrl.indexOf("/amplify_video/") !== -1 || mediaUrl.indexOf("/video_tweet/") !== -1;

        var containerDiv = document.createElement("div");
        containerDiv.style.cssText = [
            "display:flex",
            "width:100%",
            "height:100%",
            "overflow:hidden",
            "cursor:pointer",
            "position:relative"
        ].join(";");

        // For videos whose URL is a direct MP4 (not a thumbnail image), skip the img
        if (isVideo && urlIsVideo) {
            // Dark background with play button
            containerDiv.style.background = "#1a1a2e";
            containerDiv.style.justifyContent = "center";
            containerDiv.style.alignItems = "center";
        } else {
            // Normal thumbnail image (photo or video with thumbnail URL)
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
                "min-height:0"
            ];

            if (!square) {
                imgRules.push("object-fit:contain");
                imgRules.push("height:auto");
            } else {
                imgRules.push("aspect-ratio:1 / 1");
            }

            img.style.cssText = imgRules.join(";");

            // Log thumbnail load failures
            img.onerror = function () {
                console.log("[fx-reveal] Thumbnail failed to load:", mediaUrl);
                img.style.display = "none";
                containerDiv.style.background = "#1a1a2e";
                containerDiv.style.justifyContent = "center";
                containerDiv.style.alignItems = "center";
            };

            containerDiv.appendChild(img);
        }

        // Play button overlay for videos (always)
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
                "box-shadow:0 2px 8px rgba(0,0,0,0.3)"
            ].join(";");
            containerDiv.appendChild(playBtn);
        }

        // Click to open overlay
        containerDiv.addEventListener("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("[fx-reveal] " + (isVideo ? "Video" : "Image") + " clicked, opening overlay index:", index);
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
            "text-align:center"
        ].join(";");
        container.appendChild(el);
    }

    // ==================== MAIN ====================

    var PROCESSED_CLASS = "fx-rvl-processed";

    function processTweet(tweetNode) {
        if (!tweetNode || tweetNode.classList.contains(PROCESSED_CLASS)) return;
        if (!hasAgeRestriction(tweetNode)) return;

        var tweetData = extractTweetData(tweetNode);
        if (!tweetData) {
            console.log("[fx-reveal] Could not extract tweet data");
            return;
        }

        var actionBar = findActionBar(tweetNode);
        if (!actionBar) {
            console.log("[fx-reveal] Could not find action bar for:", tweetData.user, tweetData.id);
            return;
        }

        var mediaContainer = findMediaContainer(tweetNode);
        if (!mediaContainer) {
            console.log("[fx-reveal] Could not find media container for:", tweetData.user, tweetData.id);
            return;
        }

        tweetNode.classList.add(PROCESSED_CLASS);
        console.log("[fx-reveal] Processing tweet:", tweetData.user, tweetData.id);
        createEyeButton(actionBar, mediaContainer, tweetData);
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
