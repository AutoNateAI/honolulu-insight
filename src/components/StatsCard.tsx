import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon: LucideIcon;
  variant?: 'ocean' | 'sunset' | 'tropical' | 'plumeria' | 'volcanic';
  className?: string;
  description?: string;
}

const variantStyles = {
  ocean: {
    gradient: 'bg-ocean-gradient',
    iconBg: 'bg-white/20',
    iconColor: 'text-white'
  },
  sunset: {
    gradient: 'bg-sunset-gradient',
    iconBg: 'bg-white/20',
    iconColor: 'text-white'
  },
  tropical: {
    gradient: 'bg-tropical-gradient',
    iconBg: 'bg-white/20',
    iconColor: 'text-white'
  },
  plumeria: {
    gradient: 'bg-gradient-to-br from-plumeria-light to-plumeria-deep',
    iconBg: 'bg-white/20',
    iconColor: 'text-white'
  },
  volcanic: {
    gradient: 'bg-volcanic-gradient',
    iconBg: 'bg-white/20',
    iconColor: 'text-white'
  }
};

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = 'ocean',
  className = '',
  description 
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`glass-card overflow-hidden hawaii-hover ${className}`}>
      {/* Gradient Header */}
      <div className={`${styles.gradient} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
            <p className="text-2xl font-bold font-poppins">{value}</p>
            {description && (
              <p className="text-white/70 text-xs mt-1">{description}</p>
            )}
          </div>
          <div className={`${styles.iconBg} p-3 rounded-xl`}>
            <Icon className={`h-6 w-6 ${styles.iconColor}`} />
          </div>
        </div>
      </div>

      {/* Change Indicator */}
      {change && (
        <div className="p-4 bg-white/5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">{change.label}</span>
            <div className={`flex items-center text-sm font-medium ${
              change.positive !== false ? 'text-tropical-light' : 'text-sunset-deep'
            }`}>
              <span className="mr-1">
                {change.positive !== false ? '↗' : '↘'}
              </span>
              {Math.abs(change.value)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simplified metric card variant for smaller displays
export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'ocean-primary',
  className = '' 
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`metric-card ${className}`}>
      <div className={`w-12 h-12 rounded-xl mb-3 mx-auto flex items-center justify-center`}
           style={{ backgroundColor: `hsl(var(--${color}) / 0.2)` }}>
        <Icon className="h-6 w-6" style={{ color: `hsl(var(--${color}))` }} />
      </div>
      <div className="metric-value text-foreground">{value}</div>
      <div className="metric-label">{title}</div>
    </div>
  );
}