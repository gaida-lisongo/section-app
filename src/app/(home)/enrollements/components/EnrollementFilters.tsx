import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

interface EnrollementFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    status: 'all' | 'active' | 'expired';
    sortBy: 'date' | 'montant';
  }) => void;
}

export default function EnrollementFilters({ onSearch, onFilterChange }: EnrollementFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un enrollement..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 
                       dark:bg-gray-700"
            />
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
            <select
              onChange={(e) => onFilterChange({ 
                status: e.target.value as 'all' | 'active' | 'expired',
                sortBy: 'date'
              })}
              className="rounded-lg border dark:border-gray-700 dark:bg-gray-700 py-2 px-3"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="expired">Expirés</option>
            </select>
          </div>

          <select
            onChange={(e) => onFilterChange({ 
              status: 'all',
              sortBy: e.target.value as 'date' | 'montant'
            })}
            className="rounded-lg border dark:border-gray-700 dark:bg-gray-700 py-2 px-3"
          >
            <option value="date">Trier par date</option>
            <option value="montant">Trier par montant</option>
          </select>
        </div>
      </div>
    </div>
  );
}