import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

export default function AdminAcces() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', nom: '', actif: true });
  const queryClient = useQueryClient();

  // Charger les accès admin
  const { data: admins = [] } = useQuery({
    queryKey: ['acces-admin'],
    queryFn: () => db.AccesAdmin.list(),
    initialData: []
  });

  // Créer
  const createMutation = useMutation({
    mutationFn: (data) => db.AccesAdmin.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acces-admin'] });
      setShowDialog(false);
      setFormData({ email: '', password: '', nom: '', actif: true });
    },
  });

  // Mettre à jour
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.AccesAdmin.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acces-admin'] });
      setShowDialog(false);
      setEditingId(null);
      setFormData({ email: '', password: '', nom: '', actif: true });
    },
  });

  // Supprimer
  const deleteMutation = useMutation({
    mutationFn: (id) => db.AccesAdmin.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acces-admin'] });
    },
  });

  const handleSubmit = () => {
    if (!formData.email || !formData.password || !formData.nom) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (admin) => {
    setEditingId(admin.id);
    setFormData({ email: admin.email, password: admin.password, nom: admin.nom, actif: admin.actif });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({ email: '', password: '', nom: '', actif: true });
    setShowDialog(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900">Gestion des accès Admin</h3>
        <Button onClick={handleNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Admin
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Modifier l\'admin' : 'Ajouter un nouvel admin'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Nom</label>
              <Input
                type="text"
                placeholder="Nom complet"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Mot de passe</label>
              <Input
                type="password"
                placeholder="Mot de passe sécurisé"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Compte actif</label>
              <Switch
                checked={formData.actif}
                onCheckedChange={(checked) => setFormData({ ...formData, actif: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Liste */}
      <div className="bg-white rounded-lg border border-slate-200">
        {admins.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Aucun admin créé pour le moment
          </div>
        ) : (
          <div className="divide-y">
            {admins.map((admin) => (
              <div key={admin.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-900">{admin.nom}</p>
                  <p className="text-sm text-slate-600">{admin.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${admin.actif ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <span className="text-xs text-slate-600">{admin.actif ? 'Actif' : 'Inactif'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(admin)}
                  >
                    <Edit2 className="h-4 w-4 text-slate-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(admin.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}