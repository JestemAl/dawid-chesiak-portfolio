import { create } from 'zustand'

// pojedyncze „źródło prawdy” dla scrolla/sekcji
export const useAppStore = create((set, get) => ({
  // STAN
  offset: 0,             // 0..1, ciągły progres scrolla
  currentSection: 1,     // 1..N (np. 1..10)
  chapter: 'A',          // np. A..E (Twoje rozdziały)
  tLocal: 0,             // 0..1 w ramach aktywnego rozdziału

  // AKCJE (funkcje modyfikujące stan)
  setOffset: (v) => set({ offset: v }),
  setCurrentSection: (s) => set({ currentSection: s }),
  setChapterAndT: (chapter, tLocal) => set({ chapter, tLocal }),

  // POMOCNICZE (opcjonalnie): szybki dostęp bez renderu
  getState: () => get(),
}))
