# 十竹齋箋譜寫信 V1

這是一個完全離線可用的靜態原型，不依賴 npm、CDN 或後端服務。

## 打開頁面

- `index.html`：第二版主入口
- `layout-a-workbench.html`：兼容舊入口，會跳轉到 `index.html`

可以直接雙擊 `index.html` 打開。第二版只保留工作臺布局，選好箋紙和參數後可進入沉浸式紙面編輯。

## 版本記錄

- Git 標籤 `v1.0.0`：第一版基線。
- `CHANGELOG.md`：記錄每個版本的主要變更。

## 重新生成素材

如果 `..\shizhuzhai-png` 裡的圖片有增刪，重新執行：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\tools\build-assets.ps1
```

腳本會保留原始 PNG 不動，重新生成：

- `assets\thumbs`：縮略圖
- `assets\previews`：預覽圖
- `assets-manifest.js`：前端使用的素材清單
