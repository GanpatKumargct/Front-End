import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoginSuccess } from '../../shared/store/authSlice';
import { GuildLogo } from '../../shared/components/GuildLogo';
import type { RootState } from '../store';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state: RootState) => state.ui.theme);

  const handleAccessPlatform = () => {
    const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

    if (useMocks) {
      // Dev Bypass authentication
      const mockToken = 'dev-bypass-mock-jwt-token';
      const mockUser = {
        id: '8c81977a-a47d-448c-9f28-4d44fd2ceec0',
        email: 'admin@erp.local',
        roles: ['admin'],
        name: 'Admin User',
      };

      dispatch(setLoginSuccess({ token: mockToken, user: mockUser }));
      navigate('/');
    } else {
      // Live backend Zoho SSO login flow redirect
      const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
      window.location.href = `${baseURL}/api/auth/login`;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Visual Decorator Background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
        <GuildLogo className="h-20 w-20" theme={theme} />
      </div>

      <div className="w-[480px] rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-10 flex flex-col items-center text-center shadow-2xl">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
          Welcome back, Gautham
        </p>

        <h1
          className="text-3xl mb-3 text-foreground"
          style={{
            fontFamily: 'Fauna One, serif',
            fontWeight: 100,
            letterSpacing: '0.06em',
          }}
        >
          The Guild ERP
        </h1>

        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-10">
          Unified Enterprise Operations Platform
        </p>

        <button
          onClick={handleAccessPlatform}
          className="px-8 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-all duration-200 cursor-pointer shadow-md"
        >
          Access Platform
        </button>
      </div>
    </div>
  );
}
