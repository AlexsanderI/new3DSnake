// Вычисляем ширину скроллбара
export const getScrollbarWidth = (): number => {
  // Создаем временный элемент для измерения
  const outer = document.createElement('div')
  outer.style.cssText = `
    position: absolute;
    top: -9999px;
    width: 50px;
    height: 50px;
    overflow: scroll;
    visibility: hidden;
  `

  document.body.appendChild(outer)

  const inner = document.createElement('div')
  inner.style.width = '100%'
  inner.style.height = '200px'
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  document.body.removeChild(outer)

  return scrollbarWidth
}
