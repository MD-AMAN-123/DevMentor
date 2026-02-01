import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Cpu, Loader2, Shield } from "lucide-react";

interface Props {
  onLogin: (user: any) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <Cpu className="w-12 h-12 text-emerald-500 mb-2" />
          <h1 className="text-3xl font-bold text-white">DevMentor AI</h1>
        </div>

        <div className="w-full p-8 rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            Sign in to continue
          </h3>

          {/* ✅ GOOGLE LOGIN (CORRECT) */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log("Google login success", credentialResponse);
              onLogin(credentialResponse);
            }}
            onError={() => {
              console.log("Google login failed");
            }}
          />

          {/* GitHub mock stays */}
          <button
            className="mt-4 w-full bg-[#24292e] text-white py-3 rounded-xl"
            onClick={() =>
              onLogin({
                name: "AlexDev",
                email: "alex@github.com",
                role: "Architect",
              })
            }
          >
            Continue with GitHub
          </button>

          <div className="mt-6 text-xs text-slate-500 flex justify-between">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> Secure Login
            </span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
