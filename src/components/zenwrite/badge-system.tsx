'use client';

import type { Badge as BadgeType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Award, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeSystemProps {
  badges: BadgeType[];
}

export function BadgeSystem({ badges }: BadgeSystemProps) {
  const achievedBadges = badges.filter(b => b.achieved);
  const unachievedBadges = badges.filter(b => !b.achieved);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl"><Award className="mr-2 h-5 w-5" />Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 && <p className="text-muted-foreground">No badges defined yet.</p>}
        
        {(achievedBadges.length > 0 || unachievedBadges.length > 0) && (
          <TooltipProvider delayDuration={100}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {achievedBadges.map((badge) => (
                <BadgeItem key={badge.id} badge={badge} achieved />
              ))}
              {unachievedBadges.map((badge) => (
                <BadgeItem key={badge.id} badge={badge} achieved={false} />
              ))}
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
}

interface BadgeItemProps {
  badge: BadgeType;
  achieved: boolean;
}

function BadgeItem({ badge, achieved }: BadgeItemProps) {
  const IconComponent = badge.icon;
  const iconColor = achieved ? (badge.iconColor || 'text-accent') : 'text-muted-foreground';
  const bgColor = achieved ? (badge.bgColor || 'bg-accent/20') : 'bg-muted/30';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'flex flex-col items-center justify-center p-3 rounded-lg aspect-square transition-all duration-300',
            achieved ? 'border-2 border-accent shadow-lg' : 'border border-dashed opacity-60 hover:opacity-100',
            bgColor
          )}
          aria-label={`${badge.name}${achieved ? ' (Achieved)' : ' (Not achieved)'}`}
        >
          <IconComponent className={cn('h-8 w-8 mb-1', iconColor)} />
          <p className={cn('text-xs text-center font-medium truncate w-full', achieved ? 'text-foreground' : 'text-muted-foreground')}>
            {badge.name}
          </p>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-center">
        <p className="font-semibold">{badge.name}</p>
        <p className="text-sm text-muted-foreground">{badge.description}</p>
        {!achieved && <p className="text-xs italic mt-1">(Not yet achieved)</p>}
      </TooltipContent>
    </Tooltip>
  );
}
