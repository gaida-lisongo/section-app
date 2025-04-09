"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { CameraIcon } from "./_components/icons";
import { useSectionStore } from "@/store/useSectionStore";
import agentService from "@/api/agentService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@headlessui/react'
import { toast } from "react-hot-toast";
import { Section, Bureau } from '@/types/section';

// Définir l'interface pour le state data
interface ProfileData {
  coverPhoto: string;
  profilePhoto?: string;  // Ajout de la propriété profilePhoto comme optionnelle
}

interface Agent {
  id: string;
  nom: string;
  prenom: string;
  postnom: string;
  email: string;
  avatar: string;
  grade: string;
}

interface AcademicYear {
  _id: string;
  slogan: string;
  debut: number;
  fin: number;
}

interface AcademicYearForm {
  slogan: string;
  debut: number;
  fin: number;
}

export default function Page() {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find(s => s._id === activeSectionId) as Section | undefined;
  });

  const [data, setData] = useState<ProfileData>({
    coverPhoto: "/images/banner/admin-inbtp.jpeg",
  });
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loadingYears, setLoadingYears] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [yearForm, setYearForm] = useState<AcademicYearForm>({
    slogan: "",
    debut: new Date().getFullYear(),
    fin: new Date().getFullYear() + 1,
  });

  useEffect(() => {
    const fetchAgents = async () => {
      if (!activeSection?.bureaux) return;
      
      setLoading(true);
      try {
        const agentsData = await Promise.all(
          activeSection.bureaux.map(async (bureau) => {
            const response = await agentService.getAgentById(bureau.agentId);
            if (response.success) {
              return {
                ...response.data,
                grade: bureau.grade
              };
            }
            return null;
          })
        );

        setAgents(agentsData.filter(agent => agent !== null));
      } catch (error) {
        console.error("Erreur lors du chargement des agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [activeSection]);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      setLoadingYears(true);
      try {
        const response = await agentService.getAllAnnees();
        if (response.success) {
          setAcademicYears(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des années:", error);
      } finally {
        setLoadingYears(false);
      }
    };

    fetchAcademicYears();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "profilePhoto" && e.target.files?.[0]) {
      const file = e.target.files[0];
      setData({
        ...data,
        profilePhoto: URL.createObjectURL(file),
      });
    } else if (e.target.name === "coverPhoto" && e.target.files?.[0]) {
      const file = e.target.files[0];
      setData({
        ...data,
        coverPhoto: URL.createObjectURL(file),
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleDeleteYear = async (yearId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette année académique ?')) return;

    try {
      const response = await agentService.deleteAnnee(yearId);
      if (response.success) {
        setAcademicYears(prev => prev.filter(year => year._id !== yearId));
        toast.success('Année académique supprimée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleOpenModal = (year?: AcademicYear) => {
    if (year) {
      setEditingYear(year);
      setYearForm({
        slogan: year.slogan,
        debut: year.debut,
        fin: year.fin,
      });
    } else {
      setEditingYear(null);
      setYearForm({
        slogan: "",
        debut: new Date().getFullYear(),
        fin: new Date().getFullYear() + 1,
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingYear) {
        const response = await agentService.updateAnnee(editingYear._id, yearForm);
        if (response.success) {
          setAcademicYears(prev => 
            prev.map(year => 
              year._id === editingYear._id ? { ...year, ...response.data } : year
            )
          );
          toast.success("Année académique mise à jour avec succès");
        }
      } else {
        const response = await agentService.createAnnee(yearForm);
        if (response.success) {
          setAcademicYears(prev => [...prev, response.data]);
          toast.success("Année académique créée avec succès");
        }
      }
      setIsOpen(false);
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Section" />

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data?.coverPhoto}
            alt="profile cover"
            className="overflow-hidden h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            priority
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
            >
              <input
                type="file"
                name="coverPhoto"
                id="coverPhoto"
                className="sr-only"
                onChange={handleChange}
                accept="image/png, image/jpg, image/jpeg"
              />

              <CameraIcon />

              <span>Edit</span>
            </label>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              <Image
                src="/images/logo/logo-inbtp.png"
                width={160}
                height={160}
                className="overflow-hidden rounded-full"
                alt="logo section"
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="mb-1 text-2xl font-bold text-dark dark:text-white">
              {activeSection?.titre || "Aucune section sélectionnée"}
            </h3>
            <p className="font-medium text-gray-500">{activeSection?.email}</p>
            <div className="mx-auto max-w-[720px]">
              <h4 className="font-medium text-dark dark:text-white">
                Description
              </h4>
              <p className="mt-4 mb-8">
                {activeSection?.description || "Aucune description disponible"}
              </p>

              <div className="mt-8">
                <h4 className="mb-4 text-xl font-semibold text-dark dark:text-white">
                  Membres du Bureau
                </h4>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" />
                  </div>
                ) : (
                  <div  className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {agents.map((agent, idx) => (
                      <div 
                        key={idx}
                        className="rounded-lg bg-gray-1 p-4 dark:bg-gray-dark"
                      >
                        <div className="flex items-center gap-4">
                          <Image
                            src={agent.avatar || "/images/logo/logo-inbtp.png"}
                            alt={`${agent.nom} ${agent.prenom}`}
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                          <div>
                            <h5 className="font-medium text-dark dark:text-white">
                              {agent.nom} {agent.prenom}
                            </h5>
                            <p className="text-sm text-gray-500">{agent.grade}</p>
                            <p className="text-sm text-gray-500">{agent.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold text-dark dark:text-white">
                    Années Académiques
                  </h4>
                  <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                  >
                    Ajouter une année
                  </button>
                </div>
                
                {loadingYears ? (
                  <div className="flex justify-center py-8">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {academicYears.map((year) => (
                      <div 
                        key={year._id}
                        className="rounded-lg bg-gray-1 p-4 dark:bg-gray-dark"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium text-dark dark:text-white">
                              {year.debut} - {year.fin}
                            </h5>
                            <p className="text-sm text-gray-500 mt-1 italic">
                              "{year.slogan}"
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModal(year)} // Modifier ici pour ouvrir la modale
                              className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                              title="Modifier"
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <a 
                href={activeSection?.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-primary px-8 py-2 text-white hover:bg-opacity-90"
              >
                Visiter le site web
              </a>
              {activeSection?.telephone && (
                <a 
                  href={`tel:${activeSection.telephone}`}
                  className="rounded-lg border border-primary px-8 py-2 text-primary hover:bg-primary hover:text-white"
                >
                  Contacter
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 dark:bg-gray-dark">
            <Dialog.Title className="text-lg font-medium mb-4">
              {editingYear ? "Modifier l'année académique" : "Nouvelle année académique"}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Slogan de l'année
                </label>
                <input
                  type="text"
                  value={yearForm.slogan}
                  onChange={e => setYearForm(prev => ({ ...prev, slogan: e.target.value }))}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 dark:border-dark-3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Année de début
                  </label>
                  <input
                    type="number"
                    min="2000"
                    value={yearForm.debut}
                    onChange={e => setYearForm(prev => ({ 
                      ...prev, 
                      debut: parseInt(e.target.value),
                      fin: parseInt(e.target.value) + 1
                    }))}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 dark:border-dark-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Année de fin
                  </label>
                  <input
                    type="number"
                    min="2000"
                    value={yearForm.fin}
                    onChange={e => setYearForm(prev => ({ ...prev, fin: parseInt(e.target.value) }))}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 dark:border-dark-3"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setEditingYear(null);
                  }}
                  className="px-4 py-2 border border-stroke rounded-lg dark:border-dark-3"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                >
                  {editingYear ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
