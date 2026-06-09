'use client';

import React, { useState } from 'react';
import { US_STATES, getTaxFreeStates, getTaxableStates } from '../data/states';
import { generateMultipleProfiles, CompleteProfile } from '../utils/addressGenerator';
import { exportToJSON, exportToCSV, exportToTXT, copyToClipboard } from '../utils/exportUtils';
import { Download, Copy, RefreshCw } from 'lucide-react';

interface GeneratorSettingsProps {
  onProfilesGenerated?: (profiles: CompleteProfile[]) => void;
}

const selectClass = 'w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-zinc-100 dark:disabled:bg-zinc-700/50 transition-colors';
const inputClass = 'w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

export default function GeneratorSettings({ onProfilesGenerated }: GeneratorSettingsProps = {}) {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [taxFilter, setTaxFilter] = useState('');
  const [batchCount, setBatchCount] = useState(1);
  const [isCustomCount, setIsCustomCount] = useState(false);
  const [customCount, setCustomCount] = useState('');
  const [customCountError, setCustomCountError] = useState('');
  const [generatedProfiles, setGeneratedProfiles] = useState<CompleteProfile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const getFilteredStates = () => {
    switch (taxFilter) { case 'tax-free': return getTaxFreeStates(); case 'taxable': return getTaxableStates(); default: return US_STATES; }
  };

  const availableCities = selectedState ? US_STATES.find(s => s.name === selectedState)?.cities || [] : [];

  const handleCountChange = (value: string) => {
    if (value === 'custom') { setIsCustomCount(true); setCustomCount(''); setCustomCountError(''); }
    else { setIsCustomCount(false); setBatchCount(Number(value)); setCustomCount(''); setCustomCountError(''); }
  };

  const handleCustomCountChange = (value: string) => {
    setCustomCount(value); setCustomCountError('');
    if (value === '') { setBatchCount(1); return; }
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) { setCustomCountError('请输入有效的正整数'); setBatchCount(1); }
    else if (num > 1000) { setCustomCountError('数量不能超过1000'); setBatchCount(1000); }
    else { setBatchCount(num); }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 400));
    try {
      const profiles = generateMultipleProfiles(batchCount, selectedState || undefined, selectedCity || undefined);
      setGeneratedProfiles(profiles);
      onProfilesGenerated?.(profiles);
    } catch { console.error('生成失败'); }
    finally { setIsGenerating(false); }
  };

  const handleCopy = async () => {
    try { await copyToClipboard(generatedProfiles); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); }
    catch { console.error('复制失败'); }
  };

  const handleExport = (format: 'json' | 'csv' | 'txt') => {
    if (!generatedProfiles.length) return;
    try {
      if (format === 'json') exportToJSON(generatedProfiles);
      else if (format === 'csv') exportToCSV(generatedProfiles);
      else exportToTXT(generatedProfiles);
    } catch { console.error('导出失败'); }
  };

  return (
    <div className="space-y-5">
      {/* Settings card */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />生成设置
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">税收筛选</label>
            <select value={taxFilter} onChange={(e) => { setTaxFilter(e.target.value); setSelectedState(''); setSelectedCity(''); }} className={selectClass}>
              <option value="">所有州</option>
              <option value="tax-free">免税州 ({getTaxFreeStates().length})</option>
              <option value="taxable">有税州 ({getTaxableStates().length})</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">选择州</label>
            <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); }} className={selectClass}>
              <option value="">{taxFilter === 'tax-free' ? '所有免税州' : taxFilter === 'taxable' ? '所有有税州' : '所有州'}</option>
              {getFilteredStates().map(s => (
                <option key={s.abbreviation} value={s.name}>{s.name} ({s.abbreviation}){s.taxFree ? '' : ` - ${s.salesTaxRate}%`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">选择城市</label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState} className={selectClass}>
              <option value="">所有城市</option>
              {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">生成数量</label>
            <select value={isCustomCount ? 'custom' : batchCount} onChange={(e) => handleCountChange(e.target.value)} className={selectClass}>
              {[1, 5, 10, 20, 50].map(n => <option key={n} value={n}>{n} 个</option>)}
              <option value="custom">自定义</option>
            </select>
            {isCustomCount && (
              <div className="mt-2">
                <input type="number" value={customCount} onChange={(e) => handleCustomCountChange(e.target.value)} placeholder="1-1000" min={1} max={1000}
                  className={`${inputClass} ${customCountError ? 'border-red-500' : ''}`} />
                {customCountError && <p className="text-red-500 text-xs mt-1">{customCountError}</p>}
              </div>
            )}
          </div>

          <button onClick={handleGenerate} disabled={isGenerating}
            className="w-full px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2">
            {isGenerating ? <><RefreshCw className="animate-spin h-4 w-4" />生成中...</> : <><RefreshCw className="h-4 w-4" />生成身份</>}
          </button>
        </div>
      </div>

      {/* Export card */}
      {generatedProfiles.length > 0 && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-5">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">导出选项</h3>
          <div className="space-y-2">
            {[
              { format: 'json' as const, label: '导出 JSON' },
              { format: 'csv' as const, label: '导出 CSV' },
              { format: 'txt' as const, label: '导出 TXT' },
            ].map(({ format, label }) => (
              <button key={format} onClick={() => handleExport(format)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-sm flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />{label}
              </button>
            ))}
            <button onClick={handleCopy}
              className={`w-full px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 ${
                copySuccess ? 'bg-green-600 text-white' : 'border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700'
              }`}>
              <Copy className="h-4 w-4" />{copySuccess ? '已复制!' : '复制 JSON'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
