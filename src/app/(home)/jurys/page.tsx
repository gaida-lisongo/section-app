"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useJuryStore } from '@/store/useJuryStore';
import { usePromotionStore } from '@/store/usePromotionStore';
import { useSectionStore } from '@/store/useSectionStore';
import { useAgentStore } from '@/store/useAgentStore';
import { toast } from 'react-hot-toast';
import { JuryModal } from '@/components/Jury/JuryModal';

// Créer un composant enfant qui utilisera useSearchParams
function JurysContent() {
  // États locaux
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJury, setSelectedJury] = useState<any>(null);
  const [filteredAgentId, setFilteredAgentId] = useState<string | null>(null);
  const [juryToDelete, setJuryToDelete] = useState<string | null>(null);

  // Récupérer les stores
  const { jurys, loading, fetchJurys, createJury, updateJury, deleteJury } = useJuryStore();
  const { promotions, fetchPromotions } = usePromotionStore();
  const { activeSectionId } = useSectionStore();
  const { agents, loading: agentsLoading, fetchAgents } = useAgentStore();
  const searchParams = useSearchParams();

  // Charger les données initiales
  useEffect(() => {
    if (activeSectionId) {
      fetchPromotions(activeSectionId);
      fetchJurys(activeSectionId);
      fetchAgents();
    }
  }, [activeSectionId, fetchPromotions, fetchJurys, fetchAgents]);

  // Récupérer l'ID de l'agent depuis les paramètres d'URL
  useEffect(() => {
    setFilteredAgentId(searchParams.get('agentId'));
  }, [searchParams]);

  // Écouter l'événement pour ajouter un jury
  useEffect(() => {
    const handleAddJury = () => {
      setSelectedJury(null);
      setModalOpen(true);
    };

    document.addEventListener('addJury', handleAddJury);

    return () => {
      document.removeEventListener('addJury', handleAddJury);
    };
  }, []);

  // Ajouter un effet pour écouter les événements de filtrage
  useEffect(() => {
    const handleFilterJurysByAgent = (event: CustomEvent) => {
      const { agentId } = event.detail;
      setFilteredAgentId(agentId);
    };

    document.addEventListener('filterJurysByAgent', handleFilterJurysByAgent as EventListener);

    return () => {
      document.removeEventListener('filterJurysByAgent', handleFilterJurysByAgent as EventListener);
    };
  }, []);

  // Fonction pour gérer la sauvegarde depuis le modal
  const handleSaveJury = (juryData: any) => {
    if (selectedJury) {
      // Mode édition - mettre à jour le jury existant
      updateJury(selectedJury._id, juryData);
    } else {
      // Mode création - créer un nouveau jury
      createJury({
        ...juryData,
        sectionId: activeSectionId as string
      });
    }
    setModalOpen(false);
  };

  // Gérer le clic sur un jury pour le modifier
  const handleJuryClick = (jury: any) => {
    setSelectedJury(jury);
    setModalOpen(true);
  };

  // Gérer la suppression d'un jury
  const handleDeleteJury = (event: React.MouseEvent, juryId: string) => {
    // Empêcher la propagation de l'événement pour éviter d'ouvrir le modal d'édition
    event.stopPropagation();
    setJuryToDelete(juryId);
  };

  // Confirmer la suppression du jury
  const confirmDelete = async () => {
    if (juryToDelete) {
      await deleteJury(juryToDelete);
      setJuryToDelete(null);
    }
  };

  // Filtrer les jurys selon l'agent sélectionné
  const filteredJurys = useMemo(() => {
    if (!filteredAgentId) return jurys;

    return jurys.filter(jury =>
      jury.bureaux && jury.bureaux.some(membre =>
        membre.agentId === filteredAgentId ||
        (typeof membre.agentId === 'object' && membre.agentId === filteredAgentId)
      )
    );
  }, [jurys, filteredAgentId]);

  if (loading && jurys.length === 0) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Liste des Jurys</h2>
        {filteredAgentId && (
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
            <span>Filtré par agent</span>
            <button
              className="text-xs font-bold hover:text-blue-900"
              onClick={() => {
                setFilteredAgentId(null);
                document.dispatchEvent(new CustomEvent('filterJurysByAgent', { detail: { agentId: null } }));
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Liste des jurys */}
      {filteredJurys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJurys.map(jury => (
            <div
              key={jury._id}
              onClick={() => handleJuryClick(jury)}
              className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md relative"
            >
              {/* Bouton de suppression */}
              <button
                onClick={(e) => handleDeleteJury(e, jury._id)}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                title="Supprimer ce jury"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <h3 className="font-semibold text-lg mb-4">{jury.titre}</h3>

              {/* Bureau */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">Bureau</p>
                <div className="mt-1 space-y-1">
                  {jury.bureaux && jury.bureaux.length > 0 ? (
                    jury.bureaux.map((membre, index) => {
                      // Trouver l'agent correspondant dans le store
                      const agent = agents.find(a => a._id === membre.agentId );

                      return (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 rounded-md flex items-center"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                            {agent?.nom?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-medium">{membre.grade}</div>
                            <div className="text-sm text-gray-600">
                              {agent ? (
                                <>
                                  {agent.nom} {agent.prenom}
                                  {agent.matricule && <span className="text-xs text-gray-500 ml-1">({agent.matricule})</span>}
                                </>
                              ) : (
                                  'Agent inconnu'
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-400 p-2">Aucun membre dans le bureau</div>
                  )}
                </div>
              </div>

              {/* Promotions */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600">Promotions</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {jury.promotions && jury.promotions.map((promotionId, index) => {
                    // Vérifier si promotionId est un objet ou une chaîne
                    if (typeof promotionId === 'object' && promotionId !== null) {
                      // Si c'est un objet de promotion complet
                      return (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                          {promotionId.niveau} {promotionId.mention}
                        </span>
                      );
                    } else {
                      // Si c'est juste un ID
                      const promotion = promotions.find(p => p._id === promotionId);
                      return (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                          {promotion ? `${promotion.niveau} ${promotion.mention}` : `Promotion ${index + 1}`}
                        </span>
                      );
                    }
                  })}
                  {(!jury.promotions || jury.promotions.length === 0) && (
                    <span className="text-sm text-gray-400">Aucune promotion associée</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center text-gray-500">
          <p className="text-lg">
            {filteredAgentId
              ? "Aucun jury trouvé pour cet agent"
              : "Aucun jury trouvé"}
          </p>
          <p className="mt-2">
            {filteredAgentId
              ? "Essayez de sélectionner un autre agent ou de réinitialiser le filtre"
              : "Commencez par créer un nouveau jury"}
          </p>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {juryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h3 className="text-lg font-medium mb-4">Confirmer la suppression</h3>
            <p className="text-gray-700 mb-6">
              Êtes-vous sûr de vouloir supprimer ce jury ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={() => setJuryToDelete(null)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={confirmDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition/création */}
      <JuryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveJury}
        jury={selectedJury}
      />
    </div>
  );
}

// Composant principal qui enveloppe le contenu avec Suspense
export default function JurysPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">Chargement...</div>}>
      <JurysContent />
    </Suspense>
  );
}