import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCalendarDays, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

interface EnrollementCardProps {
  enrollement: {
    _id: string;
    designation: string;
    montant: number;
    date_fin: string;
    description?: string;
    cours: string[];
  };
  onManageCours: () => void;
  onEdit: () => void;
}

export default function EnrollementCard({ enrollement, onManageCours, onEdit }: EnrollementCardProps) {
  const formattedDate = useMemo(() => {
    return new Date(enrollement.date_fin).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [enrollement.date_fin]);

  const isExpired = useMemo(() => {
    return new Date(enrollement.date_fin) < new Date();
  }, [enrollement.date_fin]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${
      isExpired ? 'border-red-500 border' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{enrollement.designation}</h3>
        <button
          onClick={onEdit}
          className="text-gray-500 hover:text-primary transition-colors"
        >
          Modifier
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <FontAwesomeIcon icon={faMoneyBill} className="w-5 h-5 mr-2" />
          <span>{enrollement.montant.toLocaleString('fr-FR')} FC</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <FontAwesomeIcon icon={faCalendarDays} className="w-5 h-5 mr-2" />
          <span className={isExpired ? 'text-red-500' : ''}>
            Échéance : {formattedDate}
          </span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <FontAwesomeIcon icon={faBook} className="w-5 h-5 mr-2" />
          <span>{enrollement.cours.length} cours affectés</span>
        </div>

        {enrollement.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {enrollement.description}
          </p>
        )}

        <button
          onClick={onManageCours}
          className="w-full mt-4 px-4 py-2 bg-primary/10 text-primary 
                   hover:bg-primary/20 rounded-lg transition-colors"
        >
          Gérer les cours
        </button>
      </div>
    </div>
  );
}