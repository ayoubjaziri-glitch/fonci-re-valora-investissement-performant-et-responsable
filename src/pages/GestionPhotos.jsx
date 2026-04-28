import React, { useState } from 'react';
import { db, supabase } from '@/lib/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Save, Image as ImageIcon, Edit2, Crop, Home, TrendingUp, Briefcase, Users, Globe, Leaf, Building2, Star, ExternalLink } from 'lucide-react';

import ImageCropper from '../components/ImageCropper';

// Mapping clé image → page du site
const PAGES = [
  {
    id: 'global',
    label: 'Éléments globaux',
    icon: Star,
    keys: ['logo'],
  },
  {
    id: 'accueil',
    label: 'Page Accueil',
    icon: Home,
    keys: ['hero_home', 'hero_home_bg', 'hero_main', 'durabilite_home', 'service_souscription', 'service_sourcing', 'service_asset', 'photo_ayoub', 'photo_sophian', 'photo_renaud'],
  },
  {
    id: 'portefeuille',
    label: 'Portefeuille d\'actifs',
    icon: Building2,
    keys: [],
    special: 'portefeuille',
  },
  {
    id: 'strategie',
    label: 'Page Stratégie',
    icon: TrendingUp,
    keys: ['hero_strategie', 'strategie_hero'],
  },
  {
    id: 'missions',
    label: 'Page Nos Missions',
    icon: Briefcase,
    keys: ['services_hero', 'service_sourcing', 'service_asset', 'service_souscription'],
  },
  {
    id: 'equipe',
    label: 'Page Notre Histoire',
    icon: Users,
    keys: ['photo_ayoub', 'photo_christophe', 'photo_renaud', 'photo_marie', 'photo_thomas', 'photo_sophie', 'photo_lucas'],
  },
  {
    id: 'partenaires',
    label: 'Page Écosystème',
    icon: Globe,
    keys: ['partenaires_hero', 'hero_partenaires', 'ecosysteme_citation_photo'],
  },
  {
    id: 'durabilite',
    label: 'Page Durabilité',
    icon: Leaf,
    keys: ['hero_durabilite', 'immeuble_durable'],
  },
  {
    id: 'realisations',
    label: 'Page Nos Biens',
    icon: Building2,
    keys: [],
    special: 'realisations',
  },
];

