import React from 'react';
import { DesignModule } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface GeneratorHubProps {
  modules: DesignModule[];
  onSelectModule: (module: DesignModule) => void;
}

const GeneratorHub: React.FC<GeneratorHubProps> = ({ modules, onSelectModule }) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.generatorHub.title}</h2>
          <p className="text-xl text-blue-600 font-medium tracking-wide uppercase">{t.generatorHub.subtitle}</p>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">{t.generatorHub.selectModule}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <div 
              key={module.id}
              className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              onClick={() => onSelectModule(module)}
            >
              <img 
                src={module.imageUrl} 
                alt={module.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h3 className="text-3xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{module.title}</h3>
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                  <p className="text-gray-200 text-sm leading-relaxed mb-4">{module.description}</p>
                  <span className="inline-block px-4 py-2 border border-white/30 rounded-full text-xs font-semibold tracking-wider hover:bg-white hover:text-black transition-colors">
                    ENTER STUDIO
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneratorHub;
