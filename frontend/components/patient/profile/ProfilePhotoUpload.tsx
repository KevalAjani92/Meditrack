"use client";

import { useState, useRef } from "react";
import { Camera, Trash2, UploadCloud } from "lucide-react";

interface ProfilePhotoUploadProps {
  initialAvatarUrl: string | null;
  name: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export default function ProfilePhotoUpload({ initialAvatarUrl, name, onUpload, onRemove }: ProfilePhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onUpload(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onRemove();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-4">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md bg-secondary flex items-center justify-center text-secondary-foreground text-2xl font-bold">
          {previewUrl ? (
            <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        
        {/* Hover Overlay */}
        <label className="absolute inset-0 bg-foreground/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-background">
          <Camera className="w-6 h-6" />
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 bg-secondary text-secondary-foreground hover:bg-muted text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
        >
          <UploadCloud className="w-3.5 h-3.5" /> Upload
        </button>
        {previewUrl && (
          <button 
            onClick={handleRemove}
            className="px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </div>
    </div>
  );
}