<script setup>
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { computed, ref, watch } from 'vue'
import TabCompetitor from './components/TabCompetitor.vue'
import TabConcept from './components/TabConcept.vue'

marked.setOptions({
  gfm: true,
  breaks: true
})

const SESSION_CACHE_KEY = 'market-radar-session-cache'
const POINTS_PER_STAGE = 1
const RECOMMENDED_MONTHLY_POINTS = 60

const readCachedSession = () => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(SESSION_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    console.warn('讀取暫存失敗:', error)
    return null
  }
}

const cachedSession = readCachedSession()

const activeTab = ref(cachedSession?.activeTab ?? 'competitor')
const isLoading = ref(false)
const isGeneratingConcepts = ref(false)
const resultData = ref(cachedSession?.resultData ?? null)
const conceptData = ref(cachedSession?.conceptData ?? null)
const conceptErrorMessage = ref(cachedSession?.conceptErrorMessage ?? '')
const activePreview = ref('strategy')
const lastSavedAt = ref(cachedSession?.savedAt ?? null)

const STAGE_ONE_WEBHOOK_URL = import.meta.env.VITE_STAGE_ONE_WEBHOOK_URL?.trim() ?? ''
const STAGE_TWO_WEBHOOK_URL = import.meta.env.VITE_STAGE_TWO_WEBHOOK_URL?.trim() ?? ''

const tabs = [
  {
    key: 'competitor',
    label: '精準狙擊',
    eyebrow: '競品情報',
    title: '用競品頁面反推社群廣告切角',
    description: '輸入競品網址後，我們會整理對手訊息架構、可能受眾與可以切入的差異化機會。'
  },
  {
    key: 'concept',
    label: '市場雷達',
    eyebrow: '概念探索',
    title: '從概念出發搜尋市場需求與創意方向',
    description: '沒有明確競品也沒關係，直接用你的產品想法做市場盲搜，找到受眾語言與值得測試的主題。'
  }
]

const activeTabMeta = computed(() => tabs.find((tab) => tab.key === activeTab.value) ?? tabs[0])

const previewTabs = [
  {
    key: 'strategy',
    label: '廣告策略',
    cards: [
      {
        title: '核心主張切法',
        description: '先把產品賣點濃縮成一句結果承諾，讓第一眼就知道這個方案能解決什麼。'
      },
      {
        title: '投放優先順序',
        description: '優先測試最接近成交的角度，再把表現好的訊息延伸成第二波素材。'
      },
      {
        title: '可測試開場鉤子',
        description: '前三秒先點出使用者最怕失去的結果，再帶出你的解法與差異。'
      }
    ]
  },
  {
    key: 'audience',
    label: '受眾輪廓',
    cards: [
      {
        title: '主要痛點族群',
        description: '鎖定已經意識到問題、正在找更快做法的人，會比冷受眾更容易打中需求。'
      },
      {
        title: '情境與語感',
        description: '多用他們每天會遇到的壓力場景與內心話，少用品牌自我介紹式文案。'
      },
      {
        title: '轉換阻力點',
        description: '把猶豫點拆成價格、信任、速度三類，素材與頁面就更容易對應優化。'
      }
    ]
  },
  {
    key: 'creative',
    label: '素材方向',
    cards: [
      {
        title: '首圖視覺重點',
        description: '畫面先聚焦在問題爆點或成果反差，讓使用者停下來看第二眼。'
      },
      {
        title: '文案節奏安排',
        description: '用痛點開場、方法說明、結果收尾的三段節奏，閱讀阻力會更低。'
      },
      {
        title: '延伸變體建議',
        description: '同一主題至少拆成見證型、對比型、清單型三種素材，方便快速測試。'
      }
    ]
  }
]

const activePreviewMeta = computed(
  () => previewTabs.find((tab) => tab.key === activePreview.value) ?? previewTabs[0]
)

const resultMarkdown = computed(() => {
  if (!resultData.value) return ''
  if (typeof resultData.value === 'string') return resultData.value
  if (typeof resultData.value.result === 'string') return resultData.value.result
  if (typeof resultData.value.error === 'string') return resultData.value.error
  return JSON.stringify(resultData.value, null, 2)
})

const hasResultError = computed(() => Boolean(resultData.value?.error))

