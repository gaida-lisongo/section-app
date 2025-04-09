"use client";

import { useState, useEffect } from 'react';
import { usePromotionStore } from '@/store/usePromotionStore';
import { useSectionStore } from '@/store/useSectionStore';
import { PromotionsBanner } from '@/components/Banners/promotions-banner';
import { PromotionsDataTable } from '@/components/Tables/promotions/data-table';
import { PromotionModal } from '@/components/Modals/promotion-modal';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faGraduationCap, faChalkboardTeacher, faBook } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

import type { Promotion } from '@/types/promotion';

export default function PromotionsPage() {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find(s => s._id === activeSectionId);
  });

  const { promotions, loading, fetchPromotions, createPromotion, updatePromotion, deletePromotion } = usePromotionStore();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    if (activeSection?._id) {
      fetchPromotions(activeSection._id);
    }
  }, [activeSection, fetchPromotions]);

  useEffect(() => {
    const filtered = promotions.filter(p =>
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPromotions(filtered);
    setCurrentPage(1);
  }, [search, promotions]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPromotions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

  const handleAdd = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return;

    try {
      await deletePromotion(id);
      toast.success('Promotion supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (data: Partial<Promotion>) => {
    try {
      if (editingPromotion) {
        await updatePromotion(editingPromotion._id, data);
        toast.success('Promotion mise à jour avec succès');
      } else if (activeSection?._id) {
        await createPromotion({
          ...data,
          sectionId: activeSection._id,
          statut: data.statut || 'ACTIF',
        } as Omit<Promotion, '_id'>);
        toast.success('Promotion créée avec succès');
      }
      setIsModalOpen(false);
      setEditingPromotion(null);
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const handleToggleStatus = async (id: string, newStatus: 'ACTIF' | 'INACTIF') => {
    try {
      await updatePromotion(id, { statut: newStatus });
      toast.success(`Promotion ${newStatus === 'ACTIF' ? 'activée' : 'désactivée'}`);
    } catch (error) {
      toast.error("Erreur lors du changement de statut");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="relative h-[280px] overflow-hidden rounded-2xl shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
          <div className="absolute inset-0">
            <Image
              src="/images/banner/admin-inbtp.jpeg"
              alt="Promotions Banner"
              width={1920}
              height={1080}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />

          <div className="absolute inset-0 opacity-10 mix-blend-overlay">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white md:text-5xl">
                Gestion des Promotions
              </h1>
              <p className="mt-4 text-lg text-gray-100 md:text-xl">
                Gérez efficacement vos promotions et unités d'enseignement au sein de la section
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
              <div className="rounded-xl bg-white/10 backdrop-blur-lg p-4 text-white">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-2xl" />
                  <div>
                    <p className="text-sm opacity-80">Total Promotions</p>
                    <p className="text-2xl font-bold">{filteredPromotions.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-white/10 backdrop-blur-lg p-4 text-white">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="text-2xl" />
                  <div>
                    <p className="text-sm opacity-80">Promotions Actives</p>
                    <p className="text-2xl font-bold">
                      {filteredPromotions.filter(p => p.statut === 'ACTIF').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-white/10 backdrop-blur-lg p-4 text-white">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faBook} className="text-2xl" />
                  <div>
                    <p className="text-sm opacity-80">Total Unités</p>
                    <p className="text-2xl font-bold">
                      {filteredPromotions.reduce((acc, p) => acc + (p.unites?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-lg blur opacity-30"></div>
          
          <div className="relative rounded-xl border border-stroke bg-white shadow-2xl dark:border-strokedark dark:bg-boxdark transform hover:scale-[1.002] transition-transform duration-300">
            <div className="p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                <div className="relative flex w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Rechercher une promotion..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-white/80 pl-4 pr-10 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-800/80"
                  />
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>

                <button
                  onClick={handleAdd}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 shadow-lg shadow-primary/50 hover:shadow-xl transition-all duration-300"
                >
                  Nouvelle Promotion
                </button>
              </div>

              <div className="rounded-lg overflow-hidden">
                <PromotionsDataTable
                  data={currentItems}
                  loading={loading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-200 px-4 py-4 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Page <span className="font-medium">{currentPage}</span> sur{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === i + 1
                          ? 'z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <PromotionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPromotion(null);
          }}
          onSubmit={handleSubmit}
          promotion={editingPromotion}
        />
      </div>
    </div>
  );
}