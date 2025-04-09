import api from "@/api/config";

class JuryService {
    // Get all juries
    async getAllJurys(){
        const response = await fetch(`${api.API}jurys`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    // Create a new jury
    async createJury(data: any) {
        const response = await fetch(`${api.API}jurys`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }


    // Get a jury by ID
    async getJuryById(id: string) {
        const response = await fetch(`${api.API}jurys/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }


    // Update a jury by ID
    async updateJury(id: string, data: any) {
        const response = await fetch(`${api.API}jurys/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Delete a jury by ID
    async deleteJury(id: string) {
        const response = await fetch(`${api.API}jurys/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }


    // set Promotions in Jury
    async setPromotionsInJury(juryId: string, promotions: any[]) {
        const response = await fetch(`${api.API}jurys/${juryId}/promotions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ promotions }),
        });
        return response.json();
    }

    // Set Bureaux Jurys
    async setBureauxJurys(juryId: string, bureaux: any[]) {
        const response = await fetch(`${api.API}jurys/${juryId}/bureaux`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bureaux }),
        });
        return response.json();
    }

}

const juryService = new JuryService();
export default juryService;