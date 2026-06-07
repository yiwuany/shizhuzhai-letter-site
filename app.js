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
  const EXPORT_MAX_DIMENSION = 5200;
  const EXPORT_MAX_PIXELS = 18000000;
  const SEAL_GLYPH_TIMEOUT_MS = 8000;
  const SEAL_TEXT_LIMIT = 9;
  const SEAL_GLYPH_BOX_SIZE = 300;
  const SEAL_GLYPH_PADDING = 8;
  const SEAL_GLYPH_MAX_STRETCH = 1.3;
  const SEAL_FONT_URL = "assets/fonts/ebas927.ttf";
  const SEAL_FONT_BASE64 = typeof window.SHIZHUZHAI_SEAL_FONT_BASE64 === "string" ? window.SHIZHUZHAI_SEAL_FONT_BASE64 : "";
  const INLINE_PREVIEW_SOURCES = window.SHIZHUZHAI_INLINE_PREVIEWS && typeof window.SHIZHUZHAI_INLINE_PREVIEWS === "object"
    ? window.SHIZHUZHAI_INLINE_PREVIEWS
    : {};
  const SEAL_FORMAT_OPTIONS = [
    { value: "literal", labelKey: "sealFormatLiteral" },
    { value: "seal", labelKey: "sealFormatSeal" },
    { value: "zhiyin", labelKey: "sealFormatZhiyin" },
    { value: "smart", labelKey: "sealFormatSmart" }
  ];
  const SEAL_INSCRIPTION_SUFFIXES = ["之印", "私印", "印信", "印章", "印", "章", "璽", "玺"];
  const SEAL_GLYPH_LOCAL_SOURCES = {
    雅: { url: "assets/seal-glyphs/%E9%9B%85.svg", preferLocal: false },
    楚: { url: "assets/seal-glyphs/%E6%A5%9A.svg", preferLocal: false }
  };
  const SEAL_GENERATED_GLYPH_DATA = window.SHIZHUZHAI_SEAL_GLYPHS && typeof window.SHIZHUZHAI_SEAL_GLYPHS === "object"
    ? window.SHIZHUZHAI_SEAL_GLYPHS
    : {};
  const SEAL_GENERATED_GLYPH_SOURCES = SEAL_GENERATED_GLYPH_DATA.glyphs && typeof SEAL_GENERATED_GLYPH_DATA.glyphs === "object"
    ? SEAL_GENERATED_GLYPH_DATA.glyphs
    : {};
  const SEAL_GENERATED_GLYPH_ALIASES = SEAL_GENERATED_GLYPH_DATA.aliases && typeof SEAL_GENERATED_GLYPH_DATA.aliases === "object"
    ? SEAL_GENERATED_GLYPH_DATA.aliases
    : {};
  const SEAL_CHAR_ALIASES = {
    万: "萬",
    与: "與",
    东: "東",
    丝: "絲",
    严: "嚴",
    义: "義",
    乐: "樂",
    书: "書",
    乱: "亂",
    云: "雲",
    亚: "亞",
    产: "產",
    亲: "親",
    从: "從",
    仑: "侖",
    仓: "倉",
    仪: "儀",
    众: "眾",
    优: "優",
    传: "傳",
    伟: "偉",
    伦: "倫",
    伪: "偽",
    体: "體",
    余: "餘",
    佛: "佛",
    侠: "俠",
    俭: "儉",
    债: "債",
    倾: "傾",
    健: "健",
    关: "關",
    兴: "興",
    养: "養",
    军: "軍",
    农: "農",
    冯: "馮",
    冲: "沖",
    决: "決",
    净: "淨",
    凌: "凌",
    刘: "劉",
    则: "則",
    刚: "剛",
    创: "創",
    别: "別",
    剑: "劍",
    务: "務",
    动: "動",
    励: "勵",
    势: "勢",
    勋: "勳",
    华: "華",
    协: "協",
    单: "單",
    卢: "盧",
    卫: "衛",
    历: "歷",
    厉: "厲",
    压: "壓",
    县: "縣",
    参: "參",
    发: "發",
    变: "變",
    叠: "疊",
    叶: "葉",
    号: "號",
    吕: "呂",
    吴: "吳",
    员: "員",
    和: "和",
    咏: "詠",
    响: "響",
    善: "善",
    嘉: "嘉",
    园: "園",
    国: "國",
    图: "圖",
    圆: "圓",
    圣: "聖",
    坚: "堅",
    坤: "坤",
    城: "城",
    堂: "堂",
    墨: "墨",
    壮: "壯",
    声: "聲",
    处: "處",
    备: "備",
    复: "復",
    夏: "夏",
    头: "頭",
    无: "無",
    奋: "奮",
    奕: "奕",
    奥: "奧",
    妍: "妍",
    始: "始",
    姜: "姜",
    娴: "嫻",
    婉: "婉",
    宁: "寧",
    宝: "寶",
    实: "實",
    审: "審",
    宪: "憲",
    宽: "寬",
    宾: "賓",
    寿: "壽",
    将: "將",
    尔: "爾",
    尘: "塵",
    尚: "尚",
    尧: "堯",
    岚: "嵐",
    岛: "島",
    岳: "岳",
    峰: "峰",
    川: "川",
    巩: "鞏",
    师: "師",
    带: "帶",
    帧: "幀",
    帮: "幫",
    平: "平",
    庄: "莊",
    庆: "慶",
    庐: "廬",
    度: "度",
    康: "康",
    廷: "廷",
    建: "建",
    开: "開",
    异: "異",
    张: "張",
    强: "強",
    彦: "彥",
    彩: "彩",
    彻: "徹",
    德: "德",
    忆: "憶",
    志: "志",
    忧: "憂",
    怀: "懷",
    态: "態",
    恩: "恩",
    悦: "悅",
    惠: "惠",
    惟: "惟",
    意: "意",
    爱: "愛",
    慕: "慕",
    慧: "慧",
    成: "成",
    戏: "戲",
    才: "才",
    扬: "揚",
    执: "執",
    扩: "擴",
    承: "承",
    护: "護",
    报: "報",
    拥: "擁",
    择: "擇",
    挚: "摯",
    振: "振",
    捷: "捷",
    授: "授",
    探: "探",
    摄: "攝",
    政: "政",
    敏: "敏",
    敬: "敬",
    数: "數",
    文: "文",
    斋: "齋",
    斌: "斌",
    新: "新",
    方: "方",
    旋: "旋",
    旷: "曠",
    昀: "昀",
    昊: "昊",
    昌: "昌",
    明: "明",
    星: "星",
    春: "春",
    昭: "昭",
    晓: "曉",
    晨: "晨",
    智: "智",
    暄: "暄",
    曦: "曦",
    曼: "曼",
    月: "月",
    有: "有",
    朋: "朋",
    术: "術",
    朴: "樸",
    机: "機",
    权: "權",
    杜: "杜",
    来: "來",
    杨: "楊",
    杰: "傑",
    松: "松",
    林: "林",
    枫: "楓",
    柏: "柏",
    柔: "柔",
    柳: "柳",
    栋: "棟",
    树: "樹",
    桂: "桂",
    桥: "橋",
    梦: "夢",
    森: "森",
    楚: "楚",
    楷: "楷",
    榕: "榕",
    榮: "榮",
    樂: "樂",
    欣: "欣",
    欧: "歐",
    欢: "歡",
    正: "正",
    毅: "毅",
    毕: "畢",
    民: "民",
    汉: "漢",
    汤: "湯",
    沈: "沈",
    沐: "沐",
    沛: "沛",
    沧: "滄",
    治: "治",
    泽: "澤",
    洁: "潔",
    洛: "洛",
    津: "津",
    洪: "洪",
    浩: "浩",
    海: "海",
    涛: "濤",
    润: "潤",
    淇: "淇",
    淑: "淑",
    清: "清",
    渊: "淵",
    渠: "渠",
    湘: "湘",
    源: "源",
    滢: "瀅",
    潇: "瀟",
    澄: "澄",
    灵: "靈",
    炜: "煒",
    炼: "煉",
    烨: "燁",
    焕: "煥",
    然: "然",
    照: "照",
    燕: "燕",
    爽: "爽",
    牟: "牟",
    为: "為",
    献: "獻",
    玮: "瑋",
    现: "現",
    珍: "珍",
    琛: "琛",
    琳: "琳",
    琪: "琪",
    瑞: "瑞",
    玺: "璽",
    瑶: "瑤",
    瑾: "瑾",
    璇: "璇",
    璐: "璐",
    画: "畫",
    畅: "暢",
    疏: "疏",
    登: "登",
    白: "白",
    百: "百",
    皓: "皓",
    益: "益",
    盛: "盛",
    睿: "睿",
    知: "知",
    砚: "硯",
    硕: "碩",
    礼: "禮",
    祎: "禕",
    祖: "祖",
    祥: "祥",
    禄: "祿",
    禅: "禪",
    禾: "禾",
    秀: "秀",
    秋: "秋",
    秦: "秦",
    程: "程",
    稳: "穩",
    穆: "穆",
    立: "立",
    竞: "競",
    竹: "竹",
    笔: "筆",
    笙: "笙",
    策: "策",
    简: "簡",
    箫: "簫",
    籍: "籍",
    米: "米",
    粤: "粵",
    精: "精",
    红: "紅",
    纪: "紀",
    纶: "綸",
    绍: "紹",
    续: "續",
    维: "維",
    缘: "緣",
    美: "美",
    群: "群",
    翔: "翔",
    翰: "翰",
    耀: "耀",
    聪: "聰",
    肖: "肖",
    胜: "勝",
    腾: "騰",
    致: "致",
    舒: "舒",
    艺: "藝",
    节: "節",
    芝: "芝",
    芳: "芳",
    苏: "蘇",
    若: "若",
    英: "英",
    茂: "茂",
    范: "範",
    荣: "榮",
    莉: "莉",
    莲: "蓮",
    菁: "菁",
    華: "華",
    萍: "萍",
    萱: "萱",
    蕴: "蘊",
    薇: "薇",
    藏: "藏",
    虎: "虎",
    虹: "虹",
    蝶: "蝶",
    行: "行",
    衡: "衡",
    衣: "衣",
    裕: "裕",
    西: "西",
    观: "觀",
    觉: "覺",
    览: "覽",
    言: "言",
    诗: "詩",
    诚: "誠",
    语: "語",
    谦: "謙",
    谨: "謹",
    象: "象",
    贝: "貝",
    贤: "賢",
    贵: "貴",
    赐: "賜",
    赵: "趙",
    越: "越",
    跃: "躍",
    轩: "軒",
    辉: "輝",
    辰: "辰",
    达: "達",
    远: "遠",
    连: "連",
    迪: "迪",
    逸: "逸",
    道: "道",
    邓: "鄧",
    郁: "郁",
    郎: "郎",
    郑: "鄭",
    酷: "酷",
    里: "里",
    金: "金",
    鑫: "鑫",
    钟: "鐘",
    铭: "銘",
    锦: "錦",
    长: "長",
    门: "門",
    闲: "閒",
    闻: "聞",
    阳: "陽",
    陈: "陳",
    陆: "陸",
    难: "難",
    雅: "雅",
    雨: "雨",
    雪: "雪",
    雲: "雲",
    雷: "雷",
    霖: "霖",
    青: "青",
    静: "靜",
    韬: "韜",
    韵: "韻",
    顺: "順",
    顾: "顧",
    颖: "穎",
    风: "風",
    飞: "飛",
    馨: "馨",
    马: "馬",
    骏: "駿",
    高: "高",
    魏: "魏",
    鲁: "魯",
    鸣: "鳴",
    鸟: "鳥",
    麟: "麟",
    龙: "龍",
    龚: "龔"
  };
  const SEAL_GLYPH_COMPOSITES = {
    雅: { layout: "horizontal", parts: ["牙", "隹"] },
    楚: { layout: "vertical", parts: ["林", "疋"] },
    雷: { layout: "vertical", parts: ["雨", "田"] }
  };

  const DEFAULT_STYLE = {
    fontFamily: "song",
    fontSize: 20,
    lineHeight: 1.65,
    letterSpacing: 0.06,
    inkColor: "#3f3931",
    inkOpacity: 95,
    paperBrightness: 100,
    paperContrast: 100,
    paperSaturation: 96,
    maskOpacity: 12,
    gridOpacity: 38,
    showTitle: true,
    showSignature: true,
    showSeal: true,
    sealStyle: "zhu",
    sealFormat: "literal",
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
      sealMissingGlyphs: "未找到小篆：",
      sealText: "印章文字",
      sealFormat: "印文格式",
      sealFormatLiteral: "原文",
      sealFormatSeal: "加印",
      sealFormatZhiyin: "加之印",
      sealFormatSmart: "智能補款",
      sealStyle: "印章樣式",
      sealStyleZhu: "朱文",
      sealStyleBai: "白文",
      previewImage: "成圖預覽",
      exportImage: "導出圖片",
      exportPreviewTitle: "成圖預覽",
      downloadPng: "下載 PNG",
      closePreview: "關閉",
      exportPreparing: "生成中...",
      exportFailed: "生成圖片失敗，請稍後再試。",
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
      sealMissingGlyphs: "未找到小篆：",
      sealText: "印章文字",
      sealFormat: "印文格式",
      sealFormatLiteral: "原文",
      sealFormatSeal: "加印",
      sealFormatZhiyin: "加之印",
      sealFormatSmart: "智能补款",
      sealStyle: "印章样式",
      sealStyleZhu: "朱文",
      sealStyleBai: "白文",
      previewImage: "成图预览",
      exportImage: "导出图片",
      exportPreviewTitle: "成图预览",
      downloadPng: "下载 PNG",
      closePreview: "关闭",
      exportPreparing: "生成中...",
      exportFailed: "生成图片失败，请稍后再试。",
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
  let fitTimer = 0;
  let exportPreviewUrl = "";
  let sealRenderToken = 0;
  let sealFontPromise = null;
  const sealGlyphCache = new Map();

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
      if (event.key === "Escape" && els.exportModal && !els.exportModal.hidden) {
        closeImagePreview();
        return;
      }
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

    if (action === "preview-image") {
      void showImagePreview();
      return;
    }

    if (action === "export-image") {
      void downloadImage();
      return;
    }

    if (action === "close-export-preview") {
      closeImagePreview();
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
    window.requestAnimationFrame(scrollSelectedAssetIntoView);
  }

  function scrollSelectedAssetIntoView() {
    const grid = els.library && els.library.querySelector(".asset-grid");
    const active = grid && grid.querySelector(".asset-card.is-active");
    if (!grid || !active || grid.scrollWidth <= grid.clientWidth) return;

    const targetLeft = active.offsetLeft - (grid.clientWidth - active.offsetWidth) / 2;
    grid.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth"
    });
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
            <button class="btn" type="button" data-action="preview-image">${t("previewImage")}</button>
            <button class="btn" type="button" data-action="export-image">${t("exportImage")}</button>
          </div>
        </div>
        <div class="paper-stage">
          <div class="paper-positioner" id="paperPositioner">
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
        </div>
        <p class="immersive-hint">${t("immersiveHint")}</p>
      </div>
      <div class="export-modal" id="exportModal" hidden>
        <button class="export-backdrop" type="button" data-action="close-export-preview" aria-label="${escapeAttr(t("closePreview"))}"></button>
        <section class="export-dialog" role="dialog" aria-modal="true" aria-labelledby="exportPreviewTitle">
          <div class="export-dialog-head">
            <h2 id="exportPreviewTitle">${t("exportPreviewTitle")}</h2>
            <button class="btn" type="button" data-action="close-export-preview">${t("closePreview")}</button>
          </div>
          <div class="export-preview-box">
            <img class="export-preview-image" id="exportPreviewImage" alt="${escapeAttr(t("exportPreviewTitle"))}">
          </div>
          <div class="export-dialog-actions">
            <p class="export-status" id="exportStatus"></p>
            <a class="btn primary" id="exportDownloadLink" href="#" download>${t("downloadPng")}</a>
          </div>
        </section>
      </div>
    `;

    els.paperFrame = document.getElementById("paperFrame");
    els.paperPositioner = document.getElementById("paperPositioner");
    els.paperStage = document.querySelector(".paper-stage");
    els.paperImage = document.getElementById("paperImage");
    els.letterZone = document.getElementById("letterZone");
    els.paperEditor = document.getElementById("paperEditor");
    els.editTitle = document.getElementById("editTitle");
    els.editBody = document.getElementById("editBody");
    els.editSignature = document.getElementById("editSignature");
    els.sealMark = document.getElementById("sealMark");
    els.assetMeta = document.getElementById("assetMeta");
    els.exportModal = document.getElementById("exportModal");
    els.exportPreviewImage = document.getElementById("exportPreviewImage");
    els.exportDownloadLink = document.getElementById("exportDownloadLink");
    els.exportStatus = document.getElementById("exportStatus");
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
        <input class="input" id="sealText" data-style="sealText" maxlength="9" value="${escapeAttr(state.style.sealText)}">
      </div>
      <div class="control-group">
        <label class="control-label" for="sealFormat">${t("sealFormat")}</label>
        <select class="select" id="sealFormat" data-style="sealFormat">
          ${SEAL_FORMAT_OPTIONS.map((option) => `<option value="${option.value}" ${option.value === state.style.sealFormat ? "selected" : ""}>${t(option.labelKey)}</option>`).join("")}
        </select>
      </div>
      <div class="control-group">
        <label class="control-label" for="sealStyle">${t("sealStyle")}</label>
        <select class="select" id="sealStyle" data-style="sealStyle">
          <option value="zhu" ${state.style.sealStyle === "zhu" ? "selected" : ""}>${t("sealStyleZhu")}</option>
          <option value="bai" ${state.style.sealStyle === "bai" ? "selected" : ""}>${t("sealStyleBai")}</option>
        </select>
      </div>
      <p class="seal-warning" id="sealWarning" hidden></p>
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
    const previewSource = assetPreviewSource(asset);
    const imageUrl = `url("${previewSource.replace(/"/g, "%22")}")`;
    const targetRow = Math.max(18, state.style.fontSize * state.style.lineHeight);
    const targetCol = Math.max(22, state.style.fontSize * state.style.lineHeight);
    const sourceRatio = asset.width / asset.height;
    const displayRatio = paperDisplayRatio(asset);

    document.body.classList.toggle("is-immersive", state.mode === "immersive");
    els.paperFrame.style.setProperty("--paper-ratio", `${asset.width} / ${asset.height}`);
    els.paperFrame.style.setProperty("--paper-ratio-num", sourceRatio);
    els.paperFrame.style.setProperty("--paper-display-ratio-num", displayRatio);
    els.paperFrame.style.setProperty("--paper-base-max", state.writingMode === "horizontal" ? "700px" : "580px");
    els.paperFrame.style.setProperty("--paper-immersive-max", state.writingMode === "horizontal" ? "760px" : "620px");
    if (els.paperPositioner) {
      els.paperPositioner.style.setProperty("--paper-ratio-num", sourceRatio);
      els.paperPositioner.style.setProperty("--paper-display-ratio-num", displayRatio);
      els.paperPositioner.style.setProperty("--paper-base-max", state.writingMode === "horizontal" ? "700px" : "580px");
      els.paperPositioner.style.setProperty("--paper-immersive-max", state.writingMode === "horizontal" ? "760px" : "620px");
    }
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
    els.paperFrame.style.setProperty("--grid-row", `${targetRow}px`);
    els.paperFrame.style.setProperty("--grid-col", `${targetCol}px`);

    els.paperFrame.dataset.writingMode = state.writingMode;
    els.paperImage.onload = requestFitPaper;
    if (els.paperImage.getAttribute("src") !== previewSource) {
      els.paperImage.src = previewSource;
    }
    els.paperImage.alt = `${asset.category} ${asset.title}`;
    els.assetMeta.textContent = `${t("paperMeta")} ${asset.category} / ${asset.title}`;

    syncEditableFields();

    els.editTitle.style.display = state.style.showTitle ? "" : "none";
    els.editSignature.style.display = state.style.showSignature ? "" : "none";
    renderSealMark();

    updateControlReadouts();
    fitPaperToContent();
    requestFitPaper();
  }

  function assetPreviewSource(asset) {
    if (!asset) return "";
    return INLINE_PREVIEW_SOURCES[asset.id] || asset.previewPath;
  }

  function requestFitPaper() {
    window.cancelAnimationFrame(fitFrame);
    window.clearTimeout(fitTimer);
    fitFrame = window.requestAnimationFrame(fitPaperToContent);
    fitTimer = window.setTimeout(fitPaperToContent, 40);
  }

  function fitPaperToContent() {
    if (!els.paperFrame || !els.paperPositioner || !els.paperStage || !els.letterZone) return;

    const asset = selectedAsset();
    if (!asset) return;

    els.paperFrame.classList.remove("is-expanded-left", "is-vertical-spread", "is-centered-spread");
    els.paperStage.classList.remove("is-expanded-left", "is-expanded-down", "is-centered-spread");
    els.paperPositioner.classList.remove("is-expanded-left", "is-expanded-down", "is-centered-spread");
    els.paperPositioner.style.width = "";
    els.paperFrame.style.minWidth = "";
    els.paperFrame.style.minHeight = "";
    const baseWidth = els.paperPositioner.getBoundingClientRect().width || els.paperFrame.getBoundingClientRect().width;
    const baseHeight = baseWidth / paperDisplayRatio(asset);
    let width = baseWidth;
    let height = baseHeight;
    applyPaperGeometry(width, height, baseWidth, baseHeight);
    updateGridDistribution();

    for (let i = 0; i < 18; i++) {
      const overflow = state.writingMode === "vertical"
        ? els.letterZone.scrollWidth - els.letterZone.clientWidth
        : els.letterZone.scrollHeight - els.letterZone.clientHeight;
      const allowedOverflow = 2;

      if (overflow <= allowedOverflow) break;
      if (state.writingMode === "vertical") {
        width += Math.min(620, Math.max(120, overflow * 1.45));
      } else {
        height += Math.min(620, Math.max(120, overflow * 1.45));
      }
      applyPaperGeometry(width, height, baseWidth, baseHeight);
      updateGridDistribution();
    }

    updateGridDistribution();
    updateStageScroll(width > baseWidth + 1, height > baseHeight + 1);
  }

  function applyPaperGeometry(width, height, baseWidth, baseHeight) {
    const top = baseHeight * 0.058;
    const right = baseWidth * 0.058;
    const bottom = baseHeight * 0.068;
    const left = baseWidth * 0.058;

    els.paperFrame.style.minWidth = `${width}px`;
    els.paperFrame.style.minHeight = `${height}px`;
    els.paperPositioner.style.width = `${width}px`;
    els.paperFrame.style.setProperty("--paper-page-width", `${baseWidth}px`);
    els.paperFrame.style.setProperty("--paper-page-height", `${baseHeight}px`);
    els.paperFrame.style.setProperty("--writing-top-size", `${top}px`);
    els.paperFrame.style.setProperty("--writing-right-size", `${right}px`);
    els.paperFrame.style.setProperty("--writing-bottom-size", `${bottom}px`);
    els.paperFrame.style.setProperty("--writing-left-size", `${left}px`);
    const expandedLeft = state.writingMode === "vertical" && width > baseWidth + 1;
    const expandedDown = state.writingMode === "horizontal" && height > baseHeight + 1;
    const centeredSpread = expandedLeft && state.mode === "immersive";
    els.paperFrame.classList.toggle("is-expanded-left", expandedLeft);
    els.paperFrame.classList.toggle("is-vertical-spread", expandedLeft);
    els.paperFrame.classList.toggle("is-centered-spread", centeredSpread);
    els.paperStage.classList.toggle("is-expanded-left", expandedLeft);
    els.paperStage.classList.toggle("is-expanded-down", expandedDown);
    els.paperStage.classList.toggle("is-centered-spread", centeredSpread);
    els.paperPositioner.classList.toggle("is-expanded-left", expandedLeft);
    els.paperPositioner.classList.toggle("is-expanded-down", expandedDown);
    els.paperPositioner.classList.toggle("is-centered-spread", centeredSpread);
  }

  function updateStageScroll(expandedLeft, expandedDown) {
    if (!els.paperStage) return;

    if (expandedLeft) {
      const maxScroll = Math.max(0, els.paperStage.scrollWidth - els.paperStage.clientWidth);
      els.paperStage.scrollLeft = state.mode === "immersive" ? maxScroll / 2 : maxScroll;
      return;
    }

    els.paperStage.scrollLeft = 0;
    if (!expandedDown) els.paperStage.scrollTop = 0;
  }

  function renderSealMark() {
    if (!els.sealMark) return;

    if (!state.style.showSeal) {
      els.sealMark.style.display = "none";
      updateSealDiagnostics(null, []);
      return;
    }

    const descriptor = sealDescriptor();
    const token = ++sealRenderToken;
    els.sealMark.style.display = "block";
    els.sealMark.dataset.sealStyle = descriptor.style;
    els.sealMark.dataset.sealShape = descriptor.shape;
    els.sealMark.dataset.sealSources = "";
    els.sealMark.setAttribute("aria-label", descriptor.inputText === descriptor.text ? descriptor.text : `${descriptor.inputText} → ${descriptor.text}`);
    els.sealMark.title = descriptor.inputText === descriptor.text ? descriptor.text : `${descriptor.inputText} → ${descriptor.text}`;
    els.sealMark.innerHTML = buildSealSvg(descriptor, cachedSealGlyphs(descriptor));
    void resolveSealGlyphs(descriptor).then((glyphs) => {
      if (token !== sealRenderToken || !els.sealMark || !state.style.showSeal) return;
      const latest = sealDescriptor();
      if (latest.text !== descriptor.text || latest.style !== descriptor.style) return;
      updateSealDiagnostics(latest, glyphs);
      els.sealMark.innerHTML = buildSealSvg(latest, glyphs);
    });
  }

  function updateSealDiagnostics(descriptor, glyphs) {
    const warning = document.getElementById("sealWarning");
    if (!descriptor || !Array.isArray(glyphs)) {
      if (warning) {
        warning.hidden = true;
        warning.textContent = "";
      }
      if (els.sealMark) els.sealMark.dataset.sealSources = "";
      return;
    }

    const sources = descriptor.chars.map((char, index) => sealGlyphDiagnostic(char, glyphs[index])).join(", ");
    if (els.sealMark) els.sealMark.dataset.sealSources = sources;

    const resolvedText = sealResolvedText(descriptor, glyphs);
    const label = descriptor.inputText === resolvedText && descriptor.text === resolvedText
      ? descriptor.text
      : `${descriptor.inputText} → ${resolvedText}`;
    if (els.sealMark) {
      els.sealMark.setAttribute("aria-label", label);
      els.sealMark.title = label;
    }

    const missing = descriptor.chars.filter((char, index) => !glyphs[index] || !glyphs[index].isSealGlyph);
    if (!warning) return;
    warning.hidden = missing.length === 0;
    warning.textContent = missing.length ? `${t("sealMissingGlyphs")}${Array.from(new Set(missing)).join("")}` : "";
  }

  function sealGlyphDiagnostic(char, glyph) {
    if (!glyph || !glyph.isSealGlyph) return `${char}:missing`;
    const actual = glyph.normalizedChar || glyph.candidateChar || char;
    const source = glyph.source || "unknown";
    return actual === char ? `${char}:${source}` : `${char}→${actual}:${source}`;
  }

  function sealResolvedText(descriptor, glyphs) {
    return descriptor.chars.map((char, index) => {
      const glyph = glyphs[index];
      return glyph && glyph.isSealGlyph && glyph.normalizedChar ? glyph.normalizedChar : char;
    }).join("");
  }

  function sealDescriptor() {
    const inputText = normalizeSealText(state.style.sealText) || "雅";
    const text = applySealFormat(inputText, state.style.sealFormat) || "雅";
    const chars = Array.from(text);
    const style = state.style.sealStyle === "bai" ? "bai" : "zhu";
    const layout = sealLayoutForChars(chars);
    return { inputText, text, chars, style, shape: layout.shape, layout };
  }

  function normalizeSealText(value) {
    return Array.from(String(value || ""))
      .filter((char) => /[\p{L}\p{N}]/u.test(char))
      .join("")
      .slice(0, SEAL_TEXT_LIMIT);
  }

  function applySealFormat(text, format) {
    const normalizedFormat = SEAL_FORMAT_OPTIONS.some((option) => option.value === format) ? format : "literal";
    const chars = Array.from(String(text || ""));
    const base = chars.slice(0, SEAL_TEXT_LIMIT).join("");
    if (!base) return "";
    if (normalizedFormat === "literal" || hasSealInscriptionSuffix(base)) return truncateSealInscription(base);
    if (normalizedFormat === "seal") return appendSealSuffix(base, "印");
    if (normalizedFormat === "zhiyin") return appendSealSuffix(base, "之印");
    if (normalizedFormat === "smart") {
      if (chars.length === 1) return appendSealSuffix(base, "印");
      if (chars.length === 2) return appendSealSuffix(base, "之印");
      if (chars.length === 3) return appendSealSuffix(base, "印");
    }
    return truncateSealInscription(base);
  }

  function appendSealSuffix(text, suffix) {
    return truncateSealInscription(`${text}${suffix}`);
  }

  function truncateSealInscription(text) {
    const value = String(text || "");
    const chars = Array.from(value);
    if (chars.length <= SEAL_TEXT_LIMIT) return value;

    const suffix = sealInscriptionSuffix(value);
    const suffixLength = Array.from(suffix).length;
    if (suffix && suffixLength < SEAL_TEXT_LIMIT) {
      return `${chars.slice(0, SEAL_TEXT_LIMIT - suffixLength).join("")}${suffix}`;
    }

    return chars.slice(0, SEAL_TEXT_LIMIT).join("");
  }

  function hasSealInscriptionSuffix(text) {
    return Boolean(sealInscriptionSuffix(text));
  }

  function sealInscriptionSuffix(text) {
    const value = String(text || "");
    return SEAL_INSCRIPTION_SUFFIXES.find((suffix) => value.endsWith(suffix)) || "";
  }

  function buildSealSvg(descriptor, glyphs) {
    const id = `sealRough${Math.abs(hashText(descriptor.text + descriptor.style))}`;
    const viewBox = `0 0 ${descriptor.layout.width} ${descriptor.layout.height}`;
    const marks = descriptor.style === "bai"
      ? buildBaiSealSvg(descriptor, glyphs)
      : buildZhuSealSvg(descriptor, glyphs);

    return `
      <svg class="seal-svg" viewBox="${viewBox}" aria-hidden="true" focusable="false">
        <defs>
          <filter id="${id}" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="${Math.abs(hashText(descriptor.text)) % 97}" result="noise"></feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.55" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
          </filter>
        </defs>
        <g filter="url(#${id})">${marks}</g>
      </svg>
    `;
  }

  function buildZhuSealSvg(descriptor, glyphs) {
    const red = "#d97058";
    const paper = "rgba(255, 250, 240, .88)";
    const { layout } = descriptor;
    const border = roughRectSvg(
      layout.borderInset,
      layout.borderInset,
      layout.width - layout.borderInset * 2,
      layout.height - layout.borderInset * 2,
      hashText(descriptor.text),
      red,
      layout.strokeWidth
    );
    const glyphMarkup = layout.items.map((item) => glyphs[item.index]
      ? sealGlyphSvg(glyphs[item.index], item, "seal-glyph-art-zhu")
      : sealMissingGlyphSvg(item, "zhu", descriptor.text)
    ).join("");
    const chips = sealChipsSvg(descriptor.text + "zhu", layout.width, layout.height, paper, layout.wearCount);
    return `${border}${glyphMarkup}${chips}`;
  }

  function buildBaiSealSvg(descriptor, glyphs) {
    const red = "#d97058";
    const paper = "rgba(255, 250, 240, .96)";
    const { layout } = descriptor;
    const glyphMarkup = layout.items.map((item) => glyphs[item.index]
      ? sealGlyphSvg(glyphs[item.index], item, "seal-glyph-art-bai")
      : sealMissingGlyphSvg(item, "bai", descriptor.text)
    ).join("");
    return `
      <rect class="seal-bai-ground" x="${layout.borderInset}" y="${layout.borderInset}" width="${layout.width - layout.borderInset * 2}" height="${layout.height - layout.borderInset * 2}" rx="${layout.radius}" fill="${red}"></rect>
      <path class="seal-bai-rim" d="M${layout.rimInset} ${layout.rimInset}H${layout.width - layout.rimInset}V${layout.height - layout.rimInset}H${layout.rimInset}Z"></path>
      ${sealChipsSvg(descriptor.text + "bai", layout.width, layout.height, paper, layout.wearCount + 8)}
      ${glyphMarkup}
    `;
  }

  function sealGlyphSvg(glyph, item, className) {
    const box = sealGlyphDrawBox(item);
    return `
      <svg class="seal-glyph-art ${className}" x="${roundSvg(box.x)}" y="${roundSvg(box.y)}" width="${roundSvg(box.width)}" height="${roundSvg(box.height)}" viewBox="${escapeAttr(glyph.viewBox)}" preserveAspectRatio="none" data-glyph-source="${escapeAttr(glyph.source || "unknown")}" data-glyph-char="${escapeAttr(glyph.normalizedChar || item.char)}">
        ${glyph.content}
      </svg>
    `;
  }

  function sealGlyphDrawBox(item) {
    let width = item.glyphWidth;
    let height = item.glyphHeight;
    const ratio = width / Math.max(1, height);
    if (ratio > SEAL_GLYPH_MAX_STRETCH) {
      width = height * SEAL_GLYPH_MAX_STRETCH;
    } else if (ratio < 1 / SEAL_GLYPH_MAX_STRETCH) {
      height = width * SEAL_GLYPH_MAX_STRETCH;
    }

    return {
      x: item.x - width / 2,
      y: item.y - height / 2,
      width,
      height
    };
  }

  function sealMissingGlyphSvg(item, style, seed) {
    const color = style === "bai" ? "rgba(255, 250, 240, .38)" : "rgba(217, 102, 80, .28)";
    const random = seededRandom(`${seed}-${item.char}-missing`);
    const d1 = roughLinePath(item.x - item.glyphWidth * .18, item.y - item.glyphHeight * .1, item.x + item.glyphWidth * .18, item.y - item.glyphHeight * .1, random);
    const d2 = roughLinePath(item.x - item.glyphWidth * .12, item.y + item.glyphHeight * .1, item.x + item.glyphWidth * .12, item.y + item.glyphHeight * .1, random);
    return `
      <g class="seal-missing-glyph" aria-hidden="true">
        <path d="${d1}" fill="none" stroke="${color}" stroke-width="${roundSvg(Math.max(1.2, item.glyphWidth * .055))}" stroke-linecap="round"></path>
        <path d="${d2}" fill="none" stroke="${color}" stroke-width="${roundSvg(Math.max(1.2, item.glyphWidth * .05))}" stroke-linecap="round"></path>
      </g>
    `;
  }

  function sealLayoutForChars(chars) {
    const count = Math.max(1, Math.min(9, chars.length));
    const spec = sealLayoutSpec(count);
    const items = Array.from({ length: count }, (_, index) => sealLayoutItem(index, chars, spec));
    return {
      ...spec,
      items,
      wearCount: Math.round(spec.width * spec.height / 420)
    };
  }

  function sealLayoutSpec(count) {
    if (count === 1) return { shape: "tall", columns: 1, rows: 1, width: 88, height: 132, borderInset: 8, rimInset: 14, radius: 7, strokeWidth: 4.2, marginX: 11, marginY: 13, fillX: .9, fillY: .88 };
    if (count === 2) return { shape: "vertical", columns: 1, rows: 2, width: 88, height: 132, borderInset: 8, rimInset: 14, radius: 7, strokeWidth: 4.2, marginX: 12, marginY: 12, fillX: .92, fillY: .9 };
    if (count === 3) return { shape: "high-square", columns: 2, rows: 2, width: 108, height: 120, borderInset: 8, rimInset: 14, radius: 7, strokeWidth: 4.2, marginX: 12, marginY: 13, fillX: .9, fillY: .9 };
    if (count === 4) return { shape: "square", columns: 2, rows: 2, width: 108, height: 108, borderInset: 8, rimInset: 14, radius: 7, strokeWidth: 4.2, marginX: 12, marginY: 12, fillX: .92, fillY: .92 };
    if (count <= 6) return { shape: "tall-grid", columns: 2, rows: 3, width: 112, height: 150, borderInset: 8, rimInset: 14, radius: 7, strokeWidth: 4, marginX: 12, marginY: 13, fillX: .9, fillY: .88 };
    return { shape: "large-grid", columns: 3, rows: 3, width: 132, height: 132, borderInset: 8, rimInset: 14, radius: 7, strokeWidth: 4, marginX: 13, marginY: 13, fillX: .88, fillY: .88 };
  }

  function sealLayoutItem(index, chars, spec) {
    const count = chars.length;
    const column = Math.floor(index / spec.rows);
    const row = index % spec.rows;
    const start = column * spec.rows;
    const columnCount = Math.max(0, Math.min(spec.rows, count - start));
    const verticalOffset = Math.max(0, (spec.rows - columnCount) / 2);
    const usableWidth = spec.width - spec.marginX * 2;
    const usableHeight = spec.height - spec.marginY * 2;
    const cellWidth = usableWidth / spec.columns;
    const cellHeight = usableHeight / spec.rows;
    const visualColumn = spec.columns - column - 1;
    const cellX = spec.marginX + visualColumn * cellWidth;
    const cellY = spec.marginY + (verticalOffset + row) * cellHeight;
    const glyphWidth = cellWidth * spec.fillX;
    const glyphHeight = cellHeight * spec.fillY;
    const x = cellX + cellWidth / 2;
    const y = cellY + cellHeight / 2;

    return {
      index,
      char: chars[index] || "",
      cellX,
      cellY,
      cellWidth,
      cellHeight,
      glyphWidth,
      glyphHeight,
      x,
      y,
      width: glyphWidth,
      height: glyphHeight
    };
  }

  function cachedSealGlyphs(descriptor) {
    return descriptor.chars.map((char) => {
      for (const candidate of sealCharCandidates(char)) {
        const cached = sealGlyphCache.get(candidate);
        if (cached && typeof cached.then !== "function") return sealGlyphForInput(cached, char, candidate);
      }
      return null;
    });
  }

  async function resolveSealGlyphs(descriptor) {
    return Promise.all(descriptor.chars.map((char) => fetchSealGlyph(char)));
  }

  function fetchSealGlyph(char, seen = new Set()) {
    if (sealGlyphCache.has(char)) return Promise.resolve(sealGlyphCache.get(char)).catch(() => null);

    const request = resolveSealGlyphFromCandidates(char, seen)
      .catch(() => null)
      .then((glyph) => {
        sealGlyphCache.set(char, glyph);
        return glyph;
      });

    sealGlyphCache.set(char, request);
    return request;
  }

  async function resolveSealGlyphFromCandidates(char, seen) {
    const candidates = sealCharCandidates(char);
    for (const candidate of candidates) {
      const cached = sealGlyphCache.get(candidate);
      let glyph = cached && typeof cached.then !== "function" ? cached : null;
      if (!glyph && cached && typeof cached.then === "function") glyph = await cached.catch(() => null);
      if (!glyph) glyph = await resolveSealGlyphCandidate(candidate, seen).catch(() => null);
      if (!glyph) continue;
      sealGlyphCache.set(candidate, glyph);
      return sealGlyphForInput(glyph, char, candidate);
    }
    return null;
  }

  async function resolveSealGlyphCandidate(candidate, seen) {
    const fontGlyph = await fetchFontSealGlyph(candidate).catch(() => null);
    if (fontGlyph) return fontGlyph;

    const localGlyph = await fetchLocalSealGlyph(candidate).catch(() => null);
    if (localGlyph) return localGlyph;

    const generatedGlyph = await fetchGeneratedSealGlyph(candidate).catch(() => null);
    if (generatedGlyph) return generatedGlyph;

    const compositeGlyph = await fetchCompositeSealGlyph(candidate, seen).catch(() => null);
    if (compositeGlyph) return compositeGlyph;

    return fetchTextFallbackSealGlyph(candidate);
  }

  function sealGlyphForInput(glyph, inputChar, candidateChar) {
    if (!glyph) return null;
    return {
      ...glyph,
      inputChar,
      candidateChar,
      normalizedChar: glyph.normalizedChar || candidateChar
    };
  }

  async function fetchFontSealGlyph(normalized) {
    const font = await loadSealFont();
    if (!font || !window.opentype) return null;

    const glyphIndex = typeof font.charToGlyphIndex === "function" ? font.charToGlyphIndex(normalized) : -1;
    if (!glyphIndex) return null;

    const glyph = font.glyphs.get(glyphIndex);
    if (!glyph) return null;

    const path = glyph.getPath(0, 0, 1000);
    const bbox = path.getBoundingBox();
    if (!isFinite(bbox.x1) || !isFinite(bbox.y1) || !isFinite(bbox.x2) || !isFinite(bbox.y2)) return null;

    const width = bbox.x2 - bbox.x1;
    const height = bbox.y2 - bbox.y1;
    if (width <= 0 || height <= 0) return null;

    return normalizeFontGlyphPath(path.commands, bbox, normalized);
  }

  async function loadSealFont() {
    if (sealFontPromise) return sealFontPromise;
    sealFontPromise = (async () => {
      if (!window.opentype) return null;
      if (!(window.location && window.location.protocol === "file:")) {
        const remoteFont = await fetchSealFontFromUrl().catch(() => null);
        if (remoteFont) return remoteFont;
      }
      return parseEmbeddedSealFont();
    })().catch(() => null);
    return sealFontPromise;
  }

  async function fetchSealFontFromUrl() {
    const response = await fetchWithTimeout(SEAL_FONT_URL, {}, SEAL_GLYPH_TIMEOUT_MS);
    if (!response.ok) return null;
    return window.opentype.parse(await response.arrayBuffer());
  }

  function parseEmbeddedSealFont() {
    if (!window.opentype || !SEAL_FONT_BASE64) return null;
    return window.opentype.parse(base64ToArrayBuffer(SEAL_FONT_BASE64));
  }

  function base64ToArrayBuffer(value) {
    const binary = window.atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes.buffer;
  }

  function normalizeFontGlyphPath(commands, bbox, normalizedChar) {
    const boxSize = SEAL_GLYPH_BOX_SIZE;
    const padding = SEAL_GLYPH_PADDING;
    const width = bbox.x2 - bbox.x1;
    const height = bbox.y2 - bbox.y1;
    const scale = Math.min((boxSize - padding * 2) / width, (boxSize - padding * 2) / height);
    const offsetX = (boxSize - width * scale) / 2 - bbox.x1 * scale;
    const offsetY = (boxSize - height * scale) / 2 - bbox.y1 * scale;
    const d = fontPathToSvgD(commands, scale, offsetX, offsetY);
    if (!d) return null;

    return {
      viewBox: `0 0 ${SEAL_GLYPH_BOX_SIZE} ${SEAL_GLYPH_BOX_SIZE}`,
      content: `<path d="${escapeAttr(d)}" fill="currentColor" stroke="currentColor" stroke-width="8" stroke-linejoin="round" paint-order="stroke fill"></path>`,
      source: "font",
      normalizedChar,
      isSealGlyph: true,
      metrics: {
        sourceBox: { x: bbox.x1, y: bbox.y1, width, height },
        normalizedBox: { x: padding, y: padding, width: boxSize - padding * 2, height: boxSize - padding * 2 }
      }
    };
  }

  function fontPathToSvgD(commands, scale, offsetX, offsetY) {
    return commands.map((command) => {
      if (command.type === "M") return `M${roundSvg(command.x * scale + offsetX)} ${roundSvg(command.y * scale + offsetY)}`;
      if (command.type === "L") return `L${roundSvg(command.x * scale + offsetX)} ${roundSvg(command.y * scale + offsetY)}`;
      if (command.type === "C") {
        return `C${roundSvg(command.x1 * scale + offsetX)} ${roundSvg(command.y1 * scale + offsetY)} ${roundSvg(command.x2 * scale + offsetX)} ${roundSvg(command.y2 * scale + offsetY)} ${roundSvg(command.x * scale + offsetX)} ${roundSvg(command.y * scale + offsetY)}`;
      }
      if (command.type === "Q") {
        return `Q${roundSvg(command.x1 * scale + offsetX)} ${roundSvg(command.y1 * scale + offsetY)} ${roundSvg(command.x * scale + offsetX)} ${roundSvg(command.y * scale + offsetY)}`;
      }
      if (command.type === "Z") return "Z";
      return "";
    }).filter(Boolean).join(" ");
  }

  function fetchTextFallbackSealGlyph(normalized) {
    if (!/[\p{L}\p{N}]/u.test(normalized)) return null;
    const char = Array.from(normalized)[0] || "";
    if (!char) return null;

    return {
      viewBox: `0 0 ${SEAL_GLYPH_BOX_SIZE} ${SEAL_GLYPH_BOX_SIZE}`,
      content: `
        <text x="150" y="158" text-anchor="middle" dominant-baseline="central"
          font-family="KaiTi, STKaiti, DFKai-SB, FangSong, FangSong_GB2312, serif"
          font-size="236" font-weight="700" fill="currentColor" stroke="currentColor"
          stroke-width="8" stroke-linejoin="round" paint-order="stroke fill">${escapeHtml(char)}</text>
      `,
      source: "text-fallback",
      normalizedChar: char,
      isSealGlyph: true,
      metrics: {
        sourceBox: null,
        normalizedBox: { x: SEAL_GLYPH_PADDING, y: SEAL_GLYPH_PADDING, width: SEAL_GLYPH_BOX_SIZE - SEAL_GLYPH_PADDING * 2, height: SEAL_GLYPH_BOX_SIZE - SEAL_GLYPH_PADDING * 2 }
      }
    };
  }

  async function fetchLocalSealGlyph(normalized) {
    const source = localSealGlyphConfig(normalized);
    if (!source) return null;

    const response = await fetchWithTimeout(source.url, {}, SEAL_GLYPH_TIMEOUT_MS);
    if (!response.ok) return null;
    return sanitizeSealGlyphSvg(await response.text(), "local", normalized);
  }

  function localSealGlyphConfig(normalized) {
    const source = SEAL_GLYPH_LOCAL_SOURCES[normalized];
    if (!source) return null;
    if (typeof source === "string") return { url: source, preferLocal: false };
    return source && source.url ? source : null;
  }

  async function fetchGeneratedSealGlyph(normalized) {
    const source = generatedSealGlyphConfig(normalized);
    if (!source) return null;
    if (source.content && source.viewBox) {
      return {
        viewBox: source.viewBox,
        content: source.content,
        source: source.source || "generated",
        normalizedChar: source.canonical || normalized,
        isSealGlyph: true,
        metrics: source.metrics || { sourceBox: null }
      };
    }

    const response = await fetchWithTimeout(source.url, {}, SEAL_GLYPH_TIMEOUT_MS);
    if (!response.ok) return null;
    return sanitizeSealGlyphSvg(await response.text(), source.source || "generated", source.canonical || normalized);
  }

  function generatedSealGlyphConfig(normalized) {
    const source = SEAL_GENERATED_GLYPH_SOURCES[normalized];
    if (!source) return null;
    if (typeof source === "string") return { url: source, canonical: normalized, source: "generated" };
    if (source.content && source.viewBox) {
      return { ...source, canonical: source.canonical || normalized, source: source.source || "generated" };
    }
    return source && source.url ? { ...source, canonical: source.canonical || normalized, source: source.source || "generated" } : null;
  }

  function fetchWithTimeout(url, options = {}, timeout = SEAL_GLYPH_TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeout);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => {
      window.clearTimeout(timer);
    });
  }

  async function fetchCompositeSealGlyph(normalized, seen) {
    const composite = SEAL_GLYPH_COMPOSITES[normalized];
    if (!composite || seen.has(normalized)) return null;

    const nextSeen = new Set(seen);
    nextSeen.add(normalized);
    const parts = await Promise.all(composite.parts.map((part) => fetchSealGlyph(part, nextSeen)));
    if (parts.some((part) => !part)) return null;

    return composeSealGlyph(composite, parts);
  }

  function composeSealGlyph(composite, parts) {
    const regions = sealCompositeRegions(composite.layout, parts.length);
    return {
      viewBox: "0 0 300 300",
      content: parts.map((glyph, index) => {
        const region = regions[index] || { x: 0, y: 0, width: 300, height: 300 };
        return `
          <svg x="${region.x}" y="${region.y}" width="${region.width}" height="${region.height}" viewBox="${escapeAttr(glyph.viewBox)}" preserveAspectRatio="xMidYMid meet" overflow="visible">
            ${glyph.content}
          </svg>
        `;
      }).join(""),
      source: "composite",
      normalizedChar: composite.parts.join(""),
      isSealGlyph: true,
      metrics: { sourceBox: { x: 0, y: 0, width: 300, height: 300 } }
    };
  }

  function sealCompositeRegions(layout, count) {
    if (layout === "vertical" && count === 2) {
      return [
        { x: 30, y: 2, width: 240, height: 146 },
        { x: 42, y: 142, width: 216, height: 156 }
      ];
    }

    if (layout === "horizontal" && count === 2) {
      return [
        { x: 4, y: 22, width: 146, height: 256 },
        { x: 142, y: 14, width: 154, height: 272 }
      ];
    }

    return [{ x: 0, y: 0, width: 300, height: 300 }];
  }

  function sealCharCandidates(char) {
    const candidates = [];
    addSealCandidate(candidates, char);
    addSealCandidate(candidates, SEAL_CHAR_ALIASES[char]);
    addSealCandidate(candidates, SEAL_GENERATED_GLYPH_ALIASES[char]);
    const generated = generatedSealGlyphConfig(char);
    addSealCandidate(candidates, generated && generated.canonical);
    return candidates;
  }

  function addSealCandidate(candidates, char) {
    if (!char || candidates.includes(char)) return;
    candidates.push(char);
  }

  function sanitizeSealGlyphSvg(svgText, source = "svg", normalizedChar = "") {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const sourceSvg = doc.querySelector("svg");
    if (!sourceSvg || doc.querySelector("parsererror")) return null;

    const viewBox = sourceSvg.getAttribute("viewBox") || inferSvgViewBox(sourceSvg);
    const clone = sourceSvg.cloneNode(true);
    clone.querySelectorAll("metadata, title, desc, script, style, defs, foreignObject").forEach((node) => node.remove());
    clone.querySelectorAll("*").forEach((node) => sanitizeSealGlyphNode(node));

    return normalizeSvgSealGlyph(clone.innerHTML, viewBox, source, normalizedChar);
  }

  function normalizeSvgSealGlyph(content, sourceViewBox, source, normalizedChar) {
    const bbox = measureSvgGlyphBounds(content, sourceViewBox) || bboxFromViewBox(sourceViewBox);
    if (!bbox || bbox.width <= 0 || bbox.height <= 0) {
      return {
        viewBox: sourceViewBox,
        content,
        source,
        normalizedChar,
        isSealGlyph: true,
        metrics: { sourceBox: null }
      };
    }

    const boxSize = SEAL_GLYPH_BOX_SIZE;
    const padding = SEAL_GLYPH_PADDING;
    const scale = Math.min((boxSize - padding * 2) / bbox.width, (boxSize - padding * 2) / bbox.height);
    const offsetX = (boxSize - bbox.width * scale) / 2 - bbox.x * scale;
    const offsetY = (boxSize - bbox.height * scale) / 2 - bbox.y * scale;
    const matrix = [scale, 0, 0, scale, offsetX, offsetY].map(roundSvgTransform).join(" ");

    return {
      viewBox: `0 0 ${SEAL_GLYPH_BOX_SIZE} ${SEAL_GLYPH_BOX_SIZE}`,
      content: `<g stroke="currentColor" stroke-width="8" stroke-linejoin="round" paint-order="stroke fill"><g transform="matrix(${matrix})">${content}</g></g>`,
      source,
      normalizedChar,
      isSealGlyph: true,
      metrics: {
        sourceBox: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
        normalizedBox: { x: padding, y: padding, width: boxSize - padding * 2, height: boxSize - padding * 2 }
      }
    };
  }

  function inferSvgViewBox(svg) {
    const width = Number.parseFloat(svg.getAttribute("width")) || 300;
    const height = Number.parseFloat(svg.getAttribute("height")) || 300;
    return `0 0 ${width} ${height}`;
  }

  function measureSvgGlyphBounds(content, sourceViewBox) {
    if (!document.body) return null;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", sourceViewBox);
    svg.setAttribute("width", "1");
    svg.setAttribute("height", "1");
    svg.style.position = "absolute";
    svg.style.left = "-9999px";
    svg.style.top = "-9999px";
    svg.style.overflow = "visible";
    svg.style.opacity = "0";
    svg.style.pointerEvents = "none";
    svg.innerHTML = content;
    document.body.appendChild(svg);

    try {
      const bbox = svg.getBBox();
      if (!isFinite(bbox.x) || !isFinite(bbox.y) || !isFinite(bbox.width) || !isFinite(bbox.height)) return null;
      return { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height };
    } catch (error) {
      return null;
    } finally {
      svg.remove();
    }
  }

  function bboxFromViewBox(viewBox) {
    const parts = String(viewBox || "").trim().split(/[\s,]+/).map(Number);
    if (parts.length !== 4 || parts.some((value) => !Number.isFinite(value))) return null;
    return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
  }

  function sanitizeSealGlyphNode(node) {
    Array.from(node.attributes || []).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      if (name.startsWith("on") || ["id", "class", "style", "data-name"].includes(name)) {
        node.removeAttribute(attribute.name);
      }
    });

    const tag = node.tagName.toLowerCase();
    if (tag === "path" || tag === "rect" || tag === "circle" || tag === "ellipse" || tag === "polygon" || tag === "polyline") {
      node.setAttribute("fill", "currentColor");
      node.removeAttribute("stroke");
    }
  }

  function roughRectSvg(x, y, width, height, seed, color, strokeWidth) {
    const random = seededRandom(String(seed));
    const paths = [
      roughLinePath(x, y, x + width, y, random),
      roughLinePath(x + width, y, x + width, y + height, random),
      roughLinePath(x + width, y + height, x, y + height, random),
      roughLinePath(x, y + height, x, y, random)
    ];
    return paths.map((d) => `<path class="seal-rough-line" d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"></path>`).join("");
  }

  function roughLinePath(x1, y1, x2, y2, random) {
    const parts = [];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.max(1, Math.hypot(dx, dy));
    const segments = Math.max(8, Math.round(length / 8));
    let drawing = false;

    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const jitter = 1.2;
      const x = x1 + dx * t + (random() - .5) * jitter;
      const y = y1 + dy * t + (random() - .5) * jitter;
      if (!drawing || random() < .11) {
        parts.push(`M${roundSvg(x)} ${roundSvg(y)}`);
        drawing = true;
      } else {
        parts.push(`L${roundSvg(x)} ${roundSvg(y)}`);
      }
      if (random() < .08) drawing = false;
    }

    return parts.join(" ");
  }

  function sealChipsSvg(seed, width, height, color, count) {
    const random = seededRandom(seed);
    const chips = [];
    for (let i = 0; i < count; i += 1) {
      const x = random() * width;
      const y = random() * height;
      const w = 1 + random() * width * .13;
      const h = .8 + random() * 2.6;
      const rotate = (random() - .5) * 24;
      chips.push(`<rect x="${roundSvg(x)}" y="${roundSvg(y)}" width="${roundSvg(w)}" height="${roundSvg(h)}" rx="${roundSvg(h / 2)}" fill="${color}" transform="rotate(${roundSvg(rotate)} ${roundSvg(x)} ${roundSvg(y)})"></rect>`);
    }
    return `<g class="seal-wear">${chips.join("")}</g>`;
  }

  function hashText(text) {
    let hash = 0;
    Array.from(String(text || "")).forEach((char) => {
      hash = Math.imul(31, hash) + char.charCodeAt(0) | 0;
    });
    return hash;
  }

  function roundSvg(value) {
    return Math.round(value * 10) / 10;
  }

  function roundSvgTransform(value) {
    return Math.round(value * 10000) / 10000;
  }

  async function showImagePreview() {
    setExportBusy(true);
    try {
      const output = await renderPaperImage();
      if (exportPreviewUrl) URL.revokeObjectURL(exportPreviewUrl);
      exportPreviewUrl = output.url;
      els.exportPreviewImage.src = output.url;
      els.exportDownloadLink.href = output.url;
      els.exportDownloadLink.download = output.filename;
      els.exportStatus.textContent = `${output.width} × ${output.height}px`;
      els.exportModal.hidden = false;
    } catch (error) {
      console.error(error);
      window.alert(t("exportFailed"));
    } finally {
      setExportBusy(false);
    }
  }

  async function downloadImage() {
    setExportBusy(true);
    try {
      const output = await renderPaperImage();
      const link = document.createElement("a");
      link.href = output.url;
      link.download = output.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(output.url), 10000);
    } catch (error) {
      console.error(error);
      window.alert(t("exportFailed"));
    } finally {
      setExportBusy(false);
    }
  }

  function closeImagePreview() {
    if (!els.exportModal) return;
    els.exportModal.hidden = true;
    if (exportPreviewUrl) {
      URL.revokeObjectURL(exportPreviewUrl);
      exportPreviewUrl = "";
    }
    if (els.exportPreviewImage) els.exportPreviewImage.removeAttribute("src");
    if (els.exportDownloadLink) {
      els.exportDownloadLink.href = "#";
      els.exportDownloadLink.removeAttribute("download");
    }
    if (els.exportStatus) els.exportStatus.textContent = "";
  }

  function setExportBusy(isBusy) {
    document.querySelectorAll("[data-action='preview-image'], [data-action='export-image']").forEach((button) => {
      button.disabled = isBusy;
    });
    if (!els.exportStatus) return;
    if (isBusy) {
      els.exportStatus.textContent = t("exportPreparing");
    } else if (els.exportStatus.textContent === t("exportPreparing")) {
      els.exportStatus.textContent = "";
    }
  }

  async function renderPaperImage() {
    if (!els.paperFrame || !els.letterZone) throw new Error("Paper is not ready.");

    fitPaperToContent();
    await nextFrame();
    fitPaperToContent();
    if (document.fonts && document.fonts.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => window.setTimeout(resolve, 350))
      ]);
    }

    const asset = selectedAsset();
    const frameRect = els.paperFrame.getBoundingClientRect();
    const width = Math.max(1, Math.ceil(frameRect.width));
    const height = Math.max(1, Math.ceil(frameRect.height));
    const scale = exportScaleFor(width, height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available.");

    ctx.scale(scale, scale);
    await ensurePaperImageReady();
    drawPaperBase(ctx, els.paperImage, width, height);
    drawPaperWash(ctx, width, height);
    drawPaperGrid(ctx);
    drawLetterText(ctx);
    await drawSealOnCanvas(ctx);

    const blob = await canvasToBlob(canvas);
    return {
      url: URL.createObjectURL(blob),
      filename: exportFileName(asset),
      width: canvas.width,
      height: canvas.height
    };
  }

  function nextFrame() {
    return new Promise((resolve) => {
      const timer = window.setTimeout(resolve, 40);
      window.requestAnimationFrame(() => {
        window.clearTimeout(timer);
        resolve();
      });
    });
  }

  function ensurePaperImageReady() {
    if (els.paperImage && els.paperImage.complete && els.paperImage.naturalWidth) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error("Paper image timed out.")), 3000);
      const cleanup = () => {
        window.clearTimeout(timer);
        els.paperImage.removeEventListener("load", handleLoad);
        els.paperImage.removeEventListener("error", handleError);
      };
      const handleLoad = () => {
        cleanup();
        resolve();
      };
      const handleError = () => {
        cleanup();
        reject(new Error("Paper image failed to load."));
      };
      els.paperImage.addEventListener("load", handleLoad, { once: true });
      els.paperImage.addEventListener("error", handleError, { once: true });
    });
  }

  function exportScaleFor(width, height) {
    const dimensionScale = EXPORT_MAX_DIMENSION / Math.max(width, height);
    const pixelScale = Math.sqrt(EXPORT_MAX_PIXELS / Math.max(1, width * height));
    return Math.max(1, Math.min(2, dimensionScale, pixelScale));
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Unable to create PNG."));
      }, "image/png");
    });
  }

  function drawPaperBase(ctx, image, width, height) {
    const pageWidth = cssPx("--paper-page-width", width);
    const pageHeight = cssPx("--paper-page-height", height);
    const frameClass = els.paperFrame.classList;
    const centered = frameClass.contains("is-centered-spread");
    const verticalSpread = frameClass.contains("is-vertical-spread");
    const anchorX = centered
      ? (width - pageWidth) / 2
      : width - pageWidth;
    const startX = tileStart(verticalSpread || width > pageWidth + 1 ? anchorX : 0, pageWidth);

    ctx.save();
    ctx.fillStyle = "#f7efe1";
    ctx.fillRect(0, 0, width, height);
    ctx.filter = `brightness(${state.style.paperBrightness / 100}) contrast(${state.style.paperContrast / 100}) saturate(${state.style.paperSaturation / 100})`;

    for (let y = 0; y < height + pageHeight; y += pageHeight) {
      for (let x = startX; x < width + pageWidth; x += pageWidth) {
        ctx.drawImage(image, x, y, pageWidth, pageHeight);
      }
    }
    ctx.restore();
  }

  function tileStart(anchor, size) {
    let start = Number.isFinite(anchor) ? anchor : 0;
    const step = Math.max(1, size);
    while (start > 0) start -= step;
    while (start <= -step) start += step;
    return start;
  }

  function drawPaperWash(ctx, width, height) {
    const opacity = Math.max(0, Math.min(0.6, state.style.maskOpacity / 100));
    if (!opacity) return;

    ctx.save();
    ctx.fillStyle = `rgba(255, 250, 240, ${opacity})`;
    ctx.fillRect(0, 0, width, height);
    const sideGlow = ctx.createLinearGradient(0, 0, width, 0);
    sideGlow.addColorStop(0, "rgba(47, 102, 88, 0)");
    sideGlow.addColorStop(1, "rgba(47, 102, 88, 0.03)");
    ctx.fillStyle = sideGlow;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  function drawPaperGrid(ctx) {
    const zone = relativeRect(els.letterZone);
    const opacity = Math.max(0, Math.min(1, state.style.gridOpacity / 100));
    if (!opacity || !zone.width || !zone.height) return;

    const gridCol = cssPx("--grid-col", 32);
    const gridRow = cssPx("--grid-row", 32);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.lineWidth = 1;

    if (state.writingMode === "vertical") {
      ctx.strokeStyle = "rgba(128, 74, 48, .58)";
      ctx.strokeRect(zone.x + .5, zone.y + .5, zone.width - 1, zone.height - 1);
      ctx.strokeStyle = "rgba(128, 74, 48, .6)";
      for (let x = zone.x + zone.width - gridCol; x > zone.x + 1; x -= gridCol) {
        drawLine(ctx, x, zone.y, x, zone.y + zone.height);
      }
    } else {
      ctx.strokeStyle = "rgba(128, 74, 48, .18)";
      ctx.strokeRect(zone.x + .5, zone.y + .5, zone.width - 1, zone.height - 1);
      ctx.strokeStyle = "rgba(128, 74, 48, .38)";
      for (let y = zone.y + gridRow; y < zone.y + zone.height - 1; y += gridRow) {
        drawLine(ctx, zone.x, y, zone.x + zone.width, y);
      }
    }

    ctx.restore();
  }

  function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1 + .5, y1 + .5);
    ctx.lineTo(x2 + .5, y2 + .5);
    ctx.stroke();
  }

  function drawLetterText(ctx) {
    const zone = relativeRect(els.letterZone);
    if (!zone.width || !zone.height) return;

    const font = FONT_OPTIONS.find((item) => item.value === state.style.fontFamily) || FONT_OPTIONS[0];
    const computedStyle = window.getComputedStyle(els.letterZone);
    const fontSize = Number.parseFloat(computedStyle.fontSize) || state.style.fontSize;
    const ink = hexToRgb(state.style.inkColor);
    const opacity = Math.max(0, Math.min(1, state.style.inkOpacity / 100));

    ctx.save();
    ctx.fillStyle = `rgba(${ink.r}, ${ink.g}, ${ink.b}, ${opacity})`;
    ctx.textBaseline = "middle";

    if (state.writingMode === "vertical") {
      drawVerticalLetter(ctx, zone, font, fontSize);
    } else {
      drawHorizontalLetter(ctx, zone, font, fontSize);
    }

    ctx.restore();
  }

  function drawVerticalLetter(ctx, zone, font, fontSize) {
    const gridCol = cssPx("--grid-col", fontSize * state.style.lineHeight);
    const gridRow = cssPx("--grid-row", fontSize * state.style.lineHeight);
    const columns = Math.max(1, Math.floor(zone.width / gridCol));
    const rows = Math.max(1, Math.floor(zone.height / gridRow));
    const metrics = { zone, gridCol, gridRow, columns, rows };
    let cursor = { col: 0, row: 0 };

    ctx.textAlign = "center";
    if (state.style.showTitle && state.title.trim()) {
      ctx.font = `600 ${fontSize}px ${font.stack}`;
      cursor = drawVerticalFlow(ctx, state.title.trim(), cursor.col, 0, metrics);
      cursor = { col: cursor.col + 1, row: 0 };
    }

    ctx.font = `400 ${fontSize}px ${font.stack}`;
    cursor = drawVerticalFlow(ctx, state.body, cursor.col, cursor.row, metrics);

    if (state.style.showSignature && state.signature.trim()) {
      const signature = state.signature.trim();
      const sigCol = Math.min(columns - 1, cursor.col + 1);
      const sigRow = Math.max(0, rows - Array.from(signature).length - 1);
      ctx.font = `400 ${fontSize}px ${font.stack}`;
      drawVerticalFlow(ctx, signature, sigCol, sigRow, metrics);
    }
  }

  function drawVerticalFlow(ctx, text, startCol, startRow, metrics) {
    let col = startCol;
    let row = startRow;

    Array.from(String(text || "")).forEach((char) => {
      if (char === "\r") return;
      if (char === "\n") {
        col += 1;
        row = 0;
        return;
      }
      if (row >= metrics.rows) {
        col += 1;
        row = 0;
      }
      if (col >= metrics.columns) return;

      const x = metrics.zone.x + metrics.zone.width - (col + .5) * metrics.gridCol;
      const y = metrics.zone.y + (row + .5) * metrics.gridRow;
      ctx.fillText(char, x, y);
      row += 1;
    });

    return { col, row };
  }

  function drawHorizontalLetter(ctx, zone, font, fontSize) {
    const gridRow = cssPx("--grid-row", fontSize * state.style.lineHeight);
    const spacing = fontSize * state.style.letterSpacing;
    let row = 0;

    ctx.textAlign = "left";
    if (state.style.showTitle && state.title.trim()) {
      ctx.font = `600 ${fontSize}px ${font.stack}`;
      row = drawHorizontalParagraphs(ctx, state.title.trim(), zone, row, gridRow, spacing, "left") + 1;
    }

    ctx.font = `400 ${fontSize}px ${font.stack}`;
    row = drawHorizontalParagraphs(ctx, state.body, zone, row, gridRow, spacing, "left");

    if (state.style.showSignature && state.signature.trim()) {
      row += 1;
      ctx.font = `400 ${fontSize}px ${font.stack}`;
      drawHorizontalParagraphs(ctx, state.signature.trim(), zone, row, gridRow, spacing, "right");
    }
  }

  function drawHorizontalParagraphs(ctx, text, zone, startRow, gridRow, spacing, align) {
    let row = startRow;
    String(text || "").replace(/\r\n/g, "\n").split("\n").forEach((paragraph) => {
      if (!paragraph) {
        row += 1;
        return;
      }
      wrapHorizontalText(ctx, paragraph, zone.width, spacing).forEach((line) => {
        const y = zone.y + (row + .5) * gridRow;
        const lineWidth = measureSpacedLine(ctx, line, spacing);
        const x = align === "right" ? zone.x + zone.width - lineWidth : zone.x;
        drawSpacedLine(ctx, line, x, y, spacing);
        row += 1;
      });
    });
    return row;
  }

  function wrapHorizontalText(ctx, text, maxWidth, spacing) {
    const lines = [];
    let line = "";

    Array.from(String(text || "")).forEach((char) => {
      const candidate = line + char;
      if (line && measureSpacedLine(ctx, candidate, spacing) > maxWidth) {
        lines.push(line);
        line = char;
      } else {
        line = candidate;
      }
    });

    if (line) lines.push(line);
    return lines;
  }

  function drawSpacedLine(ctx, text, x, y, spacing) {
    let cursor = x;
    Array.from(text).forEach((char) => {
      ctx.fillText(char, cursor, y);
      cursor += ctx.measureText(char).width + spacing;
    });
  }

  function measureSpacedLine(ctx, text, spacing) {
    const chars = Array.from(text);
    return chars.reduce((total, char) => total + ctx.measureText(char).width, 0) + Math.max(0, chars.length - 1) * spacing;
  }

  async function drawSealOnCanvas(ctx) {
    if (!state.style.showSeal || !els.sealMark || els.sealMark.style.display === "none") return;

    const rect = relativeRect(els.sealMark);
    const descriptor = sealDescriptor();
    const glyphs = await resolveSealGlyphs(descriptor);

    ctx.save();
    ctx.translate(rect.x + rect.width / 2, rect.y + rect.height / 2);
    ctx.rotate(descriptor.style === "zhu" ? -0.025 : -0.02);
    ctx.translate(-rect.width / 2, -rect.height / 2);

    if (descriptor.style === "bai") {
      await drawBaiSealOnCanvas(ctx, rect, descriptor, glyphs);
    } else {
      await drawZhuSealOnCanvas(ctx, rect, descriptor, glyphs);
    }

    ctx.restore();
  }

  async function drawZhuSealOnCanvas(ctx, rect, descriptor, glyphs) {
    const random = seededRandom(descriptor.text + "zhu-canvas");
    const red = "rgba(217, 102, 80, .9)";
    const paper = "rgba(255, 250, 240, .9)";
    const { layout } = descriptor;

    ctx.save();
    ctx.scale(rect.width / layout.width, rect.height / layout.height);
    ctx.strokeStyle = red;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = layout.strokeWidth;
    drawRoughRectCanvas(ctx, layout.borderInset, layout.borderInset, layout.width - layout.borderInset * 2, layout.height - layout.borderInset * 2, random);
    await drawSealLayoutGlyphs(ctx, descriptor, glyphs, red);
    drawSealWearCanvas(ctx, layout.width, layout.height, paper, random, layout.wearCount);
    ctx.restore();
  }

  async function drawBaiSealOnCanvas(ctx, rect, descriptor, glyphs) {
    const random = seededRandom(descriptor.text + "bai-canvas");
    const red = "rgba(217, 102, 80, .94)";
    const paper = "rgba(255, 250, 240, .95)";
    const { layout } = descriptor;

    ctx.save();
    ctx.scale(rect.width / layout.width, rect.height / layout.height);
    ctx.fillStyle = red;
    roundedRectPath(ctx, layout.borderInset, layout.borderInset, layout.width - layout.borderInset * 2, layout.height - layout.borderInset * 2, layout.radius);
    ctx.fill();

    ctx.strokeStyle = "rgba(150, 48, 36, .58)";
    ctx.lineWidth = Math.max(2, layout.strokeWidth * .9);
    roundedRectPath(ctx, layout.rimInset, layout.rimInset, layout.width - layout.rimInset * 2, layout.height - layout.rimInset * 2, layout.radius * .72);
    ctx.stroke();

    drawSealWearCanvas(ctx, layout.width, layout.height, paper, random, layout.wearCount + 8);
    await drawSealLayoutGlyphs(ctx, descriptor, glyphs, "rgba(255, 250, 240, .96)");
    drawSealWearCanvas(ctx, layout.width, layout.height, "rgba(217, 102, 80, .22)", random, 8);
    ctx.restore();
  }

  async function drawSealLayoutGlyphs(ctx, descriptor, glyphs, color) {
    for (const item of descriptor.layout.items) {
      if (glyphs[item.index]) {
        await drawSealGlyphImage(ctx, glyphs[item.index], item, color);
      } else {
        drawSealMissingGlyphCanvas(ctx, item, descriptor.style, descriptor.text);
      }
    }
  }

  function drawSealMissingGlyphCanvas(ctx, item, style, seed) {
    const random = seededRandom(`${seed}-${item.char}-missing-canvas`);
    const color = style === "bai" ? "rgba(255, 250, 240, .38)" : "rgba(217, 102, 80, .28)";

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(1.2, item.glyphWidth * .055);
    drawRoughLineCanvas(ctx, item.x - item.glyphWidth * .18, item.y - item.glyphHeight * .1, item.x + item.glyphWidth * .18, item.y - item.glyphHeight * .1, random);
    ctx.lineWidth = Math.max(1.2, item.glyphWidth * .05);
    drawRoughLineCanvas(ctx, item.x - item.glyphWidth * .12, item.y + item.glyphHeight * .1, item.x + item.glyphWidth * .12, item.y + item.glyphHeight * .1, random);
    ctx.restore();
  }

  async function drawSealGlyphImage(ctx, glyph, item, color) {
    if (glyph && glyph.source === "text-fallback") {
      drawSealFallbackTextCanvas(ctx, glyph, item, color);
      return;
    }

    const box = sealGlyphDrawBox(item);
    const url = URL.createObjectURL(new Blob([sealGlyphCanvasSvg(glyph, color)], { type: "image/svg+xml" }));
    try {
      const image = await loadImageFromUrl(url);
      ctx.drawImage(image, box.x, box.y, box.width, box.height);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function drawSealFallbackTextCanvas(ctx, glyph, item, color) {
    const box = sealGlyphDrawBox(item);
    const char = glyph.normalizedChar || item.char || "";
    if (!char) return;

    const fontSize = Math.min(box.width, box.height) * .88;
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(.8, fontSize * .034);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${roundSvg(fontSize)}px KaiTi, STKaiti, DFKai-SB, FangSong, FangSong_GB2312, serif`;
    ctx.strokeText(char, box.x + box.width / 2, box.y + box.height / 2);
    ctx.fillText(char, box.x + box.width / 2, box.y + box.height / 2);
    ctx.restore();
  }

  function sealGlyphCanvasSvg(glyph, color) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeAttr(glyph.viewBox)}">
        <g color="${color}">
          ${glyph.content}
        </g>
      </svg>
    `;
  }

  function loadImageFromUrl(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const timer = window.setTimeout(() => reject(new Error("Image timed out.")), 5000);
      const cleanup = () => window.clearTimeout(timer);
      image.onload = () => {
        cleanup();
        resolve(image);
      };
      image.onerror = () => {
        cleanup();
        reject(new Error("Image failed to load."));
      };
      image.src = url;
    });
  }

  function drawRoughRectCanvas(ctx, x, y, width, height, random) {
    drawRoughLineCanvas(ctx, x, y, x + width, y, random);
    drawRoughLineCanvas(ctx, x + width, y, x + width, y + height, random);
    drawRoughLineCanvas(ctx, x + width, y + height, x, y + height, random);
    drawRoughLineCanvas(ctx, x, y + height, x, y, random);
  }

  function drawRoughLineCanvas(ctx, x1, y1, x2, y2, random) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.max(1, Math.hypot(dx, dy));
    const segments = Math.max(8, Math.round(length / 7));
    let drawing = false;

    ctx.beginPath();
    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const x = x1 + dx * t + (random() - .5) * 1.3;
      const y = y1 + dy * t + (random() - .5) * 1.3;
      if (!drawing || random() < .12) {
        ctx.moveTo(x, y);
        drawing = true;
      } else {
        ctx.lineTo(x, y);
      }
      if (random() < .075) drawing = false;
    }
    ctx.stroke();
  }

  function drawSealWearCanvas(ctx, width, height, color, random, count) {
    ctx.save();
    ctx.fillStyle = color;
    for (let i = 0; i < count; i += 1) {
      const x = random() * width;
      const y = random() * height;
      const w = 1 + random() * width * .14;
      const h = .8 + random() * 2.8;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((random() - .5) * .55);
      roundedRectPath(ctx, 0, 0, w, h, h / 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function roundedRectPath(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function relativeRect(node) {
    const frameRect = els.paperFrame.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    return {
      x: nodeRect.left - frameRect.left,
      y: nodeRect.top - frameRect.top,
      width: nodeRect.width,
      height: nodeRect.height
    };
  }

  function seededRandom(seedText) {
    let seed = 2166136261;
    Array.from(seedText || "seal").forEach((char) => {
      seed ^= char.charCodeAt(0);
      seed = Math.imul(seed, 16777619);
    });
    return function () {
      seed += 0x6D2B79F5;
      let value = seed;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function cssPx(name, fallback) {
    const value = window.getComputedStyle(els.paperFrame).getPropertyValue(name).trim();
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function hexToRgb(value) {
    const hex = String(value || "#3f3931").replace("#", "").trim();
    if (hex.length === 3) {
      return {
        r: Number.parseInt(hex[0] + hex[0], 16),
        g: Number.parseInt(hex[1] + hex[1], 16),
        b: Number.parseInt(hex[2] + hex[2], 16)
      };
    }
    return {
      r: Number.parseInt(hex.slice(0, 2), 16) || 63,
      g: Number.parseInt(hex.slice(2, 4), 16) || 57,
      b: Number.parseInt(hex.slice(4, 6), 16) || 49
    };
  }

  function exportFileName(asset) {
    const date = new Date();
    const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    return `shizhuzhai-${sanitizeFilePart(asset.category)}-${sanitizeFilePart(asset.title)}-${stamp}.png`;
  }

  function sanitizeFilePart(value) {
    return String(value || "letter")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "-")
      .slice(0, 36) || "letter";
  }

  function paperDisplayRatio(asset) {
    const sourceRatio = asset.width / asset.height;
    return state.writingMode === "horizontal"
      ? Math.max(sourceRatio, 0.78)
      : sourceRatio;
  }

  function updateGridDistribution() {
    if (!els.paperFrame || !els.letterZone) return;

    const zoneRect = els.letterZone.getBoundingClientRect();
    if (!zoneRect.width || !zoneRect.height) return;

    const computedStyle = window.getComputedStyle(els.letterZone);
    const computedFontSize = Number.parseFloat(computedStyle.fontSize) || state.style.fontSize;
    const targetRow = Math.max(18, computedFontSize * state.style.lineHeight);
    const targetCol = Math.max(22, computedFontSize * state.style.lineHeight);
    const columns = Math.max(1, Math.round(zoneRect.width / targetCol));
    const rows = Math.max(1, Math.round(zoneRect.height / targetRow));
    const columnWidth = zoneRect.width / columns;
    const rowHeight = zoneRect.height / rows;
    const alignedLineHeight = state.writingMode === "vertical"
      ? columnWidth / computedFontSize
      : rowHeight / computedFontSize;

    els.paperFrame.style.setProperty("--grid-columns", columns);
    els.paperFrame.style.setProperty("--grid-rows", rows);
    els.paperFrame.style.setProperty("--grid-col", `${columnWidth}px`);
    els.paperFrame.style.setProperty("--grid-row", `${rowHeight}px`);
    els.paperFrame.style.setProperty("--letter-line-height", alignedLineHeight);
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
    if (merged.style.sealStyle !== "bai") merged.style.sealStyle = "zhu";
    if (!SEAL_FORMAT_OPTIONS.some((option) => option.value === merged.style.sealFormat)) merged.style.sealFormat = "literal";
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
