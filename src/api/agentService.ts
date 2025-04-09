import api from "@/api/config";

class AgentService {
    async changeUserInfo({
        id,
        data
    }: {
        id: string;
        data: any;
    }) {
        const response = await fetch(`${api.API}agents/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();

    }

    async uploadImage(file: File): Promise<string> {
      // Code existant pour l'upload sur Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', api.CLOUDINARY.CLOUDINARY_UPLOAD_PRESET);
      
      console.log('Uploading to Cloudinary...', file.name);
      
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${api.CLOUDINARY.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.secure_url) {
          throw new Error("L'URL de l'image n'a pas été retournée par Cloudinary");
        }
        
        console.log('Cloudinary response:', data.secure_url);
        
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
      }
    }

    async getAgentById(id: string) {
        const response = await fetch(`${api.API}agents/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async getAllAgents() {
        const response = await fetch(`${api.API}agents`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async getAllAnnees() {
        const response = await fetch(`${api.API}annees`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async updateAnnee(id: string, data: any) {
        const response = await fetch(`${api.API}annees/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async createAnnee(data: any) {
        const response = await fetch(`${api.API}annees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async deleteAnnee(id: string) {
        const response = await fetch(`${api.API}annees/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async createAgent(data: any) {
        const response = await fetch(`${api.API}agents/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async updateAgent(id: string, data: any) {
        const response = await fetch(`${api.API}agents/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async deleteAgent(id: string) {
        const response = await fetch(`${api.API}agents/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }
}

const agentService = new AgentService();
export default agentService;
