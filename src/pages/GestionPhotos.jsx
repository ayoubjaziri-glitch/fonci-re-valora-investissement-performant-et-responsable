import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Save, Image as ImageIcon, Edit2, Crop, MapPin, Plus, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageCropper from '../components/ImageCropper';

function MapLocationsSection() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState(null);
  const emptyForm = { name: '', adresse: '', lat: '', lng: '', logements: '', dpe: '', image_url: '', actif: true };
  const [form, setForm] = useState(emptyForm);

  const { data: locations = [] } = useQuery({
    queryKey: ['map-locations'],
    queryFn: () => base44.entities.MapLocation.list(),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
      return editId ? base44.entities.MapLocation.update(editId, payload) : base44.entities.MapLocation.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['map-locations'] }); setModal(false); setEditId(null); setForm(emptyForm); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MapLocation.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['map-locations'] }),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, actif }) => base44.entities.MapLocation.update(id, { actif }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['map-locations'] }),
  });

  const handleFileUpload = async (file) => {
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, image_url: file_url }));
    setUploading(false);
  };

  const openEdit = (loc) => {
    setEditId(loc.id);
    setForm({ name: loc.name, adresse: loc.adresse, lat: loc.lat, lng: loc.lng, logements: loc.logements || '', dpe: loc.dpe || '', image_url: loc.image_url || '', actif: loc.actif });
    setModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-[#C9A961]" />
          <h2 className="text-xl font-semibold text-[#1A3A52]">Localisations sur la Carte</h2>
        </div>
        <Button onClick={() => { setEditId(null); setForm(emptyForm); setModal(true); }} className="bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
          <Plus className="h-4 w-4 mr-2" /> Ajouter un lieu
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {locations.map(loc => (
          <Card key={loc.id} className={`p-4 ${!loc.actif ? 'opacity-50' : ''}`}>
            <div className="flex gap-3">
              {loc.image_url && (
                <img src={loc.image_url} alt={loc.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1A3A52] text-sm truncate">{loc.name}</h3>
                <p className="text-xs text-slate-500 mt-1 truncate">{loc.adresse}</p>
                <div className="flex items-center gap-2 mt-1">
                  {loc.logements && <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">{loc.logements}</span>}
                  {loc.dpe && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">DPE {loc.dpe}</span>}
                </div>
                <p className="text-xs text-slate-400 mt-1">{loc.lat}, {loc.lng}</p>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => openEdit(loc)} className="text-slate-400 hover:text-[#1A3A52]"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => toggleActive.mutate({ id: loc.id, actif: !loc.actif })} className={`text-xs px-1 py-0.5 rounded ${loc.actif ? 'text-emerald-600' : 'text-slate-400'}`}>{loc.actif ? '✓' : '○'}</button>
                <button onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(loc.id); }} className="text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </Card>
        ))}
        {locations.length === 0 && <p className="col-span-full text-center text-slate-400 py-8">Aucune localisation. Ajoutez-en une.</p>}
      </div>

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Modifier' : 'Ajouter'} une localisation</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nom de l'immeuble</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1" /></div>
            <div><Label>Adresse complète</Label><Input value={form.adresse} onChange={e => setForm({...form, adresse: e.target.value})} placeholder="12 Rue de la Paix, 75001 Paris" className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Latitude</Label><Input type="number" step="0.000001" value={form.lat} onChange={e => setForm({...form, lat: e.target.value})} placeholder="48.8566" className="mt-1" /></div>
              <div><Label>Longitude</Label><Input type="number" step="0.000001" value={form.lng} onChange={e => setForm({...form, lng: e.target.value})} placeholder="2.3522" className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Logements</Label><Input value={form.logements} onChange={e => setForm({...form, logements: e.target.value})} placeholder="12 logements" className="mt-1" /></div>
              <div><Label>DPE</Label><Input value={form.dpe} onChange={e => setForm({...form, dpe: e.target.value})} placeholder="A, B, C..." className="mt-1" /></div>
            </div>
            <div>
              <Label>Photo de l'immeuble</Label>
              <div className="mt-1 space-y-2">
                <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://... ou uploader ci-dessous" />
                <label className="flex items-center gap-3 p-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#C9A961] transition-colors">
                  <Upload className="h-5 w-5 text-slate-400" />
                  <span className="text-sm text-slate-600">{uploading ? 'Upload en cours...' : 'Uploader une photo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} disabled={uploading} />
                </label>
                {form.image_url && <img src={form.image_url} alt="preview" className="w-full h-32 object-cover rounded-lg" />}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => saveMutation.mutate(form)} className="flex-1 bg-[#1A3A52] text-white" disabled={!form.name || !form.lat || !form.lng}>
                <Save className="h-4 w-4 mr-2" />{editId ? 'Mettre à jour' : 'Créer'}
              </Button>
              <Button variant="outline" onClick={() => setModal(false)}><X className="h-4 w-4" /></Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoryTab({ categoryKey, groupedImages, editingImage, newUrl, setNewUrl, setEditingImage, handleUrlUpdate, handleFileUpload, uploading }) {
  return (
    <TabsContent value={categoryKey}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupedImages[categoryKey]?.map((image) => (
          <Card key={image.id} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-200">
              <img src={image.url} alt={image.description} className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Non+disponible'; }} />
            </div>
            <div>
              <h3 className="font-semibold text-[#1A3A52] mb-1">{image.description}</h3>
              <p className="text-xs text-slate-500 break-all">{image.key}</p>
            </div>
            {editingImage === image.id ? (
              <div className="space-y-3">
                <div>
                  <Label>Nouvelle URL</Label>
                  <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="mt-1" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleUrlUpdate(image.id)} className="flex-1 bg-[#C9A961] hover:bg-[#B8994F]" disabled={!newUrl.trim()}>
                    <Save className="w-4 h-4 mr-2" /> Enregistrer
                  </Button>
                  <Button onClick={() => { setEditingImage(null); setNewUrl(''); }} variant="outline">Annuler</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button onClick={() => { setEditingImage(image.id); setNewUrl(image.url); }} variant="outline" className="w-full">
                  <Edit2 className="w-4 h-4 mr-2" /> Modifier l'URL
                </Button>
                <div className="relative">
                  <input type="file" accept="image/*"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(image.id, f); }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
                  <Button className="w-full bg-[#1A3A52] hover:bg-[#2A4A6F]" disabled={uploading}>
                    <Upload className="w-4 h-4 mr-2" /> {uploading ? 'Upload en cours...' : 'Uploader une photo'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
        {(!groupedImages[categoryKey] || groupedImages[categoryKey].length === 0) && (
          <div className="col-span-full text-center py-12 text-slate-500">Aucune image dans cette catégorie</div>
        )}
      </div>
    </TabsContent>
  );
}

export default function GestionPhotos({ embedded = false }) {
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [newUrl, setNewUrl] = useState('');
  const [cropModal, setCropModal] = useState(null); // { imageId, src }
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['site-images'],
    queryFn: () => base44.entities.SiteImage.list(),
  });

  const updateImageMutation = useMutation({
    mutationFn: ({ id, url }) => base44.entities.SiteImage.update(id, { url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-images'] });
      setEditingImage(null);
      setNewUrl('');
    },
  });

  const handleFileUpload = async (imageId, file) => {
    // Show cropper first
    const reader = new FileReader();
    reader.onload = (e) => {
      setCropModal({ imageId, src: e.target.result, originalFile: file });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile) => {
    const { imageId } = cropModal;
    setCropModal(null);
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: croppedFile });
      await updateImageMutation.mutateAsync({ id: imageId, url: file_url });
    } catch (error) {
      alert('Erreur lors de l\'upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlUpdate = (imageId) => {
    if (newUrl.trim()) {
      updateImageMutation.mutate({ id: imageId, url: newUrl });
    }
  };

  const groupedImages = images.reduce((acc, img) => {
    if (!acc[img.category]) acc[img.category] = [];
    acc[img.category].push(img);
    return acc;
  }, {});

  const categories = {
    hero: { label: "Images Hero", icon: "🎯" },
    equipe: { label: "Photos Équipe", icon: "👥" },
    realisations: { label: "Photos Réalisations", icon: "🏢" },
    services: { label: "Photos Services", icon: "⚙️" },
    autres: { label: "Autres Photos", icon: "📸" }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C9A961] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? '' : 'min-h-screen bg-slate-50 py-12'}>
      <div className={embedded ? '' : 'max-w-7xl mx-auto px-6 lg:px-8'}>
        {!embedded && <div className="mb-8">
          <h1 className="text-3xl font-serif text-[#1A3A52] mb-2">Gestion des Photos du Site</h1>
          <p className="text-slate-600">Modifiez facilement toutes les photos du site sans toucher au code</p>
        </div>}

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl">
            {Object.entries(categories).filter(([key]) => key !== 'equipe').map(([key, { label, icon }]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="hidden md:inline">{label}</span>
              </TabsTrigger>
            ))}
            <TabsTrigger value="carte" className="flex items-center gap-2">
              <span>🗺️</span>
              <span className="hidden md:inline">Carte</span>
            </TabsTrigger>
          </TabsList>

          <CategoryTab categoryKey="hero" groupedImages={groupedImages} editingImage={editingImage} newUrl={newUrl} setNewUrl={setNewUrl} setEditingImage={setEditingImage} handleUrlUpdate={handleUrlUpdate} handleFileUpload={handleFileUpload} uploading={uploading} />
          <CategoryTab categoryKey="realisations" groupedImages={groupedImages} editingImage={editingImage} newUrl={newUrl} setNewUrl={setNewUrl} setEditingImage={setEditingImage} handleUrlUpdate={handleUrlUpdate} handleFileUpload={handleFileUpload} uploading={uploading} />
          <CategoryTab categoryKey="services" groupedImages={groupedImages} editingImage={editingImage} newUrl={newUrl} setNewUrl={setNewUrl} setEditingImage={setEditingImage} handleUrlUpdate={handleUrlUpdate} handleFileUpload={handleFileUpload} uploading={uploading} />
          <CategoryTab categoryKey="autres" groupedImages={groupedImages} editingImage={editingImage} newUrl={newUrl} setNewUrl={setNewUrl} setEditingImage={setEditingImage} handleUrlUpdate={handleFileUpload} uploading={uploading} />
          <TabsContent value="carte">
            <MapLocationsSection />
          </TabsContent>
        </Tabs>

        {/* Crop Modal */}
        <Dialog open={!!cropModal} onOpenChange={(open) => { if (!open) setCropModal(null); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#1A3A52]">
                <Crop className="w-5 h-5 text-[#C9A961]" />
                Recadrer l'image
              </DialogTitle>
            </DialogHeader>
            {cropModal && (
              <ImageCropper
                imageSrc={cropModal.src}
                onCropComplete={handleCropComplete}
                onCancel={() => setCropModal(null)}
                aspectRatio={16/9}
              />
            )}
          </DialogContent>
        </Dialog>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Comment ça marche ?
          </h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• <strong>Uploader une photo</strong> : Cliquez sur "Uploader une photo", puis recadrez l'image avant de valider</li>
            <li>• <strong>Recadrage</strong> : Déplacez l'image avec la souris et zoomez pour ajuster le cadrage</li>
            <li>• <strong>Modifier l'URL</strong> : Cliquez sur "Modifier l'URL" pour coller une URL d'image existante</li>
            <li>• <strong>Changements instantanés</strong> : Les modifications sont appliquées immédiatement sur le site</li>
          </ul>
        </div>
      </div>
    </div>
  );
}