'use client';

import React, { useState } from 'react';
import Header from '@/shared/components/Layout/Header';
import GeneratorSettings from '@/tools/usa-identity/components/GeneratorSettings';
import GeneratorResults from '@/tools/usa-identity/components/GeneratorResults';
import MapComponent from '@/tools/usa-identity/components/MapComponent';
import Footer from '@/shared/components/Footer';
import { CompleteProfile } from '@/tools/usa-identity/utils/addressGenerator';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

export default function USAIdentityGenerator() {
  const [generatedProfiles, setGeneratedProfiles] = useState<CompleteProfile[]>([]);

  const handleProfilesGenerated = (profiles: CompleteProfile[]) => {
    setGeneratedProfiles(profiles);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header
        showBackButton={true}
        title="美国虚拟身份生成器"
        subtitle="专业的测试数据生成工具"
      />

      <ErrorBoundary>
        <main className="w-[80%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            <div className="lg:col-span-3">
              <GeneratorSettings onProfilesGenerated={handleProfilesGenerated} />
            </div>
            <div className="lg:col-span-7 space-y-6">
              <GeneratorResults profiles={generatedProfiles} />
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                <MapComponent profiles={generatedProfiles} />
              </div>
            </div>
          </div>
        </main>
      </ErrorBoundary>

      <Footer />
    </div>
  );
}
