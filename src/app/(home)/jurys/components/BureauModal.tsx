import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import agentService from '@/api/agentService';
import { toast } from 'react-hot-toast';

interface Bureau {
  agentId: string;
  grade: string;
}

interface Agent {
  _id: string;
  nom: string;
  prenom: string;
  matricule: string;
}

interface BureauModalProps {
  isOpen: boolean;
  onClose: () => void;
  jury: any;
  onSave: (bureaux: Bureau[]) => Promise<void>;
}

export default function BureauModal({ isOpen, onClose, jury, onSave }: BureauModalProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBureaux, setCurrentBureaux] = useState<Bureau[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchAgents();
      setCurrentBureaux(jury.bureaux || []);
    }
  }, [isOpen, jury]);

  const fetchAgents = async () => {
    try {
      const response = await agentService.getAllAgents();
      if (response.success) {
        setAgents(response.data);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des agents");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = (agent: Agent) => {
    const grade = prompt("Entrez le grade de l'agent dans le bureau (ex: Président, Secrétaire):");
    if (!grade) return;

    if (currentBureaux.some(b => b.agentId === agent._id)) {
      toast.error("Cet agent est déjà membre du bureau");
      return;
    }

    setCurrentBureaux(prev => [...prev, { agentId: agent._id, grade }]);
  };

  const handleRemoveAgent = (agentId: string) => {
    setCurrentBureaux(prev => prev.filter(b => b.agentId !== agentId));
  };

  const handleSave = async () => {
    try {
      await onSave(currentBureaux);
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const filteredAgents = agents.filter(agent =>
    !currentBureaux.some(b => b.agentId === agent._id) &&
    (agent.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
     agent.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
     agent.matricule.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="p-6">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <FontAwesomeIcon icon={faUserTie} className="text-primary" />
              Gestion du bureau
            </Dialog.Title>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Rechercher un agent..."
                className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Liste des agents disponibles */}
              <div className="space-y-4">
                <h3 className="font-medium">Agents disponibles</h3>
                <div className="h-[400px] overflow-y-auto space-y-2">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-primary" />
                    </div>
                  ) : (
                    filteredAgents.map(agent => (
                      <div
                        key={agent._id}
                        onClick={() => handleAddAgent(agent)}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 
                                 dark:hover:bg-gray-600 cursor-pointer transition-all"
                      >
                        <p className="font-medium">{agent.nom} {agent.prenom}</p>
                        <p className="text-sm text-gray-500">{agent.matricule}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bureau actuel */}
              <div className="space-y-4">
                <h3 className="font-medium">Composition du bureau</h3>
                <div className="h-[400px] overflow-y-auto space-y-2">
                  {currentBureaux.map(bureau => {
                    const agent = agents.find(a => a._id === bureau.agentId);
                    return (
                      <div
                        key={bureau.agentId}
                        className="p-4 bg-primary/5 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-primary">{bureau.grade}</p>
                            <p>{agent?.nom} {agent?.prenom}</p>
                            <p className="text-sm text-gray-500">{agent?.matricule}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveAgent(bureau.agentId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Retirer
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}