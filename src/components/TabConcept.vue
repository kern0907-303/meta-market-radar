<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['submit'])

const formData = ref({
  type: 'concept',
  projectName: '',
  conceptDesc: '',
  market: 'TW',
  referenceUrls: ['', '', '']
})

const conceptLength = computed(() => formData.value.conceptDesc.trim().length)
const filledReferenceUrls = computed(
  () => formData.value.referenceUrls.filter((url) => url.trim() !== '').length
)

const handleSubmit = () => {
  if (!formData.value.projectName.trim() || !formData.value.conceptDesc.trim()) {
    alert('請先填寫專案名稱與產品核心概念。')
    return
  }

  const cleanReferenceUrls = formData.value.referenceUrls.filter((url) => url.trim() !== '')

  emit('submit', {
    ...formData.value,
    projectName: formData.value.projectName.trim(),
    conceptDesc: formData.value.conceptDesc.trim(),
    referenceUrls: cleanReferenceUrls
  })
}
</script>

<template>
  <section class="panel-shell">
    <div class="panel-header">
      <div>
        <p class="panel-eyebrow">概念探索</p>
        <h4>從一句產品概念，展開市場偵測。</h4>
        <p class="panel-copy">
          適合還在找切角、受眾語言與需求縫隙的階段。描述越具體，回來的方向通常越有可測試性。
        </p>
      </div>
      <div class="info-chip">適合 0 到 1 探索期</div>
    </div>

    <div class="insight-section">
      <div class="insight-section-header">
        <span class="insight-section-label">使用說明</span>
        <p>以下三張卡片是填寫提示，不是輸入欄位。</p>
      </div>
      <div class="insight-grid">
      <div class="insight-card">
        <span>輸入內容</span>
        <strong>產品概念與價值主張</strong>
      </div>
      <div class="insight-card">
        <span>預期輸出</span>
        <strong>市場方向、受眾語言、創意題目</strong>
      </div>
      <div class="insight-card">
        <span>建議做法</span>
        <strong>用真實使用情境取代抽象功能描述</strong>
      </div>
      </div>
    </div>

    <div class="field-group">
      <label class="field-label" for="concept-project-name">專案名稱</label>
      <input
        id="concept-project-name"
        v-model="formData.projectName"
        type="text"
        class="field-input"
        placeholder="例如：Q3 旅行杯概念市場驗證"
      />
    </div>

    <div class="field-group">
      <label class="field-label" for="concept-desc">產品 / 服務核心概念</label>
      <textarea
        id="concept-desc"
        v-model="formData.conceptDesc"
        rows="6"
        class="field-textarea"
        placeholder="例如：我想做一個幫社群廣告投手快速拆解競品素材、歸納溝通角度並生成測試方向的智慧工作台，主要給中小品牌與代理商使用。"
      ></textarea>
      <div class="field-helper">
        <span>這裡以純文字描述為主，適合填「給誰用、解決什麼、為什麼值得買」。</span>
        <strong>{{ conceptLength }} 字</strong>
      </div>
    </div>

    <div class="field-group">
      <div class="field-label-row">
        <label class="field-label">參考網站連結（選填）</label>
        <span class="field-note">不是競品也可以，像是靈感頁、產品頁、風格參考站</span>
      </div>
      <div class="url-grid">
        <input
          v-for="(url, index) in formData.referenceUrls"
          :key="index"
          v-model="formData.referenceUrls[index]"
          type="url"
          class="field-input"
          :placeholder="`請輸入參考網址 ${index + 1}`"
        />
      </div>
      <div class="field-helper">
        <span>目前概念分析主要還是以文字敘述為主，參考網址會一併送出，方便後續擴充分析流程。</span>
        <strong>{{ filledReferenceUrls }} / 3</strong>
      </div>
    </div>

    <div class="field-row">
      <div class="field-group">
        <label class="field-label" for="concept-market">預計探勘市場</label>
        <select id="concept-market" v-model="formData.market" class="field-select">
          <option value="TW">台灣</option>
          <option value="HK">香港</option>
          <option value="CN">中國大陸</option>
        </select>
      </div>

      <div class="hint-card">
        <span class="hint-title">寫法建議</span>
        <p>如果你想要更貼近社群廣告語感，可以多寫使用者痛點、時間壓力和立即收穫。</p>
      </div>
    </div>

    <div class="submit-stack">
      <div class="credit-note">
        <strong>第一階段將扣 1 點。</strong>
        <p>概念驗證完成後，可再用 1 點啟動第二階段創意矩陣。</p>
      </div>

      <button class="submit-button submit-button-indigo" @click="handleSubmit">
        全網盲搜並生成方向
      </button>
    </div>
  </section>
