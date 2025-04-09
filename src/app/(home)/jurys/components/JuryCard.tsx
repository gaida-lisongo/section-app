"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserTie, 
  faUserGraduate, 
  faCalendarDays 
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface JuryCardProps {
  jury: {
    _id: string;
    titre: string;
    description?: string;
    bureaux: any[];
    promotions: string[];
    annees: string[];
  };
}

export default function JuryCard({ jury }: JuryCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-semibold mb-4">{jury.titre}</h3>
      {jury.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">{jury.description}</p>
      )}
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <FontAwesomeIcon icon={faUserTie} className="text-primary mb-1" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {jury.bureaux.length} membres
          </p>
        </div>
        <div className="text-center">
          <FontAwesomeIcon icon={faUserGraduate} className="text-primary mb-1" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {jury.promotions.length} promotions
          </p>
        </div>
        <div className="text-center">
          <FontAwesomeIcon icon={faCalendarDays} className="text-primary mb-1" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {jury.annees.length} années
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t dark:border-gray-700">
        <button
          onClick={() => router.push(`/jurys/bureaux/${jury._id}`)}
          className="text-sm text-gray-600 hover:text-primary transition-colors"
        >
          Gérer le bureau
        </button>
        <button
          onClick={() => router.push(`/jurys/promotions/${jury._id}`)}
          className="text-sm text-gray-600 hover:text-primary transition-colors"
        >
          Gérer les promotions
        </button>
        <button
          onClick={() => router.push(`/jurys/annees/${jury._id}`)}
          className="text-sm text-gray-600 hover:text-primary transition-colors"
        >
          Gérer les années
        </button>
      </div>
    </div>
  );
}