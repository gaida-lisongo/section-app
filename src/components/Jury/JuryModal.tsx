import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faCalendarAlt, faUsers, faInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAgentStore } from '@/store/useAgentStore';
import { usePromotionStore } from '@/store/usePromotionStore';
import agentService from '@/api/agentService';
import { set } from 'date-fns';

interface Bureau {
  grade: string;
  agentId: string;
}

interface JuryData {
  titre: string;
  secure: string;
  bureaux: Bureau[];
  promotions: string[];
  annees: string[];
}

interface JuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: JuryData) => void;
  jury?: any;
}

export function JuryModal({ isOpen, onClose, onSave, jury }: JuryModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('Président');
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [annees, setAnnees] = useState<{slogan: string, debut: number, fin: number, _id: string}[] | []>([]); // Remplacez 'any' par le type approprié si nécessaire

  const { agents, loading: agentsLoading, fetchAgents } = useAgentStore();
  const { promotions } = usePromotionStore();
  
  const [data, setData] = useState<JuryData>({
    titre: '',
    secure: '',
    bureaux: [],
    promotions: [],
    annees: []
  });

  // const annees = [
  //   { _id: '1', label: '2024-2025' },
  //   { _id: '2', label: '2023-2024' },
  //   { _id: '3', label: '2022-2023' },
  // ];
  useEffect(() => {
    const fetchAnnees = async () => {
      try {
        // Remplacez ceci par votre logique pour récupérer les années académiques
        const response = await agentService.getAllAnnees();
        if (!response.success) {
          throw new Error(response.message || "Erreur lors du chargement des années académiques");
        }
        console.log("Response années", response);
        setAnnees(response.data);
        
      } catch (error) {
        console.error('Erreur lors de la récupération des années académiques:', error);
      }
    };
    
    fetchAnnees();
  }, []);

  useEffect(() => {
    fetchAgents();
    
    if (jury) {
      setData({
        titre: jury.titre || '',
        secure: jury.secure || '',
        bureaux: Array.isArray(jury.bureaux) ? [...jury.bureaux] : [],
        promotions: Array.isArray(jury.promotions) ? [...jury.promotions] : [],
        annees: Array.isArray(jury.annees) ? [...jury.annees] : []
      });
    } else {
      setData({
        titre: '',
        secure: '',
        bureaux: [],
        promotions: [],
        annees: []
      });
    }
  }, [jury, fetchAgents]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePromotion = (promotionId: string) => {
    setData(prev => {
      const exists = prev.promotions.includes(promotionId);
      return {
        ...prev,
        promotions: exists 
          ? prev.promotions.filter(id => id !== promotionId)
          : [...prev.promotions, promotionId]
      };
    });
  };

  const toggleAnnee = (anneeId: string) => {
    setData(prev => {
      const exists = prev.annees.includes(anneeId);
      return {
        ...prev,
        annees: exists 
          ? prev.annees.filter(id => id !== anneeId)
          : [...prev.annees, anneeId]
      };
    });
  };

  const addBureauMember = () => {
    if (!selectedAgentId) return;
    
    setData(prev => ({
      ...prev,
      bureaux: [...prev.bureaux, { agentId: selectedAgentId, grade: selectedGrade }]
    }));
    
    setSelectedAgentId('');
  };

  const removeBureauMember = (index: number) => {
    setData(prev => ({
      ...prev,
      bureaux: prev.bureaux.filter((_, i) => i !== index)
    }));
  };

  const getAgentName = (agentId: string) => {
    // Il y avait une typo ici: "_idi" au lieu de "_id"
    const agent = agents.find(a => a._id === agentId);
    if (agent) {
      return `${agent.nom} ${agent.prenom || ''}`;
    }
    
    return 'Agent inconnu';
  };

  const filteredAgents = agents.filter(agent => 
    `${agent.nom} ${agent.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { name: 'Description', icon: faInfo },
    { name: 'Promotions', icon: faGraduationCap },
    { name: 'Années', icon: faCalendarAlt },
    { name: 'Bureau', icon: faUsers },
  ];

  const handleSave = () => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <Dialog.Title className="text-2xl font-semibold mb-6">
              {jury ? 'Configurer le Jury' : 'Nouveau Jury'}
            </Dialog.Title>

            <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
              <Tab.List className="flex space-x-2 rounded-xl bg-gray-100 p-1">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                       ${selected 
                         ? 'bg-white text-blue-600 shadow'
                         : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                       }`
                    }
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FontAwesomeIcon icon={tab.icon} />
                      {tab.name}
                    </div>
                  </Tab>
                ))}
              </Tab.List>

              <Tab.Panels className="mt-6">
                <Tab.Panel className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Titre <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="titre"
                      value={data.titre}
                      onChange={handleChange}
                      placeholder="Entrez le titre du jury"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="secure"
                      value={data.secure}
                      onChange={handleChange}
                      placeholder="Mot de passe du jury"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {jury ? "Laissez vide pour conserver le mot de passe actuel" : "Ce mot de passe sera nécessaire pour accéder au jury"}
                    </p>
                  </div>
                </Tab.Panel>

                <Tab.Panel className="space-y-4">
                  <h3 className="text-lg font-medium">Sélectionnez les promotions concernées</h3>
                  <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {promotions.length > 0 ? (
                      promotions.map(promotion => (
                        <div 
                          key={promotion._id} 
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            id={`promotion-${promotion._id}`}
                            checked={data.promotions.includes(promotion._id)}
                            onChange={() => togglePromotion(promotion._id)}
                            className="h-5 w-5 text-blue-600"
                          />
                          <label htmlFor={`promotion-${promotion._id}`} className="flex-1 cursor-pointer">
                            <span className="block font-medium">{promotion.niveau} {promotion.mention}</span>
                            <span className="block text-sm text-gray-500">{promotion.orientation || ''}</span>
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">Aucune promotion disponible</p>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel className="space-y-4">
                  <h3 className="text-lg font-medium">Sélectionnez les années académiques</h3>
                  <div className="space-y-2">
                    {annees.map(annee => (
                      <div 
                        key={annee._id} 
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          id={`annee-${annee._id}`}
                          checked={data.annees.includes(annee._id)}
                          onChange={() => toggleAnnee(annee._id)}
                          className="h-5 w-5 text-blue-600"
                        />
                        <label htmlFor={`annee-${annee._id}`} className="flex-1 cursor-pointer">
                          <span className="block font-medium">Année académique : {annee.debut} - {annee.fin}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </Tab.Panel>

                <Tab.Panel className="space-y-4">
                  <h3 className="text-lg font-medium">Membres du bureau</h3>
                  
                  {data.bureaux.length > 0 ? (
                    <div className="border rounded-lg p-3 space-y-2">
                      <h4 className="font-medium">Bureau actuel</h4>
                      {data.bureaux.map((membre, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{membre.grade}:</span>
                            <span className="ml-2">{getAgentName(membre.agentId)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeBureauMember(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 border rounded-lg">
                      Aucun membre dans le bureau
                    </div>
                  )}
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Ajouter un membre</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Grade</label>
                        <select 
                          className="w-full border rounded-lg p-2"
                          value={selectedGrade}
                          onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                          <option value="Président">Président</option>
                          <option value="Secrétaire">Secrétaire</option>
                          <option value="Membre">Membre</option>
                          <option value="Rapporteur">Rapporteur</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-1">Agent <span className="text-red-500">*</span></label>
                        {agentsLoading ? (
                          <div className="text-center py-2 text-gray-500">Chargement des agents...</div>
                        ) : (
                          <>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Rechercher un agent..."
                                className="w-full border rounded-lg p-2 mb-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            
                            <div className="border rounded-lg">
                              <select 
                                className="w-full p-2 bg-white border-none focus:ring-blue-500"
                                value={selectedAgentId}
                                onChange={(e) => setSelectedAgentId(e.target.value)}
                              >
                                <option value="">Sélectionner un agent</option>
                                {filteredAgents.map((agent) => (
                                  <option key={agent._id || `agent-${agent.nom}-${agent.prenom}`} value={agent._id}>
                                    {agent.nom} {agent.prenom} {agent.matricule ? `(${agent.matricule})` : ''} 
                                  </option>
                                ))}
                              </select>
                              
                              {filteredAgents.length === 0 && (
                                <div className="text-center py-2 text-gray-500">Aucun agent trouvé</div>
                              )}
                            </div>
                            
                            {/* Affichage de l'agent sélectionné */}
                            {selectedAgentId && (
                              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="font-medium">Agent sélectionné:</p>
                                <p>
                                  {(() => {
                                    const agent = agents.find(a => a._id === selectedAgentId);
                                    return agent ? `${agent.nom} ${agent.prenom}` : 'Agent inconnu';
                                  })()}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={addBureauMember}
                        className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                      >
                        Ajouter au bureau
                      </button>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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