import { useState } from 'react';
import { X, Gift, MessageCircle, Share2, Star, Check, Coins, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SHARING_REWARDS, ClaimedReward } from '@/types/room';

interface ShareRewardsModalProps {
  onClose: () => void;
  onClaimReward: (rewardType: ClaimedReward['type']) => { success: boolean; points: number };
  hasClaimedReward: (rewardType: ClaimedReward['type']) => boolean;
  appUrl: string;
}

export function ShareRewardsModal({
  onClose,
  onClaimReward,
  hasClaimedReward,
  appUrl,
}: ShareRewardsModalProps) {
  const [claimedMessage, setClaimedMessage] = useState<string | null>(null);

  const shareText = "🍅 I'm using Calmodoro to stay focused and build my cozy room! Join me and earn 1000 Focus Points as a welcome bonus!";

  const handleMessageShare = async () => {
    const claimed = hasClaimedReward('message_share');
    
    // Try to use native share if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Calmodoro - Focus Timer',
          text: shareText,
          url: appUrl,
        });
        
        if (!claimed) {
          const result = onClaimReward('message_share');
          if (result.success) {
            setClaimedMessage(`+${result.points} Focus Points earned! 🎉`);
            setTimeout(() => setClaimedMessage(null), 3000);
          }
        }
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      const fullText = `${shareText}\n\n${appUrl}`;
      await navigator.clipboard.writeText(fullText);
      
      if (!claimed) {
        const result = onClaimReward('message_share');
        if (result.success) {
          setClaimedMessage(`Link copied! +${result.points} Focus Points earned! 🎉`);
          setTimeout(() => setClaimedMessage(null), 3000);
        }
      } else {
        setClaimedMessage('Link copied to clipboard!');
        setTimeout(() => setClaimedMessage(null), 2000);
      }
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook') => {
    const claimed = hasClaimedReward('social_share');
    
    let shareUrl = '';
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(appUrl);
    
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    if (!claimed) {
      const result = onClaimReward('social_share');
      if (result.success) {
        setClaimedMessage(`+${result.points} Focus Points earned! 🎉`);
        setTimeout(() => setClaimedMessage(null), 3000);
      }
    }
  };

  const handleRatingFeedback = () => {
    const claimed = hasClaimedReward('rating_feedback');
    
    // Open a feedback form or rating prompt
    // For now, we'll simulate this with a simple confirmation
    const feedback = window.prompt('We\'d love your feedback! What do you think of Calmodoro? (Rate 1-5 and leave a comment)');
    
    if (feedback && feedback.trim().length > 0 && !claimed) {
      const result = onClaimReward('rating_feedback');
      if (result.success) {
        setClaimedMessage(`Thank you for your feedback! +${result.points} Focus Points earned! 🎉`);
        setTimeout(() => setClaimedMessage(null), 3000);
      }
    }
  };

  const rewards = [
    {
      ...SHARING_REWARDS.MESSAGE_SHARE,
      icon: MessageCircle,
      description: 'Share with friends via message',
      action: handleMessageShare,
      secondaryAction: undefined as (() => void) | undefined,
      claimed: hasClaimedReward('message_share'),
    },
    {
      ...SHARING_REWARDS.SOCIAL_SHARE,
      icon: Share2,
      description: 'Post on Twitter or Facebook',
      action: () => handleSocialShare('twitter'),
      secondaryAction: (() => handleSocialShare('facebook')) as (() => void) | undefined,
      claimed: hasClaimedReward('social_share'),
    },
    {
      ...SHARING_REWARDS.RATING_FEEDBACK,
      icon: Star,
      description: 'Rate and give us feedback',
      action: handleRatingFeedback,
      secondaryAction: undefined as (() => void) | undefined,
      claimed: hasClaimedReward('rating_feedback'),
    },
  ];

  const totalEarnable = Object.values(SHARING_REWARDS).reduce((sum, r) => sum + r.points, 0);
  const totalEarned = rewards.filter(r => r.claimed).reduce((sum, r) => sum + r.points, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[85vh] bg-background rounded-t-3xl sm:rounded-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold">Earn Focus Points</h2>
              <p className="text-xs text-muted-foreground">Share & earn up to {totalEarnable} FP!</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 py-3 bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Rewards Earned</span>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">{totalEarned} / {totalEarnable}</span>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(totalEarned / totalEarnable) * 100}%` }}
            />
          </div>
        </div>

        {/* Claimed message */}
        {claimedMessage && (
          <div className="mx-4 mt-3 p-3 bg-primary/10 border border-primary/20 rounded-xl text-center text-sm font-medium text-primary animate-fade-in">
            {claimedMessage}
          </div>
        )}

        {/* Rewards list */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[50vh]">
          {rewards.map((reward) => (
            <div
              key={reward.type}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all",
                reward.claimed 
                  ? "border-accent bg-accent/30" 
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  reward.claimed ? "bg-primary/20" : "bg-muted"
                )}>
                  {reward.claimed ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <reward.icon className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{reward.emoji} {reward.label}</span>
                    <div className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-primary" />
                      <span className={cn(
                        "text-sm font-bold",
                        reward.claimed ? "text-muted-foreground line-through" : "text-primary"
                      )}>
                        +{reward.points}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{reward.description}</p>
                  
                  {!reward.claimed && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={reward.action}
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                      >
                        {reward.type === 'social_share' ? (
                          <>Share on 𝕏</>
                        ) : (
                          <>Claim Reward</>
                        )}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      {reward.secondaryAction && (
                        <button
                          onClick={reward.secondaryAction}
                          className="px-3 py-2 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
                        >
                          Facebook
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Welcome bonus note */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-lg">🎁</span>
            <span>You received <strong className="text-primary">1000 FP</strong> as a welcome bonus!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
