"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faUserGraduate } from "@fortawesome/free-solid-svg-icons";

export default function EnseignantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <Link href="/" className="hover:text-primary">
              Accueil
            </Link>
            <FontAwesomeIcon 
              icon={faChevronRight} 
              className="h-3 w-3" 
            />
            <Link href="/enseignants" className="hover:text-primary">
              Enseignants
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}