export interface Bureau {
  agentId: string;
  grade: string;
}

export interface Section {
  _id: string;
  titre: string;
  description: string;
  designation?: string;
  email: string;
  url: string;
  telephone?: string;
  bureaux: Array<{
    grade: string;
    agentId: string;
    _id: string;
  }>;
}

export interface SectionsResponse {
  success: boolean;
  data: Section[];
  message: string;
}