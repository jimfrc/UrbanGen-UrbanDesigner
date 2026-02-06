export enum Page {
  HOME = 'HOME',
  GENERATOR_HUB = 'GENERATOR_HUB',
  GENERATOR_WORKSPACE = 'GENERATOR_WORKSPACE',
  GALLERY = 'GALLERY',
  LOGIN = 'LOGIN',
  SIGN_UP = 'SIGN_UP',
  PROFILE = 'PROFILE',
  RECHARGE = 'RECHARGE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export const ADMIN_EMAIL = '172311284@qq.com';

export enum Resolution {
  RES_NANO_BANANA_FAST = 'nano-banana-fast',
  RES_NANO_BANANA_PRO = 'nano-banana-pro',
  RES_NANO_BANANA_PRO_VT = 'nano-banana-pro-vt'
}

export type AspectRatio = 'auto' | '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3' | '5:4' | '4:5' | '21:9';

export type ImageSize = '1K' | '2K' | '4K';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  credits: number;
  joinedAt: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  userPrompt: string;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  moduleName: string;
  createdAt: number;
  localPath?: string;
}

export interface DesignModule {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  fixedPrompt: string;      // 固定模板部分，每个模块不一样
  defaultUserPrompt: string; // 用户可输入的提示词的默认值
}

export const CREDIT_COSTS: Record<Resolution, number> = {
  [Resolution.RES_NANO_BANANA_FAST]: 10,
  [Resolution.RES_NANO_BANANA_PRO]: 30,
  [Resolution.RES_NANO_BANANA_PRO_VT]: 40
};


export interface RechargePackage {
  id: string;
  credits: number;
  price: number;
  label: string;
}

export const RECHARGE_PACKAGES: RechargePackage[] = [
  { id: 'pkg-10', credits: 10, price: 0.1, label: 'Starter' },
  { id: 'pkg-1000', credits: 1000, price: 10, label: 'Advanced' },
  { id: 'pkg-4000', credits: 4000, price: 30, label: 'Professional' }
];

export interface RechargeRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  credits: number;
  status: 'pending' | 'success' | 'failed';
  createdAt: number;
}

export interface GenerationRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  moduleName: string;
  model: string;
  prompt: string;
  resolution: string;
  aspectRatio: string;
  imageSize: string;
  success: boolean;
  credits: number;
  createdAt: number;
}

export interface AdminStats {
  today: {
    totalImages: number;
    successImages: number;
    successRate: number;
    totalCredits: number;
    newUsers: number;
    totalRechargeAmount: number;
    totalRechargeCredits: number;
  };
  total: {
    totalImages: number;
    successImages: number;
    successRate: number;
    totalCredits: number;
    totalUsers: number;
    totalRechargeAmount: number;
    totalRechargeCredits: number;
  };
  moduleUsage: Array<{
    moduleName: string;
    count: number;
  }>;
  rechargeRecords: RechargeRecord[];
  recentGenerations: GenerationRecord[];
}
