import CryptoJS from 'crypto-js';

export interface CryptoResult {
  success: boolean;
  result?: string;
  error?: string;
}

// AES 加密
export const encryptAES = (text: string, key: string): CryptoResult => {
  try {
    if (!key.trim()) {
      return { success: false, error: '请输入密钥' };
    }
    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
    return { success: true, result: encrypted };
  } catch (error) {
    return { success: false, error: '加密失败：' + (error as Error).message };
  }
};

// AES 解密
export const decryptAES = (encryptedText: string, key: string): CryptoResult => {
  try {
    if (!key.trim()) {
      return { success: false, error: '请输入密钥' };
    }
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    if (!result) {
      return { success: false, error: '解密失败：密钥错误或数据损坏' };
    }
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '解密失败：' + (error as Error).message };
  }
};

// DES 加密
export const encryptDES = (text: string, key: string): CryptoResult => {
  try {
    if (!key.trim()) {
      return { success: false, error: '请输入密钥' };
    }
    const encrypted = CryptoJS.DES.encrypt(text, key).toString();
    return { success: true, result: encrypted };
  } catch (error) {
    return { success: false, error: '加密失败：' + (error as Error).message };
  }
};

// DES 解密
export const decryptDES = (encryptedText: string, key: string): CryptoResult => {
  try {
    if (!key.trim()) {
      return { success: false, error: '请输入密钥' };
    }
    const decrypted = CryptoJS.DES.decrypt(encryptedText, key);
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    if (!result) {
      return { success: false, error: '解密失败：密钥错误或数据损坏' };
    }
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '解密失败：' + (error as Error).message };
  }
};

// 3DES 加密
export const encryptTripleDES = (text: string, key: string): CryptoResult => {
  try {
    if (!key.trim()) {
      return { success: false, error: '请输入密钥' };
    }
    const encrypted = CryptoJS.TripleDES.encrypt(text, key).toString();
    return { success: true, result: encrypted };
  } catch (error) {
    return { success: false, error: '加密失败：' + (error as Error).message };
  }
};

// 3DES 解密
export const decryptTripleDES = (encryptedText: string, key: string): CryptoResult => {
  try {
    if (!key.trim()) {
      return { success: false, error: '请输入密钥' };
    }
    const decrypted = CryptoJS.TripleDES.decrypt(encryptedText, key);
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    if (!result) {
      return { success: false, error: '解密失败：密钥错误或数据损坏' };
    }
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '解密失败：' + (error as Error).message };
  }
};

// Base64 编码
export const encodeBase64 = (text: string): CryptoResult => {
  try {
    const encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
    return { success: true, result: encoded };
  } catch (error) {
    return { success: false, error: '编码失败：' + (error as Error).message };
  }
};

// Base64 解码
export const decodeBase64 = (encodedText: string): CryptoResult => {
  try {
    const decoded = CryptoJS.enc.Base64.parse(encodedText);
    const result = decoded.toString(CryptoJS.enc.Utf8);
    if (!result) {
      return { success: false, error: '解码失败：无效的Base64格式' };
    }
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '解码失败：' + (error as Error).message };
  }
};

// MD5 哈希
export const hashMD5 = (text: string): CryptoResult => {
  try {
    const hash = CryptoJS.MD5(text).toString();
    return { success: true, result: hash };
  } catch (error) {
    return { success: false, error: '哈希失败：' + (error as Error).message };
  }
};

// SHA-256 哈希
export const hashSHA256 = (text: string): CryptoResult => {
  try {
    const hash = CryptoJS.SHA256(text).toString();
    return { success: true, result: hash };
  } catch (error) {
    return { success: false, error: '哈希失败：' + (error as Error).message };
  }
};

// 主流加密方法的统一接口
export const processModernCrypto = (
  method: string,
  text: string,
  key: string,
  operation: 'encrypt' | 'decrypt'
): CryptoResult => {
  if (!text.trim()) {
    return { success: false, error: '请输入要处理的文本' };
  }

  switch (method) {
    case 'aes':
      return operation === 'encrypt' ? encryptAES(text, key) : decryptAES(text, key);
    case 'des':
      return operation === 'encrypt' ? encryptDES(text, key) : decryptDES(text, key);
    case 'tripledes':
      return operation === 'encrypt' ? encryptTripleDES(text, key) : decryptTripleDES(text, key);
    case 'base64':
      return operation === 'encrypt' ? encodeBase64(text) : decodeBase64(text);
    case 'md5':
      if (operation === 'decrypt') {
        return { success: false, error: 'MD5是单向哈希算法，无法解密' };
      }
      return hashMD5(text);
    case 'sha256':
      if (operation === 'decrypt') {
        return { success: false, error: 'SHA-256是单向哈希算法，无法解密' };
      }
      return hashSHA256(text);
    default:
      return { success: false, error: '不支持的加密方法' };
  }
};
