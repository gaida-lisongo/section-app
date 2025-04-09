export interface Cours {
  _id: string;
  designation: string;
  code: string;
  credit: number;
  semestre: "Premier" | "Second";
  codeUnite: string;
  charges_horaires: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Enrollement {
  _id: string;
  date_fin: string;
  promotionId: {
    _id: string;
    sectionId: string;
    niveau: string;
    mention: string;
    orientation: string;
    statut: 'ACTIF' | 'INACTIF';
    unites: Array<{
      code: string;
      designation: string;
      categorie: string;
      matieres: any[];
      _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
  designation: string;
  montant: number;
  description: string;
  cours: Cours[];
  date_created: string;
  createdAt: string;
  updatedAt: string;
}