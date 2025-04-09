"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEnrollementStore } from '@/store/useEnrollementStore';
import PromotionSelector from './components/PromotionSelector';
import EnrollementCard from './components/EnrollementCard';
import EnrollementFilters from './components/EnrollementFilters';
import LoadingSpinner from './components/LoadingSpinner';
import CreateEnrollementModal from './components/CreateEnrollementModal';
import { toast } from 'react-hot-toast';

export default function EnrollementsPage() {
  const router = useRouter();
  const { 
    enrollements, 
    loading, 
    selectedPromotionId, 
    setSelectedPromotion, 
    fetchEnrollements,
    createEnrollement 
  } = useEnrollementStore();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all' as 'all' | 'active' | 'expired',
    sortBy: 'date' as 'date' | 'montant'
  });

  useEffect(() => {
    if (selectedPromotionId) {
      fetchEnrollements(selectedPromotionId);
    }
  }, [selectedPromotionId, fetchEnrollements]);

  // Filtrage des enrollements
  const filteredEnrollements = enrollements.filter(enrollement => {
    // Filtre de recherche
    const matchesSearch = enrollement.designation.toLowerCase()
      .includes(filters.search.toLowerCase());

    // Filtre de statut
    if (filters.status !== 'all') {
      const isExpired = new Date(enrollement.date_fin) < new Date();
      if (filters.status === 'active' && isExpired) return false;
      if (filters.status === 'expired' && !isExpired) return false;
    }

    return matchesSearch;
  }).sort((a, b) => {
    // Tri
    if (filters.sortBy === 'date') {
      return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
    }
    return b.montant - a.montant;
  });

  const handlePromotionSelect = (promotionId: string) => {
    setSelectedPromotion(promotionId);
  };

  console.log('Enrollements:', enrollements); // Pour le debug
  console.log('Filtered Enrollements:', filteredEnrollements); // Pour le debug

  return (
    <div className="space-y-6">
      <PromotionSelector
        onSelectPromotion={handlePromotionSelect}
        selectedPromotionId={selectedPromotionId}
      />

      {selectedPromotionId && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Enrollements</h2>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg 
                       hover:bg-primary/90 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              Nouvel enrollement
            </button>
          </div>

          <EnrollementFilters
            onSearch={(search) => setFilters(prev => ({ ...prev, search }))}
            onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
          />

          {loading ? (
            <LoadingSpinner />
          ) : filteredEnrollements.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Aucun enrollement trouvé pour cette promotion
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrollements.map(enrollement => (
                <EnrollementCard
                  key={enrollement._id}
                  enrollement={{
                    ...enrollement,
                    cours: enrollement.cours.map(cours => cours._id)
                  }}
                  onManageCours={() => router.push(`/enrollements/${enrollement._id}`)}
                  onEdit={() => {/* logique de modification */}}
                />
              ))}
            </div>
          )}

          <CreateEnrollementModal
            isOpen={isCreateModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSave={async (data) => {
              try {
                await createEnrollement({
                  ...data,
                  promotionId: selectedPromotionId
                });
                setCreateModalOpen(false);
                toast.success("Enrollement créé avec succès");
              } catch (error) {
                toast.error("Erreur lors de la création de l'enrollement");
              }
            }}
          />
        </>
      )}
    </div>
  );
}