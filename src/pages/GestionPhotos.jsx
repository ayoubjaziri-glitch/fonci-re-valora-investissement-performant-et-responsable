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

export default function GestionPhotos() {
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
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
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
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-serif text-[#1A3A52] mb-2">
            Gestion des Photos du Site
          </h1>
          <p className="text-slate-600">
            Modifiez facilement toutes les photos du site sans toucher au code
          </p>
        </motion.div>

        <Tabs defaultValue="equipe" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            {Object.entries(categories).map(([key, { label, icon }]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="hidden md:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categories).map(([categoryKey, { label }]) => (
            <TabsContent key={categoryKey} value={categoryKey}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedImages[categoryKey]?.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-200">
                        <img
                          src={image.url}
                          alt={image.description}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                          }}
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-[#1A3A52] mb-1">
                          {image.description}
                        </h3>
                        <p className="text-xs text-slate-500 break-all">{image.key}</p>
                      </div>

                      {editingImage === image.id ? (
                        <div className="space-y-3">
                          <div>
                            <Label>Nouvelle URL</Label>
                            <Input
                              value={newUrl}
                              onChange={(e) => setNewUrl(e.target.value)}
                              placeholder="https://..."
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleUrlUpdate(image.id)}
                              className="flex-1 bg-[#C9A961] hover:bg-[#B8994F]"
                              disabled={!newUrl.trim()}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Enregistrer
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingImage(null);
                                setNewUrl('');
                              }}
                              variant="outline"
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button
                            onClick={() => {
                              setEditingImage(image.id);
                              setNewUrl(image.url);
                            }}
                            variant="outline"
                            className="w-full"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Modifier l'URL
                          </Button>

                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(image.id, file);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={uploading}
                            />
                            <Button
                              className="w-full bg-[#1A3A52] hover:bg-[#2A4A6F]"
                              disabled={uploading}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {uploading ? 'Upload en cours...' : 'Uploader une photo'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}

                {(!groupedImages[categoryKey] || groupedImages[categoryKey].length === 0) && (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    Aucune image dans cette catégorie
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Comment ça marche ?
          </h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• <strong>Uploader une photo</strong> : Cliquez sur "Uploader une photo" et sélectionnez votre image</li>
            <li>• <strong>Modifier l'URL</strong> : Cliquez sur "Modifier l'URL" pour coller une URL d'image existante</li>
            <li>• <strong>Changements instantanés</strong> : Les modifications sont appliquées immédiatement sur le site</li>
          </ul>
        </div>
      </div>
    </div>
  );
}