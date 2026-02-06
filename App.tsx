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
import AdminDashboard from './components/AdminDashboard';
import { Page, GeneratedImage, DesignModule, User } from './types';
import { getModules } from './modules';
import { loadImagesFromLocalStorage, saveImagesToLocalStorage, loadUserFromLocalStorage, saveUserToLocalStorage, clearUserFromLocalStorage, loginUserServer, registerUserServer, updateUserCreditsServer, getUserFromServer, getAdminRechargeRecords } from './services/localStorageService';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedModule, setSelectedModule] = useState<DesignModule | null>(null);
  const [galleryImages, setGalleryImages] = useState<GeneratedImage[]>(loadImagesFromLocalStorage);
  const [currentUser, setCurrentUser] = useState<User | null>(loadUserFromLocalStorage);
  const [hasRechargeRecord, setHasRechargeRecord] = useState<boolean>(false);
  const modules = getModules(language);

  useEffect(() => {
    saveImagesToLocalStorage(galleryImages);
  }, [galleryImages]);

  useEffect(() => {
    saveUserToLocalStorage(currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      checkRechargeRecord();
    }
  }, [currentUser]);

  const checkRechargeRecord = async () => {
    if (!currentUser) return;
    const result = await getAdminRechargeRecords(currentUser.email);
    if (result.success && result.records) {
      setHasRechargeRecord(result.records.some(r => r.status === 'success' && r.userId === currentUser.id));
    }
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== Page.GENERATOR_WORKSPACE && page !== Page.PROFILE && page !== Page.RECHARGE && page !== Page.ADMIN_DASHBOARD) {
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
      {currentPage !== Page.LOGIN && currentPage !== Page.SIGN_UP && (
        <Navbar 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          user={currentUser} 
          hasRechargeRecord={hasRechargeRecord}
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
          <GeneratorHub modules={modules} onSelectModule={handleSelectModule} />
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

        {currentPage === Page.ADMIN_DASHBOARD && currentUser && (
          <AdminDashboard 
            user={currentUser}
            onBack={() => handleNavigate(Page.HOME)}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
