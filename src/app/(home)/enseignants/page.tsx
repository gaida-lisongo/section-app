"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserGraduate, 
  faSpinner,
  faSearch,
  faPlus,
  faDownload 
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@headlessui/react";
import agentService from "@/api/agentService";
import { toast } from "react-hot-toast";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Agent {
  _id: string;
  nom: string;
  prenom: string;
  postnom: string;
  matricule: string;
  nationalite: string;
  typeAgent: 'enseignant' | 'administratif';
  lieuNaissance: string;
  adresse?: string;
  dateNaissance?: Date | null;
  email?: string;
  telephone?: string;
  sexe?: string;
  photo?: string;
  fonction?: string;
}

export default function EnseignantsPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState<{
    nom: string;
    prenom: string;
    postnom: string;
    matricule: string;
    nationalite: string;
    typeAgent: 'enseignant' | 'administratif';
    lieuNaissance: string;
    adresse: string;
    dateNaissance: Date | null;
  }>({
    nom: '',
    prenom: '',
    postnom: '',
    matricule: '',
    nationalite: 'Congolaise',
    typeAgent: 'enseignant',
    lieuNaissance: '',
    adresse: '',
    dateNaissance: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await agentService.getAllAgents();
      if (response.success) {
        setAgents(response.data);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Erreur lors du chargement des agents");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Formater la date avant l'envoi
      const formattedAgent = {
        ...newAgent,
        dateNaissance: newAgent.dateNaissance 
          ? format(new Date(newAgent.dateNaissance), 'dd/MM/yyyy', { locale: fr })
          : null
      };

      const response = await agentService.createAgent(formattedAgent);
      if (response.success) {
        toast.success("Agent créé avec succès");
        setIsModalOpen(false);
        fetchAgents();
        setNewAgent({
          nom: '',
          prenom: '',
          postnom: '',
          matricule: '',
          nationalite: 'Congolaise',
          typeAgent: 'enseignant',
          lieuNaissance: '',
          adresse: '',
          dateNaissance: null,
        });
      }
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Erreur lors de la création de l'agent");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = () => {
    // Créer le contenu CSV
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Sexe', 'Lieu de naissance', 'Adresse'];
    const csvContent = [
      headers.join(','),
      ...agents.map(agent => [
        agent.nom,
        agent.prenom,
        agent.email || '',
        agent.telephone || '',
        agent.sexe || '',
        agent.lieuNaissance || '',
        agent.adresse || ''
      ].join(','))
    ].join('\n');

    // Créer le blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'agents.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAgents = agents.filter(agent =>
    `${agent.nom} ${agent.prenom}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Rechercher un enseignant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nouveau
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Liste des agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent._id}
            onClick={() => router.push(`/enseignants/${agent._id}`)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {agent.photo ? (
                  <img
                    src={agent.photo}
                    alt={`${agent.nom} ${agent.prenom}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUserGraduate}
                    className="text-2xl text-primary"
                  />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {agent.nom} {agent.prenom}
                </h3>
                {agent.email && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {agent.email}
                  </p>
                )}
                {agent.fonction && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {agent.fonction}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de création mise à jour */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium mb-4">
              Nouvel agent
            </Dialog.Title>

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input
                    type="text"
                    value={newAgent.nom}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, nom: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <input
                    type="text"
                    value={newAgent.prenom}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, prenom: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Post-nom</label>
                  <input
                    type="text"
                    value={newAgent.postnom}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, postnom: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Matricule</label>
                  <input
                    type="text"
                    value={newAgent.matricule}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, matricule: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Ex: 7.937.125 S"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nationalité</label>
                  <input
                    type="text"
                    value={newAgent.nationalite}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, nationalite: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type d'agent</label>
                  <select
                    value={newAgent.typeAgent}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, typeAgent: e.target.value as 'enseignant' | 'administratif' }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="enseignant">Enseignant</option>
                    <option value="administratif">Administratif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lieu de naissance</label>
                  <input
                    type="text"
                    value={newAgent.lieuNaissance}
                    onChange={(e) => setNewAgent(prev => ({ ...prev, lieuNaissance: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date de naissance</label>
                  <input
                    type="date"
                    value={newAgent.dateNaissance ? format(new Date(newAgent.dateNaissance), 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      setNewAgent(prev => ({ ...prev, dateNaissance: date }));
                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <input
                  type="text"
                  value={newAgent.adresse}
                  onChange={(e) => setNewAgent(prev => ({ ...prev, adresse: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Création...
                    </>
                  ) : (
                    'Créer'
                  )}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}