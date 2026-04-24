import typographyPlugin from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        blue: {
          css: {
            '--tw-prose-body': '#365173',
            '--tw-prose-headings': '#0f2747',
            '--tw-prose-links': '#2563eb',
            '--tw-prose-bold': '#0f172a',
            '--tw-prose-bullets': '#3b82f6',
            '--tw-prose-counters': '#64748b',
            '--tw-prose-hr': '#dbeafe',
            '--tw-prose-quotes': '#0f2747',
            '--tw-prose-quote-borders': '#bfdbfe',
            '--tw-prose-captions': '#64748b',
            '--tw-prose-code': '#0369a1',
            '--tw-prose-pre-code': '#e0f2fe',
            '--tw-prose-pre-bg': '#0f172a',
            '--tw-prose-th-borders': '#cbd5e1',
            '--tw-prose-td-borders': '#e2e8f0'
          }
        }
      }
    }
  },
  plugins: [typographyPlugin]
}
