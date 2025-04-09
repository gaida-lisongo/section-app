"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBook, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEnrollementStore } from '@/store/useEnrollementStore';
import { toast } from "react-hot-toast";
import LoadingSpinner from '../components/LoadingSpinner';
import CoursModal from '../components/CoursModal';
import { CoursList } from '@/components/Enrollement/CoursList';
import { useState } from 'react';
import { Cours } from '@/types/enrollement';

export default function EnrollementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const enrollementId = params.id as string;

  const { enrollements, loading, fetchEnrollements, updateEnrollement, deleteEnrollement } = useEnrollementStore();
  const [isCoursModalOpen, setCoursModalOpen] = useState(false);

  const enrollement = enrollements.find(e => e._id === enrollementId);

  useEffect(() => {
    if (!loading && !enrollement) {
      router.push('/enrollements');
    }
  }, [loading, enrollement, router]);

  const handleSaveCours = async (cours: string[]) => {
    if (enrollement) {
      try {
        await updateEnrollement(enrollement._id, { ...enrollement, cours });
        setCoursModalOpen(false);
      } catch (error) {
        console.error('Error updating cours:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (!enrollement?._id) {
      toast.error("Impossible de supprimer l'enrollement");
      return;
    }
    if (confirm("Êtes-vous sûr de vouloir supprimer cet enrollement ?")) {
      try {
        await deleteEnrollement(enrollement._id);
        toast.success("Enrollement supprimé avec succès");
        router.push("/enrollements");
      } catch (error) {
        toast.error("Erreur lors de la suppression de l'enrollement");
      }
    }
  };

  if (loading || !enrollement) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-2xl font-semibold">{enrollement.designation}</h1>
        </div>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 
                    hover:bg-red-100 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={faTrash} />
          Supprimer l'enrollement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Détails de l'enrollement</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">Montant</p>
              <p className="font-medium">{enrollement.montant.toLocaleString('fr-FR')} FC</p>
            </div>
            <div>
              <p className="text-gray-500">Date de création</p>
              <p className="font-medium">
                {new Date(enrollement.date_created).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Date de fin</p>
              <p className="font-medium">
                {new Date(enrollement.date_fin).toLocaleDateString('fr-FR')}
              </p>
            </div>
            {enrollement.description && (
              <div>
                <p className="text-gray-500">Description</p>
                <p className="font-medium">{enrollement.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Cours ({enrollement.cours.length})</h3>
            <button
              onClick={() => setCoursModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary 
                       hover:bg-primary/20 rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faBook} />
              Gérer les cours
            </button>
          </div>

          {enrollement.cours && enrollement.cours.length > 0 ? (
            <CoursList cours={enrollement.cours as Cours[]} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FontAwesomeIcon icon={faBook} className="text-3xl mb-2" />
              <p>Aucun cours ajouté</p>
            </div>
          )}
        </div>
      </div>

      <CoursModal
        isOpen={isCoursModalOpen}
        onClose={() => setCoursModalOpen(false)}
        enrollement={enrollement}
        onSave={handleSaveCours}
      />
    </div>
  );
}