import { create } from 'zustand';
import agentService from '@/api/agentService';
import { toast } from 'react-hot-toast';

interface Agent {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  matricule: string
}

interface AgentState {
  agents: Agent[];
  loading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
}

export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  loading: false,
  error: null,

  fetchAgents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await agentService.getAllAgents();
      if (response.success) {
        set({ agents: response.data });
      } else {
        throw new Error(response.message || "Erreur lors du chargement des agents");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors du chargement des agents";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },
}));