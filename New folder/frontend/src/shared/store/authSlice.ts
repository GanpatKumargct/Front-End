import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  email: string;
  roles: string[];
  name: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginSuccess: (state, action: PayloadAction<{ token: string; user?: UserProfile }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('access_token', action.payload.token);
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },
    setUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLogout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('access_token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoginSuccess, setUser, setLogout, setLoading } = authSlice.actions;
export default authSlice.reducer;
