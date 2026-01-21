import { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const emailSchema = z.string().trim().email({ message: "Invalid email address" }).max(255);
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" }).max(72);
const displayNameSchema = z.string().trim().min(1, { message: "Name is required" }).max(50);

type AuthMode = 'login' | 'signup';

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setIsGoogleLoading(false);
    }
    // Don't set loading false on success - page will redirect
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate inputs
      const validatedEmail = emailSchema.parse(email);
      const validatedPassword = passwordSchema.parse(password);

      if (mode === 'signup') {
        const validatedName = displayNameSchema.parse(displayName);
        const { error } = await signUp(validatedEmail, validatedPassword, validatedName);
        if (error) {
          setError(error.message);
        } else {
          onSuccess?.();
          onClose();
        }
      } else {
        const { error } = await signIn(validatedEmail, validatedPassword);
        if (error) {
          setError(error.message);
        } else {
          onSuccess?.();
          onClose();
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-background rounded-2xl overflow-hidden animate-scale-in shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Display Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your name"
                  maxLength={50}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="your@email.com"
                maxLength={255}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
                maxLength={72}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-3 rounded-xl font-medium transition-all",
              "bg-primary text-primary-foreground hover:opacity-90",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className={cn(
              "w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
              "bg-muted hover:bg-muted/80 border border-border",
              (isGoogleLoading || isLoading) && "opacity-50 cursor-not-allowed"
            )}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>

        {/* Benefits */}
        <div className="p-4 bg-muted/50 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Sync your progress across devices and never lose your data
          </p>
        </div>
      </div>
    </div>
  );
}
