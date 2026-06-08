import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AppView = 'erp-access' | 'erp-modules' | 'erp-home' | 'ats' | 'purchase';
export type ActiveTab =
  | 'dashboard'
  | 'requisitions'
  | 'jobs'
  | 'candidates'
  | 'interviews'
  | 'analytics'
  | 'referrals'
  | 'settings';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  appView: AppView;
  activeTab: ActiveTab;
}

const initialState: UIState = {
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  sidebarOpen: true,
  appView: 'erp-access',
  activeTab: 'dashboard',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      localStorage.setItem('theme', nextTheme);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setAppView: (state, action: PayloadAction<AppView>) => {
      state.appView = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<ActiveTab>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setSidebarOpen, setAppView, setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
