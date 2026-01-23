import { Resolution, AspectRatio, ImageSize } from '../types';

// 根据API文档，使用正确的Grsai Nano Banana绘画接口
const GRS_API_HOST = process.env.GRS_API_HOST || 'https://grsai.dakka.com.cn';
const GRS_API_ENDPOINT = `${GRS_API_HOST}/v1/draw/nano-banana`;
// 注意：实际使用时需要从环境变量获取API密钥
const API_KEY = process.env.GRS_API_KEY || '';

// 辅助函数：处理图像URL
function processImageUrl(url: string): string {
  // 移除可能的反引号和空格
  const cleanedUrl = url.trim().replace(/`/g, '');
  
  // 如果是绝对URL，直接返回
  if (cleanedUrl.startsWith('http://') || cleanedUrl.startsWith('https://')) {
    return cleanedUrl;
  }
  // 如果是相对URL，添加主机前缀
  else if (cleanedUrl.startsWith('/')) {
    return `${GRS_API_HOST}${cleanedUrl}`;
  }
  // 如果是base64数据，添加前缀
  else if (!cleanedUrl.startsWith('data:')) {
    return `data:image/png;base64,${cleanedUrl}`;
  }
  // 其他情况直接返回
  else {
    return cleanedUrl;
  }
}

// 辅助函数：处理图像数据
function processImageData(imageData: string): string {
  // 确保返回完整的data URL
  if (imageData.startsWith('data:')) {
    return imageData;
  } else {
    // 如果只返回base64数据，添加data URL前缀
    return `data:image/png;base64,${imageData}`;
  }
}

// 辅助函数：处理SSE响应
async function handleSSEResponse(response: Response, onProgress?: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = response.body?.getReader();
    if (!reader) {
      reject(new Error('Failed to get response reader for SSE'));
      return;
    }

    let buffer = '';
    
    // SSE事件解析器
    const decoder = new TextDecoder('utf-8');
    
    // 清理资源函数
    const cleanup = () => {
      if (reader) {
        reader.releaseLock();
      }
    };
    
    function read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          cleanup();
          reject(new Error('SSE connection closed without completing generation'));
          return;
        }

        // 解码新数据
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // 分割事件
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        
        // 处理每个事件
        for (const event of events) {
          if (!event) continue;
          
          // 解析事件数据
          const dataMatch = event.match(/^data: (.*)$/ms);
          if (dataMatch) {
            try {
              const eventData = JSON.parse(dataMatch[1]);
              console.log('SSE event:', { status: eventData.status, progress: eventData.progress });
              
              // 发送进度更新
              if (eventData.progress !== undefined) {
                onProgress?.(eventData.progress);
              }
              
              // 检查任务状态
              if (eventData.status === 'failed') {
                cleanup();
                reject(new Error('Image generation failed: ' + (eventData.failure_reason || eventData.error || 'Unknown error')));
                return;
              } else if (eventData.status === 'succeeded' && eventData.results) {
                // 任务完成，获取图像URL
                if (eventData.results.length > 0 && eventData.results[0].url) {
                  const imageUrl = processImageUrl(eventData.results[0].url);
                  cleanup();
                  resolve(imageUrl);
                  return;
                }
              }
            } catch (e) {
              console.error('Failed to parse SSE event data:', e);
            }
          }
        }
        
        // 继续读取
        read();
      }).catch(error => {
        cleanup();
        reject(error);
      });
    }
    
    // 开始读取
    read();
  });
}

export const generateUrbanConcept = async (
  prompt: string, 
  resolution: Resolution,
  referenceImages: string[] = [],
  aspectRatio: AspectRatio = 'auto',
  imageSize: ImageSize = '1K',
  onProgress?: (progress: number) => void
): Promise<string> => {
  // 根据分辨率选择对应的模型名称
  const MODEL_NAME = resolution;
  
  // 确保API密钥已设置
  if (!API_KEY) {
    throw new Error('API key is required for image generation. Please set GRS_API_KEY in your environment variables.');
  }

  try {
    // 构建符合Grsai Nano Banana绘画接口要求的请求体
    const requestBody: any = {
      prompt: prompt,
      model: MODEL_NAME,
      aspectRatio: aspectRatio,
      shutProgress: false
    };
    
    // 添加更详细的日志，帮助调试第二次请求失败问题
    console.log('=== Image Generation Request ===');
    console.log('Model:', MODEL_NAME);
    console.log('Prompt:', prompt.substring(0, 50) + '...');
    console.log('Aspect Ratio:', aspectRatio);
    console.log('Image Size:', requestBody.imageSize);
    console.log('Reference Images:', referenceImages.length);
    console.log('================================');
    
    // 根据API文档，只有特定模型支持imageSize参数
    // 支持模型：nano-banana-pro, nano-banana-pro-vt
    if (MODEL_NAME.includes('pro') && !MODEL_NAME.includes('fast')) {
      // 这些模型支持1K, 2K, 4K
      requestBody.imageSize = imageSize;
    }
    // fast模型不使用imageSize参数
    console.log('API Request Body:', requestBody);

    // 如果提供了参考图，添加到请求体中
    if (referenceImages.length > 0) {
      // 处理多个参考图像
      requestBody.urls = referenceImages.map((image) => {
        // 检查是否是base64数据
        if (image.startsWith('data:')) {
          // 如果是base64数据，直接返回
          return image;
        } else {
          // 否则假设是URL，直接返回
          return image;
        }
      });
    }

    // 调用Grsai API
    const response = await fetch(GRS_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // 获取响应的Content-Type
    const contentType = response.headers.get('content-type') || '';
    
    // 检查是否是SSE格式响应
    if (contentType.includes('text/event-stream')) {
      return await handleSSEResponse(response, onProgress);
    }
    // 根据Content-Type处理不同的响应格式
    else if (contentType.startsWith('image/')) {
      // 直接返回图像数据
      const blob = await response.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } else if (contentType.startsWith('application/json')) {
      // 解析JSON响应
      const responseData = await response.json();
      
      // 检查API响应是否成功
      if (!response.ok) {
        throw new Error(`API request failed: ${responseData.message || responseData.error || response.statusText}`);
      }
      
      // 处理新的API响应格式
      if (responseData.status === 'succeeded' && responseData.results) {
        // 从results数组获取第一个图像URL
        if (responseData.results.length > 0 && responseData.results[0].url) {
          const imageUrl = responseData.results[0].url;
          return processImageUrl(imageUrl);
        }
      }
      // 处理旧的API响应格式作为后备
      else if (responseData.code === 0 && responseData.data) {
        // 检查是否有直接返回的图像数据
        if (responseData.data.image) {
          const imageData = responseData.data.image;
          return processImageData(imageData);
        }
        // 如果返回的是任务ID，需要查询结果接口
        else if (responseData.data.task_id) {
          return await getGenerationResult(responseData.data.task_id);
        }
      }
      // 如果返回的是任务ID，需要查询结果接口
      else if (responseData.task_id) {
        return await getGenerationResult(responseData.task_id);
      }
    } else {
      // 处理其他响应格式
      const responseText = await response.text();
      
      // 检查是否是直接的base64图像数据
      if (responseText.startsWith('data:')) {
        console.log('API returned direct data URL:', responseText.substring(0, 50) + '...');
        return responseText;
      } else if (responseText.startsWith('{')) {
        // 尝试解析为JSON
        try {
          const responseData = JSON.parse(responseText);
          if (responseData.code === 0 && responseData.data?.image) {
            const imageData = responseData.data.image;
            return processImageData(imageData);
          }
        } catch (e) {
          // JSON解析失败，抛出错误
          throw new Error(`API returned unexpected format: ${responseText.substring(0, 50)}...`);
        }
      }
    }

    throw new Error('No image found in API response.');
  } catch (error) {
    console.error('Grsai API Error:', error);
    throw error;
  }
};

// 获取图像生成结果的函数
const getGenerationResult = async (taskId: string): Promise<string> => {
  const resultEndpoint = `${GRS_API_HOST}/v1/draw/result`;
  
  // 轮询获取结果，最多尝试10次，每次间隔3秒
  for (let i = 0; i < 10; i++) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const response = await fetch(resultEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task_id: taskId })
    });
    
    // 获取响应的Content-Type
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.startsWith('image/')) {
      // 直接返回图像数据
      const blob = await response.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } else {
      // 尝试解析为JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        // JSON解析失败，尝试读取为文本
        const responseText = await response.text();
        // 检查是否是直接的base64图像数据
        if (responseText.startsWith('data:')) {
          return responseText;
        }
        throw new Error(`API returned unexpected format: ${responseText.substring(0, 50)}...`);
      }
      
      // 处理新的API响应格式
      if (responseData.status === 'succeeded' && responseData.results) {
        // 从results数组获取第一个图像URL
        if (responseData.results.length > 0 && responseData.results[0].url) {
          const imageUrl = responseData.results[0].url;
          return processImageUrl(imageUrl);
        }
      }
      // 处理旧的API响应格式作为后备
      else if (responseData.code === 0 && responseData.data) {
        if (responseData.data.image) {
          const imageData = responseData.data.image;
          return processImageData(imageData);
        }
        // 检查任务状态
        else if (responseData.data.status === 'failed') {
          throw new Error('Image generation failed: ' + (responseData.data.message || 'Unknown error'));
        }
      }
      // 处理直接返回的任务状态
      else if (responseData.status === 'failed') {
        throw new Error('Image generation failed: ' + (responseData.failure_reason || responseData.error || 'Unknown error'));
      }
    }
  }
  
  throw new Error('Image generation timed out. Please try again.');
};