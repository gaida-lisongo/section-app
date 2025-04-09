"use client";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faSpinner, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import sectionService from '@/api/sectionService';
import { cn } from '@/lib/utils';
import { Promotion } from '@/types/promotion';
import { useParams } from 'next/navigation';

interface Descripteur {
  _id: string;
  unite: string;
  description: string;
  competences: string[];
  capacites: string[];
  contenus: string[];
}

interface PromotionsDataTableProps {
  data: Promotion[];
  loading: boolean;
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: 'ACTIF' | 'INACTIF') => Promise<void>;
}

export function PromotionsDataTable({ 
  data, 
  loading, 
  onEdit, 
  onDelete,
  onToggleStatus 
}: PromotionsDataTableProps) {
  const params = useParams();
  const uniteId = typeof params?.id === 'string' ? params.id : '';

  const fetchDescripteurByUnite = async (uniteId: string) => {
    if (!uniteId) {
      toast.error("ID de l'unité invalide");
      return;
    }
    const response = await sectionService.getDescripteurByUnite(uniteId);
    return response;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-4 px-4 font-medium">Niveau</th>
            <th className="py-4 px-4 font-medium">Mention</th>
            <th className="py-4 px-4 font-medium">Orientation</th>
            <th className="py-4 px-4 font-medium">Description</th>
            <th className="py-4 px-4 font-medium text-center">Unités</th>
            <th className="py-4 px-4 font-medium text-center">Statut</th>
            <th className="py-4 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {loading ? (
            <tr>
              <td colSpan={7} className="py-8 text-center">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-gray-500">
                Aucune promotion trouvée
              </td>
            </tr>
          ) : (
            data.map((promotion) => (
              <tr 
                key={promotion._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="py-4 px-4 font-medium">{promotion.niveau}</td>
                <td className="py-4 px-4">{promotion.mention}</td>
                <td className="py-4 px-4">{promotion.orientation}</td>
                <td className="py-4 px-4">
                  <p className="truncate max-w-xs" title={promotion.description}>
                    {promotion.description}
                  </p>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {promotion.unites?.length || 0}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => onToggleStatus(
                      promotion._id, 
                      promotion.statut === 'ACTIF' ? 'INACTIF' : 'ACTIF'
                    )}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      promotion.statut === 'ACTIF' 
                        ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                    )}
                  >
                    <FontAwesomeIcon 
                      icon={promotion.statut === 'ACTIF' ? faToggleOn : faToggleOff} 
                      className="text-base"
                    />
                    {promotion.statut}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(promotion)}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => onDelete(promotion._id)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}