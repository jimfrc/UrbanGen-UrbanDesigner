import React, { useState } from 'react';
import { Page } from '../types';
import Button from './Button';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToSignUp: () => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignUp, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 简单验证
    if (!email.trim()) {
      setError('请输入邮箱');
      return;
    }
    
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      try {
        onLogin(email, password);
      } catch (err) {
        setError(err instanceof Error ? err.message : '登录失败');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background with blur */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/1920/1080?grayscale&blur=5" 
          className="w-full h-full object-cover"
          alt="Architectural background"
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">U</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to manage your urban projects</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 rounded-xl text-lg shadow-xl shadow-blue-500/10"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              New to UrbanGen? <span onClick={onNavigateToSignUp} className="text-blue-600 font-bold cursor-pointer hover:underline">Create an account</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
