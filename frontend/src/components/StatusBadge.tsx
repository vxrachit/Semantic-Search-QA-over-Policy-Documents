import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  onStatusChange?: (isHealthy: boolean) => void;
}

const StatusBadge = ({ onStatusChange }: StatusBadgeProps) => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');

  const checkHealth = async () => {
    setStatus('checking');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
      const data = await response.json();
      const isHealthy = response.ok && data.status === 'ok';
      setStatus(isHealthy ? 'healthy' : 'unhealthy');
      onStatusChange?.(isHealthy);
    } catch (error) {
      setStatus('unhealthy');
      onStatusChange?.(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // REMOVE: interval for periodic health checks
  }, []);

  const getStatusProps = () => {
    switch (status) {
      case 'checking':
        return {
          variant: 'secondary' as const,
          icon: Loader2,
          text: 'Checking Backend...',
          className: 'bg-muted text-muted-foreground border-border'
        };
      case 'healthy':
        return {
          variant: 'default' as const,
          icon: CheckCircle,
          text: 'Backend is Live ✅',
          className: 'bg-success-bg text-success border-success/20'
        };
      case 'unhealthy':
        return {
          variant: 'destructive' as const,
          icon: XCircle,
          text: 'Backend Down ❌',
          className: 'bg-error-bg text-error border-error/20'
        };
    }
  };

  const { icon: Icon, text, className } = getStatusProps();

  return (
    <Badge className={`flex items-center gap-2 px-3 py-1 ${className}`}>
      <Icon className={`h-4 w-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
      {text}
    </Badge>
  );
};

export default StatusBadge;