import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/system/settings')({
  component: () => (
    <div className="p-8">
      <p className="text-[11px] tracking-[0.2em] text-slate-500 uppercase mb-1">
        JEDCO LANDSIDE · KAIA
      </p>
      <h1 className="text-2xl font-semibold text-white">SYSTEM — Settings</h1>
      <p className="text-slate-400 text-sm mt-2">Coming soon.</p>
    </div>
  ),
})