function ImageCard({ image, editingImage, newUrl, setNewUrl, setEditingImage, handleUrlUpdate, handleFileUpload, uploading }) {
  const isEditing = editingImage === image.id;
  return (
    <Card className="p-5 space-y-4 hover:shadow-lg transition-shadow">
      <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-100">
        <img src={image.url} alt={image.description} className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Non+disponible'; }} />
      </div>
      <div>
        <h3 className="font-semibold text-[#1A3A52] text-sm mb-0.5">{image.description}</h3>
        <p className="text-xs text-slate-400 font-mono">{image.key}</p>
      </div>
      {isEditing ? (
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
          <Button onClick={() => { setEditingImage(image.id); setNewUrl(image.url); }} variant="outline" className="w-full text-sm">
            <Edit2 className="w-4 h-4 mr-2" /> Modifier l'URL
          </Button>
          <div className="relative">
            <input type="file" accept="image/*"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(image.id, f); }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
            <Button className="w-full bg-[#1A3A52] hover:bg-[#2A4A6F] text-sm" disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" /> {uploading ? 'Upload...' : 'Uploader une photo'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function RealisationsBiensSection() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(null); // { id, type }
  const [cropModal, setCropModal] = useState(null);

  const { data: biens = [] } = useQuery({
    queryKey: ['realisations-biens-photos'],
    queryFn: () => db.RealisationBien.list('ordre', 50),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.RealisationBien.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realisations-biens-photos'] });
      queryClient.invalidateQueries({ queryKey: ['realisations-biens'] });
    }
  });

  const handleFileUpload = (bienId, type, file) => {
    const reader = new FileReader();
    reader.onload = (e) => setCropModal({ bienId, type, src: e.target.result });
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile) => {
    const { bienId, type } = cropModal;
    setCropModal(null);
    setUploading({ id: bienId, type });
    try {
      const result = await base44.integrations.Core.UploadFile({ file: croppedFile });
      const publicUrl = result.file_url;
      await updateMutation.mutateAsync({ id: bienId, data: { [type === 'avant' ? 'image_avant' : 'image_apres']: publicUrl } });
      setUploading(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(null);
    }
  };

  const biensActifs = biens.filter(b => b.actif !== false);

  return (
    <div>
      <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
        <strong>✓ Synchronisé avec la galerie accueil</strong> — Uploadez les photos Avant/Après de chaque bien. Elles s'afficheront directement sur la page d'accueil dans "Nos opérations de valorisation".
      </div>
      {biensActifs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-20 text-center">
          <Building2 className="h-12 w-12 text-slate-200 mb-3" />
          <p className="text-slate-400 text-sm">Aucun bien ajouté</p>
          <p className="text-slate-300 text-xs mt-1">Ajoutez des biens depuis "Nos Biens & Réalisations"</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {biensActifs.map((bien) => (
            <div key={bien.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-2 gap-0.5 bg-slate-100">
                {/* Photo Avant */}
                <div className="relative aspect-video bg-slate-200 group">
                  {bien.image_avant ? (
                    <img src={bien.image_avant} alt="Avant" className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Aucune photo</div>}
                  <span className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">AVANT</span>
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <div className="bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-[#1A3A52] flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      {uploading?.id === bien.id && uploading?.type === 'avant' ? 'Upload...' : 'Changer'}
                    </div>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(bien.id, 'avant', f); }}
                      disabled={!!uploading} />
                  </label>
                </div>
                {/* Photo Après */}
                <div className="relative aspect-video bg-slate-200 group">
                  {bien.image_apres ? (
                    <img src={bien.image_apres} alt="Après" className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">Aucune photo</div>}
                  <span className="absolute top-1 left-1 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">APRÈS</span>
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <div className="bg-white rounded-lg px-3 py-1.5 text-xs font-semibold text-[#1A3A52] flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      {uploading?.id === bien.id && uploading?.type === 'apres' ? 'Upload...' : 'Changer'}
                    </div>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(bien.id, 'apres', f); }}
                      disabled={!!uploading} />
                  </label>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-[#1A3A52] text-sm">{bien.titre}</p>
                <p className="text-xs text-slate-400 mt-0.5">{bien.location} • {bien.logements} • {bien.surface}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Modal */}
      <Dialog open={!!cropModal} onOpenChange={(open) => { if (!open) setCropModal(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Recadrer la photo</DialogTitle>
          </DialogHeader>
          {cropModal && (
            <ImageCropper
              imageSrc={cropModal.src}
              onCropComplete={handleCropComplete}
              onCancel={() => setCropModal(null)}
              aspectRatio={16 / 9}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function GestionPhotos({ embedded = false }) {
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [newUrl, setNewUrl] = useState('');
  const [cropModal, setCropModal] = useState(null);
  const [activePage, setActivePage] = useState('global');
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['site-images'],
    queryFn: () => db.SiteImage.list(),
  });

  const updateImageMutation = useMutation({
    mutationFn: ({ id, url }) => db.SiteImage.update(id, { url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-images'] });
      setEditingImage(null);
      setNewUrl('');
    },
  });

  const handleFileUpload = async (imageId, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCropModal({ imageId, src: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile) => {
    const { imageId } = cropModal;
    setCropModal(null);
    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file: croppedFile });
      const publicUrl = result.file_url;
      await updateImageMutation.mutateAsync({ id: imageId, url: publicUrl });
      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
    }
  };

  const handleUrlUpdate = (imageId) => {
    if (newUrl.trim()) updateImageMutation.mutate({ id: imageId, url: newUrl });
  };

  const getPageImages = (page) => {
    return images.filter((img) => {
      if (page.keyPattern) return img.key?.includes(page.keyPattern);
      return page.keys.includes(img.key);
    });
  };

  const currentPage = PAGES.find((p) => p.id === activePage);
  const currentImages = currentPage ? getPageImages(currentPage) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#C9A961] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={embedded ? '' : 'min-h-screen bg-slate-50 py-12'}>
      <div className={embedded ? '' : 'max-w-7xl mx-auto px-6 lg:px-8'}>
        {!embedded && (
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-[#1A3A52] mb-2">Gestion des Photos du Site</h1>
            <p className="text-slate-600">Modifiez les photos page par page</p>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar navigation par page */}
          <aside className="w-56 flex-shrink-0">
            <nav className="space-y-1 bg-white rounded-2xl border border-slate-200 p-3 sticky top-4">
              {PAGES.map((page) => {
                const count = getPageImages(page).length;
                const isActive = activePage === page.id;
                const Icon = page.icon;
                return (
                  <button key={page.id} onClick={() => setActivePage(page.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isActive ? 'bg-[#1A3A52] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{page.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Grille d'images */}
          <div className="flex-1 min-w-0">
            <div className="mb-5 flex items-center gap-3">
              {currentPage && <currentPage.icon className="h-5 w-5 text-[#C9A961]" />}
              <h2 className="text-lg font-semibold text-[#1A3A52]">{currentPage?.label}</h2>
              <span className="text-sm text-slate-400">{currentImages.length} image{currentImages.length > 1 ? 's' : ''}</span>
            </div>

            {(currentPage?.special === 'realisations' || currentPage?.special === 'portefeuille') ? (
              <RealisationsBiensSection />
            ) : currentImages.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {currentImages.map((image) => (
                  <ImageCard key={image.id} image={image}
                    editingImage={editingImage} newUrl={newUrl}
                    setNewUrl={setNewUrl} setEditingImage={setEditingImage}
                    handleUrlUpdate={handleUrlUpdate} handleFileUpload={handleFileUpload}
                    uploading={uploading} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-20 text-center">
                <ImageIcon className="h-12 w-12 text-slate-200 mb-3" />
                <p className="text-slate-400 text-sm">Aucune image configurée pour cette page</p>
                <p className="text-slate-300 text-xs mt-1">Les images s'afficheront ici une fois ajoutées en base</p>
              </div>
            )}
          </div>
        </div>

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
                aspectRatio={16 / 9}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}