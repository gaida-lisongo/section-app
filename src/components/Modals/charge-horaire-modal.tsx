"use client";

import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import sectionService from '@/api/sectionService';
import agentService from '@/api/agentService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  matiereId: string;
  onSuccess: (matiere: any) => void;
}

interface Enseignant {
  _id: string;
  nom: string;
  prenom: string;
}

interface Annee {
  _id: string;
  slogan: string;
  debut: number;
  fin: number;
}

export function ChargeHoraireModal({ isOpen, onClose, matiereId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [annees, setAnnees] = useState<Annee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnee, setSelectedAnnee] = useState<string>('');
  const [charges, setCharges] = useState<Record<string, { enseignantId: string }>>({});

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enseignantsRes, anneesRes, chargesRes] = await Promise.all([
          agentService.getAllAgents(),
          agentService.getAllAnnees(),
          sectionService.getChargesHoraires(matiereId)
        ]);

        if (enseignantsRes.success) setEnseignants(enseignantsRes.data);
        if (anneesRes.success) {
          const triAnnees = anneesRes.data.sort((a: Annee, b: Annee) => b.debut - a.debut);
          setAnnees(triAnnees);
          if (triAnnees.length > 0) {
            setSelectedAnnee(triAnnees[0]._id);
          }
        }
        if (chargesRes.success) {
          const chargesMap: Record<string, { enseignantId: string }> = {};
          chargesRes.data.charges_horaires.forEach((charge: any) => {
            chargesMap[charge.anneeId] = { enseignantId: charge.titulaire };
          });
          setCharges(chargesMap);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Erreur lors du chargement des données");
      }
    };

    fetchData();
  }, [matiereId]);

  const handleSelectEnseignant = async (enseignantId: string) => {
    if (!selectedAnnee) return;

    setLoading(true);
    try {
      const response = await sectionService.createChargeHoraire(matiereId, {
        anneeId: selectedAnnee,
        titulaire: enseignantId
      });

      if (response.success) {
        setCharges(prev => ({
          ...prev,
          [selectedAnnee]: { enseignantId }
        }));
        onSuccess(response.data);
        toast.success('Charge horaire attribuée avec succès');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erreur lors de l'attribution");
    } finally {
      setLoading(false);
    }
  };

  const filteredEnseignants = enseignants.filter(e => 
    `${e.nom} ${e.prenom}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Attribution des charges horaires
          </Dialog.Title>

          <Tabs defaultValue={selectedAnnee} className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-5 gap-2">
              {annees.map(annee => (
                <TabsTrigger
                  key={annee._id}
                  value={annee._id}
                  onClick={() => setSelectedAnnee(annee._id)}
                >
                  {annee.debut}-{annee.fin}
                </TabsTrigger>
              ))}
            </TabsList>

            {annees.map(annee => (
              <TabsContent key={annee._id} value={annee._id} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Liste des enseignants */}
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher un enseignant..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2"
                      />
                      <FontAwesomeIcon 
                        icon={faSearch} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>

                    <div className="h-[400px] overflow-y-auto space-y-2">
                      {filteredEnseignants.map(enseignant => (
                        <button
                          key={enseignant._id}
                          onClick={() => handleSelectEnseignant(enseignant._id)}
                          disabled={charges[annee._id]?.enseignantId === enseignant._id}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            charges[annee._id]?.enseignantId === enseignant._id
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {enseignant.nom} {enseignant.prenom}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Enseignant actuel */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Enseignant en charge</h3>
                    {charges[annee._id] ? (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <FontAwesomeIcon icon={faUserGraduate} className="text-primary text-xl" />
                        </div>
                        <div>
                          {enseignants.find(e => e._id === charges[annee._id].enseignantId)?.nom} {' '}
                          {enseignants.find(e => e._id === charges[annee._id].enseignantId)?.prenom}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucun enseignant assigné</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}