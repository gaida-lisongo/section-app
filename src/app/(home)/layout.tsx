import {Sidebar} from "@/components/Layouts/sidebar";
import { ReactNode } from 'react';
import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | INBT Section Manager",
    default: "INBT Section Manager",
  },
  description:
    "Application de gestion des sections pour l'Institut National du Bâtiment et des Travaux Publics",
  icons: {
    icon: "/public/favicon.ico",
    shortcut: "/public/favicon.ico",
    apple: "/public/apple-touch-icon.png",
  },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (

          <div className="flex min-h-screen">
            <Sidebar />

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />

              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
              </main>
            </div>
          </div>
  );
}
