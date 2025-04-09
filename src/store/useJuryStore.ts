import { create } from 'zustand';
import juryService from '@/api/juryService';
import { toast } from 'react-hot-toast';

interface Bureau {
  agentId: string;
  grade: string;
}

interface Jury {
  _id: string;
  titre: string;
  description?: string;
  bureaux: Bureau[];
  promotions: string[];
  annees: string[];
}

interface JuryState {
  jurys: Jury[];
  selectedJury: Jury | null;
  loading: boolean;
  currentConfig: {
    bureaux: Bureau[];
    promotions: string[];
    annees: string[];
  };
  // Actions
  fetchJurys: () => Promise<void>;
  setSelectedJury: (juryId: string) => void;
  updateCurrentConfig: (type: 'bureaux' | 'promotions' | 'annees', data: any) => void;
  saveCurrentConfig: () => Promise<void>;
}

export const useJuryStore = create<JuryState>((set, get) => ({
  jurys: [],
  selectedJury: null,
  loading: false,
  currentConfig: {
    bureaux: [],
    promotions: [],
    annees: []
  },

  fetchJurys: async () => {
    set({ loading: true });
    try {
      const response = await juryService.getAllJurys();
      if (response.success) {
        set({ jurys: response.data });
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des jurys");
    } finally {
      set({ loading: false });
    }
  },

  setSelectedJury: (juryId: string) => {
    const jury = get().jurys.find(j => j._id === juryId);
    if (jury) {
      set({ 
        selectedJury: jury,
        currentConfig: {
          bureaux: [...jury.bureaux],
          promotions: [...jury.promotions],
          annees: [...jury.annees]
        }
      });
    }
  },

  updateCurrentConfig: (type, data) => {
    set(state => ({
      currentConfig: {
        ...state.currentConfig,
        [type]: data
      }
    }));
  },

  saveCurrentConfig: async () => {
    const { selectedJury, currentConfig } = get();
    if (!selectedJury) return;

    set({ loading: true });
    try {
      const response = await juryService.updateJury(selectedJury._id, {
        ...selectedJury,
        ...currentConfig
      });

      if (response.success) {
        set(state => ({
          jurys: state.jurys.map(jury =>
            jury._id === selectedJury._id ? { ...jury, ...currentConfig } : jury
          ),
          selectedJury: { ...selectedJury, ...currentConfig }
        }));
        toast.success("Configuration mise à jour avec succès");
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      set({ loading: false });
    }
  }
}));