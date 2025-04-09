import api from "@/api/config";

class EnrollementService {
    async getAllEnrollements(promotionId: string) {
        const response = await fetch(`${api.API}enrollements/promotion/${promotionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async setCoursEnrollement($id: string, data: {action: ['add' | 'remove'], cours: string}) {
        const response = await fetch(`${api.API}enrollements/${$id}/cours`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async setEnrollement(id: string, data: any) {
        const response = await fetch(`${api.API}enrollements/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async deleteEnrollement(id: string) {
        const response = await fetch(`${api.API}enrollements/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async createEnrollement(data: any) {
        const response = await fetch(`${api.API}enrollements`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

}

const enrollementService = new EnrollementService();
export default enrollementService;