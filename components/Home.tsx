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
        <div className="flex h-full w-[200%] animate-scroll-bg">
            <img 
              src="https://picsum.photos/2400/1200?grayscale&blur=2" 
              className="h-full w-1/2 object-cover" 
              alt="Urban landscape 1"
            />
             <img 
              src="https://picsum.photos/2401/1200?grayscale&blur=2" 
              className="h-full w-1/2 object-cover" 
              alt="Urban landscape 2"
            />
        </div>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl space-y-8 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-2xl whitespace-nowrap">
            Reshape the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Future City</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto">
            Empowering architects and urban planners with Nano Banana Pro. Generate high-fidelity concepts in seconds.
          </p>
          <div className="flex justify-center gap-4 pt-8">
            <Button 
              variant="outline" 
              className="border-white bg-black text-white hover:bg-gray-500 px-8 py-4 text-lg font-bold"
              onClick={() => onNavigate(Page.GENERATOR_HUB)}
            >
              Start Designing <ArrowRight className="ml-2" />
            </Button>
            <Button 
               variant="outline" 
               className="border-white text-white hover:bg-black hover:text-black px-8 py-4 text-lg"
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
