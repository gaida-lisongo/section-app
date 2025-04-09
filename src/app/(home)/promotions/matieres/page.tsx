"use client";
import { useState, useEffect } from 'react';
import { usePromotionStore } from '@/store/usePromotionStore';
import { useSectionStore } from '@/store/useSectionStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBook, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatiereDataTable } from '@/components/Tables/matieres/data-table';
import { MatiereModal } from '@/components/Modals/matiere-modal';
import { toast } from 'react-hot-toast';
import { Select } from '@/components/ui/select';
import sectionService from '@/api/sectionService';

interface Matiere {
  _id: string;
  designation: string;
  code: string;
  credit: number;
  semestre: "Premier" | "Second";
  codeUnite: string; // On utilise codeUnite au lieu de uniteId
}

export default function MatieresPage() {
  const activeSection = useSectionStore((state) => state.sections.find(s => s._id === state.activeSectionId));
  const { promotions, loading: loadingPromotions, fetchPromotions } = usePromotionStore();
  
  const [selectedPromotion, setSelectedPromotion] = useState<string>("");
  const [selectedUniteCode, setSelectedUniteCode] = useState<string>("");
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les promotions au démarrage
  useEffect(() => {
    if (activeSection?._id) {
      fetchPromotions(activeSection._id);
    }
  }, [activeSection]);

  // Charger les matières quand une unité est sélectionnée
  useEffect(() => {
    const fetchMatieres = async () => {
      if (!selectedUniteCode) return;
      try {
        setLoading(true);
        const response = await sectionService.getMatieresByUnite(selectedUniteCode);
        if (response.success) {
          setMatieres(response.data);
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des matières");
      } finally {
        setLoading(false);
      }
    };

    fetchMatieres();
  }, [selectedUniteCode]);

  const handleAdd = () => {
    if (!selectedUniteCode) {
      toast.error("Veuillez sélectionner une unité d'enseignement");
      return;
    }
    setEditingMatiere(null);
    setIsModalOpen(true);
  };

  const handleEdit = (matiere: Matiere) => {
    setEditingMatiere(matiere);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) return;
    try {
      const response = await sectionService.deleteMatiere(id);
      if (response.success) {
        setMatieres(prev => prev.filter(m => m._id !== id));
        toast.success('Matière supprimée avec succès');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleCreateMatiere = (newMatiere: Matiere) => {
    setMatieres(prev => [...prev, newMatiere]);
  };

  const handleUpdateMatiere = (updatedMatiere: Matiere) => {
    setMatieres(prev => prev.map(m => 
      m._id === updatedMatiere._id ? updatedMatiere : m
    ));
  };

  const filteredMatieres = matieres.filter(matiere => 
    matiere.designation.toLowerCase().includes(search.toLowerCase()) ||
    matiere.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Bannière */}
        <div className="relative h-[280px] overflow-hidden rounded-2xl shadow-2xl">
          <div className="absolute inset-0">
            <img
              src="/images/banner/admin-inbtp.jpeg"
              alt="Matières Banner"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
          
          <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                Matières
              </h1>
              <p className="mt-4 text-lg text-gray-100 md:text-xl">
                Gérez les matières de vos unités d'enseignement
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
              <div className="rounded-xl bg-white/10 backdrop-blur-lg p-4 text-white">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faBook} className="text-2xl" />
                  <div>
                    <p className="text-sm opacity-80">Total Matières</p>
                    <p className="text-2xl font-bold">{matieres.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section principale */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-lg blur opacity-30" />
          
          <div className="relative rounded-xl border border-stroke bg-white shadow-2xl dark:border-strokedark dark:bg-boxdark">
            <div className="p-6">
              {/* Filtres et recherche */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select
                    value={selectedPromotion}
                    onChange={(value) => {
                      setSelectedPromotion(value);
                      setSelectedUniteCode("");
                    }}
                    options={promotions.map(p => ({
                      value: p._id,
                      label: `${p.niveau} - ${p.mention}`
                    }))}
                    placeholder="Sélectionner une promotion"
                    className="w-full sm:w-[200px]"
                  />
                  
                  <Select
                    value={selectedUniteCode}
                    onChange={setSelectedUniteCode}
                    options={promotions
                      .find(p => p._id === selectedPromotion)
                      ?.unites?.map(u => ({
                        value: u.code,
                        label: `${u.code} - ${u.designation}`
                      })) || []}
                    placeholder="Sélectionner une unité"
                    className="w-full sm:w-[300px]"
                    disabled={!selectedPromotion}
                  />
                </div>

                <div className="flex gap-4">
                  <div className="relative flex w-full max-w-md">
                    <input
                      type="text"
                      placeholder="Rechercher une matière..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-white/80 pl-4 pr-10 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <FontAwesomeIcon 
                      icon={faSearch} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>

                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 shadow-lg shadow-primary/50"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Nouvelle Matière
                  </button>
                </div>
              </div>

              <MatiereDataTable
                data={filteredMatieres}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>

        <MatiereModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          matiere={editingMatiere}
          uniteCode={selectedUniteCode}
          onSuccess={(matiere) => {
            if (editingMatiere) {
              handleUpdateMatiere(matiere);
            } else {
              handleCreateMatiere(matiere);
            }
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}