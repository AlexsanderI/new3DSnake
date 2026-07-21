import { RefObject, useEffect, useRef } from 'react'

export interface FocusableElement {
  focus: () => void
}

export interface FocusState {
  didFocus: boolean
}

export function focusPrimaryActionOnce(
  element: FocusableElement | null,
  state: FocusState,
): boolean {
  if (state.didFocus || element === null) return false

  element.focus()
  state.didFocus = true
  return true
}

export function useFocusPrimaryAction<T extends FocusableElement>(
  ref: RefObject<T>,
): void {
  const focusState = useRef<FocusState>({ didFocus: false })

  useEffect(() => {
    focusPrimaryActionOnce(ref.current, focusState.current)
  }, [ref])
}
