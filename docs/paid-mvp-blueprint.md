# 付費版 MVP 開發藍圖

## 文件目的

這份文件把目前 `market-radar` 的現況、你提出的四大流程、後續商品化方向，以及付費版 MVP 的實作範圍整合成一份主文件。

這份文件要解決四件事：

1. 重新定義這個產品到底在賣什麼
2. 將目前已完成的前兩步，接上後兩步的商品化方向
3. 把目前零散的輸入與輸出，重構成可保存、可追蹤、可收費的資料流
4. 給出從現在到付費版 MVP 的實作步驟與優先順序

---

## 一句話產品定義

這不是單純的 AI 分析工具，而是一個把「市場洞察 -> 廣告概念 -> 創意清單 -> 素材製作指令」標準化的 Meta 廣告創意生產系統。

---

## 產品目標

把目前偏個人工作流的網站，升級成可提供付費用戶使用的最小可收費版本。

這個版本的目標不是一次做到最完整，而是先做到：

- 使用者可以登入與付費
- 使用者可以建立分析專案
- 系統可以產出第一階段市場洞察
- 系統可以產出第二階段 Concept Matrix
- 系統可以繼續產出第三階段 Creative Brief / 創意清單
- 所有資料都能保存、回看、匯出
- 平台能限制額度、控制成本、處理失敗

---

## 四大流程重新定義

你原本的四步是對的，但如果最終要變成商品，不能只保留「操作步驟」，而要重構成「產品流水線」。

### Step 1：市場調研

原始做法：

- 貼競品連結給 AI
- 取得競品賣點、客戶痛點、價格定位
- 手動整理到 Google Doc

商品化後的定義：

- 建立一個 `Research Project`
- 保存研究輸入、來源網址、研究時間、結果版本
- 讓結果不只是一次性輸出，而是可回看、可匯出、可作為後續流程輸入

這一步的產品輸出：

- `Market Research Report`

### Step 2：生成廣告概念

原始做法：

- 把市場研究文檔、產品資訊、TA、Offer 丟給 AI
- 生成 Cold / Warm / Hot 三階段共 12 個 Concepts
- 再手動整理到 Excel

商品化後的定義：

- 把 12 個 concept 存成結構化資料
- 每個 concept 都不是一段文字，而是一筆可管理資產
- Concept 要能直接接到第三步產出創意清單

這一步的產品輸出：

- `Concept Matrix`

### Step 3：建立創意清單

原始做法：

- 針對 12 個 concepts 各生成 3 個靜態圖設計說明
- 手動整理成創意清單

商品化後的定義：

- 這一步不只是「多吐一些 prompt」
- 而是把 concept 轉成可直接交付給設計師、AI 圖像工具、剪輯師的結構化 creative brief
- 每一筆 creative 都應有固定欄位、可追溯來源、可批量匯出

這一步的產品輸出：

- `Creative Brief List`

### Step 4：素材製作與交付

原始做法：

- 把創意清單貼到 AI 圖片工具
- 再進 Canva 清理文字與排版
- 建資料夾歸檔

商品化後的定義：

- MVP 初期不要一開始就追求全自動出圖
- 先把這一步拆成：
  - 素材生成指令輸出
  - 素材交付與歸檔
- 後續版本再做：
  - AI 批量出圖
  - Canva 模板化
  - 批量輸出與資料夾管理

這一步的產品輸出：

- `Asset Production Package`

---

## 商品化後的輸入與輸出

### 每個專案的核心輸入

- 產品名稱
- 產品簡述
- 目標市場
- 競品網址 / 參考網址
- 客戶畫像
- Offer / 優惠策略
- 品牌素材或產品圖

### 每個專案的核心輸出

1. 市場研究報告
2. Concept Matrix（12 個）
3. Creative Brief List（每個 Concept 對應多個 Creative）
4. 匯出包（Markdown / JSON / CSV / Excel）

---

## 目前網站現況與差距

### 已完成

- Vue 前端介面
- 第一階段 workflow：市場 / 競品分析
- 第二階段 workflow：Concept Matrix 生成
- 暫存、匯出、第二階段重試等前端能力

### 尚未完成

- 沒有專案層級資料模型
- 沒有把第一、二、三、四步串成正式產品流程
- 沒有第三階段 Creative Brief 系統
- 沒有第四階段素材交付系統
- 沒有正式登入、權限、歷史雲端保存
- 沒有付款與額度
- 沒有正式後端包住 n8n

