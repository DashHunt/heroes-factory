import type { ReactNode } from 'react'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center px-4 py-4">
          <h1 className="text-lg font-semibold">Heroes Factory</h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
