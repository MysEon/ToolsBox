export interface CryptoResult {
  success: boolean;
  result?: string;
  error?: string;
}

// 凯撒密码加密
export const encryptCaesar = (text: string, shift: number): CryptoResult => {
  try {
    if (shift < 1 || shift > 25) {
      return { success: false, error: '移位数必须在1-25之间' };
    }
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        const shifted = ((code - base + shift) % 26) + base;
        result += String.fromCharCode(shifted);
      } else {
        result += char;
      }
    }
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '加密失败：' + (error as Error).message };
  }
};

// 凯撒密码解密
export const decryptCaesar = (text: string, shift: number): CryptoResult => {
  try {
    if (shift < 1 || shift > 25) {
      return { success: false, error: '移位数必须在1-25之间' };
    }
    return encryptCaesar(text, 26 - shift);
  } catch (error) {
    return { success: false, error: '解密失败：' + (error as Error).message };
  }
};

// 维吉尼亚密码加密
export const encryptVigenere = (text: string, key: string): CryptoResult => {
  try {
    if (!key.match(/^[a-zA-Z]+$/)) {
      return { success: false, error: '关键词只能包含英文字母' };
    }
    
    const normalizedKey = key.toLowerCase();
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        const charCode = char.toLowerCase().charCodeAt(0) - 97;
        const keyCode = normalizedKey[keyIndex % normalizedKey.length].charCodeAt(0) - 97;
        const encrypted = (charCode + keyCode) % 26;
        const isUpperCase = char === char.toUpperCase();
        result += String.fromCharCode(encrypted + (isUpperCase ? 65 : 97));
        keyIndex++;
      } else {
        result += char;
      }
    }
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '加密失败：' + (error as Error).message };
  }
};

// 维吉尼亚密码解密
export const decryptVigenere = (text: string, key: string): CryptoResult => {
  try {
    if (!key.match(/^[a-zA-Z]+$/)) {
      return { success: false, error: '关键词只能包含英文字母' };
    }
    
    const normalizedKey = key.toLowerCase();
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        const charCode = char.toLowerCase().charCodeAt(0) - 97;
        const keyCode = normalizedKey[keyIndex % normalizedKey.length].charCodeAt(0) - 97;
        const decrypted = (charCode - keyCode + 26) % 26;
        const isUpperCase = char === char.toUpperCase();
        result += String.fromCharCode(decrypted + (isUpperCase ? 65 : 97));
        keyIndex++;
      } else {
        result += char;
      }
    }
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '解密失败：' + (error as Error).message };
  }
};

// 栅栏密码加密
export const encryptRailFence = (text: string, rails: number): CryptoResult => {
  try {
    if (rails < 2 || rails > 10) {
      return { success: false, error: '栅栏数必须在2-10之间' };
    }
    
    const fence: string[][] = Array(rails).fill(null).map(() => []);
    let rail = 0;
    let direction = 1;
    
    for (let i = 0; i < text.length; i++) {
      fence[rail].push(text[i]);
      rail += direction;
      
      if (rail === rails - 1 || rail === 0) {
        direction = -direction;
      }
    }
    
    const result = fence.map(row => row.join('')).join('');
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '加密失败：' + (error as Error).message };
  }
};

// 栅栏密码解密
export const decryptRailFence = (text: string, rails: number): CryptoResult => {
  try {
    if (rails < 2 || rails > 10) {
      return { success: false, error: '栅栏数必须在2-10之间' };
    }
    
    const fence: (string | null)[][] = Array(rails).fill(null).map(() => Array(text.length).fill(null));
    let rail = 0;
    let direction = 1;
    
    // 标记位置
    for (let i = 0; i < text.length; i++) {
      fence[rail][i] = '*';
      rail += direction;
      
      if (rail === rails - 1 || rail === 0) {
        direction = -direction;
      }
    }
    
    // 填充字符
    let index = 0;
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < text.length; c++) {
        if (fence[r][c] === '*' && index < text.length) {
          fence[r][c] = text[index++];
        }
      }
    }
    
    // 读取结果
    let result = '';
    rail = 0;
    direction = 1;
    
    for (let i = 0; i < text.length; i++) {
      result += fence[rail][i];
      rail += direction;
      
      if (rail === rails - 1 || rail === 0) {
        direction = -direction;
      }
    }
    
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '解密失败：' + (error as Error).message };
  }
};

// 摩斯密码映射
const morseCode: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

// 摩斯密码加密
export const encryptMorse = (text: string): CryptoResult => {
  try {
    const result = text.toUpperCase()
      .split('')
      .map(char => morseCode[char] || char)
      .join(' ');
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '加密失败：' + (error as Error).message };
  }
};

// 摩斯密码解密
export const decryptMorse = (text: string): CryptoResult => {
  try {
    const reverseMorse: { [key: string]: string } = {};
    Object.entries(morseCode).forEach(([char, morse]) => {
      reverseMorse[morse] = char;
    });
    
    const result = text.split(' ')
      .map(morse => reverseMorse[morse] || morse)
      .join('');
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '解密失败：' + (error as Error).message };
  }
};

// Atbash密码
export const processAtbash = (text: string): CryptoResult => {
  try {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-z]/i)) {
        const isUpperCase = char === char.toUpperCase();
        const code = char.toLowerCase().charCodeAt(0);
        const reversed = 122 - (code - 97) + 97; // z - (char - a) + a
        result += String.fromCharCode(isUpperCase ? reversed - 32 : reversed);
      } else {
        result += char;
      }
    }
    return { success: true, result };
  } catch (error) {
    return { success: false, error: '处理失败：' + (error as Error).message };
  }
};

// ROT13
export const processROT13 = (text: string): CryptoResult => {
  return encryptCaesar(text, 13);
};

// 古典加密方法的统一接口
export const processClassicalCrypto = (
  method: string,
  text: string,
  key: string,
  operation: 'encrypt' | 'decrypt'
): CryptoResult => {
  if (!text.trim()) {
    return { success: false, error: '请输入要处理的文本' };
  }

  switch (method) {
    case 'caesar':
      const shift = parseInt(key);
      if (isNaN(shift)) {
        return { success: false, error: '请输入有效的移位数字' };
      }
      return operation === 'encrypt' ? encryptCaesar(text, shift) : decryptCaesar(text, shift);
    
    case 'vigenere':
      return operation === 'encrypt' ? encryptVigenere(text, key) : decryptVigenere(text, key);
    
    case 'railfence':
      const rails = parseInt(key);
      if (isNaN(rails)) {
        return { success: false, error: '请输入有效的栅栏数' };
      }
      return operation === 'encrypt' ? encryptRailFence(text, rails) : decryptRailFence(text, rails);
    
    case 'morse':
      return operation === 'encrypt' ? encryptMorse(text) : decryptMorse(text);
    
    case 'atbash':
      return processAtbash(text);
    
    case 'rot13':
      return processROT13(text);
    
    default:
      return { success: false, error: '不支持的加密方法' };
  }
};
