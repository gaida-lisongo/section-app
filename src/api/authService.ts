import api from "./config";

interface LoginCredentials {
  email?: string;
  password?: string;
  matricule?: string;
}


interface LoginResponse {
    success: boolean;
    message?: string;
    data: {
        agent: any;
        token: string;
        agentId: string;
    };
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await fetch(`${api.API}agents/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });
        return response.json();
    }

    async verifyOtp({
        id,
        otp
    }: {id: string, otp: string}) {
        const response = await fetch(`${api.API}agents/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                otp
            }),
        });
        return response.json();
    }

    async isMemberSection({
        id}: {id: string}) {
        const response = await fetch(`${api.API}sections/agent/${id}/sections`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async getAllSections() {
        const response = await fetch(`${api.API}sections`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }
}

const authService = new AuthService();
export default authService;