"use client";
import { UploadIcon } from "@/assets/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Image from "next/image";
import { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import agentService from "@/api/agentService";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

export function UploadPhotoForm() {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const agent = useAuthStore((state) => state.agent);
  const updateUserInfo = useAuthStore((state) => state.updateUserInfo);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload to Cloudinary
      const imageUrl = await agentService.uploadImage(file);
      
      // Update user info with new avatar
      await updateUserInfo({
        ...agent,
        dateNaissance: agent?.dateNaissance ? 
                  format(new Date(agent.dateNaissance), 'dd/MM/yyyy', { locale: fr }) : "",
        avatar: imageUrl
      });
      
      toast.success("Photo de profil mise à jour avec succès");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Erreur lors de la mise à jour de la photo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await updateUserInfo({
        avatar: null // Maintenant c'est valide
      });
      toast.success("Photo de profil supprimée");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la photo");
    }
  };

  return (
    <ShowcaseSection title="Photo de profil" className="!p-7">
      <form>
        <div className="mb-4 flex items-center gap-3">
          <Image
            src={agent?.avatar || "/images/user/user-default.png"}
            width={55}
            height={55}
            alt="Photo de profil"
            className="size-14 rounded-full object-cover"
            quality={90}
          />

          <div>
            <span className="mb-1.5 font-medium text-dark dark:text-white">
              Modifier votre photo
            </span>
            <span className="flex gap-3">
              <button 
                type="button" 
                className="text-body-sm hover:text-red"
                onClick={handleRemovePhoto}
              >
                Supprimer
              </button>
            </span>
          </div>
        </div>

        <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
          <input
            type="file"
            name="profilePhoto"
            id="profilePhoto"
            accept="image/png, image/jpg, image/jpeg"
            hidden
            onChange={handleFileChange}
            disabled={uploading}
          />

          <label
            htmlFor="profilePhoto"
            className="flex cursor-pointer flex-col items-center justify-center p-4 sm:py-7.5"
          >
            <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
              {uploading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <UploadIcon />
              )}
            </div>

            <p className="mt-2.5 text-body-sm font-medium">
              <span className="text-primary">Cliquez pour télécharger</span> ou glissez-déposez
            </p>

            <p className="mt-1 text-body-xs">
              SVG, PNG, JPG ou GIF (max. 800 X 800px)
            </p>
          </label>
        </div>
      </form>
    </ShowcaseSection>
  );
}
