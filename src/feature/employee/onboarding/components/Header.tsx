import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          HRMS
        </h1>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm text-slate-500">Onboarding</span>
        </div>
      </div>
    </header>
  );
};
