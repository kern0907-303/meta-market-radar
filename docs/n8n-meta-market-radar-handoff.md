# Meta 廣告概念生成引擎後端交接

這份文件對應可匯入的 n8n 工作流檔案：

- [n8n-meta-market-radar-workflow.json](/Volumes/2T/my-ai-project/market-radar/docs/n8n-meta-market-radar-workflow.json)

## 匯入方式

1. 在 n8n 進入 `Workflows`
2. 點擊 `Import from File`
3. 選擇 `docs/n8n-meta-market-radar-workflow.json`
4. 匯入後依照下方占位符逐一填值

## 需要你填入的占位符

- `__FIRECRAWL_API_KEY__`
- `__SERPER_API_KEY__`
- `__GEMINI_API_KEY__`
- `__GEMINI_MODEL__`
- `__FILL_WEBHOOK_ID__`
- `__N8N_WORKFLOW_ID__`

## 建議填法

- `__GEMINI_MODEL__`
  - 建議填 `gemini-1.5-pro`
- `__FILL_WEBHOOK_ID__`
  - 匯入後可讓 n8n 自動生成，或保留後再於 UI 內重存
- `__N8N_WORKFLOW_ID__`
  - 可刪掉或保留占位，通常 n8n 匯入後會自動處理

## 前端要對接的 Webhook

前端目前在 [App.vue](/Volumes/2T/my-ai-project/market-radar/src/App.vue:32) 還是占位值：

- `你的_N8N_WEBHOOK_URL`

請替換為你 n8n 上線後的正式 Webhook，例如：

```text
https://YOUR_N8N_HOST/webhook/analyze-market
```

## 工作流說明

### 路徑 A：精準狙擊

1. `Webhook - Analyze Market` 接收前端 POST
2. `Switch - Task Type` 判斷 `body.type === competitor`
3. `Code - Prepare Competitor URLs` 清理網址陣列
4. `HTTP - Firecrawl Scrape (Competitor)` 抓競品頁面 Markdown
5. `Code - Build Gemini Prompt (Competitor)` 合併爬蟲文字並組 prompt
6. `HTTP - Gemini Generate (Competitor)` 呼叫 Gemini
7. `Code - Format Response (Competitor)` 整理成前端可讀格式
8. `Respond to Webhook` 回傳 JSON

### 路徑 B：市場雷達

1. `Webhook - Analyze Market` 接收前端 POST
2. `Switch - Task Type` 判斷 `body.type === concept`
3. `HTTP - Serper Search` 用概念與市場代碼搜尋
4. `Code - Prepare Search URLs` 取前 5 筆搜尋連結
5. `HTTP - Firecrawl Scrape (Concept)` 抓搜尋結果頁面 Markdown
6. `Code - Build Gemini Prompt (Concept)` 合併爬蟲文字並組 prompt
7. `HTTP - Gemini Generate (Concept)` 呼叫 Gemini
8. `Code - Format Response (Concept)` 整理成前端可讀格式
9. `Respond to Webhook` 回傳 JSON

## 回傳格式

目前設計會回傳：

```json
{
  "ok": true,
  "type": "competitor",
  "result": "Gemini 回傳的純文字分析",
  "raw": {}
}
```

或：

```json
{
  "ok": true,
  "type": "concept",
  "result": "Gemini 回傳的純文字分析",
  "raw": {}
}
```

前端會直接把 `response.json()` 的內容顯示在結果區，因此如果你要更漂亮的前端呈現，建議後續把前端改成只渲染 `result` 欄位。

## 注意事項

- 這份藍圖使用 `HTTP Request` 節點串接 Firecrawl、Serper、Gemini，避免額外依賴社群節點。
- Firecrawl 目前設計為逐筆對網址呼叫 `/v1/scrape`，若未來資料量更大，可改成批次流程。
- 若 Firecrawl 或 Serper 回傳空值，程式節點會直接丟錯，方便在 n8n execution log 排查。
- Gemini prompt 已內嵌防幻覺規則、純文字輸出要求，以及資料不足時必須提供補件建議的規則。
- 若你預期常遇到驗證頁或無法抓取的落地頁，建議後續增加圖片上傳分析功能，讓使用者可補上頁面截圖或廣告素材截圖。
