import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoginSuccess } from '../../shared/store/authSlice';
import { GuildLogo } from '../../shared/components/GuildLogo';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 relative">
      {/* Top Center Logo */}
      <div className="mb-10 flex justify-center">
        <GuildLogo className="h-24 w-24" theme="dark" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[440px] rounded-2xl border border-zinc-800/80 bg-[#121214] p-10 flex flex-col items-center text-center shadow-xl">
        <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-6 font-medium">
          WELCOME BACK, GAUTHAM
        </p>

        <h1
          className="text-[32px] text-white mb-2 leading-none"
          style={{
            fontFamily: 'Fauna One, serif',
            fontWeight: 400,
            letterSpacing: '0.04em',
          }}
        >
          The Guild ERP
        </h1>

        <p className="text-xs text-zinc-500 max-w-sm leading-relaxed mb-8">
          Unified Enterprise Operations Platform
        </p>

        <button
          onClick={handleAccessPlatform}
          className="w-full py-3.5 rounded-xl bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-100 transition-colors shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-zinc-700"
        >
          Access Platform
        </button>
      </div>
    </div>
  );
}