</template>

<style scoped>
.panel-shell {
  display: grid;
  gap: 22px;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.panel-eyebrow {
  margin: 0;
  color: #1877f2;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.panel-header h4 {
  margin: 10px 0 0;
  color: #163054;
  font-size: 1.5rem;
  line-height: 1.18;
}

.panel-copy {
  margin-top: 10px;
  color: #6680a0;
  line-height: 1.7;
}

.info-chip {
  flex-shrink: 0;
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  font-size: 0.88rem;
  font-weight: 700;
}

.insight-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.insight-section {
  display: grid;
  gap: 12px;
}

.insight-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #6d83a2;
  font-size: 0.9rem;
}

.insight-section-header p {
  margin: 0;
}

.insight-section-label {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(24, 119, 242, 0.08);
  color: #1877f2;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.insight-card,
.hint-card {
  border: 1px solid rgba(173, 195, 255, 0.55);
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(243, 248, 255, 0.98), rgba(237, 244, 255, 0.98));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.insight-card {
  padding: 16px;
  position: relative;
}

.insight-card::before {
  content: 'i';
  position: absolute;
  top: 14px;
  right: 14px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(24, 119, 242, 0.1);
  color: #1877f2;
  font-size: 0.8rem;
  font-weight: 800;
}

.insight-card span,
.hint-title {
  display: block;
  color: #6d83a2;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.insight-card strong {
  display: block;
  margin-top: 8px;
  color: #183153;
  line-height: 1.45;
}

.field-group {
  display: grid;
  gap: 10px;
}

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.field-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 16px;
  align-items: stretch;
}

.field-label {
  color: #355477;
  font-size: 0.94rem;
  font-weight: 700;
}

.field-note {
  color: #6d83a2;
  font-size: 0.82rem;
}

.url-grid {
  display: grid;
  gap: 10px;
}

.field-input,
.field-textarea,
.field-select {
  width: 100%;
  border: 1px solid rgba(165, 189, 238, 0.82);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  color: #183153;
  padding: 14px 16px;
  outline: none;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  border-color: rgba(24, 119, 242, 0.72);
  box-shadow: 0 0 0 4px rgba(24, 119, 242, 0.12);
  background: #fff;
}

.field-textarea {
  resize: vertical;
  min-height: 150px;
}

.field-helper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #6d83a2;
  font-size: 0.84rem;
}

.field-textarea,
.field-select {
  width: 100%;
  border: 1px solid rgba(170, 197, 255, 0.72);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  color: #183153;
  box-sizing: border-box;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.field-textarea {
  min-height: 160px;
  padding: 18px 18px 16px;
  resize: vertical;
  font: inherit;
  line-height: 1.7;
}

.field-select {
  padding: 14px 16px;
  font: inherit;
}

.field-textarea:focus,
.field-select:focus {
  outline: none;
  border-color: rgba(24, 119, 242, 0.45);
  box-shadow: 0 0 0 5px rgba(24, 119, 242, 0.1);
}

.field-helper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #6d83a2;
  font-size: 0.84rem;
}

.field-helper strong {
  color: #4f46e5;
}

.hint-card {
  padding: 18px;
}

.hint-card p {
  margin: 10px 0 0;
  color: #6880a0;
  line-height: 1.6;
}

.submit-stack {
  display: grid;
  gap: 12px;
}

.credit-note {
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(99, 102, 241, 0.14);
  background: rgba(99, 102, 241, 0.06);
}

.credit-note strong {
  color: #282a6b;
}

.credit-note p {
  margin: 6px 0 0;
  color: #6267a3;
  line-height: 1.6;
  font-size: 0.9rem;
}

.submit-button {
  width: 100%;
  border: none;
  border-radius: 18px;
  padding: 16px 22px;
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  filter: saturate(1.05);
}

.submit-button-indigo {
  background: linear-gradient(135deg, #5b5cff, #1877f2);
  box-shadow: 0 18px 34px rgba(72, 108, 211, 0.24);
}

@media (max-width: 900px) {
  .insight-grid,
  .field-row {
    grid-template-columns: 1fr;
  }

  .panel-header,
  .insight-section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-chip {
    align-self: flex-start;
  }
}
</style>
