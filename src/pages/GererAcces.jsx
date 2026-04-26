import React, { useState } from 'react';
import { db } from '@/lib/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UserPlus, Trash2, Key, Users, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GererAcces({ embedded = false }) {
  const [newAccess, setNewAccess] = useState({ email: '', password: '', nom: '' });
  const [showPasswords, setShowPasswords] = useState({});
  const queryClient = useQueryClient();

  const { data: acces = [], isLoading } = useQuery({
    queryKey: ['acces-associes'],
    queryFn: () => db.AccesAssocie.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.AccesAssocie.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acces-associes'] });
      setNewAccess({ email: '', password: '', nom: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.AccesAssocie.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acces-associes'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, actif }) => db.AccesAssocie.update(id, { actif }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acces-associes'] });
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (newAccess.email && newAccess.password && newAccess.nom) {
      createMutation.mutate({ ...newAccess, actif: true });
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C9A961] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? '' : 'min-h-screen bg-slate-50 py-12'}>
      <div className={embedded ? '' : 'max-w-5xl mx-auto px-6 lg:px-8'}>
        {!embedded && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-serif text-[#1A3A52] mb-2">Gestion des Accès - Espace Associés</h1>
          <p className="text-slate-600">Gérez les accès sécurisés à l'Espace Associés</p>
        </motion.div>}

        {/* Formulaire ajout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="h-6 w-6 text-[#C9A961]" />
              <h2 className="text-xl font-semibold text-[#1A3A52]">
                Ajouter un accès associé
              </h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Nom complet</Label>
                  <Input
                    value={newAccess.nom}
                    onChange={(e) => setNewAccess({ ...newAccess, nom: e.target.value })}
                    placeholder="Jean Dupont"
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newAccess.email}
                    onChange={(e) => setNewAccess({ ...newAccess, email: e.target.value })}
                    placeholder="email@exemple.com"
                    required
                  />
                </div>
                <div>
                  <Label>Mot de passe</Label>
                  <Input
                    type="text"
                    value={newAccess.password}
                    onChange={(e) => setNewAccess({ ...newAccess, password: e.target.value })}
                    placeholder="Mot de passe sécurisé"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold"
                disabled={createMutation.isPending}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {createMutation.isPending ? 'Création...' : 'Créer l\'accès'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Liste des accès */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-[#1A3A52]" />
              <h2 className="text-xl font-semibold text-[#1A3A52]">
                Accès existants ({acces.length})
              </h2>
            </div>

            <div className="space-y-3">
              {acces.map((access) => (
                <div
                  key={access.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{access.nom}</h3>
                      {access.actif ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          Actif
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Désactivé
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{access.email}</p>
                    <div className="flex items-center gap-2">
                      <Key className="h-3 w-3 text-slate-400" />
                      <code className="text-xs text-slate-500 font-mono">
                        {showPasswords[access.id] ? access.password : '••••••••'}
                      </code>
                      <button
                        onClick={() => togglePasswordVisibility(access.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {showPasswords[access.id] ? 
                          <EyeOff className="h-3 w-3" /> : 
                          <Eye className="h-3 w-3" />
                        }
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActiveMutation.mutate({ 
                        id: access.id, 
                        actif: !access.actif 
                      })}
                      className={access.actif ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'}
                    >
                      {access.actif ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm(`Supprimer l'accès de ${access.nom} ?`)) {
                          deleteMutation.mutate(access.id);
                        }
                      }}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {acces.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  Aucun accès créé. Ajoutez un accès ci-dessus.
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• <strong>Créer un accès</strong> : Ajoutez l'email, le nom et le mot de passe de l'associé</li>
                <li>• <strong>Partager les identifiants</strong> : Communiquez l'email et le mot de passe à l'associé</li>
                <li>• <strong>Connexion</strong> : L'associé peut se connecter sur la page "Espace Associés"</li>
                <li>• <strong>Désactiver</strong> : Vous pouvez temporairement désactiver un accès sans le supprimer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}