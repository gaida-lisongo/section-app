import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { useSectionStore } from './useSectionStore'
import agentService from '@/api/agentService'

interface Agent {
  id: string;
  nom: string;
  prenom: string;
  postnom: string;
  email: string;
  matricule: string;
  telephone: string;
  typeAgent: string;
  avatar: string | null; // Permettre null pour l'avatar
  dateNaissance: string | null;
  lieuNaissance: string | null;
  nationalite: string | null;
}

interface AuthState {
  agent: Agent | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: { agent: Agent; token: string }) => void;
  logout: () => void;
  updateUserInfo: (updatedInfo: Partial<Agent>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      agent: null,
      token: null,
      isAuthenticated: false,
      login: (data) => {
        // S'assurer que tous les champs sont présents, même si null
        const agent = {
          ...data.agent,
          dateNaissance: data.agent.dateNaissance || null,
          lieuNaissance: data.agent.lieuNaissance || null,
          nationalite: data.agent.nationalite || null
        };
        set({ 
          agent,
          token: data.token, 
          isAuthenticated: true 
        });
      },
      logout: () => set({ 
        agent: null, 
        token: null, 
        isAuthenticated: false 
      }),
      updateUserInfo: async (updatedInfo) => {
        try {
          const currentAgent = get().agent;
          if (!currentAgent) throw new Error("Aucun utilisateur connecté");

          const response = await agentService.changeUserInfo({
            id: currentAgent.id,
            data: updatedInfo
          });

          if (response.success) {
            const { agent } = response.data;
            set({
              agent: {
                ...currentAgent,
                ...agent
              }
            });
            return Promise.resolve();
          } else {
            return Promise.reject(new Error(response.message));
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)