"use client";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSectionStore } from "@/store/useSectionStore";
import { useEffect, useState } from "react";
import sectionService from "@/api/sectionService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';

interface Retrait {
  _id: string;
  montant: number;
  type: string;
  statut: 'completed' | 'pending';
  date_created: string;
  agentId: {
    nom: string;
    prenom: string;
    email: string;
  };
}

export function RetraitsCard({ className }: { className?: string }) {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find(s => s._id === activeSectionId);
  });

  const [retraits, setRetraits] = useState<Retrait[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRetraits = async () => {
      if (!activeSection?._id) return;
      setLoading(true);
      try {
        const response = await sectionService.getRetraitsBySection(activeSection._id);
        if (response.success) {
          setRetraits(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des retraits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRetraits();
  }, [activeSection]);

  return (
    <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
      <h2 className="mb-5.5 px-7.5 text-body-2xlg font-bold text-dark dark:text-white flex justify-between items-center">
        Retraits
        {loading && <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl" />}
      </h2>

      <ul className="divide-y divide-gray-100 dark:divide-dark-3">
        {retraits.map((retrait) => (
          <li key={retrait._id}>
            <div className="flex items-center gap-4 px-7.5 py-3">
              <div className="relative shrink-0">
                <div className={cn(
                  "size-14 rounded-full flex items-center justify-center",
                  retrait.type === 'enseignant' ? 'bg-blue-100' : 'bg-purple-100'
                )}>
                  <span className={cn(
                    "text-2xl",
                    retrait.type === 'enseignant' ? 'text-blue-600' : 'text-purple-600'
                  )}>
                    {retrait.agentId.nom[0]}{retrait.agentId.prenom[0]}
                  </span>
                </div>

                <span className={cn(
                  "absolute bottom-0 right-0 size-3.5 rounded-full ring-2 ring-white dark:ring-dark-2",
                  retrait.statut === 'completed' ? "bg-green-500" : "bg-orange-500"
                )}/>
              </div>

              <div className="flex-grow">
                <h3 className="font-medium text-dark dark:text-white">
                  {retrait.agentId.nom} {retrait.agentId.prenom}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{standardFormat(retrait.montant)} FC</span>
                  <span>•</span>
                  <time dateTime={retrait.date_created}>
                    {format(new Date(retrait.date_created), 'Pp', { locale: fr })}
                  </time>
                </div>
              </div>

              <FontAwesomeIcon 
                icon={retrait.statut === 'completed' ? faCheckCircle : faClock}
                className={cn(
                  "text-xl",
                  retrait.statut === 'completed' ? "text-green-500" : "text-orange-500"
                )}
              />
            </div>
          </li>
        ))}

        {retraits.length === 0 && !loading && (
          <li className="px-7.5 py-8 text-center text-gray-500">
            Aucun retrait effectué
          </li>
        )}
      </ul>
    </div>
  );
}
