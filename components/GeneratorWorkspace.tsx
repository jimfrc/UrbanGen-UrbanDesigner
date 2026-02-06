import React, { useState, useRef } from 'react';
import { DesignModule, Resolution, GeneratedImage, CREDIT_COSTS, User, AspectRatio, ImageSize } from '../types';
import Button from './Button';
import { generateUrbanConcept } from '../services/geminiService';
import { saveGeneratedImageToLocal, saveGenerationRecord } from '../services/localStorageService';
import { Download, Sliders, AlertCircle, Database, Lock, Upload } from 'lucide-react';
import { v4 as uuidv } from 'uuid';
import { useLanguage } from '../contexts/LanguageContext';

interface GeneratorWorkspaceProps {
  module: DesignModule;
  user: User | null;
  onBack: () => void;
  onImageGenerated: (image: GeneratedImage, cost: number) => void;
  onNavigate: (page: any) => void;
}

const GeneratorWorkspace: React.FC<GeneratorWorkspaceProps> = ({ module, user, onBack, onImageGenerated, onNavigate }) => {
  const { t } = useLanguage();
  const [userPrompt, setUserPrompt] = useState(module.defaultUserPrompt);
  const [resolution, setResolution] = useState<Resolution>(Resolution.RES_NANO_BANANA_FAST);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<number | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [referenceImages, setReferenceImages] = useState<{id: string, url: string, name: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 4;
  const MAX_SIZE_MB = 4;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const cost = CREDIT_COSTS[resolution];
  const canAfford = user ? user.credits >= cost : false;

  const handleGenerate = async () => {
    if (!user) {
      onNavigate('LOGIN');
      return;
    }

    if (!canAfford) {
      setError(`Insufficient credits. You need ${cost} points for ${resolution} resolution.`);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // 拼接固定模板和用户输入的提示词
      const fullPrompt = userPrompt ? `${module.fixedPrompt}, ${userPrompt}` : module.fixedPrompt;
      // 提取所有参考图像的URL
      const referenceImageUrls = referenceImages.map(img => img.url);
      let resultBase64 = await generateUrbanConcept(fullPrompt, resolution, referenceImageUrls, aspectRatio, imageSize, (progress) => {
        setGenerationProgress(progress);
      });
      
      // 验证返回的图像数据
      if (!resultBase64 || typeof resultBase64 !== 'string') {
        throw new Error('Invalid image data received from API.');
      }
      
      // 检查图像数据格式
      console.log('Generated image data type:', typeof resultBase64);
      console.log('Generated image data starts with:', resultBase64.substring(0, 50) + '...');
      console.log('Generated image data length:', resultBase64.length);
      
      // 确保图像数据是有效的data URL
      if (!resultBase64.startsWith('data:image/')) {
        console.error('Image data is not a valid data URL:', resultBase64.substring(0, 50) + '...');
        // 尝试修复图像数据格式
        if (resultBase64.startsWith('data:')) {
          console.log('Image data is a data URL but not an image:', resultBase64.substring(0, 50) + '...');
        } else if (resultBase64.startsWith('{')) {
          console.log('Image data appears to be JSON:', resultBase64.substring(0, 50) + '...');
        } else if (resultBase64.length > 1000) {
          // 可能是直接的base64数据，尝试添加前缀
          const fixedData = `data:image/png;base64,${resultBase64}`;
          console.log('Trying fixed data URL:', fixedData.substring(0, 50) + '...');
          resultBase64 = fixedData;
        }
      }
      
      // 更新状态显示图像
      setGeneratedImage(resultBase64);
      
      // 检查状态是否更新
      setTimeout(() => {
        console.log('After state update, generatedImage is:', typeof generatedImage, generatedImage ? generatedImage.substring(0, 50) + '...' : null);
      }, 0);
      
      const imageId = uuidv();
      const newImage: GeneratedImage = {
        id: imageId,
        url: resultBase64,
        prompt: fullPrompt,
        userPrompt: userPrompt,
        resolution: resolution,
        aspectRatio: aspectRatio,
        imageSize: imageSize,
        moduleName: module.title,
        createdAt: Date.now()
      };

      const localPath = await saveGeneratedImageToLocal(resultBase64, imageId);
      if (localPath) {
        newImage.localPath = localPath;
      }

      await saveGenerationRecord({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        imageId: imageId,
        model: resolution,
        resolution: resolution,
        aspectRatio: aspectRatio,
        imageSize: imageSize,
        prompt: fullPrompt,
        userPrompt: userPrompt,
        moduleName: module.title,
        credits: cost,
        success: true
      });

      onImageGenerated(newImage, cost);

    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  // 图像压缩函数
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // 创建canvas进行压缩
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          
          // 保持原始宽高比
          canvas.width = img.width;
          canvas.height = img.height;
          
          try {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // 根据文件大小调整压缩质量
            let quality = 0.9;
            if (file.size > 3 * 1024 * 1024) quality = 0.7;
            else if (file.size > 2 * 1024 * 1024) quality = 0.8;
            else if (file.size > 1 * 1024 * 1024) quality = 0.85;
            
            // 转换为base64
            const compressedDataUrl = canvas.toDataURL(file.type, quality);
            resolve(compressedDataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => {
          reject(new Error('Failed to load image for compression'));
        };
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 计算可上传的剩余位置
    const remainingSlots = MAX_IMAGES - referenceImages.length;
    if (remainingSlots <= 0) {
      setError(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    // 限制只处理可上传的数量
    const filesToProcess: File[] = Array.from(files).slice(0, remainingSlots) as File[];
    const newImages: {id: string, url: string, name: string}[] = [];

    for (const file of filesToProcess) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        setError('Please upload image files only.');
        return;
      }

      try {
        let imageUrl: string;
        
        // 检查文件大小，如果超过限制则压缩
        if (file.size > MAX_SIZE_BYTES) {
          imageUrl = await compressImage(file);
        } else {
          // 直接读取文件
          imageUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }

        const imageName = `图${referenceImages.length + newImages.length + 1}`;
        newImages.push({ id: uuidv(), url: imageUrl, name: imageName });
      } catch (err) {
        setError('Failed to process image. Please try again.');
        return;
      }
    }

    // 添加新图像到现有列表
    setReferenceImages(prev => [...prev, ...newImages]);
    setError(null);
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveReferenceImage = (imageId: string) => {
    setReferenceImages(prev => {
      // 删除指定图像
      const updated = prev.filter(img => img.id !== imageId);
      // 重新编号剩余图像
      return updated.map((img, index) => ({
        ...img,
        name: `图${index + 1}`
      }));
    });
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-white flex flex-col md:flex-row">
      {/* Left Panel: Controls */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-6 border-r border-gray-100 flex flex-col h-[calc(100vh-6rem)] overflow-y-auto">
        <button onClick={onBack} className="text-gray-500 hover:text-black mb-6 flex items-center gap-2 text-sm font-medium">
          ← {t.common.generatorHub}
        </button>

        <h2 className="text-2xl font-bold mb-1">{module.title}</h2>
        <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest">Configuration</p>

        <div className="space-y-8 flex-1">
          {/* Reference Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Upload size={16} /> {t.generatorWorkspace.referenceImage} (Optional, max {MAX_IMAGES})
            </label>
            
            {/* 已上传图像网格 */}
            {referenceImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                {referenceImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <img 
                      src={img.url} 
                      alt={img.name} 
                      className="w-full h-32 object-cover rounded-xl border-2 border-dashed border-blue-500"
                    />
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      {img.name}
                    </div>
                    <button 
                      onClick={() => handleRemoveReferenceImage(img.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* 上传区域 */}
            {referenceImages.length < MAX_IMAGES && (
              <div 
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={24} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">{t.generatorWorkspace.uploadImage}</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to {MAX_SIZE_MB}MB (automatic compression)</p>
                <p className="text-xs text-gray-400 mt-1">Uploaded: {referenceImages.length}/{MAX_IMAGES}</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple // 允许选择多个文件
                />
              </div>
            )}
          </div>

          {/* Parameters (Prompt) Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sliders size={16} /> Parameters (Prompt)
            </label>
            
            {/* User Prompt (Editable) */}
            <div>
              <textarea
                className="w-full h-40 p-4 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 text-sm leading-relaxed resize-none transition-all"
                placeholder={t.generatorWorkspace.promptPlaceholder}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
            </div>
          </div>

          {/* Aspect Ratio Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              {t.generatorWorkspace.aspectRatio}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                'auto', '1:1', '16:9', '9:16', '4:3', '3:4', 
                '3:2', '2:3', '5:4', '4:5', '21:9'
              ].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio as AspectRatio)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${ratio === 'auto' ? 'col-span-3' : ''} ${ratio === aspectRatio ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Image Size Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              {t.generatorWorkspace.imageSize}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['1K', '2K', '4K'].map((size) => (
                <button
                  key={size}
                  onClick={() => setImageSize(size as ImageSize)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${size === imageSize ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Output Quality (Model) Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              {t.generatorWorkspace.model}
            </label>
            <div className="grid grid-cols-1 gap-3">
              {(Object.keys(CREDIT_COSTS) as Resolution[]).map((res) => {
                // 只允许nano banana fast和nano banana pro模型
                const isDisabled = !res.includes('nano-banana-fast') && !res.includes('nano-banana-pro');
                
                return (
                  <button
                    key={res}
                    onClick={() => !isDisabled && setResolution(res)}
                    className={`flex items-center justify-between p-4 rounded-xl text-sm font-medium border transition-all ${isDisabled ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed' : resolution === res ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    disabled={isDisabled}
                  >
                    <span className="font-bold">{res}</span>
                    <div className="flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded-full border border-gray-100">
                      <Database size={12} />
                      <span>{CREDIT_COSTS[res]} pts</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          
          {/* Progress Bar */}
          {isGenerating && generationProgress !== null && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{t.generatorWorkspace.generating}</span>
                <span className="text-sm font-bold text-blue-600">{generationProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <Button 
            className={`w-full py-4 text-lg shadow-xl ${canAfford || !user ? 'shadow-blue-500/20' : 'bg-gray-400 cursor-not-allowed shadow-none'}`} 
            onClick={handleGenerate} 
            isLoading={isGenerating}
            disabled={user && !canAfford}
          >
            {!user ? (
               <>{t.common.login}</>
            ) : (
               <div className="flex items-center gap-2">
                 {canAfford ? t.generatorWorkspace.generate : <><Lock size={18} /> Insufficient Points</>}
                 <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">-{cost}</span>
               </div>
            )}
          </Button>
          
          {user && (
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              Current balance: <span className="font-bold text-gray-600">{user.credits} pts</span>
            </p>
          )}
        </div>
      </div>

      {/* Right Panel: Visualization */}
      <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center relative">
        <div className="w-full h-full max-h-[80vh] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex items-center justify-center relative group">
          
          {generatedImage ? (
             <>
              <img 
                src={generatedImage} 
                alt="Generated Urban Plan" 
                className="max-w-full max-h-full object-contain border-2 border-red-500"
                style={{ display: 'block', visibility: 'visible', opacity: 1 }} // 确保图像可见
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={generatedImage} 
                  download={`urban-gen-${Date.now()}.png`}
                  className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-white flex items-center gap-2 text-sm font-medium backdrop-blur-sm"
                >
                  <Download size={18} /> Download
                </a>
              </div>
             </>
          ) : (
            <div className="text-center text-gray-400">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ImageIconPlaceholder />
              </div>
              <p className="text-lg font-medium text-gray-600">Architectural Canvas</p>
              <p className="text-sm">Enter parameters to visualize your project</p>
            </div>
          )}
          
          {isGenerating && (
             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-blue-600 font-bold animate-pulse text-xl">Materializing Space...</p>
                <p className="text-gray-400 text-sm mt-2">Deducting {cost} credits</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ImageIconPlaceholder = () => (
  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
  </svg>
);

export default GeneratorWorkspace;
