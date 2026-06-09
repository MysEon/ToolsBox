import { LucideIcon, Shield, Key, Lock, Hash, Zap, Clock } from 'lucide-react';

export interface CryptoMethod {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  requiresKey: boolean;
  keyPlaceholder?: string;
  category: 'modern' | 'classical';
  color: string;
}

// 主流加密方法
export const modernCryptoMethods: CryptoMethod[] = [
  {
    id: 'aes',
    name: 'AES',
    description: '高级加密标准，最广泛使用的对称加密算法',
    icon: Shield,
    requiresKey: true,
    keyPlaceholder: '请输入密钥（建议16位以上）',
    category: 'modern',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'des',
    name: 'DES',
    description: '数据加密标准，经典的对称加密算法',
    icon: Key,
    requiresKey: true,
    keyPlaceholder: '请输入8位密钥',
    category: 'modern',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'tripledes',
    name: '3DES',
    description: '三重数据加密算法，DES的增强版本',
    icon: Lock,
    requiresKey: true,
    keyPlaceholder: '请输入密钥（24位）',
    category: 'modern',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'base64',
    name: 'Base64',
    description: '基础64编码，常用于数据传输和存储',
    icon: Hash,
    requiresKey: false,
    category: 'modern',
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'md5',
    name: 'MD5',
    description: 'MD5哈希算法（仅加密，不可逆）',
    icon: Zap,
    requiresKey: false,
    category: 'modern',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'sha256',
    name: 'SHA-256',
    description: 'SHA-256哈希算法（仅加密，不可逆）',
    icon: Shield,
    requiresKey: false,
    category: 'modern',
    color: 'from-red-500 to-red-600'
  }
];

// 古典加密方法
export const classicalCryptoMethods: CryptoMethod[] = [
  {
    id: 'caesar',
    name: '凯撒密码',
    description: '最简单的替换密码，通过字母移位进行加密',
    icon: Clock,
    requiresKey: true,
    keyPlaceholder: '请输入移位数字（1-25）',
    category: 'classical',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'vigenere',
    name: '维吉尼亚密码',
    description: '多表替换密码，使用关键词进行加密',
    icon: Key,
    requiresKey: true,
    keyPlaceholder: '请输入关键词（英文字母）',
    category: 'classical',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'railfence',
    name: '栅栏密码',
    description: '通过锯齿形排列文字进行加密的换位密码',
    icon: Hash,
    requiresKey: true,
    keyPlaceholder: '请输入栅栏数（2-10）',
    category: 'classical',
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'morse',
    name: '摩斯密码',
    description: '使用点和划的组合来表示字母和数字',
    icon: Zap,
    requiresKey: false,
    category: 'classical',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'atbash',
    name: 'Atbash密码',
    description: '希伯来字母表的替换密码，A↔Z, B↔Y...',
    icon: Lock,
    requiresKey: false,
    category: 'classical',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'rot13',
    name: 'ROT13',
    description: '凯撒密码的特殊情况，固定移位13位',
    icon: Shield,
    requiresKey: false,
    category: 'classical',
    color: 'from-emerald-500 to-emerald-600'
  }
];

export const getAllCryptoMethods = () => {
  return [...modernCryptoMethods, ...classicalCryptoMethods];
};

export const getCryptoMethodById = (id: string) => {
  return getAllCryptoMethods().find(method => method.id === id);
};
