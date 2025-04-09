"use client";
import { useState, useEffect } from "react";
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faPhone, 
  faEnvelope, 
  faCalendar,
  faLocationDot,
  faFlag,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export function PersonalInfoForm() {
  const agent = useAuthStore((state) => state.agent);
  const updateUserInfo = useAuthStore((state) => state.updateUserInfo);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    postnom: "",
    telephone: "",
    email: "",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "",
  });

  // Mettre à jour le formulaire quand l'agent change
  useEffect(() => {
    if (agent) {
      setFormData({
        nom: agent.nom || "",
        prenom: agent.prenom || "",
        postnom: agent.postnom || "",
        telephone: agent.telephone || "",
        email: agent.email || "",
        dateNaissance: agent.dateNaissance ? 
          format(new Date(agent.dateNaissance), 'dd/MM/yyyy', { locale: fr }) : "",
        lieuNaissance: agent.lieuNaissance || "",
        nationalite: agent.nationalite || "",
      });
    }
  }, [agent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "dateNaissance") {
      try {
        const parsedDate = new Date(value);
        // Formater la date en français
        const formattedDate = format(parsedDate, 'dd/MM/yyyy', { locale: fr });
        setFormData(prev => ({
          ...prev,
          [name]: formattedDate
        }));
      } catch (error) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserInfo(formData);
      toast.success("Informations mises à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (agent) {
      setFormData({
        nom: agent.nom || "",
        prenom: agent.prenom || "",
        postnom: agent.postnom || "",
        telephone: agent.telephone || "",
        email: agent.email || "",
        dateNaissance: agent.dateNaissance ? 
          format(new Date(agent.dateNaissance), 'dd/MM/yyyy', { locale: fr }) : "",
        lieuNaissance: agent.lieuNaissance || "",
        nationalite: agent.nationalite || "",
      });
    }
  };

  return (
    <ShowcaseSection title="Informations Personnelles" className="!p-7">
      <form onSubmit={handleSubmit}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/3"
            type="text"
            name="nom"
            label="Nom"
            placeholder="Votre nom"
            value={formData.nom}
            handleChange={handleChange}
            icon={<FontAwesomeIcon icon={faUser} />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/3"
            type="text"
            name="prenom"
            label="Prénom"
            placeholder="Votre prénom"
            value={formData.prenom}
            handleChange={handleChange}
            icon={<FontAwesomeIcon icon={faUser} />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/3"
            type="text"
            name="postnom"
            label="Post-nom"
            placeholder="Votre post-nom"
            value={formData.postnom}
            handleChange={handleChange}
            icon={<FontAwesomeIcon icon={faUser} />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="tel"
            name="telephone"
            label="Téléphone"
            placeholder="Votre numéro"
            value={formData.telephone}
            handleChange={handleChange}
            icon={<FontAwesomeIcon icon={faPhone} />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="email"
            name="email"
            label="Adresse Email"
            placeholder="Votre email"
            value={formData.email}
            handleChange={handleChange}
            icon={<FontAwesomeIcon icon={faEnvelope} />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/3"
            type="date"
            name="dateNaissance"
            label="Date de naissance"
            placeholder="Sélectionnez une date"
            value={formData.dateNaissance || ''}
            handleChange={handleChange}
            icon={<FontAwesomeIcon icon={faCalendar} />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/3"
            type="text"
            name="lieuNaissance"
            label="Lieu de naissance"
            placeholder="Votre lieu de naissance"
            value={formData.lieuNaissance}
            handleChange={handleChange}
            icon={<FontAwesomeIcon icon={faLocationDot} />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/3"
            type="text"
            name="nationalite"
            label="Nationalité"
            placeholder="Votre nationalité"
            value={formData.nationalite}
            handleChange={handleChange}
            icon={<FontAwesomeIcon icon={faFlag} />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            type="button"
            onClick={handleReset}
          >
            Annuler
          </button>

          <button
            className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </ShowcaseSection>
  );
}
