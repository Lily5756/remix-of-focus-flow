import { useState } from 'react';
import { X, User, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import all avatar images
import avatarCuteGirl from '@/assets/avatars/avatar-cute-girl.png';
import avatarCuteBoy from '@/assets/avatars/avatar-cute-boy.png';
import avatarFunnyGirl from '@/assets/avatars/avatar-funny-girl.png';
import avatarFunnyBoy from '@/assets/avatars/avatar-funny-boy.png';
import avatarSeriousWoman from '@/assets/avatars/avatar-serious-woman.png';
import avatarSeriousMan from '@/assets/avatars/avatar-serious-man.png';
import avatarChillGirl from '@/assets/avatars/avatar-chill-girl.png';
import avatarChillBoy from '@/assets/avatars/avatar-chill-boy.png';
import avatarNerdyGirl from '@/assets/avatars/avatar-nerdy-girl.png';
import avatarNerdyBoy from '@/assets/avatars/avatar-nerdy-boy.png';
import avatarSportyGirl from '@/assets/avatars/avatar-sporty-girl.png';
import avatarSportyBoy from '@/assets/avatars/avatar-sporty-boy.png';

export interface AvatarOption {
  id: string;
  src: string;
  label: string;
  category: 'cute' | 'funny' | 'serious' | 'chill' | 'nerdy' | 'sporty';
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'cute-girl', src: avatarCuteGirl, label: 'Cute Girl', category: 'cute' },
  { id: 'cute-boy', src: avatarCuteBoy, label: 'Cute Boy', category: 'cute' },
  { id: 'funny-girl', src: avatarFunnyGirl, label: 'Funny Girl', category: 'funny' },
  { id: 'funny-boy', src: avatarFunnyBoy, label: 'Funny Boy', category: 'funny' },
  { id: 'serious-woman', src: avatarSeriousWoman, label: 'Serious Woman', category: 'serious' },
  { id: 'serious-man', src: avatarSeriousMan, label: 'Serious Man', category: 'serious' },
  { id: 'chill-girl', src: avatarChillGirl, label: 'Chill Girl', category: 'chill' },
  { id: 'chill-boy', src: avatarChillBoy, label: 'Chill Boy', category: 'chill' },
  { id: 'nerdy-girl', src: avatarNerdyGirl, label: 'Nerdy Girl', category: 'nerdy' },
  { id: 'nerdy-boy', src: avatarNerdyBoy, label: 'Nerdy Boy', category: 'nerdy' },
  { id: 'sporty-girl', src: avatarSportyGirl, label: 'Sporty Girl', category: 'sporty' },
  { id: 'sporty-boy', src: avatarSportyBoy, label: 'Sporty Boy', category: 'sporty' },
];

interface AvatarSelectorProps {
  selectedAvatarId: string | null;
  customAvatar: string | null;
  onSelectAvatar: (avatarId: string | null) => void;
  onUploadAvatar: (dataUrl: string) => void;
  onClose: () => void;
}

export function AvatarSelector({
  selectedAvatarId,
  customAvatar,
  onSelectAvatar,
  onUploadAvatar,
  onClose,
}: AvatarSelectorProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUploadAvatar(dataUrl);
      setUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to read file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (avatarId: string) => {
    onSelectAvatar(avatarId);
  };

  const handleRemoveAvatar = () => {
    onSelectAvatar(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 mood-transition">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold">Choose Avatar</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Upload custom avatar */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Upload Your Own
            </label>
            <div className="mt-2 flex items-center gap-3">
              <label className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl",
                "bg-muted border-2 border-dashed border-border cursor-pointer",
                "hover:border-foreground/30 transition-colors",
                uploading && "opacity-50 pointer-events-none"
              )}>
                <Camera className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {uploading ? 'Uploading...' : 'Choose Photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {customAvatar && (
                <div className="relative">
                  <img
                    src={customAvatar}
                    alt="Custom avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preset avatars */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Or Pick a Character
            </label>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {/* Default icon option */}
              <button
                onClick={handleRemoveAvatar}
                className={cn(
                  "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                  "flex items-center justify-center bg-muted",
                  !selectedAvatarId && !customAvatar
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-foreground/20"
                )}
              >
                <User className="w-8 h-8 text-muted-foreground" />
              </button>
              
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleSelectPreset(avatar.id)}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    selectedAvatarId === avatar.id
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-foreground/20"
                  )}
                >
                  <img
                    src={avatar.src}
                    alt={avatar.label}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity mood-transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper to get avatar src from ID
export function getAvatarSrc(avatarId: string | null, customAvatar: string | null): string | null {
  if (customAvatar) return customAvatar;
  if (!avatarId) return null;
  const avatar = AVATAR_OPTIONS.find(a => a.id === avatarId);
  return avatar?.src || null;
}
