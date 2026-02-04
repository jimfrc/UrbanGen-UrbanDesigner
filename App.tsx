import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import GeneratorHub from './components/GeneratorHub';
import GeneratorWorkspace from './components/GeneratorWorkspace';
import Gallery from './components/Gallery';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Recharge from './components/Recharge';
import { Page, GeneratedImage, DesignModule, User } from './types';
import { MODULES } from './modules';
import { loadImagesFromLocalStorage, saveImagesToLocalStorage, loadUserFromLocalStorage, saveUserToLocalStorage, clearUserFromLocalStorage, loginUserServer, registerUserServer, updateUserCreditsServer, getUserFromServer } from './services/localStorageService';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedModule, setSelectedModule] = useState<DesignModule | null>(null);
  const [galleryImages, setGalleryImages] = useState<GeneratedImage[]>(loadImagesFromLocalStorage);
  // 从本地存储加载用户信息
  const [currentUser, setCurrentUser] = useState<User | null>(loadUserFromLocalStorage);

  // 监听galleryImages变化，自动保存到本地存储
  useEffect(() => {
    saveImagesToLocalStorage(galleryImages);
  }, [galleryImages]);

  useEffect(() => {
    saveUserToLocalStorage(currentUser);
  }, [currentUser]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== Page.GENERATOR_WORKSPACE && page !== Page.PROFILE && page !== Page.RECHARGE) {
      setSelectedModule(null);
    }
  };

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    setCurrentPage(Page.HOME);
  };

  const handleSignUp = async (user: User) => {
    setCurrentUser(user);
    setCurrentPage(Page.HOME);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearUserFromLocalStorage();
    setCurrentPage(Page.HOME);
  };

  const handleSelectModule = (module: DesignModule) => {
    setSelectedModule(module);
    setCurrentPage(Page.GENERATOR_WORKSPACE);
  };

  const handleImageGenerated = (newImage: GeneratedImage, cost: number) => {
    setGalleryImages((prev) => [newImage, ...prev]);
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        credits: currentUser.credits - cost
      };
      setCurrentUser(updatedUser);
      updateUserCreditsServer(currentUser.id, updatedUser.credits);
    }
  };

  const handleRechargeComplete = (credits: number) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        credits: currentUser.credits + credits
      };
      setCurrentUser(updatedUser);
      updateUserCreditsServer(currentUser.id, updatedUser.credits);
    }
    setTimeout(() => {
      setCurrentPage(Page.PROFILE);
    }, 2000);
  };

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen selection:bg-blue-100 selection:text-blue-900">
      {/* 在登录和注册页面不显示导航栏 */}
      {currentPage !== Page.LOGIN && currentPage !== Page.SIGN_UP && (
        <Navbar 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          user={currentUser} 
        />
      )}
      
      <main>
        {currentPage === Page.HOME && (
          <Home onNavigate={handleNavigate} />
        )}
        
        {currentPage === Page.LOGIN && (
          <Login 
            onLogin={handleLogin} 
            onNavigateToSignUp={() => handleNavigate(Page.SIGN_UP)} 
            onBack={() => handleNavigate(Page.HOME)} 
          />
        )}
        
        {currentPage === Page.SIGN_UP && (
          <SignUp 
            onSignUp={handleSignUp} 
            onNavigateToLogin={() => handleNavigate(Page.LOGIN)} 
            onBack={() => handleNavigate(Page.HOME)} 
          />
        )}

        {currentPage === Page.PROFILE && currentUser && (
          <Profile 
            user={currentUser} 
            userImages={galleryImages} 
            onLogout={handleLogout} 
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === Page.RECHARGE && currentUser && (
          <Recharge 
            user={currentUser}
            onBack={() => handleNavigate(Page.PROFILE)} 
            onRechargeComplete={handleRechargeComplete} 
          />
        )}

        {currentPage === Page.GENERATOR_HUB && (
          <GeneratorHub modules={MODULES} onSelectModule={handleSelectModule} />
        )}

        {currentPage === Page.GENERATOR_WORKSPACE && selectedModule && (
          <GeneratorWorkspace 
            module={selectedModule} 
            user={currentUser}
            onBack={() => handleNavigate(Page.GENERATOR_HUB)}
            onImageGenerated={handleImageGenerated}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === Page.GALLERY && (
          <Gallery images={galleryImages} />
        )}
      </main>
    </div>
  );
}

export default App;