const renderedResultHtml = computed(() => {
  const source = resultMarkdown.value || '目前沒有可顯示的分析內容。'
  const html = marked.parse(source)
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true }
  })
})

const conceptMarkdown = computed(() => {
  if (conceptErrorMessage.value && !conceptData.value) return conceptErrorMessage.value
  if (!conceptData.value) return ''
  if (typeof conceptData.value === 'string') return conceptData.value
  if (typeof conceptData.value.result === 'string') return conceptData.value.result
  if (typeof conceptData.value.error === 'string') return conceptData.value.error
  return JSON.stringify(conceptData.value, null, 2)
})

const hasConceptError = computed(() => Boolean(conceptErrorMessage.value || conceptData.value?.error))

const renderedConceptHtml = computed(() => {
  const source = conceptMarkdown.value || '目前沒有可顯示的創意矩陣內容。'
  const html = marked.parse(source)
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true }
  })
})

const hasCachedData = computed(() => Boolean(resultData.value || conceptData.value))

const cacheStatusText = computed(() => {
  if (!lastSavedAt.value) return '尚未建立暫存'

  try {
    return `最近暫存：${new Date(lastSavedAt.value).toLocaleString('zh-TW')}`
  } catch {
    return '最近暫存：剛剛'
  }
})

const creditSummaryText = computed(() => {
  return `每階段 ${POINTS_PER_STAGE} 點，完整跑完第一、二階段共 2 點。建議付費 MVP 先提供每月 ${RECOMMENDED_MONTHLY_POINTS} 點，約可支撐 30 次完整專案。`
})

const persistSession = () => {
  if (typeof window === 'undefined') return

  if (!resultData.value && !conceptData.value) {
    window.localStorage.removeItem(SESSION_CACHE_KEY)
    lastSavedAt.value = null
    return
  }

  const payload = {
    activeTab: activeTab.value,
    resultData: resultData.value,
    conceptData: conceptData.value,
    conceptErrorMessage: conceptErrorMessage.value,
    savedAt: new Date().toISOString()
  }

  window.localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(payload))
  lastSavedAt.value = payload.savedAt
}

watch([activeTab, resultData, conceptData, conceptErrorMessage], persistSession, { deep: true })

const downloadFile = (filename, content, type = 'text/plain;charset=utf-8') => {
  if (typeof window === 'undefined') return

  const blob = new Blob([content], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

const exportStageMarkdown = (stage) => {
  const isConceptStage = stage === 'concept'
  const content = isConceptStage ? conceptMarkdown.value : resultMarkdown.value
  const filename = isConceptStage ? 'stage-two-concepts.md' : 'stage-one-insights.md'
  downloadFile(filename, content || '目前沒有可匯出的內容。', 'text/markdown;charset=utf-8')
}

const exportStageJson = (stage) => {
  const isConceptStage = stage === 'concept'
  const payload = isConceptStage ? conceptData.value : resultData.value
  const filename = isConceptStage ? 'stage-two-concepts.json' : 'stage-one-insights.json'
  downloadFile(filename, JSON.stringify(payload ?? {}, null, 2), 'application/json;charset=utf-8')
}

const clearCachedSession = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(SESSION_CACHE_KEY)
  }

  lastSavedAt.value = null
  resultData.value = null
  conceptData.value = null
  conceptErrorMessage.value = ''
}

const startNewProject = () => {
  activeTab.value = 'competitor'
  activePreview.value = 'strategy'
  clearCachedSession()
}

const submitToN8n = async (payload) => {
  if (!STAGE_ONE_WEBHOOK_URL) {
    resultData.value = {
      error: '尚未設定第一階段 webhook。請在 `.env.local` 補上 `VITE_STAGE_ONE_WEBHOOK_URL`。'
    }
    return
  }

  isLoading.value = true
  resultData.value = null
  conceptData.value = null
  conceptErrorMessage.value = ''
  try {
    const requestPayload = {
      ...payload,
      executionContext: {
        stage: 'stage_one',
        pointCost: POINTS_PER_STAGE,
        requestedAt: new Date().toISOString(),
        projectName: payload.projectName ?? '',
        sourceApp: 'market-radar-web'
      }
    }

    const response = await fetch(STAGE_ONE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload)
    })

    resultData.value = await response.json()
  } catch (error) {
    console.error('Webhook 發送失敗:', error)
    resultData.value = {
      error: `連線失敗！可能是 n8n 工作流未啟用（Active）或遭遇 CORS 跨網域阻擋。詳細錯誤：${error.message}`
    }
  } finally {
    isLoading.value = false
  }
}

