import { useAppSelector } from './useRedux';

export const usePermissions = () => {
  const { user } = useAppSelector((state) => state.auth);

  const hasPermission = (resource: string, action: string) => {
    // Admin type might have all permissions, but we follow the backend permissions array
    if (!user?.role?.permissions) return false;
    
    return user.role.permissions.some(
      (p: any) => (p.resource === resource || p.resource === `${action.toLowerCase()}:${resource}`) &&
                  p.actions?.includes(action)
    );
  };

  return { 
    hasPermission,
    canCreate: (resource: string) => hasPermission(resource, 'CREATE'),
    canRead: (resource: string) => hasPermission(resource, 'READ'),
    canUpdate: (resource: string) => hasPermission(resource, 'UPDATE'),
    canDelete: (resource: string) => hasPermission(resource, 'DELETE'),
  };
};
