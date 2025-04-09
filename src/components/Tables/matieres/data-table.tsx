"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faSpinner, faCalendar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface Matiere {
  _id: string;
  designation: string;
  code: string;
  credit: number;
  semestre: "Premier" | "Second";
  codeUnite: string;
}

interface DataTableProps {
  data: Matiere[];
  loading: boolean;
  onEdit: (matiere: Matiere) => void;
  onDelete: (id: string) => void;
}

export function MatiereDataTable({ data, loading, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-4 px-4 font-medium">Code</th>
            <th className="py-4 px-4 font-medium">Désignation</th>
            <th className="py-4 px-4 font-medium text-center">Crédits</th>
            <th className="py-4 px-4 font-medium text-center">Semestre</th>
            <th className="py-4 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {loading ? (
            <tr>
              <td colSpan={5} className="py-8 text-center">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-500">
                Aucune matière trouvée
              </td>
            </tr>
          ) : (
            data.map((matiere) => (
              <tr 
                key={matiere._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <td className="py-4 px-4 font-medium">
                  {matiere.code || '-'}
                </td>
                <td className="py-4 px-4">
                  <Link 
                    href={{
                      pathname: `/promotions/matieres/${matiere._id}`,
                      query: {
                        code: matiere.code,
                        designation: matiere.designation,
                        credit: matiere.credit,
                        semestre: matiere.semestre,
                        codeUnite: matiere.codeUnite
                      }
                    }}
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    {matiere.designation}
                  </Link>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-medium dark:bg-blue-900/30 dark:text-blue-400">
                    {matiere.credit}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium
                    ${matiere.semestre === "Premier" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                    }`}
                  >
                    <FontAwesomeIcon icon={faCalendar} className="text-xs" />
                    {matiere.semestre}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(matiere)}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => onDelete(matiere._id)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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