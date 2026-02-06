import React, { useState } from 'react';
import { Page, User } from '../types';
import Button from './Button';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { loginUserServer } from '../services/localStorageService';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToSignUp: () => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignUp, onBack }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError(t.login.email);
      return;
    }
    
    if (!password.trim()) {
      setError(t.login.password);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await loginUserServer(email, password);
      
      if (typeof result === 'string') {
        setError(result);
      } else {
        onLogin(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.login);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
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
          <ArrowLeft size={18} /> {t.common.home}
        </button>

        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">U</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{t.login.title}</h2>
            <p className="text-gray-500 mt-2">{t.login.subtitle}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.login.email}</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.login.password}</label>
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
              {t.login.login}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              {t.login.noAccount} <span onClick={onNavigateToSignUp} className="text-blue-600 font-bold cursor-pointer hover:underline">{t.login.signUp}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