---

## 先重新整理目前資料的步驟

這一段是從「現在網站已有的東西」往商品化結構過渡的第一步。

### 步驟 1：把一次分析改成一個 Project

目前網站偏向單次執行。

要改成：

- 每次分析都屬於一個 `project`
- project 下面會有：
  - 研究輸入
  - 第一階段結果
  - 第二階段結果
  - 後續 creative list
  - 匯出紀錄

### 步驟 2：把第一階段結果從自由文字提升成報告物件

目前第一階段結果主要是 markdown / 純文字。

要逐步整理成：

- 摘要
- 競品賣點
- 客戶痛點
- 受眾語言
- 定價觀察
- 後續建議

目的不是完全不顯示 markdown，而是內部資料結構不能只有一整段字。

### 步驟 3：把第二階段 12 個 Concept 結構化

目前第二階段重點是把 12 個 concept 產出來。

要整理成每個 concept 都有：

- `concept_id`
- `project_id`
- `stage` (`cold`, `warm`, `hot`)
- `title`
- `big_idea`
- `target_persona`
- `core_message`
- `suggested_format`
- `status`

這一步很重要，因為第三步要靠 concept 作為父層資料。

### 步驟 4：新增第三階段資料模型，不一定先做完整 UI

先定義資料，不一定先把全部頁面做完。

每個 creative brief 建議有：

- `creative_id`
- `concept_id`
- `asset_type` (`static`, `carousel`, `video`, `ugc`)
- `visual_direction`
- `headline`
- `body_copy`
- `cta`
- `tone`
- `color_style`
- `designer_notes`
- `generator_prompt`

### 步驟 5：先把匯出格式統一

MVP 早期就要決定：

- 給使用者看的畫面
- 給內部資料庫存的結構
- 匯出給 Excel / 設計師 / AI 工具的格式

建議至少統一成：

- Markdown：給人讀
- JSON：給系統吃
- CSV / Excel：給操作人員整理

### 步驟 6：把 localStorage 暫存，未來替換成雲端專案保存

目前 localStorage 是好用的暫時方案，但付費版不能只靠它。

要把現在的暫存概念過渡成：

- 使用者登入後可回看自己所有 projects
- 任務資料與結果存進 DB
- localStorage 只做輔助暫存，不是主儲存

---

## 付費版 MVP 的重新定義

### 一句話版本

單一付費使用者登入後，可以建立一個廣告研究專案，依序得到市場研究、Concept Matrix，並保存結果、重跑第二階段、匯出資料。

### MVP 範圍

MVP 先收斂在前三步中的前兩步，並為第三步留下資料接口。

也就是：

- 做好 Step 1：市場調研
- 做好 Step 2：Concept Matrix
- 補好資料模型，能接 Step 3
- 暫時不做 Step 4 的完整自動素材製作

### 為什麼這樣收斂

因為目前真正最能形成可收費產品的，不是先自動產 36 張圖，而是：

- 研究輸入變成正式專案
- 研究結果與 concept 可回看
- 結果可匯出給團隊與外部工具

這樣就已經可以賣「策略版」或「創意版」產品。

---

## 產品層級建議

如果最終要變成商品，我建議產品分三層，而不是一次全做。

### Level 1：策略版

包含：

- Step 1 市場研究
- Step 2 Concept Matrix

適合：

- 品牌主
- 操盤手
- 小團隊

### Level 2：創意版

包含：

- 策略版全部
- Step 3 Creative Brief List

適合：

- 行銷團隊
- 代理商
- 設計協作者

### Level 3：素材版

包含：

- 創意版全部
- Step 4 AI 生成與 Canva 交付

適合：

- 大量投放團隊
- 需要快速出素材的操作型使用者

MVP 建議先做到 Level 1，資料模型預留到 Level 2。

---

## MVP 功能範圍

### 1. 帳號系統

必做：

- Email 註冊 / 登入 / 登出
- 忘記密碼
- Email 驗證

可延後：

- Google Login
- 雙因素驗證

### 2. 方案與額度

先只做一種方案：

- 月費制
- 每月固定額度

MVP 建議先提供：

- 每月 `60` 點
- 第一步市場調研 `1` 點
- 第二步 Concept Matrix `1` 點

等於：

- 一次完整專案 `2` 點
- 每月大約可跑 `30` 次完整專案

