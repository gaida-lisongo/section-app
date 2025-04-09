export interface PromotionInput {
  sectionId: string;
  niveau: string;
  mention: string;
  orientation: string;
  description: string;
}

export interface Unite {
  _id: string;
  code: string;
  designation: string;
  categorie: string;
  matieres?: string[];
}

export interface Promotion extends PromotionInput {
  _id: string;
  statut: 'ACTIF' | 'INACTIF';
  unites?: Unite[];
}

export interface PromotionsResponse {
  success: boolean;
  data: Promotion[];
  message: string;
}