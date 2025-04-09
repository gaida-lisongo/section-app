"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface UE {
  _id: string;
  code: string;
  designation: string;
  categorie: string;
  credits?: number;
  volumeHoraire?: number;
  matieres?: any[];
}

interface DataTableProps {
  data: UE[];
  onEdit: (ue: UE) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function UEDataTable({ data, onEdit, onDelete, loading }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-4 px-4 font-medium">Code</th>
            <th className="py-4 px-4 font-medium">Désignation</th>
            <th className="py-4 px-4 font-medium">Catégorie</th>
            <th className="py-4 px-4 font-medium text-center">Matières</th>
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
                Aucune unité d'enseignement trouvée
              </td>
            </tr>
          ) : (
            data.map((ue) => (
              <tr 
                key={ue._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="py-4 px-4 font-medium">{ue.code}</td>
                <td className="py-4 px-4">
                  <Link 
                    href={{
                      pathname: `/promotions/ue/${ue._id}`,
                      query: {
                        code: ue.code,
                        designation: ue.designation,
                        categorie: ue.categorie
                      }
                    }}
                    className="text-primary hover:underline"
                  >
                    {ue.designation}
                  </Link>
                </td>
                <td className="py-4 px-4">{ue.categorie}</td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {ue.matieres?.length || 0}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(ue)}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => onDelete(ue._id)}
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