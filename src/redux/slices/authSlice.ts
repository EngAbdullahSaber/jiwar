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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserData }>
    ) => {
      const { user } = action.payload;
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
