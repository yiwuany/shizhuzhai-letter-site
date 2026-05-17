(function () {
  "use strict";

  const ASSETS = Array.isArray(window.SHIZHUZHAI_ASSETS) ? window.SHIZHUZHAI_ASSETS : [];
  const STORAGE_KEY = "shizhuzhai-letter-v2";
  const LEGACY_STORAGE_KEY = "shizhuzhai-letter-v1";

  const FONT_OPTIONS = [
    {
      value: "song",
      labelKey: "fontSong",
      stack: '"Songti SC", "STSong", "SimSun", "Noto Serif CJK SC", "PMingLiU", serif'
    },
    {
      value: "kai",
      labelKey: "fontKai",
      stack: '"Kaiti SC", "KaiTi", "STKaiti", "DFKai-SB", serif'
    },
    {
      value: "fangsong",
      labelKey: "fontFangSong",
      stack: '"FangSong", "FangSong_GB2312", "STFangsong", serif'
    },
    {
      value: "hei",
      labelKey: "fontHei",
      stack: '"Microsoft YaHei UI", "Microsoft YaHei", "SimHei", sans-serif'
    },
    {
      value: "serif",
      labelKey: "fontSystemSerif",
      stack: 'Georgia, "Times New Roman", "Songti SC", serif'
    }
  ];

  const DEFAULT_STYLE = {
    fontFamily: "song",
    fontSize: 22,
    lineHeight: 1.72,
    letterSpacing: 0.06,
    inkColor: "#3f3931",
    inkOpacity: 95,
    paperBrightness: 100,
    paperContrast: 100,
    paperSaturation: 96,
    maskOpacity: 12,
    gridOpacity: 34,
    showTitle: true,
    showSignature: true,
    showSeal: true,
    sealText: "雅"
  };

  const DEFAULT_STATE = {
    language: "zh-Hant",
    category: "all",
    selectedId: "",
    writingMode: "vertical",
    mode: "setup",
    title: "山中寄友",
    body: "展信安。\n\n窗前新雨初歇，紙上尚有竹齋舊色。想起前日同看花影，便覺山水也有回音。\n\n此箋不為長篇，只願把一點清明寄到你案前。",
    signature: "某年春日",
    style: DEFAULT_STYLE
  };

  const I18N = {
    "zh-Hant": {
      brand: "十竹齋箋譜寫信",
      tagline: "選箋、設格、入紙書寫",
      switchLang: "简体",
      enterImmersive: "進入沉浸編輯",
      exitImmersive: "返回設定",
      library: "箋紙",
      allCategories: "全部",
      totalCount: "張箋紙",
      randomAll: "全庫隨機",
      randomCategory: "本類隨機",
      currentPaper: "當前箋紙",
      editor: "設定",
      titleLabel: "題名",
      bodyLabel: "正文",
      signatureLabel: "落款",
      titlePlaceholder: "題名",
      bodyPlaceholder: "在箋紙上直接書寫",
      signaturePlaceholder: "落款",
      direction: "排版方向",
      vertical: "直排",
      horizontal: "橫排",
      style: "字與界格",
      fontFamily: "字體",
      fontSong: "宋體",
      fontKai: "楷體",
      fontFangSong: "仿宋",
      fontHei: "黑體",
      fontSystemSerif: "系統襯線",
      fontSize: "字號",
      lineHeight: "行距",
      letterSpacing: "字距",
      inkColor: "墨色",
      inkOpacity: "文字透明",
      paperBrightness: "箋紙亮度",
      paperContrast: "箋紙對比",
      paperSaturation: "箋紙飽和",
      maskOpacity: "紙面柔化",
      gridOpacity: "界格濃淡",
      showTitle: "顯示題名",
      showSignature: "顯示落款",
      showSeal: "顯示印章",
      sealText: "印章文字",
      resetStyle: "重置樣式",
      resetContent: "重置內容",
      resetAll: "重置全部",
      confirmResetContent: "清空題名、正文和落款？",
      confirmResetAll: "清除本機保存並回到預設狀態？",
      noAssets: "尚未生成素材清單。請先執行 tools/build-assets.ps1。",
      paperMeta: "分類",
      immersiveHint: "可直接在箋紙上書寫，按 Esc 返回設定",
      px: "px",
      percent: "%"
    },
    "zh-Hans": {
      brand: "十竹斋笺谱写信",
      tagline: "选笺、设格、入纸书写",
      switchLang: "繁體",
      enterImmersive: "进入沉浸编辑",
      exitImmersive: "返回设置",
      library: "笺纸",
      allCategories: "全部",
      totalCount: "张笺纸",
      randomAll: "全库随机",
      randomCategory: "本类随机",
      currentPaper: "当前笺纸",
      editor: "设置",
      titleLabel: "题名",
      bodyLabel: "正文",
      signatureLabel: "落款",
      titlePlaceholder: "题名",
      bodyPlaceholder: "在笺纸上直接书写",
      signaturePlaceholder: "落款",
      direction: "排版方向",
      vertical: "直排",
      horizontal: "横排",
      style: "字与界格",
      fontFamily: "字体",
      fontSong: "宋体",
      fontKai: "楷体",
      fontFangSong: "仿宋",
      fontHei: "黑体",
      fontSystemSerif: "系统衬线",
      fontSize: "字号",
      lineHeight: "行距",
      letterSpacing: "字距",
      inkColor: "墨色",
      inkOpacity: "文字透明",
      paperBrightness: "笺纸亮度",
      paperContrast: "笺纸对比",
      paperSaturation: "笺纸饱和",
      maskOpacity: "纸面柔化",
      gridOpacity: "界格浓淡",
      showTitle: "显示题名",
      showSignature: "显示落款",
      showSeal: "显示印章",
      sealText: "印章文字",
      resetStyle: "重置样式",
      resetContent: "重置内容",
      resetAll: "重置全部",
      confirmResetContent: "清空题名、正文和落款？",
      confirmResetAll: "清除本机保存并回到默认状态？",
      noAssets: "尚未生成素材清单。请先执行 tools/build-assets.ps1。",
      paperMeta: "分类",
      immersiveHint: "可直接在笺纸上书写，按 Esc 返回设置",
      px: "px",
      percent: "%"
    }
  };

  const els = {};
  let state = normalizeState(loadState());
  let fitFrame = 0;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    els.root = document.querySelector("[data-app]");
    els.topbar = document.getElementById("topbar");
    els.library = document.getElementById("libraryPanel");
    els.preview = document.getElementById("previewPanel");
    els.editor = document.getElementById("editorPanel");

    if (!els.root) return;

    ensureSelectedAsset();
    renderAll();
    bindEvents();
    updatePaper();
    saveState();
  }

  function bindEvents() {
    els.root.addEventListener("click", handleClick);
    els.root.addEventListener("input", handleInput);
    els.root.addEventListener("change", handleInput);
    window.addEventListener("resize", requestFitPaper);

    els.root.addEventListener("paste", function (event) {
      const editable = event.target.closest("[data-edit-field]");
      if (!editable) return;
      event.preventDefault();
      const text = (event.clipboardData || window.clipboardData).getData("text/plain");
      document.execCommand("insertText", false, text);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && state.mode === "immersive") {
        exitImmersive();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        enterImmersive();
      }
    });
  }

  function handleClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;

    if (action === "toggle-language") {
      state.language = state.language === "zh-Hant" ? "zh-Hans" : "zh-Hant";
      renderAll();
      updatePaper();
      saveState();
      return;
    }

    if (action === "enter-immersive") {
      enterImmersive();
      return;
    }

    if (action === "exit-immersive") {
      exitImmersive();
      return;
    }

    if (action === "select-category") {
      state.category = target.dataset.category || "all";
      selectFirstInCurrentCategory();
      renderLibrary();
      updatePaper();
      saveState();
      return;
    }

    if (action === "select-asset") {
      state.selectedId = target.dataset.assetId || state.selectedId;
      renderLibrary();
      updatePaper();
      saveState();
      return;
    }

    if (action === "random-all") {
      const asset = randomFrom(ASSETS);
      if (asset) {
        state.selectedId = asset.id;
        state.category = "all";
        renderLibrary();
        updatePaper();
        saveState();
      }
      return;
    }

    if (action === "random-category") {
      const list = filteredAssets();
      const asset = randomFrom(list.length ? list : ASSETS);
      if (asset) {
        state.selectedId = asset.id;
        if (state.category === "all") state.category = asset.category;
        renderLibrary();
        updatePaper();
        saveState();
      }
      return;
    }

    if (action === "writing-mode") {
      state.writingMode = target.dataset.mode === "horizontal" ? "horizontal" : "vertical";
      renderEditor();
      updatePaper();
      saveState();
      return;
    }

    if (action === "reset-style") {
      state.style = { ...DEFAULT_STYLE };
      renderEditor();
      updatePaper();
      saveState();
      return;
    }

    if (action === "reset-content" && window.confirm(t("confirmResetContent"))) {
      state.title = "";
      state.body = "";
      state.signature = "";
      syncTextControls();
      updatePaper();
      saveState();
      return;
    }

    if (action === "reset-all" && window.confirm(t("confirmResetAll"))) {
      localStorage.removeItem(STORAGE_KEY);
      state = normalizeState({});
      ensureSelectedAsset();
      renderAll();
      updatePaper();
      saveState();
    }
  }

  function handleInput(event) {
    const el = event.target;
    const field = el.dataset.field;
    const editField = el.dataset.editField;
    const styleKey = el.dataset.style;

    if (field) {
      state[field] = el.value;
      syncEditableFields(field);
      updatePaper();
      saveState();
      return;
    }

    if (editField) {
      state[editField] = normalizeEditableText(el.innerText, editField);
      syncTextControls(editField);
      requestFitPaper();
      saveState();
      return;
    }

    if (styleKey) {
      if (el.type === "checkbox") {
        state.style[styleKey] = el.checked;
      } else if (el.type === "range") {
        state.style[styleKey] = Number(el.value);
      } else {
        state.style[styleKey] = el.value;
      }
      updatePaper();
      updateControlReadouts();
      saveState();
    }
  }

  function renderAll() {
    document.documentElement.lang = state.language;
    document.body.classList.toggle("is-immersive", state.mode === "immersive");
    renderTopbar();
    renderLibrary();
    renderPreviewShell();
    renderEditor();
  }

  function renderTopbar() {
    els.topbar.innerHTML = `
      <div class="brand">
        <h1 class="brand-title">${t("brand")}</h1>
        <p class="brand-subtitle">${t("tagline")}</p>
      </div>
      <div class="top-actions">
        <button class="btn" type="button" data-action="toggle-language">${t("switchLang")}</button>
        <button class="btn primary" type="button" data-action="enter-immersive">${t("enterImmersive")}</button>
      </div>
    `;
  }

  function renderLibrary() {
    if (!ASSETS.length) {
      els.library.innerHTML = `<div class="empty-state">${t("noAssets")}</div>`;
      return;
    }

    const categories = uniqueCategories();
    const currentList = filteredAssets();

    els.library.innerHTML = `
      <div class="panel-head">
        <h2 class="panel-title">${t("library")}</h2>
        <span class="panel-count">${ASSETS.length} ${t("totalCount")}</span>
      </div>
      <div class="button-row">
        <button class="btn primary" type="button" data-action="random-all">${t("randomAll")}</button>
        <button class="btn" type="button" data-action="random-category">${t("randomCategory")}</button>
      </div>
      <div class="section-divider"></div>
      <div class="category-list">
        <button class="chip ${state.category === "all" ? "is-active" : ""}" type="button" data-action="select-category" data-category="all">${t("allCategories")}</button>
        ${categories.map((category) => `
          <button class="chip ${state.category === category ? "is-active" : ""}" type="button" data-action="select-category" data-category="${escapeAttr(category)}">${escapeHtml(category)}</button>
        `).join("")}
      </div>
      <div class="asset-grid">
        ${currentList.map((asset) => `
          <button class="asset-card ${asset.id === state.selectedId ? "is-active" : ""}" type="button" data-action="select-asset" data-asset-id="${escapeAttr(asset.id)}" title="${escapeAttr(asset.category + " / " + asset.title)}">
            <img src="${escapeAttr(asset.thumbPath)}" alt="${escapeAttr(asset.category + " " + asset.title)}" loading="lazy">
            <span>${escapeHtml(asset.title)}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderPreviewShell() {
    if (!ASSETS.length) {
      els.preview.innerHTML = `<div class="empty-state">${t("noAssets")}</div>`;
      return;
    }

    els.preview.innerHTML = `
      <div class="preview-shell">
        <div class="preview-head">
          <div class="preview-title">
            <h2>${t("currentPaper")}</h2>
            <p class="asset-meta" id="assetMeta"></p>
          </div>
          <div class="button-row">
            <button class="btn" type="button" data-action="random-category">${t("randomCategory")}</button>
            <button class="btn primary" type="button" data-action="enter-immersive">${t("enterImmersive")}</button>
          </div>
        </div>
        <div class="paper-stage">
          <div class="paper-frame" id="paperFrame">
            <img class="paper-image-probe" id="paperImage" alt="">
            <div class="paper-wash"></div>
            <div class="letter-zone" id="letterZone">
              <div class="paper-grid" id="paperGrid" aria-hidden="true"></div>
              <div class="paper-editor" id="paperEditor">
                <div class="editable-title" id="editTitle" data-edit-field="title" contenteditable="plaintext-only" spellcheck="false" data-placeholder="${escapeAttr(t("titlePlaceholder"))}"></div>
                <div class="editable-body" id="editBody" data-edit-field="body" contenteditable="plaintext-only" spellcheck="false" data-placeholder="${escapeAttr(t("bodyPlaceholder"))}"></div>
                <div class="editable-signature" id="editSignature" data-edit-field="signature" contenteditable="plaintext-only" spellcheck="false" data-placeholder="${escapeAttr(t("signaturePlaceholder"))}"></div>
              </div>
            </div>
            <div class="seal-mark" id="sealMark"></div>
          </div>
        </div>
        <p class="immersive-hint">${t("immersiveHint")}</p>
      </div>
    `;

    els.paperFrame = document.getElementById("paperFrame");
    els.paperImage = document.getElementById("paperImage");
    els.letterZone = document.getElementById("letterZone");
    els.paperEditor = document.getElementById("paperEditor");
    els.editTitle = document.getElementById("editTitle");
    els.editBody = document.getElementById("editBody");
    els.editSignature = document.getElementById("editSignature");
    els.sealMark = document.getElementById("sealMark");
    els.assetMeta = document.getElementById("assetMeta");
  }

  function renderEditor() {
    els.editor.innerHTML = `
      <div class="panel-head">
        <h2 class="panel-title">${t("editor")}</h2>
      </div>
      <div class="segmented" role="group" aria-label="${escapeAttr(t("direction"))}">
        <button class="segment ${state.writingMode === "vertical" ? "is-active" : ""}" type="button" data-action="writing-mode" data-mode="vertical">${t("vertical")}</button>
        <button class="segment ${state.writingMode === "horizontal" ? "is-active" : ""}" type="button" data-action="writing-mode" data-mode="horizontal">${t("horizontal")}</button>
      </div>
      <div class="field-group">
        <label class="field-label" for="letterTitle">${t("titleLabel")}</label>
        <input class="input" id="letterTitle" data-field="title" value="${escapeAttr(state.title)}" placeholder="${escapeAttr(t("titlePlaceholder"))}">
      </div>
      <div class="field-group">
        <label class="field-label" for="letterBody">${t("bodyLabel")}</label>
        <textarea class="textarea" id="letterBody" data-field="body" placeholder="${escapeAttr(t("bodyPlaceholder"))}">${escapeHtml(state.body)}</textarea>
      </div>
      <div class="field-group">
        <label class="field-label" for="letterSignature">${t("signatureLabel")}</label>
        <textarea class="textarea compact" id="letterSignature" data-field="signature" placeholder="${escapeAttr(t("signaturePlaceholder"))}">${escapeHtml(state.signature)}</textarea>
      </div>
      <div class="button-row">
        <button class="btn primary" type="button" data-action="enter-immersive">${t("enterImmersive")}</button>
        <button class="btn danger" type="button" data-action="reset-content">${t("resetContent")}</button>
      </div>
      <div class="section-divider"></div>
      <div class="panel-head">
        <h2 class="panel-title">${t("style")}</h2>
      </div>
      <div class="control-group">
        <label class="control-label" for="fontFamily">${t("fontFamily")}</label>
        <select class="select" id="fontFamily" data-style="fontFamily">
          ${FONT_OPTIONS.map((font) => `<option value="${font.value}" ${font.value === state.style.fontFamily ? "selected" : ""}>${t(font.labelKey)}</option>`).join("")}
        </select>
      </div>
      ${rangeControl("fontSize", 16, 34, 1, t("px"))}
      ${rangeControl("lineHeight", 1.15, 2.3, .01, "")}
      ${rangeControl("letterSpacing", 0, .24, .01, "em")}
      <div class="color-row">
        <label class="control-label" for="inkColor">${t("inkColor")}</label>
        <input class="color-input" id="inkColor" type="color" data-style="inkColor" value="${escapeAttr(state.style.inkColor)}">
        <span class="control-note">${escapeHtml(state.style.inkColor)}</span>
      </div>
      ${rangeControl("inkOpacity", 40, 100, 1, t("percent"))}
      ${rangeControl("paperBrightness", 82, 118, 1, t("percent"))}
      ${rangeControl("paperContrast", 82, 122, 1, t("percent"))}
      ${rangeControl("paperSaturation", 62, 130, 1, t("percent"))}
      ${rangeControl("maskOpacity", 0, 42, 1, t("percent"))}
      ${rangeControl("gridOpacity", 0, 70, 1, t("percent"))}
      <div class="check-grid">
        ${checkControl("showTitle")}
        ${checkControl("showSignature")}
        ${checkControl("showSeal")}
      </div>
      <div class="field-group">
        <label class="field-label" for="sealText">${t("sealText")}</label>
        <input class="input" id="sealText" data-style="sealText" maxlength="4" value="${escapeAttr(state.style.sealText)}">
      </div>
      <div class="button-row">
        <button class="btn" type="button" data-action="reset-style">${t("resetStyle")}</button>
        <button class="btn danger" type="button" data-action="reset-all">${t("resetAll")}</button>
      </div>
    `;
    updateControlReadouts();
  }

  function rangeControl(key, min, max, step, suffix) {
    const value = state.style[key];
    return `
      <div class="range-row">
        <label class="control-label" for="${key}">${t(key)}</label>
        <input class="range" id="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${escapeAttr(value)}" data-style="${key}">
        <output data-output="${key}" data-suffix="${escapeAttr(suffix)}"></output>
      </div>
    `;
  }

  function checkControl(key) {
    return `
      <label class="check">
        <input type="checkbox" data-style="${key}" ${state.style[key] ? "checked" : ""}>
        <span>${t(key)}</span>
      </label>
    `;
  }

  function updatePaper() {
    const asset = selectedAsset();
    if (!asset || !els.paperFrame) return;

    const font = FONT_OPTIONS.find((item) => item.value === state.style.fontFamily) || FONT_OPTIONS[0];
    const imageUrl = `url("${asset.previewPath.replace(/"/g, "%22")}")`;
    const row = Math.max(18, state.style.fontSize * state.style.lineHeight);
    const col = Math.max(18, state.style.fontSize * (1 + state.style.letterSpacing * 2.2));

    document.body.classList.toggle("is-immersive", state.mode === "immersive");
    els.paperFrame.style.setProperty("--paper-ratio", `${asset.width} / ${asset.height}`);
    els.paperFrame.style.setProperty("--paper-url", imageUrl);
    els.paperFrame.style.setProperty("--paper-brightness", state.style.paperBrightness / 100);
    els.paperFrame.style.setProperty("--paper-contrast", state.style.paperContrast / 100);
    els.paperFrame.style.setProperty("--paper-saturation", state.style.paperSaturation / 100);
    els.paperFrame.style.setProperty("--paper-mask-opacity", state.style.maskOpacity / 100);
    els.paperFrame.style.setProperty("--letter-ink", state.style.inkColor);
    els.paperFrame.style.setProperty("--letter-font-family", font.stack);
    els.paperFrame.style.setProperty("--letter-font-size", `${state.style.fontSize}px`);
    els.paperFrame.style.setProperty("--letter-line-height", state.style.lineHeight);
    els.paperFrame.style.setProperty("--letter-spacing", `${state.style.letterSpacing}em`);
    els.paperFrame.style.setProperty("--letter-opacity", state.style.inkOpacity / 100);
    els.paperFrame.style.setProperty("--grid-opacity", state.style.gridOpacity / 100);
    els.paperFrame.style.setProperty("--grid-row", `${row}px`);
    els.paperFrame.style.setProperty("--grid-col", `${col}px`);

    els.paperFrame.dataset.writingMode = state.writingMode;
    els.paperImage.src = asset.previewPath;
    els.paperImage.alt = `${asset.category} ${asset.title}`;
    els.paperImage.onload = requestFitPaper;
    els.assetMeta.textContent = `${t("paperMeta")} ${asset.category} / ${asset.title}`;

    syncEditableFields();

    els.editTitle.style.display = state.style.showTitle ? "" : "none";
    els.editSignature.style.display = state.style.showSignature ? "" : "none";
    els.sealMark.textContent = String(state.style.sealText || "雅").trim().slice(0, 4) || "雅";
    els.sealMark.style.display = state.style.showSeal ? "grid" : "none";

    updateControlReadouts();
    requestFitPaper();
  }

  function requestFitPaper() {
    window.cancelAnimationFrame(fitFrame);
    fitFrame = window.requestAnimationFrame(fitPaperToContent);
  }

  function fitPaperToContent() {
    if (!els.paperFrame || !els.letterZone) return;

    const asset = selectedAsset();
    if (!asset) return;

    const width = els.paperFrame.getBoundingClientRect().width;
    const baseHeight = width * asset.height / asset.width;
    let height = baseHeight;
    els.paperFrame.style.minHeight = `${height}px`;

    for (let i = 0; i < 18; i++) {
      const zoneRect = els.letterZone.getBoundingClientRect();
      const frameRect = els.paperFrame.getBoundingClientRect();
      const allowedOverflow = state.writingMode === "vertical"
        ? Math.max(32, zoneRect.left - frameRect.left - 12)
        : 2;
      const overflow = state.writingMode === "vertical"
        ? els.letterZone.scrollWidth - els.letterZone.clientWidth
        : els.letterZone.scrollHeight - els.letterZone.clientHeight;

      if (overflow <= allowedOverflow) break;
      height += Math.min(520, Math.max(120, overflow * 1.45));
      els.paperFrame.style.minHeight = `${height}px`;
    }
  }

  function syncEditableFields(singleField) {
    const map = {
      title: els.editTitle,
      body: els.editBody,
      signature: els.editSignature
    };

    Object.keys(map).forEach((field) => {
      if (singleField && field !== singleField) return;
      const node = map[field];
      if (!node || document.activeElement === node) return;
      node.textContent = state[field] || "";
    });
  }

  function syncTextControls(singleField) {
    const map = {
      title: "letterTitle",
      body: "letterBody",
      signature: "letterSignature"
    };

    Object.keys(map).forEach((field) => {
      if (singleField && field !== singleField) return;
      const node = document.getElementById(map[field]);
      if (!node || document.activeElement === node) return;
      node.value = state[field] || "";
    });
  }

  function enterImmersive() {
    state.mode = "immersive";
    document.body.classList.add("is-immersive");
    updatePaper();
    window.requestAnimationFrame(() => {
      if (els.editBody) {
        els.editBody.focus({ preventScroll: true });
      }
    });
  }

  function exitImmersive() {
    state.mode = "setup";
    document.body.classList.remove("is-immersive");
    updatePaper();
  }

  function updateControlReadouts() {
    document.querySelectorAll("[data-output]").forEach((output) => {
      const key = output.dataset.output;
      const suffix = output.dataset.suffix || "";
      const rawValue = state.style[key];
      const value = Number.isInteger(rawValue)
        ? rawValue
        : Number(rawValue).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
      output.textContent = `${value}${suffix}`;
    });

    const colorNote = document.querySelector(".color-row .control-note");
    if (colorNote) colorNote.textContent = state.style.inkColor;
  }

  function uniqueCategories() {
    return Array.from(new Set(ASSETS.map((asset) => asset.category))).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  }

  function filteredAssets() {
    if (state.category === "all") return ASSETS;
    return ASSETS.filter((asset) => asset.category === state.category);
  }

  function selectedAsset() {
    return ASSETS.find((asset) => asset.id === state.selectedId) || ASSETS[0];
  }

  function ensureSelectedAsset() {
    if (!ASSETS.length) return;
    const found = ASSETS.some((asset) => asset.id === state.selectedId);
    if (!found) state.selectedId = ASSETS[0].id;
  }

  function selectFirstInCurrentCategory() {
    const list = filteredAssets();
    if (list.length) state.selectedId = list[0].id;
  }

  function randomFrom(list) {
    if (!list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      return {};
    }
  }

  function saveState() {
    try {
      const { mode, ...stored } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      // Local storage can be unavailable in strict privacy contexts.
    }
  }

  function normalizeState(raw) {
    const merged = {
      ...DEFAULT_STATE,
      ...raw,
      mode: "setup",
      style: {
        ...DEFAULT_STYLE,
        ...(raw && raw.style ? raw.style : {})
      }
    };

    if (!I18N[merged.language]) merged.language = "zh-Hant";
    if (merged.writingMode !== "horizontal") merged.writingMode = "vertical";
    if (typeof merged.title !== "string") merged.title = "";
    if (typeof merged.body !== "string") merged.body = "";
    if (typeof merged.signature !== "string") merged.signature = "";
    if (typeof merged.category !== "string") merged.category = "all";
    return merged;
  }

  function normalizeEditableText(text, field) {
    const normalized = String(text || "").replace(/\u00a0/g, " ").replace(/\r\n/g, "\n");
    if (field === "body") return normalized.replace(/\n{4,}/g, "\n\n\n");
    return normalized.replace(/\n+/g, " ").trim();
  }

  function t(key) {
    return (I18N[state.language] && I18N[state.language][key]) || I18N["zh-Hant"][key] || key;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }
})();