const generateConcepts = async () => {
  if (!resultData.value) return
  if (!STAGE_TWO_WEBHOOK_URL) {
    conceptErrorMessage.value =
      '尚未設定第二階段 webhook。請在 `.env.local` 補上 `VITE_STAGE_TWO_WEBHOOK_URL`。'
    return
  }

  const previousConceptData = conceptData.value
  isGeneratingConcepts.value = true
  conceptErrorMessage.value = ''

  try {
    const response = await fetch(STAGE_TWO_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        marketInsights: resultData.value,
        sourceType: activeTab.value,
        executionContext: {
          stage: 'stage_two',
          pointCost: POINTS_PER_STAGE,
          requestedAt: new Date().toISOString(),
          projectName: resultData.value?.meta?.projectName ?? '',
          sourceApp: 'market-radar-web'
        }
      })
    })

    const nextConceptData = await response.json()

    if (nextConceptData?.error) {
      conceptErrorMessage.value = nextConceptData.error
      conceptData.value = previousConceptData
      return
    }

    conceptData.value = nextConceptData
  } catch (error) {
    console.error('第二階段發送失敗:', error)
    conceptErrorMessage.value = `第二階段連線失敗！請確認 generate-concepts webhook 已啟用。詳細錯誤：${error.message}`
    conceptData.value = previousConceptData
  } finally {
    isGeneratingConcepts.value = false
  }
}

const resetResult = () => {
  resultData.value = null
  conceptData.value = null
  conceptErrorMessage.value = ''
}
</script>

