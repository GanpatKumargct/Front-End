import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store';
import { AppProviders } from './providers';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import { DashboardLayout } from '../shared/components/layout/DashboardLayout';
import MainATSContainer from '../modules/ats/components/MainATSContainer';
import { ERPModuleCatalog } from '../modules/ats/components/ERPModuleCatalog';
import PurchaseModule from '../modules/purchase/components/PurchaseModule';
import { setAppView } from '../shared/store/uiSlice';

function ProtectedRoutes() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const appView = useSelector((state: RootState) => state.ui.appView);
  const dispatch = useDispatch();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleModuleSelect = (moduleId: string) => {
    if (moduleId === 'ats') {
      dispatch(setAppView('ats'));
    } else if (moduleId === 'procurement') {
      dispatch(setAppView('purchase'));
    }
  };

  if (appView === 'erp-access' || appView === 'erp-modules') {
    return <ERPModuleCatalog onModuleSelect={handleModuleSelect} currentModule={appView} />;
  }

  if (appView === 'purchase') {
    return <PurchaseModule />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<MainATSContainer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
