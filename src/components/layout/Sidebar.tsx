import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Home, Activity, DollarSign, ClipboardList, TrendingUp, Zap, Settings, ChevronRight } from 'lucide-react'

const NAV = [
  { id:'home', label:'HOME', icon:Home, to:'/' as const, accent:'text-slate-300' },
  { id:'pulse', label:'PULSE', icon:Activity, accent:'text-red-400', dot:true,
    children:[
      { label:'Live Overview',     to:'/pulse' },
      { label:'Vehicle Flow',      to:'/pulse/flow' },
      { label:'Barriers & Access', to:'/pulse/barriers' },
      { label:'Active Incidents',  to:'/pulse/incidents' },
    ]},
  { id:'revenue', label:'REVENUE', icon:DollarSign, accent:'text-teal-400',
    children:[
      { label:'Daily Summary',        to:'/revenue' },
      { label:'Income by Product',    to:'/revenue/products' },
      { label:'Transactions',         to:'/revenue/transactions' },
      { label:'Settlements & Budget', to:'/revenue/settlements' },
    ]},
  { id:'field', label:'FIELD', icon:ClipboardList, accent:'text-sky-400',
    children:[
      { label:'Incidents Log',     to:'/field/incidents' },
      { label:'Cleaning & Maint.', to:'/field/maintenance' },
      { label:'Money Counts',      to:'/field/counts' },
      { label:'PWA Stats',         to:'/field/pwa' },
    ]},
  { id:'forecast', label:'FORECAST', icon:TrendingUp, accent:'text-violet-400',
    children:[
      { label:'Predictive Analytics', to:'/forecast' },
      { label:'Scenario Simulation',  to:'/forecast/simulation' },
      { label:'Product Design',       to:'/forecast/products' },
    ]},
  { id:'noor', label:'NOOR', icon:Zap, accent:'text-amber-400',
    children:[
      { label:'Assistant',      to:'/noor' },
      { label:'Chat History',   to:'/noor/history' },
      { label:'Saved Analyses', to:'/noor/saved' },
    ]},
] as const

const SYSTEM = {
  id:'system', label:'SYSTEM', icon:Settings, accent:'text-slate-400',
  children:[
    { label:'Users & Roles', to:'/system/users' },
    { label:'Whitelist',     to:'/system/whitelist' },
    { label:'Tariff Config', to:'/system/tariffs' },
    { label:'Settings',      to:'/system/settings' },
  ],
} as const

export function Sidebar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState<Record<string, boolean>>({ pulse: true })
  const toggle = (id: string) => setOpen(prev => ({ ...prev, [id]: !prev[id] }))
  const isActive = (to: string) => to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-[#0f0f17] border-r border-[#1e1e2e] select-none shrink-0">
      <div className="px-4 pt-5 pb-4 border-b border-[#1e1e2e]">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-white uppercase">JEDCO LANDSIDE</p>
        <p className="text-[9px] tracking-[0.15em] text-slate-500 mt-0.5 uppercase">KAIA · JEDDAH</p>
      </div>
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV.map(item => {
          const Icon = item.icon
          const hasChildren = 'children' in item
          const isExpanded = open[item.id]
          const parentActive = hasChildren ? item.children.some(c => isActive(c.to)) : isActive(item.to)
          return (
            <div key={item.id}>
              {hasChildren ? (
                <button onClick={() => toggle(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors rounded-none ${
                    parentActive ? 'text-white bg-[#161621]' : 'text-slate-400 hover:text-slate-200 hover:bg-[#161621]/60'}`}>
                  <Icon size={14} className={`shrink-0 ${item.accent}`} />
                  <span className={`flex-1 text-[11px] font-semibold tracking-[0.12em] uppercase ${parentActive ? 'text-white' : ''}`}>{item.label}</span>
                  {'dot' in item && item.dot && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  <ChevronRight size={11} className={`shrink-0 text-slate-600 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              ) : (
                <Link to={item.to} className={`flex items-center gap-2.5 px-3 py-2 transition-colors ${
                  isActive(item.to) ? 'text-white bg-[#161621] border-l-2 border-teal-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#161621]/60 border-l-2 border-transparent'}`}>
                  <Icon size={14} className={`shrink-0 ${item.accent}`} />
                  <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">{item.label}</span>
                </Link>
              )}
              {hasChildren && isExpanded && (
                <div className="pb-1">
                  {item.children.map(child => (
                    <Link key={child.to} to={child.to}
                      className={`flex items-center gap-2 pl-8 pr-3 py-1.5 transition-colors ${
                        isActive(child.to) ? 'text-teal-400 bg-[#161621]/80' : 'text-slate-500 hover:text-slate-300 hover:bg-[#161621]/40'}`}>
                      <span className={`w-1 h-1 rounded-full shrink-0 ${isActive(child.to) ? 'bg-teal-400' : 'bg-slate-600'}`} />
                      <span className="text-[11px] tracking-wide">{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <div className="border-t border-[#1e1e2e] py-2">
        <button onClick={() => toggle('system')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors ${
            open['system'] ? 'text-slate-300 bg-[#161621]' : 'text-slate-500 hover:text-slate-300 hover:bg-[#161621]/60'}`}>
          <Settings size={13} className="shrink-0 text-slate-500" />
          <span className="flex-1 text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-500">SYSTEM</span>
          <ChevronRight size={10} className={`shrink-0 text-slate-700 transition-transform duration-150 ${open['system'] ? 'rotate-90' : ''}`} />
        </button>
        {open['system'] && (
          <div>
            {SYSTEM.children.map(child => (
              <Link key={child.to} to={child.to}
                className={`flex items-center gap-2 pl-8 pr-3 py-1.5 transition-colors ${
                  isActive(child.to) ? 'text-teal-400 bg-[#161621]/80' : 'text-slate-600 hover:text-slate-400 hover:bg-[#161621]/40'}`}>
                <span className={`w-1 h-1 rounded-full shrink-0 ${isActive(child.to) ? 'bg-teal-400' : 'bg-slate-700'}`} />
                <span className="text-[11px] tracking-wide">{child.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
                                                                }