<template>
  <div class="app-shell">
    <main class="page-frame">
      <section class="hero-panel">
        <div class="hero-copy">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            廣告創意雷達
          </div>
          <p class="hero-eyebrow">社群藍系策略工作台</p>
          <h1>快速分析市場、拆解競品，產出可直接測試的 Meta 廣告策略。</h1>
          <p class="hero-description">
            輸入競品網址或產品概念後，系統會整理受眾痛點、溝通角度與素材方向，幫你更快決定下一波廣告怎麼打。
          </p>

          <div class="hero-metrics">
            <div class="metric-card">
              <span class="metric-label">分析模式</span>
              <strong>2 種工作流</strong>
              <p>競品逆向拆解與概念盲搜並行。</p>
            </div>
            <div class="metric-card">
              <span class="metric-label">輸入成本</span>
              <strong>3 分鐘內啟動</strong>
              <p>網址或概念貼上後就能直接送件。</p>
            </div>
            <div class="metric-card">
              <span class="metric-label">回傳目標</span>
              <strong>可執行廣告靈感</strong>
              <p>不是資料堆疊，而是能馬上測試的方向。</p>
            </div>
          </div>
        </div>

        <aside class="hero-preview">
          <div class="preview-window">
            <div class="preview-topbar">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="preview-body">
              <div class="preview-nav">
                <button
                  v-for="preview in previewTabs"
                  :key="preview.key"
                  type="button"
                  :class="['preview-pill', { 'preview-pill-active': activePreview === preview.key }]"
                  @click="activePreview = preview.key"
                >
                  {{ preview.label }}
                </button>
              </div>
              <div class="preview-graph"></div>
              <div class="preview-list">
                <div
                  v-for="card in activePreviewMeta.cards"
                  :key="card.title"
                  class="preview-list-item"
                >
                  <strong>{{ card.title }}</strong>
                  <p>{{ card.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section class="workspace-panel">
        <header class="workspace-header">
          <div>
            <p class="section-label">操作流程</p>
            <h2>選一種進場方式，開始你的市場拆解。</h2>
            <p class="section-copy">
              介面改成更清楚的雙欄卡片式分頁，讓第一次進來的人也能快速分辨「我現在要餵網址」還是「我要先丟概念」。
            </p>
          </div>
          <div class="workspace-tip">
            <span>目前模式</span>
            <strong>{{ activeTabMeta.eyebrow }}</strong>
          </div>
        </header>

        <div class="tab-switcher" role="tablist" aria-label="分析模式切換">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab-button', { 'tab-button-active': activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >
            <span class="tab-eyebrow">{{ tab.eyebrow }}</span>
            <strong>{{ tab.label }}</strong>
            <small>{{ tab.title }}</small>
          </button>
        </div>

        <div class="active-mode-card">
          <p class="section-label">{{ activeTabMeta.eyebrow }}</p>
          <h3>{{ activeTabMeta.title }}</h3>
          <p>{{ activeTabMeta.description }}</p>
        </div>

        <div class="commerce-panel">
          <div>
            <p class="section-label">商業化預備</p>
            <h3>目前已切成專案化輸入與分階段點數模型。</h3>
            <p>{{ creditSummaryText }}</p>
          </div>
        </div>

        <div class="cache-panel">
          <div>
            <p class="section-label">暫存區</p>
            <h3>分析結果會自動保存在這台裝置。</h3>
            <p>{{ cacheStatusText }}</p>
          </div>
          <div class="result-actions">
            <button v-if="hasCachedData" class="ghost-button" @click="clearCachedSession">清除暫存</button>
            <button v-if="hasCachedData" class="ghost-button ghost-button-accent" @click="startNewProject">
              開始新專案
            </button>
          </div>
        </div>

        <div v-if="!isLoading && !resultData" class="form-stage">
          <TabCompetitor v-if="activeTab === 'competitor'" @submit="submitToN8n" />
          <TabConcept v-else @submit="submitToN8n" />
        </div>

        <div v-else-if="isLoading" class="state-card">
          <div class="loader-orbit">
            <span></span>
          </div>
          <h3>正在為您搜集情報</h3>
          <p>系統會先比對市場訊號，再整理受眾語言、競品脈絡與可測試的廣告方向，稍後產出專業分析報告。</p>
        </div>

        <div v-else class="result-card">
          <div class="result-header">
            <div>
              <p class="section-label">分析結果摘要</p>
              <h3>{{ hasResultError ? '目前無法完成分析' : '分析結果與建議概念' }}</h3>
            </div>
            <div class="result-actions">
              <button class="ghost-button" @click="exportStageMarkdown('result')">匯出 Markdown</button>
              <button class="ghost-button" @click="exportStageJson('result')">匯出 JSON</button>
              <button class="ghost-button" @click="resetResult">重新分析</button>
            </div>
          </div>
          <div :class="['result-content', { 'result-content-error': hasResultError }]">
            <article
              :class="[
                'report-prose',
                'prose',
                'prose-blue',
                'max-w-none',
                'prose-headings:mb-4',
                'prose-headings:text-slate-900',
                'prose-p:my-4',
                'prose-li:my-1',
                'prose-li:marker:text-blue-500',
                'prose-strong:text-slate-900',
                'prose-table:rounded-2xl',
                'prose-table:border',
                'prose-table:border-slate-200',
                'prose-thead:bg-slate-100',
                'prose-th:border-b',
                'prose-th:border-slate-200',
                'prose-th:px-4',
                'prose-th:py-3',
                'prose-td:px-4',
                'prose-td:py-3',
                'prose-tr:border-b',
                'prose-tr:border-slate-100',
                'prose-a:text-blue-600',
                'prose-a:no-underline',
                'prose-code:text-sky-700'
              ]"
              v-html="renderedResultHtml"
            ></article>
          </div>

          <div v-if="!hasResultError" class="stage-two-panel">
            <div class="stage-two-copy">
              <p class="section-label">第二階段</p>
              <h4>把洞察直接轉成可投放的創意矩陣。</h4>
              <p>
                第一階段已經整理出市場脈絡與痛點，現在可以直接把這份報告送進第二個
                workflow，展開更有差異化的 Meta 廣告概念。
              </p>
            </div>

            <div class="stage-two-actions">
              <button
                v-if="!conceptData && !isGeneratingConcepts"
                class="submit-button stage-two-button"
                @click="generateConcepts"
              >
                啟動第二階段：生成創意矩陣（1 點）
              </button>
            </div>
          </div>

          <div v-if="isGeneratingConcepts" class="state-card state-card-secondary">
            <div class="loader-orbit loader-orbit-secondary">
              <span></span>
            </div>
            <h3>正在量產多樣化創意概念</h3>
            <p>系統會根據第一階段洞察，拆出更適合冷、溫、熱受眾的 Meta 廣告切角與素材方向。</p>
          </div>

          <div v-if="conceptErrorMessage" class="stage-error-banner">
            <strong>第二階段這次沒有成功覆蓋結果。</strong>
            <p>{{ conceptErrorMessage }}</p>
          </div>

          <div v-if="conceptData" class="concept-card">
            <div class="result-header">
              <div>
                <p class="section-label">創意矩陣</p>
                <h3>第二階段：Meta 多樣化創意清單</h3>
              </div>
              <div class="result-actions">
                <button class="ghost-button" @click="exportStageMarkdown('concept')">匯出 Markdown</button>
                <button class="ghost-button" @click="exportStageJson('concept')">匯出 JSON</button>
                <button class="ghost-button ghost-button-accent" @click="generateConcepts">
                  重啟第二階段
                </button>
              </div>
            </div>
            <div class="result-content">
              <article
                :class="[
                  'report-prose',
                  'prose',
                  'prose-blue',
                  'max-w-none',
                  'prose-headings:mb-4',
                  'prose-headings:text-slate-900',
                  'prose-p:my-4',
                  'prose-li:my-1',
                  'prose-li:marker:text-blue-500',
                  'prose-strong:text-slate-900',
                  'prose-table:rounded-2xl',
                  'prose-table:border',
                  'prose-table:border-slate-200',
                  'prose-thead:bg-slate-100',
                  'prose-th:border-b',
                  'prose-th:border-slate-200',
                  'prose-th:px-4',
                  'prose-th:py-3',
                  'prose-td:px-4',
                  'prose-td:py-3',
                  'prose-tr:border-b',
                  'prose-tr:border-slate-100',
                  'prose-a:text-blue-600',
                  'prose-a:no-underline',
                  'prose-code:text-sky-700'
                ]"
                v-html="renderedConceptHtml"
              ></article>
            </div>
          </div>

          <div v-else-if="conceptErrorMessage" class="concept-card">
            <div class="result-header">
              <div>
                <p class="section-label">創意矩陣</p>
                <h3>第二階段目前無法完成</h3>
              </div>
              <div class="result-actions">
                <button class="ghost-button ghost-button-accent" @click="generateConcepts">重啟第二階段</button>
              </div>
            </div>
            <div class="result-content result-content-error">
              <article class="report-prose prose max-w-none">
                {{ conceptErrorMessage }}
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 32px 20px 56px;
}

