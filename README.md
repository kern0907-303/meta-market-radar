# Market Radar

用 Vue 3 + Vite 製作的 Meta 廣告策略工作台。

## 開發

```bash
npm install
cp .env.example .env.local
npm run dev
```

預設開發網址：

```text
http://127.0.0.1:5173/
```

## 建置

```bash
npm run build
```

## 環境變數

在 `.env.local` 設定：

```bash
VITE_STAGE_ONE_WEBHOOK_URL=你的第一階段 webhook
VITE_STAGE_TWO_WEBHOOK_URL=你的第二階段 webhook
```

## 目錄

- `src/`：前端頁面與元件
- `public/`：公開靜態資源
- `docs/`：n8n workflow 與交接文件
