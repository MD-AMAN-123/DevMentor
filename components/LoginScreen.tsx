import React, { useState } from 'react';
import { Cpu, Loader2, Shield } from 'lucide-react';

interface Props {
  onLogin: (user: any) => void;
}

// NOTE: Replace with your actual Google Cloud Console Client ID
// You must add 'http://localhost:port' to "Authorized JavaScript origins" in Google Cloud Console
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [loading, setLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    setLoading('google');
    setError(null);

    // Check if Google script is loaded
    if (typeof google === 'undefined') {
        setError("Google Sign-In script not loaded. Please check internet connection.");
        setLoading(null);
        return;
    }

    try {
        const client = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            callback: async (tokenResponse: any) => {
                if (tokenResponse.access_token) {
                    try {
                        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                        }).then(res => {
                            if (!res.ok) throw new Error('Failed to fetch user profile');
                            return res.json();
                        });

                        onLogin({
                            name: userInfo.name,
                            email: userInfo.email,
                            role: 'Architect', // Default role for new users
                            avatar: userInfo.picture
                        });
                    } catch (err) {
                        console.error("Error fetching user info:", err);
                        setError("Failed to retrieve user profile.");
                    } finally {
                        setLoading(null);
                    }
                } else {
                   setLoading(null);
                }
            },
            error_callback: (err: any) => {
                console.error("Google Auth Error:", err);
                if (err.type === 'popup_closed') {
                    // User closed the popup, strictly not a system error but a cancellation
                    setError(null); 
                } else {
                    setError("Google Sign-In failed. Please try again.");
                }
                setLoading(null);
            }
        });

        // Use requestAccessToken to trigger the popup
        // Note: prompt: 'select_account' forces account selection, which can help if the user previously closed the popup
        client.requestAccessToken({ prompt: 'select_account' });

    } catch (err) {
        console.error("Initialization Error:", err);
        setError("Could not initialize Google Sign-In.");
        setLoading(null);
    }
  };

  const handleGithubLogin = () => {
    setLoading('github');
    // Simulate GitHub Login (Mock) as we only implemented Real-time Google Login per request
    setTimeout(() => {
      const mockUser = {
        name: 'AlexDev',
        role: 'Architect',
        email: 'alex@github.com',
        avatar: 'bg-slate-700' // Fallback for avatar
      };
      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-md w-full z-10 flex flex-col items-center">
        
        {/* Branding Header */}
        <div className="text-center mb-8 animate-in slide-in-from-top duration-700">
             <div className="flex items-center justify-center gap-3 mb-4">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Cpu className="w-8 h-8 text-emerald-500" />
                 </div>
             </div>
             <h1 className="text-3xl font-bold text-white tracking-tight">DevMentor AI</h1>
        </div>

        {/* Login Card */}
        <div className="w-full sci-card p-8 rounded-3xl border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-700 backdrop-blur-xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
          
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Welcome !</h3>
            <p className="text-slate-500 text-sm">Sign in to access your workspace</p>
          </div>
          
          {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {error}
              </div>
          )}

          <div className="space-y-4">
            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              {loading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* GitHub Button */}
            <button
              onClick={handleGithubLogin}
              disabled={loading !== null}
              className="w-full bg-[#24292e] hover:bg-[#2f363d] text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-white/10"
            >
              {loading === 'github' ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <>
                   <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                   </svg>
                  <span>Continue with GitHub</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-between text-xs text-slate-500">
             <div className="flex items-center gap-1">
                 <Shield className="w-3 h-3" />
                 <span>Secure 256-bit Encryption</span>
             </div>
             <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
// Global definition for Google Identity Services
declare const google: any;