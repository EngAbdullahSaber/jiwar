import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {   getTokenDescription } from '@/lib/jwt';

interface Permission {
  id: number;
  resource: string;
  actions: string[];
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

interface UserData {
  id: number;
  email: string;
  image: string;
  isVerified: boolean;
  userType: string;
  role: Role;
  token: string;
}

interface AuthState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  decodedInfo: any | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  decodedInfo: null,
};

const normalizePermissions = (permissions: Permission[]): Permission[] => {
  const normalizedMap: Record<string, Permission> = {};

  permissions.forEach((p) => {
    let resource = p.resource;
    
    // Handle action:resource format (e.g., "create:user")
    if (resource.includes(':')) {
      const parts = resource.split(':');
      resource = parts[1];
    }

    if (!normalizedMap[resource]) {
      normalizedMap[resource] = {
        ...p,
        resource: resource,
        actions: [...p.actions],
      };
    } else {
      // Merge actions into the existing resource entry
      p.actions.forEach((a) => {
        if (!normalizedMap[resource].actions.includes(a)) {
          normalizedMap[resource].actions.push(a);
        }
      });
    }
  });

  return Object.values(normalizedMap);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserData }>
    ) => {
      const { user } = action.payload;
      
      // Normalize permissions if they exist
      if (user?.role?.permissions) {
        user.role.permissions = normalizePermissions(user.role.permissions);
      }
      
      state.user = user;
      state.token = user.token;
      state.isAuthenticated = true;
      state.decodedInfo = getTokenDescription(user.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.decodedInfo = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
