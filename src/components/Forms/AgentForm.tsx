"use client";

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import agentService from '@/api/agentService';

interface AgentFormProps {
  agent: {
    _id: string;
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
    sexe?: 'M' | 'F';
    lieuNaissance?: string;
    adresse?: string;
  };
  onSuccess: () => void;
}

export function AgentForm({ agent, onSuccess }: AgentFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nom: agent.nom,
    prenom: agent.prenom,
    email: agent.email || '',
    telephone: agent.telephone || '',
    sexe: agent.sexe || 'M',
    lieuNaissance: agent.lieuNaissance || '',
    adresse: agent.adresse || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await agentService.updateAgent(agent._id, form);

      if (response.success) {
        toast.success('Informations mises à jour avec succès');
        onSuccess();
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            value={form.nom}
            onChange={(e) => setForm(prev => ({ ...prev, nom: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prénom</label>
          <input
            type="text"
            value={form.prenom}
            onChange={(e) => setForm(prev => ({ ...prev, prenom: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            type="tel"
            value={form.telephone}
            onChange={(e) => setForm(prev => ({ ...prev, telephone: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sexe</label>
          <select
            value={form.sexe}
            onChange={(e) => setForm(prev => ({ ...prev, sexe: e.target.value as 'M' | 'F' }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700"
            required
          >
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lieu de naissance</label>
          <input
            type="text"
            value={form.lieuNaissance}
            onChange={(e) => setForm(prev => ({ ...prev, lieuNaissance: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Adresse</label>
          <input
            type="text"
            value={form.adresse}
            onChange={(e) => setForm(prev => ({ ...prev, adresse: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 dark:bg-gray-700"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
              Mise à jour...
            </>
          ) : (
            'Mettre à jour'
          )}
        </button>
      </div>
    </form>
  );
}