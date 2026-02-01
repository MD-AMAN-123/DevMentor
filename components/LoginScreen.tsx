import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Cpu, Github, Shield, Lock, Layout, ArrowRight } from "lucide-react";

interface Props {
  onLogin: (user: any) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#030712]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10 transform transition-all duration-700 ease-out">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Cpu className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            DevMentor AI
          </h1>
          <p className="text-slate-400 text-sm font-medium">Elevate Your Coding Journey</p>
        </div>

        <div className="w-full p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] shadow-2xl">
          <div className="bg-[#0B1121]/90 backdrop-blur-2xl p-8 md:p-10 rounded-[2.4rem] border border-white/5 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <Lock className="w-4 h-4 text-emerald-500" />
                <h3 className="text-lg font-semibold text-white">Secure Portal</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                    Authentication
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-full flex justify-center">
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          console.log("Google login success", credentialResponse);
                          onLogin(credentialResponse);
                        }}
                        onError={() => {
                          console.log("Google login failed");
                        }}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        width="100%"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-xs font-medium text-slate-600 uppercase tracking-widest">or</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div className="space-y-2">
                  <button
                    className="group relative w-full bg-[#161b22] hover:bg-[#1f2428] text-white py-4 rounded-xl transition-all duration-300 border border-white/10 overflow-hidden flex items-center justify-center gap-3 overflow-hidden"
                    onClick={() =>
                      onLogin({
                        name: "AlexDev",
                        email: "alex@github.com",
                        role: "Architect",
                      })
                    }
                  >
                    <Github className="w-5 h-5" />
                    <span className="font-semibold text-sm">Continue with GitHub</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </button>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors cursor-default">
                    <Shield className="w-3.5 h-3.5" /> Encrypted Connection
                  </span>
                  <div className="flex gap-3">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <span>•</span>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative background element inside card */}
            <div className="absolute bottom-[-20px] right-[-20px] opacity-10 rotate-12">
              <Layout className="w-32 h-32 text-emerald-500" />
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-500 text-xs font-medium px-4">
          By signing in, you agree to our platform guidelines and data processing policies.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;

