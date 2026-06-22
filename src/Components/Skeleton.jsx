import React from "react";

export function CardSkeleton() {
  return (
    <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-6 w-1/3 bg-slate-700 rounded-md"></div>
        <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-700 rounded-md"></div>
        <div className="h-4 w-5/6 bg-slate-700 rounded-md"></div>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <div className="h-6 w-16 bg-slate-700 rounded-full"></div>
        <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
        <div className="h-6 w-14 bg-slate-700 rounded-full"></div>
      </div>
      <div className="h-4 w-40 bg-slate-700 rounded-md pt-2"></div>
      <div className="border-t border-slate-700/50 pt-4 flex justify-end gap-3">
        <div className="h-9 w-28 bg-slate-700 rounded-xl"></div>
        <div className="h-9 w-24 bg-slate-700 rounded-xl"></div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl h-32 flex flex-col justify-between">
            <div className="h-4 w-1/2 bg-slate-700 rounded"></div>
            <div className="h-8 w-1/3 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 w-48 bg-slate-700 rounded"></div>
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <div className="h-8 w-40 bg-slate-700 rounded"></div>
          <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
        <div className="h-6 w-36 bg-slate-700 rounded"></div>
        <div className="h-6 w-16 bg-slate-700 rounded"></div>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-0">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 bg-slate-700 rounded"></div>
            <div className="h-3 w-1/4 bg-slate-700 rounded"></div>
          </div>
          <div className="h-6 w-20 bg-slate-700 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="h-40 bg-slate-700"></div>
        <div className="p-6 relative">
          <div className="absolute -top-16 left-6 w-32 h-32 rounded-full bg-slate-700 border-4 border-slate-900"></div>
          <div className="flex justify-end pt-4">
            <div className="h-10 w-32 bg-slate-700 rounded-xl"></div>
          </div>
          <div className="mt-16 space-y-3">
            <div className="h-7 w-48 bg-slate-700 rounded"></div>
            <div className="h-4 w-24 bg-slate-700 rounded"></div>
            <div className="h-3 w-full bg-slate-700 rounded pt-4"></div>
            <div className="h-3 w-5/6 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
