'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LandingPage } from '@/components/landing/LandingPage';
import { useCADStore } from '@/store/useCADStore';

// Dynamically import CADApp with ssr: false — Three.js requires the browser
const CADApp = dynamic(() => import('@/components/cad/CADApp').then(m => m.CADApp), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-xl animate-pulse">
        Z
      </div>
      <div className="text-sm text-muted-foreground">Loading ZCAD Studio...</div>
    </div>
  ),
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-white gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center font-bold text-xl animate-pulse">
          Z
        </div>
        <div className="text-sm text-white/50">Loading Super Z CAD...</div>
      </div>
    );
  }

  if (showApp) {
    return <CADApp />;
  }

  return (
    <LandingPage
      onLaunch={(partId) => {
        // If a specific part was clicked, set it as active before launching
        if (partId) {
          useCADStore.setState({ activePartId: partId });
        }
        setShowApp(true);
      }}
    />
  );
}
