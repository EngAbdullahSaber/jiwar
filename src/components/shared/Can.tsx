import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface CanProps {
  I: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  a: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ I, a, children, fallback = null }) => {
  const { hasPermission } = usePermissions();

  if (hasPermission(a, I)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
