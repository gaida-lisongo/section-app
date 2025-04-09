import api from "@/api/config";

class SectionService {
    // Récupérer toutes les promotions de la section
    async getAllPromotions(sectionId: string) {
        const response = await fetch(`${api.API}promotions/section/${sectionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    // Créer une nouvelle promotion
    /*
        Voici le sché ma de la requête pour créer une nouvelle promotion:
            description: String,
            sectionId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            niveau: {
                type: String,
                required: true
            },
            mention: String,
            orientation: String,
            statut: {
                type: String,
                enum: ['ACTIF', 'INACTIF'],
                default: 'ACTIF'
            }
     */
    async createPromotion(data: any) {
        const response = await fetch(`${api.API}promotions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Modifier une promotion existante
    async updatePromotion(id: string, data: any) {
        const response = await fetch(`${api.API}promotions/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Supprimer une promotion
    async deletePromotion(id: string) {
        const response = await fetch(`${api.API}promotions/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    // Récuperer toutes les unités de la section
    /*
        Voici le schéma de la requête pour récupérer toutes les unités de la section:
            {
                code: {
                    type: String,
                    required: true
                },
                designation: {
                    type: String,
                    required: true
                },
                categorie: {
                    type: String,
                    required: true
                },
                matieres: [{
                    type: Schema.Types.ObjectId,
                    ref: 'Matiere'
                }]
            }
     */
    async getAllUnites(promotionId: string) {
        const response = await fetch(`${api.API}promotions/${promotionId}/unites`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    // Créer une nouvelle unité
    async createUnite(promotionId : string, data: any) {
        const response = await fetch(`${api.API}promotions/${promotionId}/unites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Modifier une unité existante
    async updateUnite(promotionId: string, id: string, data: any) {
        console.log("Updating unite with ID:", id, "in promotion:", promotionId, "with data:", data);
        const response = await fetch(`${api.API}promotions/${promotionId}/unites/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }


    // Supprimer une unité
    async deleteUnite(promotionId: string, id: string) {
        const response = await fetch(`${api.API}promotions/${promotionId}/unites/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    // Récupérations des recettes de la section
    async getCommandesByPromotion(promotionId: string, product: string = '') {
        console.log("Fetching commandes for promotion:", promotionId, product);
        const response = await fetch(`${api.API}etudiants/commandes/product/${promotionId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ product }),
        });
        return response.json();
    }

    async getRetraitsBySection(sectionId: string) {
        const response = await fetch(`${api.API}retraits`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: "departement", ref: sectionId }),
        });
        return response.json();
    }

    async getDescripteurByUnite(uniteId: string) {
        const response = await fetch(`${api.API}descripteurs/${uniteId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async createdescripteur(uniteId: string, data: any) {
        const response = await fetch(`${api.API}descripteurs/${uniteId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async updatedescripteur(uniteId: string, data: any) {
        const response = await fetch(`${api.API}descripteurs/${uniteId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async deletedescripteur(uniteId: string) {
        const response = await fetch(`${api.API}descripteurs/${uniteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    // Récupérer les matières d'une unité
    async getMatieresByUnite(uniteId: string) {
        console.log("Fetching matieres for unite:", uniteId);
        const response = await fetch(`${api.API}matieres/unite/${uniteId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.json();
    }

    // Créer une nouvelle matière
    async createMatiere(uniteId: string, data: any) {
        const response = await fetch(`${api.API}matieres`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    // Modifier une matière existante
    async updateMatiere(id: string, data: any) {
        const response = await fetch(`${api.API}matieres/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    // Supprimer une matière
    async deleteMatiere(id: string) {
        const response = await fetch(`${api.API}matieres/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.json();
    }

    // Récupérer les charges horaires d'une matière
    async getChargesHoraires(matiereId: string) {
        const response = await fetch(`${api.API}matieres/${matiereId}/charges`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.json();
    }

    // Créer une charge horaire
    async createChargeHoraire(matiereId: string, data: any) {
        const response = await fetch(`${api.API}matieres/${matiereId}/charges`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    // Modifier une charge horaire
    async updateChargeHoraire(matiereId: string, chargeId: string, data: any) {
        const response = await fetch(`${api.API}matieres/${matiereId}/charges/${chargeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    // Supprimer une charge horaire
    async deleteChargeHoraire(matiereId: string, chargeId: string) {
        const response = await fetch(`${api.API}matieres/${matiereId}/charges/${chargeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        return response.json();
    }
}

const sectionService = new SectionService();
export default sectionService;