這個數字的好處是：

- 對單人操盤手或小團隊來說夠用
- 對平台成本相對可控
- 不會因為額度太高，讓早期版本被濫用

建議額度邏輯：

- 第一階段成功執行：扣 1 點
- 第二階段成功執行：扣 1 點

這樣對成本比較可控，也比較容易做錯誤補償。

### 3. Project 系統

必做：

- 建立 project
- project 內保存輸入
- 第一階段與第二階段結果都屬於 project
- project 歷史列表
- project 詳情頁

### 4. 任務系統

必做：

- 建立第一階段任務
- 在第一階段成功後啟動第二階段
- 任務狀態追蹤
- 任務結果保存
- 第二階段重試

任務狀態建議：

- `queued`
- `running`
- `completed`
- `failed`
- `partial_failed`

### 5. 匯出

必做：

- 匯出第一階段 Markdown / JSON
- 匯出第二階段 Markdown / JSON
- 預留第三階段 CSV / Excel 匯出

### 6. 基本客服與營運支援

MVP 最低限度：

- 能查某個使用者有哪些 project
- 能查某個 project 的任務狀態
- 能查扣點是否成功
- 能手動補點

---

## 技術架構建議

### 建議架構

1. 前端：現有 Vue / Vite
2. 後端 API：新增正式應用層
3. Workflow：沿用 n8n
4. AI / 搜尋 / 抓取：Gemini、Firecrawl、Serper
5. 資料庫：保存使用者、專案、任務、結果、額度、付款
6. 付款：Stripe 或等效方案

### 建議資料流

1. 前端呼叫自家 API
2. API 驗證登入狀態與額度
3. API 建立 project 與 task
4. API 觸發 n8n workflow
5. n8n 完成後回寫結果到 API / DB
6. 前端查看任務狀態與 project 詳情

### 不建議的做法

- 付費用戶直接從瀏覽器打 n8n webhook
- API key 只存在 workflow JSON 檔案中
- 只靠 localStorage 保存正式用戶資料

---

## 建議資料模型

### users

- `id`
- `email`
- `password_hash`
- `email_verified`
- `plan_status`
- `created_at`
- `updated_at`

### subscriptions

- `id`
- `user_id`
- `plan_code`
- `status`
- `current_period_start`
- `current_period_end`
- `payment_provider`
- `provider_subscription_id`

### credits

- `id`
- `user_id`
- `balance`
- `updated_at`

### credit_transactions

- `id`
- `user_id`
- `project_id`
- `task_id`
- `type` (`debit`, `refund`, `manual_adjustment`)
- `amount`
- `reason`
- `created_at`

### projects

- `id`
- `user_id`
- `name`
- `product_name`
- `market`
- `project_type` (`competitor`, `concept`)
- `input_payload`
- `status`
- `created_at`
- `updated_at`

### analysis_tasks

- `id`
- `project_id`
- `user_id`
- `stage` (`stage_one`, `stage_two`, `stage_three`)
- `status`
- `input_payload`
- `result_payload`
- `error_message`
- `created_at`
- `updated_at`

### concepts

- `id`
- `project_id`
- `concept_code`
- `awareness_stage`
- `title`
- `big_idea`
- `target_persona`
- `core_message`
- `suggested_format`
- `raw_content`
- `created_at`

### creative_briefs

- `id`
- `project_id`
- `concept_id`
- `creative_code`
- `asset_type`
- `visual_direction`
- `headline`
- `body_copy`
- `cta`
- `tone`
- `color_style`
- `designer_notes`
- `generator_prompt`
- `created_at`

### payments

- `id`
- `user_id`
- `provider`
- `provider_payment_id`
- `amount`
- `currency`
- `status`
- `created_at`

---

## API 範圍建議

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`

### Billing

- `GET /api/billing/plan`
- `POST /api/billing/checkout`
- `POST /api/billing/webhook`

### Credits

- `GET /api/credits`

### Projects

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:projectId`

### Tasks

- `POST /api/projects/:projectId/stage-one`
- `POST /api/projects/:projectId/stage-two`
- `POST /api/projects/:projectId/stage-three`
- `POST /api/tasks/:taskId/retry`
- `GET /api/tasks/:taskId`

### Concepts

- `GET /api/projects/:projectId/concepts`

### Creative Briefs

- `GET /api/projects/:projectId/creative-briefs`

