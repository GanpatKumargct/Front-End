import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setLoginSuccess } from '../../shared/store/authSlice';
import { apiClient } from '../../shared/api/client';

export default function AuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      const getProfileAndRedirect = async () => {
        try {
          const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';
          let userProfile = {
            id: '8c81977a-a47d-448c-9f28-4d44fd2ceec0',
            email: 'admin@erp.local',
            roles: ['admin'],
            name: 'Admin User',
          };

          if (!useMocks) {
            localStorage.setItem('access_token', token);
            const response = await apiClient.get('/auth/me');
            userProfile = response.data;
          }

          dispatch(setLoginSuccess({ token, user: userProfile }));
          navigate('/');
        } catch (error) {
          console.error('SSO Authentication profile fetch failed:', error);
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      };

      getProfileAndRedirect();
    } else {
      console.warn('SSO callback accessed without token parameter.');
      navigate('/login');
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground tracking-wide font-medium">
          Completing Zoho SSO Authentication...
        </p>
      </div>
    </div>
  );
}
