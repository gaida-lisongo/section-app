import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Image from "next/image";
import logo from "@/../public/images/logo/logo-inbtp.png";
import inbtp from "@/../public/images/banner/admin-inbtp.jpeg";
import Link from "next/link";

export const metadata: Metadata = {
  title: "INBTP Section Manager - Connexion",
  description: "Portail de gestion académique de l'Institut National du Bâtiment et des Travaux Publics, votre centre d'excellence en formation d'ingénieurs.",
};

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:bg-gray-dark dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
        <div className="flex flex-wrap items-stretch">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <Signin />
            </div>
          </div>

          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="h-full custom-gradient-1 overflow-hidden rounded-r-2xl p-12.5 dark:!bg-dark-2 dark:bg-none">
              <Link 
                className="mb-10 inline-block transition-transform hover:scale-105" 
                href="/"
              >
                <Image
                  src={logo}
                  alt="INBTP Logo"
                  width={176}
                  height={32}
                  priority
                  className="drop-shadow-md"
                />
              </Link>

              <h1 className="mb-6 text-3xl font-bold text-dark dark:text-white sm:text-heading-3">
                Bienvenue sur INBTP Section Manager
              </h1>

              <div className="space-y-6">
                <p className="font-medium text-dark-4 dark:text-dark-6">
                  L'Institut National du Bâtiment et des Travaux Publics (INBTP) est un établissement 
                  d'excellence dédié à la formation des futurs ingénieurs et cadres du secteur de la construction.
                </p>

                <div className="space-y-4">
                  <p className="font-medium text-dark-4 dark:text-dark-6">
                    Cette plateforme vous permet de gérer efficacement :
                  </p>

                  <ul className="list-disc pl-5 space-y-3 font-medium text-dark-4 dark:text-dark-6">
                    <li className="transition-all hover:translate-x-1">Les promotions et unités d'enseignement</li>
                    <li className="transition-all hover:translate-x-1">Le suivi académique des étudiants</li>
                    <li className="transition-all hover:translate-x-1">Les jurys et délibérations</li>
                    <li className="transition-all hover:translate-x-1">Les charges horaires des enseignants</li>
                  </ul>
                </div>
              </div>

              <div className="mt-10">
                <Image
                  src={inbtp}
                  alt="INBTP Campus"
                  width={405}
                  height={325}
                  className="rounded-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-[1.02]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
