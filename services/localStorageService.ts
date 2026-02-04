import { GeneratedImage, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY_IMAGES = 'urban_gen_gallery_images';
const STORAGE_KEY_USER = 'urban_gen_current_user';
const STORAGE_KEY_USERS = 'urban_gen_all_users';

// 使用SHA256密码哈希函数（与后端保持一致）
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'urban_gen_salt');
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// 验证密码
const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const computedHash = await hashPassword(password);
  return computedHash === hashedPassword;
};

/**
 * 保存图像数据到本地存储
 * @param images 要保存的图像数组
 */
export const saveImagesToLocalStorage = (images: GeneratedImage[]): void => {
  try {
    const jsonData = JSON.stringify(images);
    localStorage.setItem(STORAGE_KEY_IMAGES, jsonData);
  } catch (error) {
    console.error('Failed to save images to localStorage:', error);
  }
};

/**
 * 从本地存储加载图像数据
 * @returns 加载的图像数组，如果没有数据则返回空数组
 */
export const loadImagesFromLocalStorage = (): GeneratedImage[] => {
  try {
    const jsonData = localStorage.getItem(STORAGE_KEY_IMAGES);
    if (jsonData) {
      const images = JSON.parse(jsonData);
      return images.filter((image: GeneratedImage) => !image.url.includes('picsum.photos'));
    }
  } catch (error) {
    console.error('Failed to load images from localStorage:', error);
  }
  return [];
};

/**
 * 清除本地存储中的图像数据
 */
export const clearImagesFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_IMAGES);
  } catch (error) {
    console.error('Failed to clear images from localStorage:', error);
  }
};

/**
 * 保存用户信息到本地存储
 * @param user 要保存的用户信息
 */
export const saveUserToLocalStorage = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
};

/**
 * 从本地存储加载用户信息
 * @returns 加载的用户信息，如果没有数据则返回null
 */
export const loadUserFromLocalStorage = (): User | null => {
  try {
    const jsonData = localStorage.getItem(STORAGE_KEY_USER);
    if (jsonData) {
      return JSON.parse(jsonData);
    }
  } catch (error) {
    console.error('Failed to load user from localStorage:', error);
  }
  return null;
};

/**
 * 清除本地存储中的用户信息
 */
export const clearUserFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_USER);
  } catch (error) {
    console.error('Failed to clear user from localStorage:', error);
  }
};

/**
 * 保存所有用户数据到本地存储
 * @param users 要保存的用户数组
 */
export const saveAllUsersToLocalStorage = (users: User[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save all users to localStorage:', error);
  }
};

/**
 * 从本地存储加载所有用户数据
 * @returns 加载的用户数组，如果没有数据则返回空数组
 */
export const loadAllUsersFromLocalStorage = (): User[] => {
  try {
    const jsonData = localStorage.getItem(STORAGE_KEY_USERS);
    if (jsonData) {
      return JSON.parse(jsonData);
    }
  } catch (error) {
    console.error('Failed to load all users from localStorage:', error);
  }
  return [];
};

/**
 * 注册新用户
 * @param name 用户名
 * @param email 邮箱
 * @param password 密码
 * @returns 注册成功返回用户对象，失败返回错误信息
 */
export const registerUser = async (name: string, email: string, password: string): Promise<User | string> => {
  try {
    const allUsers = loadAllUsersFromLocalStorage();
    
    // 检查邮箱是否已存在
    if (allUsers.some(user => user.email === email)) {
      return '该邮箱已被注册';
    }
    
    // 检查用户名是否已存在
    if (allUsers.some(user => user.name === name)) {
      return '该用户名已被使用';
    }
    
    // 创建新用户
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password: await hashPassword(password),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      credits: 100, // 初始积分
      joinedAt: Date.now()
    };
    
    // 保存新用户
    allUsers.push(newUser);
    saveAllUsersToLocalStorage(allUsers);
    
    return newUser;
  } catch (error) {
    console.error('Failed to register user:', error);
    return '注册失败，请稍后重试';
  }
};

/**
 * 用户登录验证
 * @param email 邮箱
 * @param password 密码
 * @returns 登录成功返回用户对象，失败返回错误信息
 */
export const loginUser = async (email: string, password: string): Promise<User | string> => {
  try {
    const allUsers = loadAllUsersFromLocalStorage();
    
    // 查找用户
    const user = allUsers.find(user => user.email === email);
    
    if (!user) {
      return '用户不存在';
    }
    
    // 验证密码
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return '密码错误';
    }
    
    return user;
  } catch (error) {
    console.error('Failed to login user:', error);
    return '登录失败，请稍后重试';
  }
};

/**
 * 检查用户名是否已存在
 * @param name 用户名
 * @returns 存在返回true，不存在返回false
 */
