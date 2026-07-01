import type { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto flex justify-center w-full max-w-5xl items-center pt-8 text-center">
        <h1 className="text-[32px] font-semibold text-blue-700">Hérois</h1>
      </div>
      <main>{children}</main>
    </div>
  );
}
