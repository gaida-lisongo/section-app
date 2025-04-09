"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { useSectionStore } from '@/store/useSectionStore';
import authService from '@/api/authService';
import Cookies from 'js-cookie';
import InputGroup from '../FormElements/InputGroup';

interface Section {
  _id: string;
  titre: string;
  description: string;
  email: string;
  url: string;
  telephone?: string;
  bureaux: Array<{
    grade: string;
    agentId: string;
    _id: string;
  }>;
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

interface SectionsResponse {
  success: boolean;
  data: Section[];
}

interface Section {
  _id: string;
  titre: string;
  description: string;
  email: string;
  url: string;
  bureaux: Array<{
    grade: string;
    agentId: string;
    _id: string;
  }>;
}

export default function SigninWithPassword() {
  const router = useRouter();
  const [step, setStep] = useState<'matricule' | 'otp'>('matricule');
  const [data, setData] = useState({
    matricule: "",
    otp: "",
    agentId: "",
  });

  const login = useAuthStore((state) => state.login);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allSections, setAllSections] = useState([]);
  const {setSections, sections} = useSectionStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitMatricule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await authService.login({ matricule: data.matricule });
      console.log(response);
      if (response.success) {
        
        setData(prev => ({
          ...prev,
          agentId: response.data.agentId
        }));
        setStep('otp');

      } else {
        setError("Matricule invalide");
      }
    } catch (error) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  
  const handleSubmitOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await authService.verifyOtp({
        id: data.agentId,
        otp: data.otp
      });
      console.log("Statut response : ", response.success);
      if (response.success) {
        // Sauvegarder le token dans le cookie
        Cookies.set('auth-token', response.data.token, {
          expires: 1, // expire dans 1 jour
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
      console.log(response.data.agent);
        // Stocker les données de l'utilisateur dans le store
        login({
          agent: response.data.agent,
          token: response.data.token
        });
        
        // Redirection vers la page d'accueil
        router.push('/');
      } else {
        setError("Code OTP invalide");
      }
    } catch (error) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const listSections = async () => {
      const response = await authService.getAllSections();
      console.log(response);
      if (response.success) {
        setAllSections(response.data);
      }
    }

    listSections();

    return () => {
      setAllSections([]);
    }
  }, []);

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-500">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Sections disponibles:</h3>
        <div className="space-y-2">
          {allSections.map((section: Section) => (
            <div key={section._id} className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium">{section.titre}</h4>
              <p className="text-sm text-gray-600">{section.description}</p>
              <div className="mt-1 text-sm text-gray-500">
                <span>Email: {section.email}</span>
                {section.telephone && (
                  <span className="ml-4">Tel: {section.telephone}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {step === 'matricule' ? (
        <form onSubmit={handleSubmitMatricule}>
          <InputGroup
            type="text"
            label="Matricule"
            className="mb-4 [&_input]:py-[15px]"
            placeholder="Entrez votre matricule"
            name="matricule"
            handleChange={handleChange}
            value={data.matricule}
          />

          <div className="mb-4.5">
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
            >
              Envoyer le code
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitOTP}>
          <InputGroup
            type="text"
            label="Code OTP"
            className="mb-4 [&_input]:py-[15px]"
            placeholder="Entrez le code reçu par email"
            name="otp"
            handleChange={handleChange}
            value={data.otp}
          />

          <div className="mb-4.5">
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
            >
              Vérifier
              {loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
