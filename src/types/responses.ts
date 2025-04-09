export interface Charge {
  lecons: any[];
  travaux: any[];
  examens: any[];
  rattrapages: any[];
  anneeId: {
    _id: string;
  };
  titulaire: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Matiere {
  _id: string;
  designation: string;
  code: string;
  credit: number;
  semestre: "Premier" | "Second";
  codeUnite: string;
  charges_horaires: Charge[];
  createdAt: string;
  updatedAt: string;
}

export interface Unite {
  code: string;
  designation: string;
  categorie: string;
  semestres: {
    Premier: Matiere[];
    Second: Matiere[];
  };
  totalCredits: number;
  totalMatieres: number;
}

export interface PromotionMatieres {
  unites: Unite[];
  stats: {
    totalUnites: number;
    totalMatieres: number;
    totalCredits: number;
  };
}

export interface GetMatieresByPromotionResponse {
  success: boolean;
  data: {
    success: boolean;
    data: PromotionMatieres;
  };
}