import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Cpu, Github, Shield, Lock, Layout, ArrowRight } from "lucide-react";

interface Props {
  onLogin: (user: any) => void;
}

interface GoogleJwtPayload {
  name: string;
  email: string;
  picture: string;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#030712]">
      {/* Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20">
            <Cpu className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">DevMentor AI</h1>
          <p className="text-slate-400 text-sm">Elevate Your Coding Journey</p>
        </div>

        <div className="bg-[#0B1121]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-emerald-500" />
            <h3 className="text-lg font-semibold text-white">Secure Portal</h3>
          </div>

          {/* ✅ GOOGLE LOGIN */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (!credentialResponse.credential) return;

                const decoded = jwtDecode<GoogleJwtPayload>(
                  credentialResponse.credential
                );

                // 🔥 IMPORTANT: map Google user → App user
                onLogin({
                  name: decoded.name,
                  email: decoded.email,
                  role: "Architect",
                  avatar: decoded.picture,
                });
              }}
              onError={() => {
                console.log("Google login failed");
              }}
              theme="filled_black"
              shape="pill"
              size="large"
            />
          </div>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="mx-4 text-xs text-slate-600 uppercase">or</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* GitHub mock */}
          <button
            className="w-full bg-[#161b22] hover:bg-[#1f2428] text-white py-4 rounded-xl border border-white/10 flex items-center justify-center gap-3"
            onClick={() =>
              onLogin({
                name: "AlexDev",
                email: "alex@github.com",
                role: "Architect",
              })
            }
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-8 flex justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Encrypted
            </span>
            <span>Privacy • Terms</span>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-500 text-xs">
          By signing in, you agree to our policies.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
