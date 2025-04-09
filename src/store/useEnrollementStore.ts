import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import enrollementService from '@/api/enrollementService';

interface Promotion {
  _id: string;
}

interface Enrollement {
  _id: string;
  date_created: string;
  date_fin: string;
  promotionId: Promotion;
  designation: string;
  montant: number;
  description?: string;
  cours: string[];
  createdAt: string;
  updatedAt: string;
}

interface EnrollementState {
  enrollements: Enrollement[];
  selectedPromotionId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  setSelectedPromotion: (promotionId: string) => void;
  fetchEnrollements: (promotionId: string) => Promise<void>;
  createEnrollement: (data: {
    promotionId: string;
    designation: string;
    montant: number;
    description?: string;
    date_fin: string;
  }) => Promise<void>;
  updateEnrollement: (id: string, data: Partial<Enrollement>) => Promise<void>;
  deleteEnrollement: (id: string) => Promise<void>;
  setCoursEnrollement: (enrollementId: string, action: 'add' | 'remove', coursId: string) => Promise<void>;
}

export const useEnrollementStore = create<EnrollementState>((set, get) => ({
  enrollements: [],
  selectedPromotionId: null,
  loading: false,
  error: null,

  setSelectedPromotion: (promotionId) => {
    set({ selectedPromotionId: promotionId });
  },

  fetchEnrollements: async (promotionId) => {
    set({ loading: true, error: null });
    try {
      const response = await enrollementService.getAllEnrollements(promotionId);
      if (response.success) {
        set({ enrollements: response.data });
      } else {
        throw new Error(response.message || "Erreur lors du chargement des enrollements");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors du chargement des enrollements";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  createEnrollement: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await enrollementService.createEnrollement(data);
      if (response.success) {
        const { selectedPromotionId } = get();
        if (selectedPromotionId) {
          await get().fetchEnrollements(selectedPromotionId);
        }
        toast.success("Enrollement créé avec succès");
      } else {
        throw new Error(response.message || "Erreur lors de la création de l'enrollement");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la création de l'enrollement";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  updateEnrollement: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await enrollementService.setEnrollement(id, data);
      if (response.success) {
        const { selectedPromotionId } = get();
        if (selectedPromotionId) {
          await get().fetchEnrollements(selectedPromotionId);
        }
        toast.success("Enrollement mis à jour avec succès");
      } else {
        throw new Error(response.message || "Erreur lors de la mise à jour de l'enrollement");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la mise à jour de l'enrollement";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  deleteEnrollement: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await enrollementService.deleteEnrollement(id);
      if (response.success) {
        set(state => ({
          enrollements: state.enrollements.filter(e => e._id !== id)
        }));
        toast.success("Enrollement supprimé avec succès");
      } else {
        throw new Error(response.message || "Erreur lors de la suppression de l'enrollement");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la suppression de l'enrollement";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  setCoursEnrollement: async (enrollementId, action, coursId) => {
    set({ loading: true, error: null });
    try {
      const response = await enrollementService.setCoursEnrollement(enrollementId, {
        action: [action],
        cours: coursId
      });
      if (response.success) {
        const { selectedPromotionId } = get();
        if (selectedPromotionId) {
          await get().fetchEnrollements(selectedPromotionId);
        }
        toast.success(`Cours ${action === 'add' ? 'ajouté' : 'retiré'} avec succès`);
      } else {
        throw new Error(response.message || "Erreur lors de la modification des cours");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la modification des cours";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  }
}));