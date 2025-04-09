"use client";

import { useState, useEffect, Suspense } from 'react';
import { useAgentStore } from '@/store/useAgentStore';
import { useJuryStore } from '@/store/useJuryStore';
import { useRouter, useSearchParams } from 'next/navigation';

// Composant qui utilise useSearchParams doit être enveloppé dans Suspense
function JurysLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(
    searchParams.get('agentId')
  );

  const { agents, loading: agentsLoading, fetchAgents } = useAgentStore();
  const { jurys, loading: jurysLoading, fetchJurys } = useJuryStore();

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Filtrer les agents en fonction de la recherche
  const filteredAgents = agents.filter(agent =>
    `${agent.nom} ${agent.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Données mockées pour les années académiques
  const annees = [
    { _id: '1', label: '2024-2025' },
    { _id: '2', label: '2023-2024' },
    { _id: '3', label: '2022-2023' },
  ];

  // Calculer les métriques de présence des agents dans les jurys
  const agentJuryCount = agents.map(agent => {
    const juryCount = jurys.filter(jury => 
      jury.bureaux && jury.bureaux.some(membre => 
        membre.agentId === agent._id || 
        (typeof membre.agentId === 'string' && membre.agentId === agent._id)
      )
    ).length;
    
    return {
      agent,
      juryCount
    };
  }).sort((a, b) => b.juryCount - a.juryCount); // Trier par nombre de jurys décroissant

  // Sélectionner un agent pour filtrer les jurys
  const handleSelectAgent = (agentId: string) => {
    // Si on clique sur l'agent déjà sélectionné, on désélectionne
    if (selectedAgentId === agentId) {
      setSelectedAgentId(null);
      // Mettre à jour l'URL sans paramètre de filtrage
      router.push('/jurys');
    } else {
      setSelectedAgentId(agentId);
      // Mettre à jour l'URL pour inclure le filtrage
      router.push(`/jurys?agentId=${agentId}`);
    }
    
    // Émettre un événement pour le filtrage dans la page enfant
    document.dispatchEvent(new CustomEvent('filterJurysByAgent', { 
      detail: { agentId: selectedAgentId === agentId ? null : agentId } 
    }));
  };

  // Calculs des métriques
  const totalJurys = jurys.length;
  const totalAgents = agents.length;
  const totalAnnees = annees.length;
  const agentsWithJurys = agentJuryCount.filter(item => item.juryCount > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bannière avec métriques */}
      <div className="h-48 relative mb-6 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-white">Gestion des Jurys</h1>
          <p className="mt-2 text-white/80">Organisez et gérez vos jurys académiques</p>

          {/* Métriques */}
          <div className="mt-4 flex gap-4">
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-center">
              <p className="text-sm text-white/80">Jurys</p>
              <p className="text-2xl font-bold text-white">{totalJurys}</p>
            </div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-center">
              <p className="text-sm text-white/80">Agents</p>
              <p className="text-2xl font-bold text-white">{totalAgents}</p>
            </div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-center">
              <p className="text-sm text-white/80">Agents en jury</p>
              <p className="text-2xl font-bold text-white">{agentsWithJurys}</p>
            </div>
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-center">
              <p className="text-sm text-white/80">Années</p>
              <p className="text-2xl font-bold text-white">{totalAnnees}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6 space-y-8">
              {/* Bouton Ajouter Jury et Reset Filtre */}
              <div className="flex gap-2 flex-col">
                <button 
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => document.dispatchEvent(new CustomEvent('addJury'))}
                >
                  + Nouveau Jury
                </button>
                
                {selectedAgentId && (
                  <button 
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    onClick={() => handleSelectAgent(selectedAgentId)}
                  >
                    Réinitialiser le filtre
                  </button>
                )}
              </div>
              

              {/* Section Agents */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Filtrer par agent</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Rechercher un agent..."
                    className="w-full px-4 py-2 border rounded-lg"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {agentsLoading ? (
                      <div className="text-center py-4 text-gray-500">Chargement...</div>
                    ) : (
                      filteredAgents.map((agent) => {
                        const juryCount = jurys.filter(jury => 
                          jury.bureaux && jury.bureaux.some(membre => 
                            membre.agentId === agent._id || 
                            (typeof membre.agentId === 'string' && membre.agentId === agent._id)
                          )
                        ).length;
                        
                        const isSelected = selectedAgentId === agent._id;
                        
                        return (
                          <div 
                            key={agent._id}
                            onClick={() => handleSelectAgent(agent._id)}
                            className={`p-2 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${
                              isSelected 
                                ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div>
                              <p className="font-medium">{agent.nom} {agent.prenom}</p>
                              <p className="text-sm text-gray-500">{agent.email || agent.matricule || ''}</p>
                            </div>
                            {juryCount > 0 && (
                              <div className="bg-blue-100 text-blue-700 font-medium h-6 w-6 rounded-full flex items-center justify-center">
                                {juryCount}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                    
                    {filteredAgents.length === 0 && !agentsLoading && (
                      <div className="text-center py-4 text-gray-500">Aucun agent trouvé</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal qui enveloppe le contenu avec Suspense
export default function JurysLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Chargement...</div>}>
      <JurysLayoutContent>{children}</JurysLayoutContent>
    </Suspense>
  );
}