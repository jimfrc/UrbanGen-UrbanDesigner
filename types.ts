export enum Page {
  HOME = 'HOME',
  GENERATOR_HUB = 'GENERATOR_HUB',
  GENERATOR_WORKSPACE = 'GENERATOR_WORKSPACE',
  GALLERY = 'GALLERY',
  LOGIN = 'LOGIN',
  SIGN_UP = 'SIGN_UP',
  PROFILE = 'PROFILE',
  RECHARGE = 'RECHARGE'
}

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
  prompt: string; // 完整提示词（fixed + user）
  userPrompt: string; // 仅用户输入的提示词
  resolution: Resolution;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  moduleName: string;
  createdAt: number;
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
  { id: 'pkg-1000', credits: 1000, price: 10, label: 'Starter' },
  { id: 'pkg-5000', credits: 5000, price: 45, label: 'Professional' },
  { id: 'pkg-10000', credits: 10000, price: 80, label: 'Enterprise' }
];
