import React from 'react';
import { Shield } from 'lucide-react';
import { Page, User, ADMIN_EMAIL } from '../types';
import { Layout, Palette, Image as ImageIcon, User as UserIcon, LogIn, Database, Languages, Crown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: User | null;
  hasRechargeRecord?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, user, hasRechargeRecord = false }) => {
  const { t, toggleLanguage, language } = useLanguage();

  const isAdmin = user?.email === ADMIN_EMAIL;
  const isProMember = hasRechargeRecord;

  const navItems = [
    { page: Page.HOME, label: t.common.home, icon: Layout },
    { page: Page.GENERATOR_HUB, label: t.common.generatorHub, icon: Palette },
    { page: Page.GALLERY, label: t.common.gallery, icon: ImageIcon },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate(Page.HOME)}>
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg mr-2"></div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
              UrbanGen
            </span>
          </div>

          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.page || (item.page === Page.GENERATOR_HUB && currentPage === Page.GENERATOR_WORKSPACE)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
              title={t.common.language}
            >
              <Languages size={16} />
              <span>{language === 'zh' ? 'EN' : '中'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                {isProMember && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                    PRO MEMBER
                  </span>
                )}
                <button 
                  onClick={() => onNavigate(Page.RECHARGE)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 rounded-full border border-amber-100 transition-colors"
                >
                  <Database size={14} className="text-amber-600" />
                  <span className="text-sm font-bold text-amber-700">{user.credits}</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => onNavigate(Page.ADMIN_DASHBOARD)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium transition-colors"
                  >
                    <Shield size={14} />
                    {t.common.adminDashboard}
                  </button>
                )}
                <button 
                  onClick={() => onNavigate(Page.PROFILE)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                    currentPage === Page.PROFILE ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate(Page.LOGIN)}
                className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <LogIn size={18} />
                {t.common.login}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
