import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Sidebar } from '@/components/layout/Sidebar'

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen overflow-hidden bg-[#05050a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  ),
})
