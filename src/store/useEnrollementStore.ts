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
  promotionId: {
    _id: string;
    sectionId: string;
    niveau: string;
    mention: string;
    orientation: string;
    unites: Array<{
      code: string;
      designation: string;
      categorie: string;
      matieres: any[];
      _id: string;
    }>;
  };
  designation: string;
  montant: number;
  description?: string;
  cours: Array<{
    _id: string;
    designation: string;
    code: string;
    credit: number;
    semestre: string;
    codeUnite: string;
    charges_horaires: any[];
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface UpdateEnrollementData {
  date_fin?: string;
  designation?: string;
  montant?: number;
  description?: string;
  cours?: string[]; // Array of course IDs
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
  updateEnrollement: (id: string, data: UpdateEnrollementData) => Promise<void>;
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
    console.log("Fetching enrollements for promotion:", promotionId);
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
      // If cours array is present in data, ensure we're only sending course IDs
      const updateData = {
        ...data,
        cours: data.cours 
          ? data.cours 
          : undefined
      };

      const response = await enrollementService.setEnrollement(id, updateData);
      if (response.success) {
        set(state => ({
          enrollements: state.enrollements.map(enrollement => 
            enrollement._id === id ? response.data : enrollement
          )
        }));
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
        action: 'add',
        cours: coursId
      });
      
      if (response.success) {
        // Update the local state directly with the response data
        set(state => ({
          enrollements: state.enrollements.map(enrollement => 
            enrollement._id === enrollementId 
              ? {
                  ...enrollement,
                  cours: action === 'add'
                    ? [...enrollement.cours, response.data.cours]
                    : enrollement.cours.filter(c => c._id !== coursId)
                }
              : enrollement
          )
        }));
        
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