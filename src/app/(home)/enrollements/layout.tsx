"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

export default function EnrollementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Bannière */}
      <div className="relative bg-white dark:bg-gray-800 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
        <div className="absolute inset-0 bg-[url('/images/banner/admin-inbtp.jpeg')] opacity-10 bg-cover bg-center" />
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner">
              <FontAwesomeIcon 
                icon={faGraduationCap} 
                className="text-3xl text-primary" 
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestion des Enrollements
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                Inscriptions aux cours et gestion des frais académiques
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fil d'Ariane */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-primary transition-colors">
              Accueil
            </Link>
            <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
            <Link href="/enrollements" className="hover:text-primary transition-colors">
              Enrollements
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}