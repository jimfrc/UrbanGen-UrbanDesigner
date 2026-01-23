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
import { v4 as uuidv4 } from 'uuid';
import { MODULES } from './modules';
import { loadImagesFromLocalStorage, saveImagesToLocalStorage, loadUserFromLocalStorage, saveUserToLocalStorage, clearUserFromLocalStorage, registerUser, loginUser, updateUser } from './services/localStorageService';

const MOCK_IMAGES: GeneratedImage[] = [
  {
    id: uuidv4(),
    url: 'https://picsum.photos/1024/768?random=10',
    prompt: 'Concept art of a floating city above clouds',
    userPrompt: 'floating city above clouds',
    resolution: '2K' as any,
    aspectRatio: '16:9' as any,
    imageSize: '1K' as any,
    moduleName: 'Futuristic',
    createdAt: Date.now() - 86400000
  },
  {
    id: uuidv4(),
    url: 'https://picsum.photos/1024/768?random=11',
    prompt: 'Underground lush garden city',
    userPrompt: 'underground lush garden',
    resolution: '1K' as any,
    aspectRatio: '4:3' as any,
    imageSize: '1K' as any,
    moduleName: 'Eco-Friendly City',
    createdAt: Date.now() - 172800000
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedModule, setSelectedModule] = useState<DesignModule | null>(null);
  // 初始加载时优先从本地存储获取数据，如果没有则使用模拟数据
  const [galleryImages, setGalleryImages] = useState<GeneratedImage[]>(() => {
    const savedImages = loadImagesFromLocalStorage();
    return savedImages.length > 0 ? savedImages : MOCK_IMAGES;
  });
  // 从本地存储加载用户信息
  const [currentUser, setCurrentUser] = useState<User | null>(loadUserFromLocalStorage);

  // 监听galleryImages变化，自动保存到本地存储
  useEffect(() => {
    saveImagesToLocalStorage(galleryImages);
  }, [galleryImages]);

  // 监听currentUser变化，自动保存到本地存储
  useEffect(() => {
    saveUserToLocalStorage(currentUser);
  }, [currentUser]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== Page.GENERATOR_WORKSPACE && page !== Page.PROFILE && page !== Page.RECHARGE) {
      setSelectedModule(null);
    }
  };

  const handleLogin = (email: string, password: string) => {
    // 调用登录验证服务
    const result = loginUser(email, password);
    
    if (typeof result === 'string') {
      // 登录失败，抛出错误以便组件捕获
      throw new Error(result);
    }
    
    // 登录成功
    setCurrentUser(result);
    setCurrentPage(Page.HOME);
  };

  const handleSignUp = (name: string, email: string, password: string) => {
    // 调用注册服务
    const result = registerUser(name, email, password);
    
    if (typeof result === 'string') {
      // 注册失败，抛出错误以便组件捕获
      throw new Error(result);
    }
    
    // 注册成功，自动登录
    setCurrentUser(result);
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
      updateUser(updatedUser); // 更新所有用户列表中的数据
    }
  };

  const handleRechargeComplete = (credits: number) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        credits: currentUser.credits + credits
      };
      setCurrentUser(updatedUser);
      updateUser(updatedUser); // 更新所有用户列表中的数据
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