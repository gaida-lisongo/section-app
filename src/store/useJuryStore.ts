import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import juryService from '@/api/juryService';
import { toast } from 'react-hot-toast';

interface Bureau {
  agentId: string;
  grade: string;
}
interface Promotion {
  _id: string;
  sectionId: string;
  niveau: string;
  mention: string;
  orientation: string;
  statut: string;
}

interface Jury {
  _id: string;
  titre: string;
  secure?: string;
  bureaux: Bureau[];
  promotions: Promotion[];
  annees: string[];
  sectionId?: string;
}

interface JuryState {
  jurys: Jury[];
  selectedJury: Jury | null;
  loading: boolean;
  currentConfig: {
    bureaux: Bureau[];
    promotions: Promotion[];
    annees: string[];
  };
  // Actions
  fetchJurys: (sectionId?: string) => Promise<void>;
  setSelectedJury: (juryId: string) => void;
  updateCurrentConfig: (type: 'bureaux' | 'promotions' | 'annees', data: any) => void;
  saveCurrentConfig: () => Promise<void>;
  createJury: (data: {
    titre: string;
    secure: string;
    bureaux: Bureau[];
    promotions: string[];
    annees: string[];
    sectionId?: string;
  }) => Promise<void>;
  deleteJury: (juryId: string) => Promise<void>;
  updateJury: (juryId: string, data: Partial<Jury>) => Promise<void>;
}

export const useJuryStore = create<JuryState>()(
  persist(
    (set, get) => ({
      jurys: [],
      selectedJury: null,
      loading: false,
      currentConfig: {
        bureaux: [],
        promotions: [],
        annees: []
      },

      fetchJurys: async (sectionId) => {
        set({ loading: true });
        try {
          const response = await juryService.getAllJurys();
          console.log("Response jurys", response);
          if (response.success) {
            set({ jurys: response.data });
          } else {
            throw new Error(response.message || "Erreur lors du chargement des jurys");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erreur lors du chargement des jurys";
          toast.error(message);
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
              bureaux: jury.bureaux || [],
              promotions: jury.promotions || [],
              annees: jury.annees || []
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
            throw new Error(response.message || "Erreur lors de la mise à jour");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erreur lors de la mise à jour";
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },

      createJury: async (data) => {
        set({ loading: true });
        try {
          const response = await juryService.createJury(data);
          if (response.success) {
            set(state => ({
              jurys: [...state.jurys, response.data]
            }));
            toast.success("Jury créé avec succès");
            return Promise.resolve(response.data);
          } else {
            throw new Error(response.message || "Erreur lors de la création du jury");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erreur lors de la création du jury";
          toast.error(message);
          return Promise.reject(error);
        } finally {
          set({ loading: false });
        }
      },

      deleteJury: async (juryId: string) => {
        set({ loading: true });
        try {
          const response = await juryService.deleteJury(juryId);
          if (response.success) {
            set(state => ({
              jurys: state.jurys.filter(jury => jury._id !== juryId),
              selectedJury: state.selectedJury?._id === juryId ? null : state.selectedJury
            }));
            toast.success("Jury supprimé avec succès");
          } else {
            throw new Error(response.message || "Erreur lors de la suppression");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erreur lors de la suppression";
          toast.error(message);
        } finally {
          set({ loading: false });
        }
      },

      updateJury: async (juryId: string, data: Partial<Jury>) => {
        set({ loading: true });
        try {
          const response = await juryService.updateJury(juryId, data);
          if (response.success) {
            set(state => ({
              jurys: state.jurys.map(jury =>
                jury._id === juryId ? { ...jury, ...data } : jury
              ),
              selectedJury: state.selectedJury?._id === juryId ? 
                { ...state.selectedJury, ...data } : state.selectedJury
            }));
            toast.success("Jury mis à jour avec succès");
            return Promise.resolve(response.data);
          } else {
            throw new Error(response.message || "Erreur lors de la mise à jour");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erreur lors de la mise à jour";
          toast.error(message);
          return Promise.reject(error);
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'jury-storage', // nom pour la persistance dans le localStorage
      partialize: (state) => ({
        jurys: state.jurys, // ne persister que les jurys, pas l'état de chargement
      }),
    }
  )
);