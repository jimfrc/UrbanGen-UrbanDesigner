import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Maximize2 } from 'lucide-react';

interface GalleryProps {
  images: GeneratedImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  if (images.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
            <Maximize2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Gallery is Empty</h3>
          <p className="text-gray-500">No urban designs generated yet. Go to the Studio to create your first masterpiece.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900">Community Gallery</h2>
          <p className="mt-2 text-gray-500">Explore designs created by the Nano Banana Pro engine</p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image) => (
            <div key={image.id} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
              <img 
                src={image.url} 
                alt={image.prompt} 
                className="w-full h-auto object-cover"
              />
              
              {/* Overlay Info */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div>
                   <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded mb-2">
                     {image.moduleName}
                   </span>
                   <p className="text-gray-200 text-sm line-clamp-3 font-light leading-relaxed">
                     "{image.userPrompt || image.prompt}"
                   </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-700 pt-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Resolution</span>
                    <span className="text-white font-mono text-sm">{image.resolution}</span>
                  </div>
                  <a 
                    href={image.url}
                    download={`gallery-${image.id}.png`}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    title="Download"
                  >
                    <Download size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
