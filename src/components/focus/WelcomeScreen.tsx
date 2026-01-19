import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useMoodTheme } from '@/hooks/useMoodTheme';
import { AmbientEffects } from './AmbientEffects';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize mood theme on welcome screen too
  const { activeMood } = useMoodTheme();

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

        {/* Helper text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          You can change this later in Settings
        </p>
      </div>
    </div>
  );
}
