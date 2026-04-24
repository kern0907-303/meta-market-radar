<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['submit'])

const formData = ref({
  type: 'competitor',
  projectName: '',
  productName: '',
  market: 'TW',
  urls: ['', '', '']
})

const filledUrls = computed(() => formData.value.urls.filter((url) => url.trim() !== '').length)

const handleSubmit = () => {
  const cleanUrls = formData.value.urls.filter((url) => url.trim() !== '')

  if (!formData.value.projectName.trim() || !formData.value.productName.trim() || cleanUrls.length === 0) {
    alert('請填寫專案名稱、產品名稱，並至少提供一個競品網址。')
    return
  }

  emit('submit', {
    ...formData.value,
    projectName: formData.value.projectName.trim(),
    productName: formData.value.productName.trim(),
    urls: cleanUrls
  })
}
</script>

<template>
  <section class="panel-shell">
    <div class="panel-header">
      <div>
        <p class="panel-eyebrow">競品情報</p>
        <h4>用對手網址，快速反推可切入的廣告位置。</h4>
        <p class="panel-copy">
          適合已經知道市場上誰做得不錯，想直接拆出對方訊息、版位語感與可以避開內卷的角度。
        </p>
      </div>
      <div class="info-chip">最少 1 個網址，最多 3 個</div>
    </div>

    <div class="insight-section">
      <div class="insight-section-header">
        <span class="insight-section-label">使用說明</span>
        <p>以下三張卡片是分析說明，不是可輸入欄位。</p>
      </div>
      <div class="insight-grid">
      <div class="insight-card">
        <span>輸入內容</span>
        <strong>你的產品名 + 競品落地頁</strong>
      </div>
      <div class="insight-card">
        <span>預期輸出</span>
        <strong>對手話術、賣點分層、差異化切角</strong>
      </div>
      <div class="insight-card">
        <span>建議做法</span>
        <strong>挑風格不同但同客群的競品一起比</strong>
      </div>
      </div>
    </div>

    <div class="field-group">
      <label class="field-label" for="project-name">專案名稱</label>
      <input
        id="project-name"
        v-model="formData.projectName"
        type="text"
        class="field-input"
        placeholder="例如：Q3 保溫杯市場切角研究"
      />
    </div>

    <div class="field-group">
      <label class="field-label" for="product-name">你的產品 / 服務名稱</label>
      <input
        id="product-name"
        v-model="formData.productName"
        type="text"
        class="field-input"
        placeholder="例如：Life OS 人生系統儀表板"
      />
    </div>

    <div class="field-row">
      <div class="field-group">
        <label class="field-label" for="competitor-market">目標市場區域</label>
        <select id="competitor-market" v-model="formData.market" class="field-select">
          <option value="TW">台灣</option>
          <option value="HK">香港</option>
          <option value="CN">中國大陸</option>
        </select>
      </div>

      <div class="hint-card">
        <span class="hint-title">目前進度</span>
        <p>已填入 {{ filledUrls }} / 3 個網址。至少 1 個即可開始分析。</p>
      </div>
    </div>

    <div class="field-group">
      <div class="field-label-row">
        <label class="field-label">競品網頁連結</label>
        <span class="field-note">建議貼產品頁、首頁或銷售頁</span>
      </div>
      <div class="url-grid">
        <input
          v-for="(url, index) in formData.urls"
          :key="index"
          v-model="formData.urls[index]"
          type="url"
          class="field-input"
          :placeholder="`請輸入競品網址 ${index + 1}`"
        />
      </div>
    </div>

    <div class="submit-stack">
      <div class="credit-note">
        <strong>第一階段將扣 1 點。</strong>
        <p>商業化版本會以專案保存結果，完成第二階段再扣 1 點。</p>
      </div>

      <button class="submit-button submit-button-facebook" @click="handleSubmit">
        送出競品分析
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
  background: rgba(24, 119, 242, 0.1);
  color: #1877f2;
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

.field-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 16px;
  align-items: stretch;
}

.field-label,
.field-note {
  color: #355477;
}

.field-label {
  font-size: 0.94rem;
  font-weight: 700;
}

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.field-note {
  font-size: 0.82rem;
}

.field-input,
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

.field-input {
  padding: 15px 16px;
  font: inherit;
}

.field-select {
  padding: 14px 16px;
  font: inherit;
}

.field-input:focus,
.field-select:focus {
  outline: none;
  border-color: rgba(24, 119, 242, 0.45);
  box-shadow: 0 0 0 5px rgba(24, 119, 242, 0.1);
}

.hint-card {
  padding: 18px;
}

.hint-card p {
  margin: 10px 0 0;
  color: #6880a0;
  line-height: 1.6;
}

.url-grid {
  display: grid;
  gap: 12px;
}

.submit-stack {
  display: grid;
  gap: 12px;
}

.credit-note {
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(24, 119, 242, 0.12);
  background: rgba(24, 119, 242, 0.06);
}

.credit-note strong {
  color: #163054;
}

.credit-note p {
  margin: 6px 0 0;
  color: #6880a0;
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

.submit-button-facebook {
  background: linear-gradient(135deg, #1877f2, #54a3ff);
  box-shadow: 0 18px 34px rgba(24, 119, 242, 0.24);
}

@media (max-width: 900px) {
  .insight-grid,
  .field-row {
    grid-template-columns: 1fr;
  }

  .panel-header,
  .field-label-row,
  .insight-section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-chip {
    align-self: flex-start;
  }
}
</style>
