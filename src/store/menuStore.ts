import create from 'zustand'

interface MenuState {
  isVisible: boolean
  titleMenu: string
  toggleModal: () => void
  setModalVisible: (isVisible: boolean) => void
  selectTitleMenu: (text: string) => void
}

export const useMenuStore = create<MenuState>((set) => ({
  isVisible: true,
  titleMenu: 'start',
  toggleModal: () => set((state) => ({ isVisible: !state.isVisible })),
  setModalVisible: (isVisible) => set({ isVisible }),
  selectTitleMenu: (text) => set({ titleMenu: text }),
}))
interface PauseState {
  isPause: boolean
  togglePause: () => void
  setPauseVisible: (isPause: boolean) => void
}
export const usePauseStore = create<PauseState>((set) => ({
  isPause: true,
  togglePause: () => set((state) => ({ isPause: !state.isPause })),
  setPauseVisible: (isPause) => set({ isPause }),
}))
