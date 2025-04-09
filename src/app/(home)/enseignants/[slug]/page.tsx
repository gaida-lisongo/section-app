"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSpinner, 
  faTrash,
  faPen,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import Link from "next/link";
import agentService from "@/api/agentService";
import { AgentForm } from '@/components/Forms/AgentForm';

interface Agent {
  _id: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  fonction?: string;
  photo?: string;
  typeAgent: string;
  matricule?: string;
}

export default function AgentDetailPage() {
  const router = useRouter();
  const { slug } = useParams() as { slug: string };
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        if (!slug) return;
        setLoading(true);
        const response = await agentService.getAgentById(slug);
        console.log("Agent response:", response);
        if (response.success) {
          setAgent(response.data);
        }
      } catch (error) {
        console.error("Error fetching agent:", error);
        toast.error("Erreur lors du chargement de l'agent");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAgent();
  }, [slug]);

  const handleDelete = async () => {
    if (!agent || !confirm("Êtes-vous sûr de vouloir supprimer cet agent ?")) {
      return;
    }

    try {
      const response = await agentService.deleteAgent(agent._id);
      if (response.success) {
        toast.success("Agent supprimé avec succès");
        router.push("/enseignants");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleBack = () => {
    router.back(); // Utiliser router.back() au lieu de router.push()
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Agent non trouvé</p>
        <Link href="/enseignants" className="text-primary hover:underline mt-4 inline-block">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header avec infos non modifiables */}
        <div className="relative z-10 h-48 bg-gradient-to-r from-primary to-primary/60">
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-24 bg-gradient-to-t from-black/50">
            <h1 className="text-2xl font-bold text-white">
              {agent.nom} {agent.prenom}
            </h1>
            <p className="text-gray-200 mt-1">Matricule: {agent.matricule || 'Non défini'}</p>
            <p className="text-gray-200">Type: {agent.typeAgent.toUpperCase() || 'Non défini'}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Formulaire de modification */}
          <AgentForm agent={agent} onSuccess={() => router.refresh()} />

          {/* Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => router.push('/enseignants')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}