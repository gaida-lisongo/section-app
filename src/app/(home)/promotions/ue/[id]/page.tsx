"use client";
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import sectionService from '@/api/sectionService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faBook, 
  faGraduationCap,
  faPlus,
  faTrash,
  faPen,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Descripteur {
  objectifs: string[];
  contenu: string[];
  competences: string[];
  approchePed: string[];
  evaluation: string[];
}

export default function UEDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const uniteId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? '';
  
  const [ue] = useState({
    _id: uniteId,
    code: searchParams.get('code'),
    designation: searchParams.get('designation'),
    categorie: searchParams.get('categorie')
  });

  const [loading, setLoading] = useState(true);
  const [descripteur, setDescripteur] = useState<Descripteur>({
    objectifs: [],
    contenu: [],
    competences: [],
    approchePed: [],
    evaluation: []
  });
  const [editingField, setEditingField] = useState<keyof Descripteur | null>(null);
  const [newItems, setNewItems] = useState<{ [K in keyof Descripteur]: string }>({
    objectifs: '',
    contenu: '',
    competences: '',
    approchePed: '',
    evaluation: ''
  });

  // Ne charger que le descripteur au démarrage
  useEffect(() => {
    const fetchDescripteur = async () => {
      if (!uniteId) {
        toast.error("ID de l'unité invalide");
        return;
      }

      setLoading(true);
      try {
        const response = await sectionService.getDescripteurByUnite(uniteId);
        
        if (response.success) {
          // Si un descripteur existe, on l'utilise
          if (response.data) {
            setDescripteur(response.data);
          } else {
            // Si aucun descripteur n'existe, on en crée un nouveau
            const newDescripteur = {
              objectifs: [],
              contenu: [],
              competences: [],
              approchePed: [],
              evaluation: []
            };
            
            const createResponse = await sectionService.createdescripteur(uniteId, newDescripteur);
            
            if (createResponse.success) {
              setDescripteur(createResponse.data);
              toast.success('Nouveau descripteur créé avec succès');
            } else {
              throw new Error('Erreur lors de la création du descripteur');
            }
          }
        } else {
          throw new Error(response.message || 'Erreur lors du chargement du descripteur');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error("Erreur lors du chargement du descripteur");
      } finally {
        setLoading(false);
      }
    };

    fetchDescripteur();
  }, [uniteId]);

  const handleAddItem = async (field: keyof Descripteur) => {
    if (!newItems[field].trim() || !uniteId) return;
    
    try {
      // S'assurer que le descripteur existe
      const currentDescripteur = descripteur || {
        objectifs: [],
        contenu: [],
        competences: [],
        approchePed: [],
        evaluation: []
      };

      const updatedDescripteur = {
        ...currentDescripteur,
        [field]: [...(currentDescripteur[field] || []), newItems[field].trim()]
      };

      const response = await sectionService.updatedescripteur(uniteId, updatedDescripteur);
      
      if (response.success) {
        setDescripteur(updatedDescripteur);
        setNewItems(prev => ({ ...prev, [field]: '' }));
        toast.success('Élément ajouté avec succès');
      } else {
        throw new Error(response.message || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erreur lors de l'ajout de l'élément");
    }
  };

  const handleDeleteItem = async (field: keyof Descripteur, index: number) => {
    if (!uniteId) return;

    try {
      // Créer une copie du descripteur sans l'élément à supprimer
      const updatedDescripteur = {
        ...descripteur,
        [field]: descripteur[field].filter((_, i) => i !== index)
      };

      // Mettre à jour en base de données
      const response = await sectionService.updatedescripteur(uniteId, updatedDescripteur);
      
      if (response.success) {
        // Mettre à jour le state local uniquement si la persistance a réussi
        setDescripteur(updatedDescripteur);
        toast.success('Élément supprimé avec succès');
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erreur lors de la suppression de l'élément");
    }
  };

  const renderTabSection = (field: keyof Descripteur) => (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <input
          type="text"
          value={newItems[field]}
          onChange={(e) => setNewItems(prev => ({ 
            ...prev, 
            [field]: e.target.value 
          }))}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddItem(field);
            }
          }}
          className="flex-1 rounded-lg border border-stroke bg-white dark:bg-gray-800 px-4 py-2 focus:border-primary dark:border-dark-3"
          placeholder={`Ajouter un nouvel élément...`}
        />
        <button
          onClick={() => handleAddItem(field)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          <FontAwesomeIcon icon={faPlus} />
          Ajouter
        </button>
      </div>

      <ul className="space-y-2">
        {descripteur && descripteur[field].map((item, index) => (
          <li 
            key={index}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <span className="text-gray-700 dark:text-gray-300">{item}</span>
            <button
              onClick={() => handleDeleteItem(field, index)}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
        {descripteur && descripteur[field].length === 0 && (
          <li className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            Aucun élément dans cette section
          </li>
        )}
      </ul>
    </div>
  );

  if (loading) return <div>Chargement...</div>;
  if (!ue) return <div>Unité d'enseignement non trouvée</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Bannière de l'UE */}
        <div className="relative h-[200px] overflow-hidden rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="relative z-10 h-full flex flex-col justify-between p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {ue.code} - {ue.designation}
                </h1>
                <p className="mt-2 text-lg text-gray-100">
                  Catégorie: {ue.categorie}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/promotions/ue"
                  className="text-white hover:text-gray-200"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  Retour
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Tabs defaultValue="objectifs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-4 bg-gray-100 dark:bg-gray-900 rounded-lg p-2">
              <TabsTrigger 
                value="objectifs"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Objectifs
              </TabsTrigger>
              <TabsTrigger 
                value="contenu"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Contenu
              </TabsTrigger>
              <TabsTrigger 
                value="competences"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Compétences
              </TabsTrigger>
              <TabsTrigger 
                value="approchePed"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Approche pédagogique
              </TabsTrigger>
              <TabsTrigger 
                value="evaluation"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Évaluation
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="objectifs">
                {renderTabSection('objectifs')}
              </TabsContent>
              <TabsContent value="contenu">
                {renderTabSection('contenu')}
              </TabsContent>
              <TabsContent value="competences">
                {renderTabSection('competences')}
              </TabsContent>
              <TabsContent value="approchePed">
                {renderTabSection('approchePed')}
              </TabsContent>
              <TabsContent value="evaluation">
                {renderTabSection('evaluation')}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}