export const isUsernameExists = (name: string): boolean => {
  try {
    const allUsers = loadAllUsersFromLocalStorage();
    return allUsers.some(user => user.name === name);
  } catch (error) {
    console.error('Failed to check username:', error);
    return false;
  }
};

/**
 * 检查邮箱是否已存在
 * @param email 邮箱
 * @returns 存在返回true，不存在返回false
 */
export const isEmailExists = (email: string): boolean => {
  try {
    const allUsers = loadAllUsersFromLocalStorage();
    return allUsers.some(user => user.email === email);
  } catch (error) {
    console.error('Failed to check email:', error);
    return false;
  }
};

/**
 * 更新用户信息
 * @param user 更新后的用户信息
 */
export const updateUser = (user: User): void => {
  try {
    const allUsers = loadAllUsersFromLocalStorage();
    const userIndex = allUsers.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      allUsers[userIndex] = user;
      saveAllUsersToLocalStorage(allUsers);
    }
    
    saveUserToLocalStorage(user);
  } catch (error) {
    console.error('Failed to update user:', error);
  }
};

const downloadImageToLocal = async (imageDataUrl: string, imageId: string): Promise<string> => {
  try {
    const response = await fetch('/api/save-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: imageDataUrl,
        imageId: imageId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save image to server');
    }

    const result = await response.json();
    return result.localPath;
  } catch (error) {
    console.error('Failed to download image to local:', error);
    throw error;
  }
};

export const saveGeneratedImageToLocal = async (imageDataUrl: string, imageId: string): Promise<string | null> => {
  try {
    const localPath = await downloadImageToLocal(imageDataUrl, imageId);
    return localPath;
  } catch (error) {
    console.error('Failed to save generated image to local:', error);
    return null;
  }
};

export const saveGenerationRecord = async (record: {
  userId: string;
  userName?: string;
  userEmail?: string;
  imageId: string;
  model: string;
  resolution?: string;
  aspectRatio?: string;
  imageSize?: string;
  prompt?: string;
  userPrompt?: string;
  moduleName?: string;
}): Promise<boolean> => {
  try {
    const response = await fetch('/api/save-generation-record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      throw new Error('Failed to save generation record to server');
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to save generation record:', error);
    return false;
  }
};

export const getGenerationRecords = async (userId?: string): Promise<any[]> => {
  try {
    const url = userId ? `/api/generation-records/${userId}` : '/api/generation-records';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch generation records');
    }

    const result = await response.json();
    return result.records || [];
  } catch (error) {
    console.error('Failed to fetch generation records:', error);
    return [];
  }
};

export const registerUserServer = async (name: string, email: string, password: string): Promise<User | string> => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return errorData.error || '注册失败，请稍后重试';
      } catch {
        return '注册失败，请稍后重试';
      }
    }

    const text = await response.text();
    if (!text) {
      return '注册失败，服务器返回空响应';
    }

    const result = JSON.parse(text);
    return result.user as User;
  } catch (error) {
    console.error('Failed to register user:', error);
    return '注册失败，请稍后重试';
  }
};

export const loginUserServer = async (email: string, password: string): Promise<User | string> => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return errorData.error || '登录失败，请稍后重试';
      } catch {
        return '登录失败，请稍后重试';
      }
    }

    const text = await response.text();
    if (!text) {
      return '登录失败，服务器返回空响应';
    }

    const result = JSON.parse(text);
    return result.user as User;
  } catch (error) {
    console.error('Failed to login user:', error);
    return '登录失败，请稍后重试';
  }
};

export const getUserFromServer = async (userId: string): Promise<User | null> => {
  try {
    const response = await fetch(`/api/user/${userId}`);

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.user as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};

export const updateUserCreditsServer = async (userId: string, credits: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/user/${userId}/credits`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credits })
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to update user credits:', error);
    return false;
  }
};

export const createPayment = async (userId: string, packageId: string, amount: number, subject?: string): Promise<{ success: boolean; orderId?: string; qrCode?: string; error?: string }> => {
  try {
    const response = await fetch('/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, packageId, amount, subject })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }

    const result = await response.json();
    return { success: true, orderId: result.orderId, qrCode: result.qrCode };
  } catch (error) {
    console.error('Failed to create payment:', error);
    return { success: false, error: '网络错误，请稍后重试' };
  }
};

export const queryPayment = async (orderId: string): Promise<{ success: boolean; order?: any }> => {
  try {
    const response = await fetch(`/api/payment/query/${orderId}`);

    if (!response.ok) {
      return { success: false };
    }

    const result = await response.json();
    return { success: true, order: result.order };
  } catch (error) {
    console.error('Failed to query payment:', error);
    return { success: false };
  }
};
