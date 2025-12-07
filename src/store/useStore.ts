import { create } from 'zustand'

interface UIState {
  isSimpleMode: boolean
  toggleSimpleMode: () => void
}

export const useStore = create<UIState>((set) => ({
  isSimpleMode: false,
  toggleSimpleMode: () => set((state) => ({ isSimpleMode: !state.isSimpleMode })),
}))