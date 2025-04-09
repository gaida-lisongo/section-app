import { create } from 'zustand'
import sectionService from '@/api/sectionService'
import { Promotion, Unite } from '@/types/promotion'

interface PromotionState {
  promotions: Promotion[]
  loading: boolean
  error: string | null
  selectedPromotionId: string | null
  // Actions principales
  fetchPromotions: (sectionId: string) => Promise<void>
  createPromotion: (data: Omit<Promotion, '_id'>) => Promise<void>
  updatePromotion: (id: string, data: Partial<Promotion>) => Promise<void>
  deletePromotion: (id: string) => Promise<void>
  // Actions pour les unités
  fetchUnites: (promotionId: string) => Promise<void>
  createUnite: (promotionId: string, data: Omit<Unite, '_id'>) => Promise<void>
  updateUnite: (promotionId: string, uniteId: string, data: Partial<Unite>) => Promise<void>
  deleteUnite: (promotionId: string, uniteId: string) => Promise<void>
  setSelectedPromotion: (promotionId: string | null) => void
}

export const usePromotionStore = create<PromotionState>()((set, get) => ({
  promotions: [],
  loading: false,
  error: null,
  selectedPromotionId: null,

  fetchPromotions: async (sectionId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await sectionService.getAllPromotions(sectionId)
      if (response.success) {
        set({ promotions: response.data })
      } else {
        set({ error: response.message })
      }
    } catch (error) {
      set({ error: "Erreur lors de la récupération des promotions" })
    } finally {
      set({ loading: false })
    }
  },

  createPromotion: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await sectionService.createPromotion(data)
      if (response.success) {
        set(state => ({
          promotions: [...state.promotions, response.data]
        }))
      } else {
        set({ error: response.message })
      }
    } catch (error) {
      set({ error: "Erreur lors de la création de la promotion" })
    } finally {
      set({ loading: false })
    }
  },

  updatePromotion: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await sectionService.updatePromotion(id, data)
      if (response.success) {
        set(state => ({
          promotions: state.promotions.map(promo =>
            promo._id === id ? { ...promo, ...response.data } : promo
          )
        }))
      } else {
        set({ error: response.message })
      }
    } catch (error) {
      set({ error: "Erreur lors de la mise à jour de la promotion" })
    } finally {
      set({ loading: false })
    }
  },

  deletePromotion: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await sectionService.deletePromotion(id)
      if (response.success) {
        set(state => ({
          promotions: state.promotions.filter(promo => promo._id !== id)
        }))
      } else {
        set({ error: response.message })
      }
    } catch (error) {
      set({ error: "Erreur lors de la suppression de la promotion" })
    } finally {
      set({ loading: false })
    }
  },

  setSelectedPromotion: (promotionId: string | null) => {
    set({ selectedPromotionId: promotionId })
  },

  fetchUnites: async (promotionId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await sectionService.getAllUnites(promotionId)
      if (response.success) {
        set(state => ({
          promotions: state.promotions.map(promo =>
            promo._id === promotionId ? { ...promo, unites: response.data } : promo
          )
        }))
      } else {
        set({ error: response.message })
      }
    } catch (error) {
      set({ error: "Erreur lors de la récupération des unités" })
    } finally {
      set({ loading: false })
    }
  },

  createUnite: async (promotionId: string, data: Omit<Unite, '_id'>) => {
    set({ loading: true, error: null })
    try {
      const response = await sectionService.createUnite(promotionId, data)
      if (response.success) {
        set(state => ({
          promotions: state.promotions.map(promo =>
            promo._id === promotionId ? 
              { ...promo, unites: [...response.data] } : 
              promo
          )
        }))

        window.location.reload()
      } else {
        set({ error: response.message })
      }
    } catch (error) {
      set({ error: "Erreur lors de la création de l'unité" })
    } finally {
      set({ loading: false })
    }
  },

  updateUnite: async (promotionId: string, uniteId: string, data: Partial<Unite>) => {
    set({ loading: true, error: null })
    try {
      const response = await sectionService.updateUnite(promotionId, uniteId, data)
      if (response.success) {
        set(state => ({
          promotions: state.promotions.map(promo =>
            promo._id === promotionId ? 
              { 
                ...promo, 
                unites: (promo.unites || []).map(unite =>
                  unite._id === uniteId ? { ...unite, ...response.data } : unite
                )
              } : 
              promo
          )
        }))

        window.location.reload()
      } else {
        set({ error: response.message })
      }
    } catch (error) {
      set({ error: "Erreur lors de la mise à jour de l'unité" })
    } finally {
      set({ loading: false })
    }
  },

  deleteUnite: async (promotionId: string, uniteId: string) => {
    set({ loading: true, error: null })
    try {
      const response = await sectionService.deleteUnite(promotionId, uniteId)
      if (response.success) {
        set(state => ({
          promotions: state.promotions.map(promo =>
            promo._id === promotionId ? 
              { 
                ...promo, 
                unites: (promo.unites || []).filter(unite => unite._id !== uniteId)
              } : 
              promo
          )
        }))

        window.location.reload()
      } else {
        set({ error: response.message })
      }
    } catch (error) {
      set({ error: "Erreur lors de la suppression de l'unité" })
    } finally {
      set({ loading: false })
    }
  }
}))