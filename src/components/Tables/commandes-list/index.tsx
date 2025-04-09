"use client";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faGraduationCap, faSpinner, faSearch } from '@fortawesome/free-solid-svg-icons';
import { usePromotionStore } from "@/store/usePromotionStore";
import { useSectionStore } from "@/store/useSectionStore";
import sectionService from "@/api/sectionService";

interface Commande {
  _id: string;
  date_created: string;
  product: string;
  montant: number;
  ref: string;
}

export function CommandesList({ className }: { className?: string }) {
  const activeSection = useSectionStore((state) => {
    const sections = state.sections;
    const activeSectionId = state.activeSectionId;
    return sections.find(s => s._id === activeSectionId);
  });
  
  const { promotions, fetchPromotions } = usePromotionStore();
  const [selectedPromotion, setSelectedPromotion] = useState<string>("");
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeSection?._id) {
      fetchPromotions(activeSection._id);
    }
  }, [activeSection, fetchPromotions]);

  useEffect(() => {
    const fetchCommandes = async () => {
      if (!selectedPromotion) return;
      console.log("Fetching commandes for promotion:", selectedPromotion);
      setLoading(true);
      try {
        const response = await sectionService.getCommandesByPromotion(selectedPromotion);
        if (response.success) {
          setCommandes(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des commandes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, [selectedPromotion]);

  const getProductColor = (product: string) => {
    return product.toLowerCase().includes('tp') 
      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
      : 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
  };

  const getProductIcon = (product: string) => {
    return product.toLowerCase().includes('tp') 
      ? faFileAlt 
      : faGraduationCap;
  };

  return (
    <div className={cn(
      "rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 sm:pb-4",
      className
    )}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-title-md2 font-bold text-dark dark:text-white">
            Liste des Commandes
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {commandes.length} commande(s) trouvée(s)
          </p>
        </div>

        <div className="relative flex w-full max-w-[300px]">
          <select
            value={selectedPromotion}
            onChange={(e) => setSelectedPromotion(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-4 pr-10 outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
          >
            <option value="">Toutes les promotions</option>
            {promotions.map((promotion) => (
              <option key={promotion._id} value={promotion._id}>
                {promotion.niveau}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            <FontAwesomeIcon icon={faSearch} className="size-4" />
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-primary" />
        </div>
      ) : (
        <>
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-2 dark:bg-meta-4 [&>th]:!py-4 [&>th]:!font-semibold">
                  <TableHead className="min-w-[150px]">Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-center">Référence</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {commandes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center text-gray-500">
                      Aucune commande trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  commandes.map((commande) => (
                    <TableRow
                      key={commande._id}
                      className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-1 dark:hover:bg-meta-4"
                    >
                      <TableCell className="py-4">
                        {format(new Date(commande.date_created), 'PPP', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-medium",
                          getProductColor(commande.product)
                        )}>
                          <FontAwesomeIcon icon={getProductIcon(commande.product)} className="size-4" />
                          {commande.product}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {standardFormat(commande.montant)} FC
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-block rounded-full bg-gray-2 px-3 py-1 text-sm font-medium dark:bg-meta-4">
                          {commande.ref}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>
              Total: {standardFormat(commandes.reduce((sum, cmd) => sum + cmd.montant, 0))} FC
            </span>
            <span>
              {commandes.length} résultat(s)
            </span>
          </div>
        </>
      )}
    </div>
  );
}