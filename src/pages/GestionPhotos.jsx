import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Save, Image as ImageIcon, Edit2, Crop } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageCropper from '../components/ImageCropper';

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
  const [cropModal, setCropModal] = useState(null);
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
    let category = img.category;
    // Pour les images avec des clés commençant par "service_", les placer dans la catégorie "services"
    if (img.key?.startsWith('service_')) {
      category = 'services';
    }
    if (!acc[category]) acc[category] = [];
    acc[category].push(img);
    return acc;
  }, {});

  const categories = {
    hero: { label: "Images Hero", icon: "🎯" },
    equipe: { label: "Photos Équipe", icon: "👥" },
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
          <TabsList className="grid grid-cols-4 w-full max-w-4xl">
            {Object.entries(categories).filter(([key]) => key !== 'equipe').map(([key, { label, icon }]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="hidden md:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <CategoryTab categoryKey="hero" groupedImages={groupedImages} editingImage={editingImage} newUrl={newUrl} setNewUrl={setNewUrl} setEditingImage={setEditingImage} handleUrlUpdate={handleUrlUpdate} handleFileUpload={handleFileUpload} uploading={uploading} />
           <CategoryTab categoryKey="services" groupedImages={groupedImages} editingImage={editingImage} newUrl={newUrl} setNewUrl={setNewUrl} setEditingImage={setEditingImage} handleUrlUpdate={handleUrlUpdate} handleFileUpload={handleFileUpload} uploading={uploading} />
           <CategoryTab categoryKey="autres" groupedImages={groupedImages} editingImage={editingImage} newUrl={newUrl} setNewUrl={setNewUrl} setEditingImage={setEditingImage} handleUrlUpdate={handleFileUpload} uploading={uploading} />
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