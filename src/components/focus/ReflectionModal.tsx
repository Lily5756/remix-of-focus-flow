import { X } from 'lucide-react';

interface ReflectionModalProps {
  onSubmit: (answer: 'yes' | 'no') => void;
  onSkip: () => void;
}

export function ReflectionModal({ onSubmit, onSkip }: ReflectionModalProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl shadow-xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="text-center pt-2">
          <h2 className="text-xl font-semibold mb-2">Session complete!</h2>
          <p className="text-muted-foreground mb-8">
            Did you complete what you planned?
          </p>

          {/* Answer buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onSubmit('no')}
              className="flex-1 py-4 px-6 rounded-2xl bg-muted text-muted-foreground font-medium text-lg hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Not yet
            </button>
            <button
              onClick={() => onSubmit('yes')}
              className="flex-1 py-4 px-6 rounded-2xl bg-foreground text-background font-medium text-lg hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Yes!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
