import { forwardRef } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { SimpleBarChart } from './SimpleBarChart';
import { formatDuration, TimeRange } from '@/hooks/useReportData';

interface ShareCardProps {
  userName: string;
  range: TimeRange;
  totalMinutes: number;
  totalSessions: number;
  chartData: { label: string; minutes: number; sessions: number }[];
  className?: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ userName, range, totalMinutes, totalSessions, chartData, className }, ref) => {
    const rangeLabel = range === 'weekly' ? 'This Week' : range === 'monthly' ? 'This Month' : 'This Year';
    const dateLabel = format(new Date(), range === 'yearly' ? 'yyyy' : 'MMM yyyy');

    return (
      <div
        ref={ref}
        className={cn(
          "w-[340px] bg-background rounded-3xl p-6 shadow-2xl border border-border",
          className
        )}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-1">{rangeLabel}</p>
          <h2 className="text-xl font-bold">
            {userName ? `${userName}'s Focus Report` : 'My Focus Report'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{dateLabel}</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold">{formatDuration(totalMinutes)}</p>
            <p className="text-xs text-muted-foreground">Focus Time</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{totalSessions}</p>
            <p className="text-xs text-muted-foreground">Pomodoros</p>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="bg-muted/50 rounded-2xl p-4 mb-6">
          <SimpleBarChart data={chartData} className="h-20" />
        </div>

        {/* Motivational Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Small steps, big progress ✨
          </p>
        </div>

        {/* Branding */}
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-[10px] text-muted-foreground">
            Made with Focus Timer 🍅
          </p>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';
