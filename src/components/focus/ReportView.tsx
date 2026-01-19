import { useState, useRef, useCallback } from 'react';
import { Share2, Download, Clock, Target, Flame, Star, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useReportData, formatDuration, TimeRange } from '@/hooks/useReportData';
import { SimpleBarChart } from './SimpleBarChart';
import { ShareCard } from './ShareCard';
import { StreakCalendar } from './StreakCalendar';
import { toPng } from 'html-to-image';

interface ReportViewProps {
  userName: string | null;
}

export function ReportView({ userName }: ReportViewProps) {
  const [range, setRange] = useState<TimeRange>('weekly');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  
  const reportData = useReportData(range);
  
  const hasData = reportData.totalSessions > 0;

  const handleShare = async () => {
    setShowShareModal(true);
  };

  const handleDownloadImage = useCallback(async () => {
    if (!shareCardRef.current) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: 'white',
      });
      
      const link = document.createElement('a');
      link.download = `focus-report-${range}-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [range]);

  const handleNativeShare = useCallback(async () => {
    if (!shareCardRef.current || !navigator.share) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: 'white',
      });
      
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `focus-report-${range}.png`, { type: 'image/png' });
      
      await navigator.share({
        title: 'My Focus Report',
        text: `Check out my focus progress! ${formatDuration(reportData.totalMinutes)} of focused time this ${range === 'weekly' ? 'week' : range === 'monthly' ? 'month' : 'year'}! 🍅`,
        files: [file],
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to share:', error);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [range, reportData.totalMinutes]);

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare;

  return (
    <div className="flex flex-col h-full px-4">
      {/* Header */}
      <div className="py-4">
        <h1 className="text-xl font-semibold">Your Focus Report 📊</h1>
        <p className="text-sm text-muted-foreground">Track your progress over time</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-center gap-1 p-1 bg-muted rounded-full mb-6">
        {(['weekly', 'monthly', 'yearly'] as TimeRange[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all capitalize",
              range === r
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {hasData ? (
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Focus Time</span>
              </div>
              <p className="text-2xl font-bold">{formatDuration(reportData.totalMinutes)}</p>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Pomodoros</span>
              </div>
              <p className="text-2xl font-bold">{reportData.totalSessions}</p>
            </div>
          </div>

          {/* Best Day */}
          {reportData.bestDay && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Best Day</span>
              </div>
              <p className="text-lg font-semibold">
                {format(reportData.bestDay.date, 'EEEE, MMM d')}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDuration(reportData.bestDay.minutes)} of focus
              </p>
            </div>
          )}

          {/* Chart */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <SimpleBarChart data={reportData.chartData} />
          </div>

          {/* Streak Calendar */}
          <StreakCalendar />

          {/* Highlights */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium">Highlights ✨</p>
            
            {reportData.longestStreak > 0 && (
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm">
                  Longest streak: <strong>{reportData.longestStreak} days</strong>
                </span>
              </div>
            )}
            
            {reportData.currentStreak > 0 && (
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm">
                  Current streak: <strong>{reportData.currentStreak} days</strong>
                </span>
              </div>
            )}
            
            {reportData.mostFocusedDayOfWeek && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">
                  Most focused on: <strong>{reportData.mostFocusedDayOfWeek}s</strong>
                </span>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-full py-4 px-6 rounded-2xl bg-foreground text-background font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Share2 className="w-5 h-5" />
            Share Your Progress
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
          <p className="text-sm text-muted-foreground">
            Start your first Pomodoro to see your progress here!
          </p>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-center mb-4">Share Your Progress</h3>
            
            {/* Preview */}
            <div className="flex justify-center mb-6 overflow-hidden rounded-2xl">
              <div className="transform scale-[0.85] origin-center">
                <ShareCard
                  ref={shareCardRef}
                  userName={userName || ''}
                  range={range}
                  totalMinutes={reportData.totalMinutes}
                  totalSessions={reportData.totalSessions}
                  chartData={reportData.chartData}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {canNativeShare && (
                <button
                  onClick={handleNativeShare}
                  disabled={isGenerating}
                  className="w-full py-3 px-4 rounded-xl bg-foreground text-background font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4" />
                  {isGenerating ? 'Generating...' : 'Share'}
                </button>
              )}
              
              <button
                onClick={handleDownloadImage}
                disabled={isGenerating}
                className={cn(
                  "w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50",
                  canNativeShare 
                    ? "bg-muted text-foreground" 
                    : "bg-foreground text-background"
                )}
              >
                <Download className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Save as Image'}
              </button>
              
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 px-4 rounded-xl bg-muted text-muted-foreground font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
