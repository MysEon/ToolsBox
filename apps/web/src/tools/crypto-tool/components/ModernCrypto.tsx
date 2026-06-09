'use client';

import { useState } from 'react';
import { Copy, Lock, Unlock, AlertCircle, CheckCircle } from 'lucide-react';
import { modernCryptoMethods } from '../data/cryptoMethods';
import { processModernCrypto } from '../utils/modernCrypto';

export default function ModernCrypto() {
  const [selectedMethod, setSelectedMethod] = useState('aes');
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedMethodData = modernCryptoMethods.find(m => m.id === selectedMethod);

  const handleProcess = async () => {
    if (!inputText.trim()) { setError('请输入要处理的文本'); return; }
    setIsProcessing(true);
    setError('');
    setSuccess('');
    try {
      const cryptoResult = processModernCrypto(selectedMethod, inputText, key, operation);
      if (cryptoResult.success) {
        setResult(cryptoResult.result || '');
        setSuccess(`${operation === 'encrypt' ? '加密' : '解密'}成功！`);
      } else {
        setError(cryptoResult.error || '处理失败');
        setResult('');
      }
    } catch { setError('处理过程中发生错误'); setResult(''); }
    finally { setIsProcessing(false); }
  };

  const handleCopy = async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(result); setSuccess('结果已复制到剪贴板'); }
    catch { setError('复制失败'); }
  };

  const handleClear = () => { setInputText(''); setKey(''); setResult(''); setError(''); setSuccess(''); };

  const isHashMethod = selectedMethod === 'md5' || selectedMethod === 'sha256';

  const inputClass = 'w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

  return (
    <div className="space-y-5">
      {/* Algorithm select */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">选择加密算法</label>
        <select
          value={selectedMethod}
          onChange={(e) => { setSelectedMethod(e.target.value); setResult(''); setError(''); setSuccess(''); }}
          className={inputClass}
        >
          {modernCryptoMethods.map(m => (
            <option key={m.id} value={m.id}>{m.name} - {m.description}</option>
          ))}
        </select>
      </div>

      {/* Operation toggle */}
      {!isHashMethod && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">操作类型</label>
          <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-700/50 rounded-lg w-fit">
            <button
              onClick={() => setOperation('encrypt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                operation === 'encrypt' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              加密
            </button>
            <button
              onClick={() => setOperation('decrypt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                operation === 'decrypt' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Unlock className="h-3.5 w-3.5" />
              解密
            </button>
          </div>
        </div>
      )}

      {/* Key input */}
      {selectedMethodData?.requiresKey && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">密钥</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={selectedMethodData.keyPlaceholder}
            className={inputClass}
          />
        </div>
      )}

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          {operation === 'encrypt' ? '原始文本' : '加密文本'}
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`请输入要${operation === 'encrypt' ? '加密' : '解密'}的文本...`}
          rows={4}
          className={inputClass + ' resize-y'}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="flex-1 px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isProcessing ? '处理中...' : isHashMethod ? '生成哈希' : operation === 'encrypt' ? '加密' : '解密'}
        </button>
        <button onClick={handleClear} className="px-4 py-2.5 border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-sm">
          清空
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {isHashMethod ? '哈希结果' : operation === 'encrypt' ? '加密结果' : '解密结果'}
            </label>
            <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
              <Copy className="h-3.5 w-3.5" />
              复制
            </button>
          </div>
          <textarea
            value={result}
            readOnly
            rows={4}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-700/50 border border-zinc-200 dark:border-zinc-600 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none resize-y"
          />
        </div>
      )}
    </div>
  );
}
