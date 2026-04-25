import { useAppSelector } from './useRedux';

export const usePermissions = () => {
  const { user } = useAppSelector((state) => state.auth);

  const hasPermission = (resource: string, action: string) => {
    // Admin type might have all permissions, but we follow the backend permissions array
    if (!user?.role?.permissions) return false;
    
    const permission = user.role.permissions.find(
      (p: any) => p.resource === resource
    );
    
    return permission?.actions?.includes(action) || false;
  };

  return { 
    hasPermission,
    canCreate: (resource: string) => hasPermission(resource, 'CREATE'),
    canRead: (resource: string) => hasPermission(resource, 'READ'),
    canUpdate: (resource: string) => hasPermission(resource, 'UPDATE'),
    canDelete: (resource: string) => hasPermission(resource, 'DELETE'),
  };
};
