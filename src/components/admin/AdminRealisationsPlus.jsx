import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Edit2, Save, X, Upload, MapPin, Loader2, ArrowRight } from 'lucide-react';
import ImageCropper from '../ImageCropper';

const getDPEColor = (dpe) => {
  const colors = { 'A': 'bg-emerald-500', 'B': 'bg-green-500', 'C': 'bg-lime-500', 'D': 'bg-yellow-500', 'E': 'bg-orange-500', 'F': 'bg-red-400', 'G': 'bg-red-600' };
  return colors[dpe] || 'bg-gray-400';
};

export default function AdminRealisationsPlus() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    titre: '', location: '', lat: null, lng: null, annee: '', image_avant: '', image_apres: '', surface: '', logements: '', investissement: '', 
    dpe_avant: 'D', dpe_apres: 'B', description_avant: '', description_apres: '', travaux: '', rendement_brut: '', plus_value: '', ordre: 0, actif: true
  });
  const [geoError, setGeoError] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [cropModal, setCropModal] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoType, setPhotoType] = useState('avant');

  const { data: realisations = [] } = useQuery({
    queryKey: ['realisations-biens'],
    queryFn: () => db.RealisationBien.list('ordre', 50),
    initialData: []
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['map-locations'],
    queryFn: () => db.MapLocation.list(),
    initialData: []
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        titre: data.titre, location: data.location, lat: data.lat ? parseFloat(data.lat) : null, 
        lng: data.lng ? parseFloat(data.lng) : null, annee: data.annee, image_avant: data.image_avant, 
        image_apres: data.image_apres, surface: data.surface, logements: data.logements, investissement: data.investissement,
        dpe_avant: data.dpe_avant, dpe_apres: data.dpe_apres, description_avant: data.description_avant,
        description_apres: data.description_apres, travaux: data.travaux, rendement_brut: data.rendement_brut,
        plus_value: data.plus_value, ordre: data.ordre, actif: data.actif
      };

      if (editId) {
        return db.RealisationBien.update(editId, payload);
      } else {
        return db.RealisationBien.create(payload);
      }
    },
    onSuccess: (data) => {
      console.log('Réalisation sauvegardée:', data);
      qc.invalidateQueries({ queryKey: ['realisations-biens'] }); 
      setModal(false); 
      setEditId(null);
      setForm({ titre: '', location: '', lat: null, lng: null, annee: '', image_avant: '', image_apres: '', surface: '', logements: '', investissement: '', 
        dpe_avant: 'D', dpe_apres: 'B', description_avant: '', description_apres: '', travaux: '', rendement_brut: '', plus_value: '', ordre: 0, actif: true });
      setGeoError('');
    },
    onError: (error) => {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur : ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.RealisationBien.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['realisations-biens'] }),
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCropModal({ src: event.target.result, originalFile: file });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile) => {
    setCropModal(null);
    setUploadingPhoto(true);
    try {
      const { file_url } = await db.uploadFile(croppedFile);
      setForm({ ...form, [photoType === 'avant' ? 'image_avant' : 'image_apres']: file_url });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleGeocodeAddress = async (address) => {
    if (!address.trim()) return;
    setGeocoding(true);
    setGeoError('');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
      const data = await response.json();
      if (data && data[0]) {
        setForm({ ...form, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        setGeoError('Adresse non trouvée. Essayez une localisation plus précise.');
      }
    } catch (err) {
      setGeoError('Erreur lors de la géocodification');
    } finally {
      setGeocoding(false);
    }
  };

  const openEdit = (bien) => {
    setForm(bien);
    setEditId(bien.id);
    setModal(true);
  };

  const openNew = () => {
    setForm({ titre: '', location: '', lat: null, lng: null, annee: '', image_avant: '', image_apres: '', surface: '', logements: '', investissement: '', 
      dpe_avant: 'D', dpe_apres: 'B', description_avant: '', description_apres: '', travaux: '', rendement_brut: '', plus_value: '', ordre: 0, actif: true });
    setEditId(null);
    setGeoError('');
    setModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#1A3A52]">Gestion des Réalisations</h2>
          <p className="text-slate-500 text-sm">{realisations.length} bien{realisations.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openNew} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
          <Plus className="h-4 w-4 mr-2" /> Ajouter une réalisation
        </Button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-[#1A3A52]">{editId ? 'Modifier' : 'Ajouter'} une réalisation</h3>
              <button onClick={() => setModal(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label className="text-sm font-medium">Titre *</Label>
                   <Input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} placeholder="Ex: Vichy Rénov" />
                 </div>
                 <div>
                   <Label className="text-sm font-medium">Localisation *</Label>
                   <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Ex: Vichy, Allier" />
                 </div>
               </div>

               <div>
                 <Label className="text-sm font-medium">Adresse complète (pour la carte)</Label>
                 <div className="flex gap-2 mt-1">
                   <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="12 Rue de la Paix, 75001 Paris" />
                   <Button onClick={() => handleGeocodeAddress(form.location)} disabled={geocoding || !form.location} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold whitespace-nowrap">
                     {geocoding ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Géolocaliser'}
                   </Button>
                 </div>
                 {geoError && <p className="text-xs text-red-500 mt-1">{geoError}</p>}
                 {form.lat && form.lng && <p className="text-xs text-emerald-600 mt-1">✓ Coordonnées trouvées: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}</p>}
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label className="text-sm font-medium">Année</Label>
                   <Input type="number" value={form.annee} onChange={e => setForm({...form, annee: e.target.value})} placeholder="2025" />
                 </div>
                 <div>
                   <Label className="text-sm font-medium">Surface</Label>
                   <Input value={form.surface} onChange={e => setForm({...form, surface: e.target.value})} placeholder="1 200 m²" />
                 </div>
               </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Logements/Lots</Label>
                  <Input value={form.logements} onChange={e => setForm({...form, logements: e.target.value})} placeholder="12 lots" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Investissement</Label>
                  <Input value={form.investissement} onChange={e => setForm({...form, investissement: e.target.value})} placeholder="1 450 000 €" />
                </div>
              </div>

              {/* Photos Upload */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Photo Avant</Label>
                  <label className="mt-1 flex items-center gap-3 p-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#C9A961] transition-colors">
                    <Upload className="h-5 w-5 text-slate-400" />
                    <span className="text-sm text-slate-600">{uploadingPhoto && photoType === 'avant' ? 'Upload...' : form.image_avant ? '✓ Uploadée' : 'Cliquez'}</span>
                    <input type="file" accept="image/*" onChange={(e) => { setPhotoType('avant'); handlePhotoUpload(e); }} disabled={uploadingPhoto} className="hidden" />
                  </label>
                  {form.image_avant && <p className="text-xs text-emerald-600 mt-1 truncate">{form.image_avant}</p>}
                </div>
                <div>
                  <Label className="text-sm font-medium">Photo Après</Label>
                  <label className="mt-1 flex items-center gap-3 p-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#C9A961] transition-colors">
                    <Upload className="h-5 w-5 text-slate-400" />
                    <span className="text-sm text-slate-600">{uploadingPhoto && photoType === 'apres' ? 'Upload...' : form.image_apres ? '✓ Uploadée' : 'Cliquez'}</span>
                    <input type="file" accept="image/*" onChange={(e) => { setPhotoType('apres'); handlePhotoUpload(e); }} disabled={uploadingPhoto} className="hidden" />
                  </label>
                  {form.image_apres && <p className="text-xs text-emerald-600 mt-1 truncate">{form.image_apres}</p>}
                </div>
              </div>

              {/* Crop Modal */}
              {cropModal && (
                <Dialog open={!!cropModal} onOpenChange={(open) => { if (!open) setCropModal(null); }}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>Recadrer la photo</DialogTitle></DialogHeader>
                    <ImageCropper imageSrc={cropModal.src} onCropComplete={handleCropComplete} onCancel={() => setCropModal(null)} aspectRatio={16/9} />
                  </DialogContent>
                </Dialog>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">DPE Avant</Label>
                  <select value={form.dpe_avant} onChange={e => setForm({...form, dpe_avant: e.target.value})} className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium">DPE Après</Label>
                  <select value={form.dpe_apres} onChange={e => setForm({...form, dpe_apres: e.target.value})} className="w-full px-3 py-2 border border-input rounded-md text-sm bg-white">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Description Avant</Label>
                <Textarea rows={2} value={form.description_avant} onChange={e => setForm({...form, description_avant: e.target.value})} />
              </div>

              <div>
                <Label className="text-sm font-medium">Description Après</Label>
                <Textarea rows={2} value={form.description_apres} onChange={e => setForm({...form, description_apres: e.target.value})} />
              </div>

              <div>
                <Label className="text-sm font-medium">Travaux (séparés par virgules)</Label>
                <Input value={form.travaux} onChange={e => setForm({...form, travaux: e.target.value})} placeholder="Rénovation toiture, Isolation, ..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Rendement Brut</Label>
                  <Input value={form.rendement_brut} onChange={e => setForm({...form, rendement_brut: e.target.value})} placeholder="8,2%" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Plus-Value</Label>
                  <Input value={form.plus_value} onChange={e => setForm({...form, plus_value: e.target.value})} placeholder="+18%" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Ordre d'affichage</Label>
                  <Input type="number" value={form.ordre} onChange={e => setForm({...form, ordre: parseInt(e.target.value) || 0})} />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.actif} onChange={e => setForm({...form, actif: e.target.checked})} />
                    Afficher sur le site
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.titre} className="flex-1 bg-[#1A3A52] hover:bg-[#2A4A6F] text-white">
                <Save className="h-4 w-4 mr-2" /> {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button variant="outline" onClick={() => setModal(false)}>Annuler</Button>
            </div>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-3">
        {realisations.map(bien => (
          <div key={bien.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-shadow">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900">{bien.titre}</h4>
              <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {bien.location} • {bien.annee}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-6 h-6 ${getDPEColor(bien.dpe_avant)} text-white text-xs font-bold flex items-center justify-center rounded`}>{bien.dpe_avant}</div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
                <div className={`w-6 h-6 ${getDPEColor(bien.dpe_apres)} text-white text-xs font-bold flex items-center justify-center rounded`}>{bien.dpe_apres}</div>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${bien.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {bien.actif ? 'Visible' : 'Masqué'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(bien)} className="text-slate-400 hover:text-[#1A3A52]"><Edit2 className="h-4 w-4" /></button>
              <button onClick={() => { if (confirm(`Supprimer ${bien.titre} ?`)) deleteMutation.mutate(bien.id); }} className="text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {realisations.length === 0 && <p className="text-center text-slate-400 py-8">Aucune réalisation</p>}
      </div>
    </div>
  );
}