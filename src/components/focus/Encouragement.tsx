interface EncouragementProps {
  message: string | null;
}

export function Encouragement({ message }: EncouragementProps) {
  if (!message) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="px-6 py-3 rounded-full bg-foreground text-background font-medium shadow-lg">
        {message}
      </div>
    </div>
  );
}