.page-frame {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 24px;
}

.hero-panel,
.workspace-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(152, 186, 255, 0.48);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow:
    0 30px 80px rgba(46, 85, 179, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(14px);
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 24px;
  padding: 32px;
}

.hero-panel::before,
.workspace-panel::before {
  content: '';
  position: absolute;
  inset: auto auto 0 0;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(24, 119, 242, 0.12), transparent 72%);
  pointer-events: none;
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(24, 119, 242, 0.16);
  background: rgba(255, 255, 255, 0.72);
  color: #1877f2;
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1877f2, #66a8ff);
  box-shadow: 0 0 0 6px rgba(24, 119, 242, 0.08);
}

.hero-eyebrow,
.section-label {
  margin: 18px 0 0;
  color: #1877f2;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 14px 0 0;
  font-size: clamp(2.2rem, 4vw, 4.2rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: #12233d;
}

.hero-description,
.section-copy,
.active-mode-card p,
.state-card p {
  color: #58708f;
  line-height: 1.7;
}

.hero-description {
  max-width: 62ch;
  margin-top: 18px;
  font-size: 1.02rem;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.metric-card,
.active-mode-card,
.commerce-panel,
.cache-panel,
.workspace-tip,
.state-card,
.result-card {
  border-radius: 22px;
  border: 1px solid rgba(171, 199, 255, 0.48);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(244, 248, 255, 0.92));
  box-shadow: 0 14px 30px rgba(88, 129, 210, 0.1);
}

.metric-card {
  padding: 18px;
}

.metric-label,
.workspace-tip span {
  display: block;
  color: #6e85a5;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.metric-card strong,
.workspace-tip strong,
.active-mode-card h3,
.state-card h3,
.result-header h3 {
  display: block;
  margin-top: 8px;
  color: #183153;
}

.metric-card p {
  margin-top: 6px;
  color: #6680a0;
  line-height: 1.55;
  font-size: 0.92rem;
}

.hero-preview {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.preview-window {
  width: min(100%, 430px);
  padding: 16px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(245, 249, 255, 0.94), rgba(227, 237, 255, 0.94));
  border: 1px solid rgba(163, 195, 255, 0.65);
  box-shadow:
    0 25px 60px rgba(48, 90, 174, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.88);
}

.preview-topbar {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.preview-topbar span {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: rgba(24, 119, 242, 0.18);
}

.preview-body {
  border-radius: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.92);
}

.preview-nav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preview-pill {
  border: none;
  padding: 8px 12px;
  border-radius: 999px;
  background: #edf3ff;
  color: #5876a4;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.preview-pill:hover {
  transform: translateY(-1px);
  background: #e1ecff;
}

.preview-pill-active {
  background: linear-gradient(135deg, #0f5fd7, #1877f2 58%, #4f98ff);
  color: #fff;
  box-shadow: 0 12px 26px rgba(15, 95, 215, 0.34);
}

.preview-graph {
  height: 160px;
  margin-top: 16px;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(102, 168, 255, 0.28), rgba(102, 168, 255, 0.02)),
    linear-gradient(135deg, rgba(24, 119, 242, 0.14), rgba(255, 255, 255, 0.96));
  position: relative;
  overflow: hidden;
}

.preview-graph::before,
.preview-graph::after {
  content: '';
  position: absolute;
  inset: auto auto 0 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.preview-graph::before {
  background-image: linear-gradient(transparent 0%, rgba(255, 255, 255, 0.4) 100%);
}

.preview-graph::after {
  clip-path: polygon(0 73%, 14% 60%, 26% 65%, 39% 38%, 51% 44%, 66% 18%, 79% 31%, 100% 6%, 100% 100%, 0 100%);
  background: linear-gradient(180deg, rgba(24, 119, 242, 0.95), rgba(24, 119, 242, 0.2));
}

.preview-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.preview-list-item {
  padding: 14px;
  border-radius: 16px;
  background: #f7faff;
  border: 1px solid rgba(174, 201, 255, 0.5);
}

.preview-list-item strong {
  color: #183153;
  font-size: 0.95rem;
}

.preview-list-item p {
  margin-top: 4px;
  color: #6b83a2;
  font-size: 0.88rem;
  line-height: 1.5;
}

.workspace-panel {
  padding: 28px;
}

.workspace-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.workspace-header h2 {
  margin: 10px 0 0;
  color: #12233d;
  font-size: clamp(1.6rem, 2.8vw, 2.4rem);
  line-height: 1.1;
}

.section-copy {
  margin-top: 12px;
  max-width: 68ch;
}

.workspace-tip {
  min-width: 210px;
  padding: 18px;
}

.tab-switcher {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 26px;
}

.tab-button {
  text-align: left;
  padding: 18px 20px;
  border: 1px solid rgba(174, 201, 255, 0.55);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(244, 248, 255, 0.86));
  color: #39557b;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.tab-button:hover {
  transform: translateY(-2px);
  border-color: rgba(24, 119, 242, 0.35);
  box-shadow: 0 16px 28px rgba(88, 129, 210, 0.12);
}

.tab-button-active {
  border-color: rgba(15, 95, 215, 0.46);
  background: linear-gradient(
    135deg,
    rgba(15, 95, 215, 0.24),
    rgba(24, 119, 242, 0.18) 52%,
    rgba(255, 255, 255, 0.98)
  );
  box-shadow: 0 20px 32px rgba(15, 95, 215, 0.2);
}

.tab-eyebrow {
  display: block;
  color: #1877f2;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.tab-button strong {
  display: block;
  margin-top: 10px;
  font-size: 1.04rem;
  color: #163054;
}

.tab-button small {
  display: block;
  margin-top: 6px;
  color: #6c83a2;
  line-height: 1.5;
}

.active-mode-card {
  padding: 20px 22px;
  margin-top: 18px;
}

.commerce-panel {
  padding: 20px 22px;
  margin-top: 18px;
  border-radius: 22px;
}

.commerce-panel h3 {
  margin: 10px 0 8px;
  color: #183153;
  font-size: 1.08rem;
}

.commerce-panel p:last-child {
  margin: 0;
  color: #6680a0;
  line-height: 1.65;
}

.cache-panel {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 22px;
  margin-top: 18px;
}

.cache-panel h3 {
  margin: 10px 0 8px;
  color: #183153;
  font-size: 1.08rem;
}

.cache-panel p:last-child {
  margin: 0;
  color: #6680a0;
  line-height: 1.6;
}

.active-mode-card h3 {
  margin: 10px 0 8px;
  font-size: 1.3rem;
}

.form-stage {
  margin-top: 22px;
}

.state-card,
.result-card {
  margin-top: 24px;
  padding: 26px;
}

.state-card-secondary {
  margin-top: 20px;
}

.state-card {
  text-align: center;
}

.loader-orbit {
  display: grid;
  place-items: center;
  margin: 0 auto 20px;
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(24, 119, 242, 0.12), rgba(24, 119, 242, 0.02));
}

.loader-orbit span {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid rgba(24, 119, 242, 0.18);
  border-top-color: #1877f2;
  animation: spin 1s linear infinite;
}

.loader-orbit-secondary {
  background: radial-gradient(circle, rgba(94, 92, 230, 0.12), rgba(94, 92, 230, 0.02));
}

.loader-orbit-secondary span {
  border-color: rgba(94, 92, 230, 0.18);
  border-top-color: #5b5ce6;
}

.result-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.ghost-button {
  border: 1px solid rgba(24, 119, 242, 0.18);
  border-radius: 999px;
  padding: 12px 16px;
  background: rgba(24, 119, 242, 0.06);
  color: #1877f2;
  font-weight: 700;
  cursor: pointer;
}

.ghost-button-accent {
  border-color: rgba(91, 92, 230, 0.22);
  background: rgba(91, 92, 230, 0.08);
  color: #5b5ce6;
}

.result-content {
  margin-top: 18px;
  padding: 22px 22px 20px;
  border-radius: 18px;
  background: #f7faff;
  border: 1px solid rgba(174, 201, 255, 0.45);
  color: #365173;
}

.result-content-error {
  background: #fff6f6;
  border-color: rgba(220, 38, 38, 0.18);
  color: #9f1d1d;
}

.result-content-error :deep(.report-prose) {
  color: #9f1d1d;
}

.stage-two-panel,
.concept-card {
  margin-top: 22px;
  border-radius: 22px;
  border: 1px solid rgba(191, 195, 255, 0.55);
  background: linear-gradient(180deg, rgba(248, 247, 255, 0.96), rgba(241, 239, 255, 0.96));
  box-shadow: 0 18px 34px rgba(91, 92, 230, 0.12);
}

.stage-error-banner {
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(234, 88, 12, 0.2);
  background: rgba(255, 247, 237, 0.95);
  color: #9a3412;
}

.stage-error-banner strong {
  display: block;
  margin-bottom: 6px;
}

.stage-error-banner p {
  margin: 0;
  line-height: 1.6;
}

.stage-two-panel {
  display: grid;
  gap: 18px;
  padding: 22px;
}

.stage-two-copy h4 {
  margin: 10px 0 8px;
  color: #282a6b;
  font-size: 1.2rem;
}

.stage-two-copy p:last-child {
  margin: 0;
  color: #6267a3;
  line-height: 1.7;
}

.stage-two-actions {
  display: flex;
  gap: 12px;
}

.stage-two-button {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #5b5ce6, #7f56d9 58%, #9b6bff);
  color: #fff;
  box-shadow: 0 16px 26px rgba(91, 92, 230, 0.22);
}

.stage-two-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 30px rgba(91, 92, 230, 0.28);
}

.concept-card {
  padding: 24px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 960px) {
  .hero-panel {
    grid-template-columns: 1fr;
  }

  .workspace-header,
  .result-header,
  .commerce-panel,
  .cache-panel {
    flex-direction: column;
  }

  .workspace-tip {
    min-width: 0;
    width: 100%;
  }

  .hero-metrics,
  .tab-switcher {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .app-shell {
    padding-inline: 14px;
    padding-top: 18px;
  }

  .hero-panel,
  .workspace-panel {
    padding: 20px;
    border-radius: 22px;
  }

  .hero-copy h1 {
    font-size: 2rem;
  }
}
</style>
