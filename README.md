# 十竹齋箋譜寫信

一个以《十竹斋笺谱》风格笺纸为核心的静态写信工具。用户可以选择不同笺纸，输入题名、正文和落款，调整书写方向、字号、网格、墨色、纸张质感和印章样式，并导出成 PNG 图片。

在线体验：

[https://yiwuany.github.io/shizhuzhai-letter-site/](https://yiwuany.github.io/shizhuzhai-letter-site/)

## 项目特点

- 纯静态前端：不依赖 npm、CDN 或后端服务。
- 支持本地离线打开，也支持部署到 GitHub Pages。
- 内置笺纸缩略图和预览图，可在页面左侧选择笺纸。
- 支持竖排和横排书写，正文、题名、落款可直接编辑。
- 提供字号、行距、字距、网格透明度、墨色、纸张亮度/对比度/饱和度等样式控制。
- 支持朱文/白文印章、印文补款和部分小篆字形渲染。
- 支持成图预览和 PNG 下载。
- 自动保存当前编辑状态到浏览器本地存储。

## 使用方式

### 在线访问

直接打开 GitHub Pages 地址：

[https://yiwuany.github.io/shizhuzhai-letter-site/](https://yiwuany.github.io/shizhuzhai-letter-site/)

### 本地打开

双击 `index.html` 即可使用。页面在 `file://` 环境下会自动加载 `assets-inline-previews.js`，用于离线显示预览图。

也可以在项目目录启动任意静态服务器，例如：

```powershell
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000/
```

## 页面入口

- `index.html`：当前主入口。
- `layout-a-workbench.html`：旧入口兼容页，会跳转到 `index.html`。

## 项目结构

- `app.js`：核心交互逻辑、状态保存、纸面排版、印章渲染和图片导出。
- `styles.css`：工作台、笺纸预览、编辑面板和沉浸式编辑样式。
- `assets-manifest.js`：前端使用的笺纸素材清单。
- `assets-inline-previews.js`：本地离线打开时使用的内联预览资源。
- `assets/thumbs/`：笺纸缩略图。
- `assets/previews/`：笺纸预览图。
- `assets/fonts/`：印章字形相关字体和数据。
- `assets/seal-glyphs/`：补充的小篆 SVG 字形。
- `assets/vendor/`：随项目提交的第三方前端依赖。
- `tools/`：素材和印章字形生成脚本。

## 重新生成素材

如果父目录中的 `..\shizhuzhai-png` 原始图片有增删，可以重新生成站点素材：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\tools\build-assets.ps1
```

脚本会保留原始 PNG 不动，并重新生成：

- `assets\thumbs`：缩略图。
- `assets\previews`：预览图。
- `assets-manifest.js`：前端素材清单。

## 重新生成印章字形

如果需要从字体补充小篆 SVG 字形，可以运行：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\tools\build-seal-glyphs.ps1
```

生成结果会写入：

- `assets\seal-glyphs`：小篆 SVG。
- `assets\seal-glyphs\generated-manifest.js`：小篆字形清单。

## 部署

当前仓库通过 GitHub Pages 发布：

- 发布分支：`main`
- 发布目录：仓库根目录 `/`
- Pages 地址：[https://yiwuany.github.io/shizhuzhai-letter-site/](https://yiwuany.github.io/shizhuzhai-letter-site/)

仓库根目录包含 `.nojekyll`，GitHub Pages 会直接按静态文件发布，不经过 Jekyll 处理。

## 版本记录

- `CHANGELOG.md`：记录主要版本变更。
- Git 标签：`v1.0.0`、`v2.0.0`、`v2.1.0`、`v2.2.0`。

## 说明

`output/` 和 `test-results/` 是本地检查/导出结果目录，已通过 `.gitignore` 排除，不会提交到仓库。
