import React from 'react';
import { User, GeneratedImage, Page } from '../types';
import { Database, Image as ImageIcon, Calendar, LogOut, ChevronRight, Plus } from 'lucide-react';
import Button from './Button';

interface ProfileProps {
  user: User;
  userImages: GeneratedImage[];
  onLogout: () => void;
  onNavigate: (page: Page) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, userImages, onLogout, onNavigate }) => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 mb-4">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
                  Senior Designer
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100 uppercase tracking-wider">
                  Pro Member
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Button variant="outline" className="border-red-100 text-red-600 hover:bg-red-50" onClick={onLogout}>
              <LogOut size={18} /> Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 translate-x-4 -translate-y-4 opacity-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500">
               <Database size={100} />
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
              <Database size={24} />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Credits Balance</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{user.credits} <span className="text-sm font-normal text-gray-400 ml-1">pts</span></h3>
              </div>
              <button 
                onClick={() => onNavigate(Page.RECHARGE)}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <Plus size={16} /> Top-up
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
              <ImageIcon size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Designs</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{userImages.length}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
              <Calendar size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium">Member Since</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </h3>
          </div>
        </div>

        {/* Recent Designs List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Personal Workspace</h2>
            <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {userImages.length > 0 ? (
              userImages.slice(0, 5).map((img) => (
                <div key={img.id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{img.moduleName}</h4>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{img.userPrompt || img.prompt}</p>
                    <div className="flex items-center gap-4 mt-2">
                       <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                         {img.resolution}
                       </span>
                       <span className="text-xs text-gray-400">
                         {new Date(img.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400">
                No designs yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
