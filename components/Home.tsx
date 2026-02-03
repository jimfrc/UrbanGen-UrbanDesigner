import React from 'react';
import { Page } from '../types';
import Button from './Button';
import { ArrowRight } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Auto-scrolling Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <div className="flex h-full w-[400%] animate-scroll-bg">
            <img 
              src="/modules/bg1.jpg" 
              className="h-full w-1/4 object-cover" 
              alt="Urban landscape 1"
            />
            <img 
              src="/modules/bg2.jpg" 
              className="h-full w-1/4 object-cover" 
              alt="Urban landscape 2"
            />
            <img 
              src="/modules/bg3.jpg" 
              className="h-full w-1/4 object-cover" 
              alt="Urban landscape 3"
            />
            <img 
              src="/modules/bg4.jpg" 
              className="h-full w-1/4 object-cover" 
              alt="Urban landscape 4"
            />
        </div>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <div className="max-w-4xl w-full space-y-6 sm:space-y-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl leading-tight">
            Reshape the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Future City</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
            Empowering architects and urban planners with Nano Banana Pro. Generate high-fidelity concepts in seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-6 sm:pt-8 w-full sm:w:w-auto">
            <Button 
              variant="outline" 
              className="border-white bg-black text-white hover:bg-gray-500 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold w-full sm:w-auto"
              onClick={() => onNavigate(Page.GENERATOR_HUB)}
            >
              Start Designing <ArrowRight className="ml-2" />
            </Button>
            <Button 
               variant="outline" 
               className="border-white text-white hover:bg-black hover:text-black px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
               onClick={() => onNavigate(Page.GALLERY)}
            >
              View Gallery
            </Button>
          </div>
        </div>
      </div>
      
      {/* Gradient Overlay for bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default Home;
