import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Check, X } from 'lucide-react';

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 16/9 }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [containerSize, setContainerSize] = useState({ w: 500, h: 300 });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImageSize({ w: img.naturalWidth, h: img.naturalHeight });
      
      // Fit image initially
      const cw = containerSize.w;
      const ch = containerSize.h;
      const fitScale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      setScale(fitScale);
      setOffset({
        x: (cw - img.naturalWidth * fitScale) / 2,
        y: (ch - img.naturalHeight * fitScale) / 2,
      });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    drawCanvas();
  }, [scale, offset, imageSize]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      imageRef.current,
      offset.x, offset.y,
      imageRef.current.naturalWidth * scale,
      imageRef.current.naturalHeight * scale
    );
    // Overlay dimming outside crop area
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    const cw = canvas.width;
    const ch = canvas.height;
    ctx.fillRect(0, 0, cw, ch);
    // Clear the crop area
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(
      imageRef.current,
      offset.x, offset.y,
      imageRef.current.naturalWidth * scale,
      imageRef.current.naturalHeight * scale
    );


  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const t = e.touches[0];
    setOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  const zoom = (factor) => {
    const newScale = Math.max(0.1, Math.min(5, scale * factor));
    const cw = containerSize.w;
    const ch = containerSize.h;
    // Zoom centered on canvas
    const cx = cw / 2;
    const cy = ch / 2;
    setOffset(prev => ({
      x: cx - (cx - prev.x) * (newScale / scale),
      y: cy - (cy - prev.y) * (newScale / scale),
    }));
    setScale(newScale);
  };

  const reset = () => {
    if (!imageRef.current) return;
    const cw = containerSize.w;
    const ch = containerSize.h;
    const fitScale = Math.max(cw / imageRef.current.naturalWidth, ch / imageRef.current.naturalHeight);
    setScale(fitScale);
    setOffset({
      x: (cw - imageRef.current.naturalWidth * fitScale) / 2,
      y: (ch - imageRef.current.naturalHeight * fitScale) / 2,
    });
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    // Convert dataURL to Blob then File
    fetch(croppedDataUrl)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
        onCropComplete(file, croppedDataUrl);
      });
  };

  const cw = containerSize.w;
  const ch = Math.round(cw / aspectRatio);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Déplacez l'image pour recadrer. Utilisez les boutons pour zoomer.</p>
      
      <div className="flex items-center gap-2 mb-2">
        <Button size="sm" variant="outline" onClick={() => zoom(1.15)}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => zoom(1/1.15)}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={reset}>
          <RotateCcw className="w-4 h-4" />
          <span className="ml-1 text-xs">Réinitialiser</span>
        </Button>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg cursor-move select-none"
        style={{ width: cw, height: ch, maxWidth: '100%' }}
      >
        <canvas
          ref={canvasRef}
          width={cw}
          height={ch}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="block"
          style={{ touchAction: 'none' }}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleCrop} className="flex-1 bg-[#C9A961] hover:bg-[#B8994F] text-[#1A3A52] font-semibold">
          <Check className="w-4 h-4 mr-2" />
          Valider le recadrage
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
      </div>
    </div>
  );
}