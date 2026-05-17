# 十竹齋箋譜寫信 V1

這是一個完全離線可用的靜態原型，不依賴 npm、CDN 或後端服務。

## 打開頁面

- `layout-a-workbench.html`：工作臺布局
- `layout-b-immersive.html`：沉浸布局
- `layout-c-classic.html`：素箋布局

可以直接雙擊 HTML 文件打開。三個頁面共用同一份素材清單、樣式與自動保存資料。

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
