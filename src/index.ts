import main from './main'
import { enableScrolling } from './commands/enableScrolling'
/**
 * Глобальные ссылки для очистки слушателей
 */
let ac: AbortController | null = null
/**
 * Публичный cleanup — теперь на верхнем уровне (валидный экспорт).
 * Можно вызвать из HMR/SPA-фреймворка.
 */
export function cleanupBootstrap(): void {
  if (ac) {
    ac.abort() // снимает все слушатели, подписанные с { signal }
    ac = null
  }
  try {
    ;(window as any).__appRoot?.unmount?.()
    ;(window as any).__appRoot = null
  } catch {}
  try {
    enableScrolling()
  } catch {}
}
/**
 * Безопасно исполняем только в браузере
 */
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  ac = new AbortController()
  const { signal } = ac
  const onPageHide = () => {
    try {
      enableScrolling()
    } catch {}
  }
  const onBeforeUnload = () => {
    try {
      enableScrolling()
    } catch {}
  }
  // Тип PageTransitionEvent может быть недоступен в некоторых tsconfig без "dom".
  // Поэтому без строгой типизации:
  const onPageShow = (e: any) => {
    // if (e?.persisted) { /* при необходимости восстановить UI */ }
  }
  window.addEventListener('pagehide', onPageHide, { signal })
  window.addEventListener('beforeunload', onBeforeUnload, { signal })
  window.addEventListener('pageshow', onPageShow, { signal })
  const start = () => {
    try {
      main()
    } catch (err) {
      console.error('main() failed:', err)
    }
  }
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', start, { once: true, signal })
  } else {
    start()
  }
  // expose cleanup helper for e2e tests and HMR consumers
  ;(window as any).__cleanupBootstrap = cleanupBootstrap
}
