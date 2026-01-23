import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { isUsernameExists, isEmailExists } from '../services/localStorageService';

interface SignUpProps {
  onSignUp: (name: string, email: string, password: string) => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onNavigateToLogin, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 实时检查用户名是否可用
  useEffect(() => {
    if (name.trim()) {
      const timer = setTimeout(() => {
        const exists = isUsernameExists(name);
        setIsNameAvailable(!exists);
        setNameError(exists ? '该用户名已被使用' : '');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsNameAvailable(null);
      setNameError('');
    }
  }, [name]);

  // 实时检查邮箱是否可用
  useEffect(() => {
    if (email.trim()) {
      const timer = setTimeout(() => {
        const exists = isEmailExists(email);
        setIsEmailAvailable(!exists);
        setEmailError(exists ? '该邮箱已被注册' : '');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsEmailAvailable(null);
      setEmailError('');
    }
  }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 表单验证
    if (!name.trim()) {
      setError('请输入用户名');
      return;
    }
    
    if (!email.trim()) {
      setError('请输入邮箱');
      return;
    }
    
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    
    if (password.length < 6) {
      setError('密码长度不能少于6个字符');
      return;
    }
    
    if (nameError || emailError) {
      setError('请检查输入的用户名和邮箱');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      try {
        onSignUp(name, email, password);
      } catch (err) {
        setError(err instanceof Error ? err.message : '注册失败');
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
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2">Join UrbanGen to start creating amazing urban designs</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  placeholder="Choose a username"
                  className={`w-full pl-11 pr-10 py-3 rounded-xl border ${nameError ? 'border-red-500' : isNameAvailable === true ? 'border-green-500' : 'border-gray-200'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                {isNameAvailable !== null && (
                  <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${isNameAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {isNameAvailable ? '✓' : '✗'}
                  </div>
                )}
              </div>
              {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className={`w-full pl-11 pr-10 py-3 rounded-xl border ${emailError ? 'border-red-500' : isEmailAvailable === true ? 'border-green-500' : 'border-gray-200'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                {isEmailAvailable !== null && (
                  <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${isEmailAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {isEmailAvailable ? '✓' : '✗'}
                  </div>
                )}
              </div>
              {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password"
                  required
                  placeholder="Create a password (min 6 characters)"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {password.length > 0 && password.length < 6 && (
                <p className="mt-1 text-xs text-red-500">密码长度不能少于6个字符</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 rounded-xl text-lg shadow-xl shadow-blue-500/10"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account? <span onClick={onNavigateToLogin} className="text-blue-600 font-bold cursor-pointer hover:underline">Sign In</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;