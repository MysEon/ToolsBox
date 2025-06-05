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
    if (!inputText.trim()) {
      setError('请输入要处理的文本');
      return;
    }

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
    } catch (err) {
      setError('处理过程中发生错误');
      setResult('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setSuccess('结果已复制到剪贴板');
      } catch (err) {
        setError('复制失败');
      }
    }
  };

  const handleClear = () => {
    setInputText('');
    setKey('');
    setResult('');
    setError('');
    setSuccess('');
  };

  const isHashMethod = selectedMethod === 'md5' || selectedMethod === 'sha256';

  return (
    <div className="space-y-6">

      {/* 算法选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择加密算法
        </label>
        <select
          value={selectedMethod}
          onChange={(e) => {
            setSelectedMethod(e.target.value);
            setResult('');
            setError('');
            setSuccess('');
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {modernCryptoMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name} - {method.description}
            </option>
          ))}
        </select>
      </div>

      {/* 操作选择 */}
      {!isHashMethod && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            操作类型
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="encrypt"
                checked={operation === 'encrypt'}
                onChange={(e) => setOperation(e.target.value as 'encrypt' | 'decrypt')}
                className="mr-2"
              />
              <Lock className="h-4 w-4 mr-1" />
              加密
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="decrypt"
                checked={operation === 'decrypt'}
                onChange={(e) => setOperation(e.target.value as 'encrypt' | 'decrypt')}
                className="mr-2"
              />
              <Unlock className="h-4 w-4 mr-1" />
              解密
            </label>
          </div>
        </div>
      )}

      {/* 密钥输入 */}
      {selectedMethodData?.requiresKey && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            密钥
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={selectedMethodData.keyPlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* 输入文本 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {operation === 'encrypt' ? '原始文本' : '加密文本'}
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`请输入要${operation === 'encrypt' ? '加密' : '解密'}的文本...`}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isProcessing ? '处理中...' : (isHashMethod ? '生成哈希' : (operation === 'encrypt' ? '加密' : '解密'))}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          清空
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* 成功提示 */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* 结果显示 */}
      {result && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {isHashMethod ? '哈希结果' : (operation === 'encrypt' ? '加密结果' : '解密结果')}
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              <Copy className="h-4 w-4 mr-1" />
              复制
            </button>
          </div>
          <textarea
            value={result}
            readOnly
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
