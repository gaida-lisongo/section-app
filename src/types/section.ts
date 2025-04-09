export interface Bureau {
  agentId: string;
  grade: string;
}

export interface Section {
  _id: string;
  titre: string;
  designation: string;  // Ajout de la propriété manquante
  nom: string;
  description?: string;
  code: string;
  email?: string;
  telephone?: string;
  url?: string;
  image?: string;
  chef?: string;
  adjoint?: string;
  statut: 'ACTIF' | 'INACTIF';
  bureaux: Bureau[];
  jurys?: string[];
  offres?: string[];
}

export interface SectionsResponse {
  success: boolean;
  data: Section[];
  message: string;
}