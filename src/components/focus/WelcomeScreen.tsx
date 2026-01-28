import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useMoodTheme } from '@/hooks/useMoodTheme';
import { useAuth } from '@/hooks/useAuth';
import { AmbientEffects } from './AmbientEffects';
import { AuthModal } from './AuthModal';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user } = useAuth();

  // Initialize mood theme on welcome screen too
  const { activeMood } = useMoodTheme();

  // If user logs in, use their display name or email
  if (user) {
    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';
    onComplete(displayName);
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError("Tell me your name first 😄");
      return;
    }
    
    if (trimmedName.length > 15) {
      setError("That's a bit long! Max 15 characters 😅");
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    // Small delay for animation feel
    setTimeout(() => {
      onComplete(trimmedName);
    }, 300);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 15) {
      setName(value);
      if (error) setError('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-in fade-in duration-500 mood-transition relative">
      {/* Ambient effects */}
      <AmbientEffects mood={activeMood} />
      
      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={`${import.meta.env.BASE_URL}calmodoro.png`} alt="Calmodoro" className="w-20 h-20" />
        </div>

        {/* Welcome header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Welcome 👋</h1>
          <p className="text-lg text-muted-foreground">What should I call you?</p>
        </div>

        {/* Name input form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Your name"
              autoFocus
              autoComplete="off"
              maxLength={15}
              className={cn(
                "w-full px-5 py-4 text-lg rounded-2xl bg-card border-2 transition-colors mood-transition",
                "placeholder:text-muted-foreground focus:outline-none",
                error 
                  ? "border-destructive focus:border-destructive" 
                  : "border-transparent focus:border-foreground"
              )}
            />
            
            {/* Error message */}
            {error && (
              <p className="mt-2 text-sm text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                {error}
              </p>
            )}

            {/* Character count */}
            <p className="mt-2 text-xs text-muted-foreground text-right">
              {name.length}/15
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all mood-transition",
              "bg-foreground text-background",
              "hover:opacity-90 active:scale-[0.98]",
              "disabled:opacity-70 disabled:cursor-not-allowed",
              isSubmitting && "animate-pulse"
            )}
          >
            {isSubmitting ? "Let's go! 🚀" : "Let's lock in 🔒"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        {/* Login button */}
        <button
          type="button"
          onClick={() => setShowAuthModal(true)}
          className={cn(
            "w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all",
            "bg-muted hover:bg-muted/80 border border-border",
          )}
        >
          Sign in to sync progress
        </button>

        {/* Helper text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          You can change this later in Settings
        </p>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
