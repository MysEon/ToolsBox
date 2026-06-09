import CryptoJS from 'crypto-js';

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export interface HashResult {
  algorithm: HashAlgorithm;
  label: string;
  value: string;
}

export const HASH_ALGORITHMS: { id: HashAlgorithm; label: string; description: string }[] = [
  { id: 'md5', label: 'MD5', description: '128-bit，仅用于校验' },
  { id: 'sha1', label: 'SHA-1', description: '160-bit，仅用于校验' },
  { id: 'sha256', label: 'SHA-256', description: '256-bit，推荐' },
  { id: 'sha512', label: 'SHA-512', description: '512-bit，高安全' },
];

const algorithmLabels: Record<HashAlgorithm, string> = HASH_ALGORITHMS.reduce(
  (labels, algorithm) => ({ ...labels, [algorithm.id]: algorithm.label }),
  {} as Record<HashAlgorithm, string>
);

function digest(input: string | CryptoJS.lib.WordArray, algorithm: HashAlgorithm): string {
  switch (algorithm) {
    case 'md5':
      return CryptoJS.MD5(input).toString();
    case 'sha1':
      return CryptoJS.SHA1(input).toString();
    case 'sha256':
      return CryptoJS.SHA256(input).toString();
    case 'sha512':
      return CryptoJS.SHA512(input).toString();
    default: {
      const exhaustiveCheck: never = algorithm;
      return exhaustiveCheck;
    }
  }
}

export function hashText(input: string, algorithms: HashAlgorithm[]): HashResult[] {
  return algorithms.map((algorithm) => ({
    algorithm,
    label: algorithmLabels[algorithm],
    value: digest(input, algorithm),
  }));
}

export function hashArrayBuffer(buffer: ArrayBuffer, algorithms: HashAlgorithm[]): HashResult[] {
  const view = new Uint8Array(buffer);
  const words: number[] = [];

  for (let i = 0; i < view.length; i += 4) {
    words.push(
      ((view[i] ?? 0) << 24) |
      ((view[i + 1] ?? 0) << 16) |
      ((view[i + 2] ?? 0) << 8) |
      (view[i + 3] ?? 0)
    );
  }

  const wordArray = CryptoJS.lib.WordArray.create(words, view.length);

  return algorithms.map((algorithm) => ({
    algorithm,
    label: algorithmLabels[algorithm],
    value: digest(wordArray, algorithm),
  }));
}