### Exports

- `GET /api/projects/:projectId/export?format=md`
- `GET /api/projects/:projectId/export?format=json`
- `GET /api/projects/:projectId/export?format=csv`

---

## 使用者流程

### 首次付費使用者流程

1. 進入首頁
2. 註冊帳號
3. 驗證 Email
4. 選擇方案並付款
5. 建立新的 research project
6. 執行第一階段市場調研
7. 查看市場研究報告
8. 啟動第二階段 Concept Matrix
9. 查看、匯出、保存結果

### 已付費使用者日常流程

1. 登入
2. 查看剩餘額度
3. 開新 project
4. 回看舊 project
5. 重跑第二階段
6. 匯出結果

### 未來升級流程

在 Level 2 版本，流程會接著變成：

1. 從 project 中選擇 concepts
2. 啟動第三階段 creative brief 生成
3. 匯出 creative list 給設計師 / AI 工具 / Canva

---

## 安全與風控

MVP 必做：

- 所有 webhook 與 API key 移到後端安全環境
- 前端不直接暴露 n8n 生產 webhook
- Rate limit
- 單一使用者額度限制
- URL 基本驗證與黑名單策略
- 任務輸入大小限制

需要特別注意：

- 惡意重送請求造成成本爆炸
- 任意網址抓取造成濫用與法律問題
- prompt injection 影響後續生成品質

---

## 測試範圍

### 功能測試

- 註冊 / 登入 / 登出
- 付款後方案開通
- 建立 project
- 第一階段成功
- 第二階段成功
- 第二階段失敗重試
- 歷史紀錄載入
- 匯出功能

### 邊界測試

- 額度不足
- 第一階段成功但第二階段失敗
- workflow timeout
- webhook 無回應
- 外部 API 失敗
- 重複提交任務

### 商業測試

- 是否正確扣點
- 是否錯誤退點
- 取消訂閱後是否停用

---

## 監控與營運

MVP 最低限度需要：

- 任務成功率
- 任務失敗率
- 每位使用者使用次數
- 每日 API 成本估算
- 付款成功 / 失敗紀錄

建議至少要有：

- 錯誤日誌
- 任務追蹤 ID
- 人工補點操作記錄

---

## 法務與政策

上線前至少要補：

- 服務條款
- 隱私權政策
- 退款政策
- 資料保存政策

需要明講：

- 你會保存哪些分析資料
- 保存多久
- 是否用於內部優化
- 付款後如何退費

---

## 開發優先順序

### Phase 0：定義與收斂

- 定義方案與扣點規則
- 定義 project / task / concept / creative brief 資料模型
- 決定後端框架
- 決定付款方案

### Phase 1：底層骨架

- 建立後端 API
- 建立資料庫 schema
- 建立使用者系統
- 建立 project 與 task 資料模型

### Phase 2：分析流程接管

- 前端改打自家 API
- API 串接第一階段 workflow
- API 串接第二階段 workflow
- 保存任務與結果
- project 詳情頁

### Phase 3：收費與額度

- 串接付款
- 開通訂閱
- 額度扣點
- 額度顯示

### Phase 4：第三階段資料化

- 建立 concept 結構化解析
- 建立 creative brief 資料模型
- 定義第三階段 workflow 輸出格式
- 補 CSV / Excel 匯出

### Phase 5：穩定化

- 補測試
- 補錯誤處理
- 補監控
- 補法務頁

---

## 預估時程

如果需求不再大幅變動，建議抓：

- 藍圖與規格收斂：1 到 2 天
- MVP 骨架：3 到 5 個工作天
- 可內測版本：7 到 12 個工作天
- 可正式收費第一版：3 到 5 週

---

## 上線前驗收標準

符合以下條件才算 MVP 可收費：

- 使用者可以順利註冊、登入、付款
- 每位使用者只能看到自己的 project 與資料
- 第一階段與第二階段都能穩定完成
- 額度扣除規則清楚且可追查
- 歷史紀錄可回看
- 匯出功能正常
- 常見錯誤可重試
- 有基本服務條款與隱私政策

---

## 建議下一步

這份藍圖整合完成後，最適合的下一步是：

1. 先定義方案與扣點規則
2. 再畫出 `project -> task -> concept -> creative_brief` 的資料關係
3. 最後再開始進入後端與 DB schema 設計

如果先不做這三件事，就會很容易在開發途中反覆返工。
