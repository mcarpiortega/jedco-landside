import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'

type Health = 'good' | 'warn' | 'alert' | 'idle'
type OverallHealth = 'good' | 'warn' | 'alert'

interface CardData {
  id: string; module: string; accentColor: string; dotColor: string
  dotPulse?: boolean; kpiLabel: string; kpiValue: string; kpiColor: string
  delta: string; deltaColor: string; sub: string; pips: Health[]
  health: OverallHealth; route: string
}

const HEALTH_BG: Record<Health, string> = {
  good: '#22c55e', warn: '#f59e0b', alert: '#ef4444', idle: '#1e1e2e',
}

const BADGE: Record<OverallHealth, { bg: string; color: string; label: string }> = {
  good:  { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', label: 'Good'  },
  warn:  { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Warn'  },
  alert: { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', label: 'Alert' },
}

const CARDS: CardData[] = [
  { id:'pulse',    module:'Pulse',    accentColor:'#ef4444', dotColor:'#22c55e',
    kpiLabel:"Today's Revenue", kpiValue:'SAR 184K', kpiColor:'#22c55e',
    delta:'▲ +12.4% vs yesterday', deltaColor:'#22c55e',
    sub:'Tickets: 4,231 · Avg SAR 43.5', pips:['good','good','good','good','warn'],
    health:'good', route:'/pulse' },
  { id:'barriers', module:'Barriers', accentColor:'#ef4444', dotColor:'#f59e0b',
    kpiLabel:'Barrier Health', kpiValue:'87.5%', kpiColor:'#f59e0b',
    delta:'▼ 3/24 barriers with fault', deltaColor:'#f59e0b',
    sub:'1 critical active · 2 scheduled maint.', pips:['good','good','good','warn','warn'],
    health:'warn', route:'/pulse/barriers' },
  { id:'incidents', module:'Incidents', accentColor:'#ef4444', dotColor:'#ef4444', dotPulse:true,
    kpiLabel:'Active Incidents', kpiValue:'7', kpiColor:'#ef4444',
    delta:'▲ +67% vs avg similar day', deltaColor:'#ef4444',
    sub:'P1 ×2 · P2 ×3 · P3 ×2', pips:['good','good','warn','alert','alert'],
    health:'alert', route:'/pulse/incidents' },
  { id:'revenue',  module:'Revenue',  accentColor:'#2dd4bf', dotColor:'#22c55e',
    kpiLabel:'vs Daily Target', kpiValue:'105%', kpiColor:'#22c55e',
    delta:'SAR 184K / SAR 175K target', deltaColor:'#22c55e',
    sub:'Short-stay 62% · Long-stay 28%', pips:['good','good','good','good','good'],
    health:'good', route:'/revenue' },
  { id:'field',    module:'Field',    accentColor:'#38bdf8', dotColor:'#f59e0b',
    kpiLabel:'Tasks Open', kpiValue:'9/23', kpiColor:'#f59e0b',
    delta:'39% pending · SLA risk', deltaColor:'#f59e0b',
    sub:'2 maintenance overdue · 3 cleaning', pips:['good','good','good','warn','warn'],
    health:'warn', route:'/field/incidents' },
]

const NOOR_QUEUE = [
  { color:'#ef4444', label:'2 more P1' }, { color:'#f59e0b', label:'4 P2' },
  { color:'#38bdf8', label:'1 web anomaly' }, { color:'#64748b', label:'3 preventive' },
]

function getLast5Hours(): string[] {
  const now = new Date()
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now); d.setHours(now.getHours() - 4 + i)
    return d.getHours().toString().padStart(2, '0') + 'h'
  })
}

function PipBar({ pips, hours }: { pips: Health[]; hours: string[] }) {
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {pips.map((p, i) => (<div key={i} className="flex-1 rounded-sm" style={{ height:3, background:HEALTH_BG[p] }} />))}
      </div>
      <div className="flex gap-1 mt-1">
        {hours.map((h, i) => (<div key={i} className="flex-1 text-center" style={{ fontSize:8, color:'#334155', fontVariantNumeric:'tabular-nums' }}>{h}</div>))}
      </div>
    </div>
  )
}

function KpiCard({ card, hours, onClick }: { card: CardData; hours: string[]; onClick: () => void }) {
  const badge = BADGE[card.health]
  return (
    <div className="relative flex flex-col overflow-hidden rounded cursor-pointer"
      style={{ background:'#0f0f17', border:'1px solid #1e1e2e', padding:14 }}
      onClick={onClick}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor='#2d2d3f')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor='#1e1e2e')}>
      <div className="absolute top-0 left-0 right-0" style={{ height:2, background:card.accentColor }} />
      <div className="flex items-center justify-between mb-3 mt-1">
        <span style={{ fontSize:9, letterSpacing:'0.18em', color:'#4a5568', textTransform:'uppercase' }}>{card.module}</span>
        <div className="rounded-full" style={{ width:7, height:7, background:card.dotColor, animation:card.dotPulse?'pulse 1s infinite':undefined }} />
      </div>
      <p style={{ fontSize:9, letterSpacing:'0.12em', color:'#4a5568', textTransform:'uppercase', marginBottom:4 }}>{card.kpiLabel}</p>
      <p style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.01em', lineHeight:1, color:card.kpiColor, marginBottom:4 }}>{card.kpiValue}</p>
      <p style={{ fontSize:10, color:card.deltaColor }}>{card.delta}</p>
      <div style={{ borderTop:'1px solid #1e1e2e', margin:'10px 0' }} />
      <p style={{ fontSize:10, color:'#4a5568', lineHeight:1.6 }}>{card.sub}</p>
      <PipBar pips={card.pips} hours={hours} />
      <div className="flex items-center gap-1 mt-3">
        <span style={{ flex:1, fontSize:9, color:'#4a5568', textTransform:'uppercase', letterSpacing:'0.1em' }}>Overall</span>
        <span style={{ fontSize:9, fontWeight:600, letterSpacing:'0.1em', padding:'2px 7px', borderRadius:2, textTransform:'uppercase', background:badge.bg, color:badge.color }}>{badge.label}</span>
      </div>
    </div>
  )
    }

function NoorCard({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="relative overflow-hidden rounded cursor-pointer"
      style={{ background:'#0f0f17', border:'1px solid rgba(245,158,11,0.27)', padding:'14px 16px' }}
      onClick={onOpen}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor='rgba(245,158,11,0.5)')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor='rgba(245,158,11,0.27)')}>
      <div className="absolute top-0 left-0 right-0" style={{ height:2, background:'#f59e0b' }} />
      <div className="flex items-center justify-between mb-3 mt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center justify-center rounded shrink-0" style={{ width:18, height:18, background:'rgba(245,158,11,0.15)', fontSize:11, color:'#f59e0b' }}>⚡</div>
          <span style={{ fontSize:9, letterSpacing:'0.18em', color:'#f59e0b', textTransform:'uppercase', fontWeight:600 }}>NOOR · Action Required</span>
          <span style={{ fontSize:9, color:'#4a5568' }}>Updated 2 min ago · based on 14 signals</span>
        </div>
        <button style={{ fontSize:9, letterSpacing:'0.12em', color:'rgba(245,158,11,0.5)', textTransform:'uppercase', border:'1px solid rgba(245,158,11,0.2)', borderRadius:2, padding:'3px 8px', background:'transparent', fontFamily:'inherit', cursor:'pointer', flexShrink:0 }}
          onClick={e => { e.stopPropagation(); onOpen() }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color='#f59e0b'; (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(245,158,11,0.5)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color='rgba(245,158,11,0.5)'; (e.currentTarget as HTMLButtonElement).style.borderColor='rgba(245,158,11,0.2)' }}>
          Open NOOR ↗
        </button>
      </div>
      <div className="flex items-start gap-3">
        <span style={{ fontSize:8, letterSpacing:'0.1em', fontWeight:700, padding:'3px 7px', borderRadius:2, textTransform:'uppercase', background:'rgba(239,68,68,0.15)', color:'#ef4444', whiteSpace:'nowrap', marginTop:2, flexShrink:0 }}>P1 · Now</span>
        <div>
          <p style={{ fontSize:11, color:'#e2e8f0', lineHeight:1.6, letterSpacing:'0.01em' }}>Dispatch supervisor to Barrier B-07 (Terminal 3, Level 2) — arm stuck open, manual override failed at 14:32. Vehicle queue building. Estimated revenue loss: SAR 420/hr.</p>
          <p style={{ fontSize:9, color:'#4a5568', marginTop:4 }}>Source: barrier fault log · incidents feed · revenue model</p>
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginTop:10, paddingTop:10, borderTop:'1px solid #1e1e2e' }}>
        <div className="flex gap-4 flex-wrap">
          {NOOR_QUEUE.map(item => (<div key={item.label} className="flex items-center gap-1"><div className="rounded-full shrink-0" style={{ width:5, height:5, background:item.color }} /><span style={{ fontSize:9, color:'#4a5568', textTransform:'uppercase', letterSpacing:'0.08em' }}>{item.label}</span></div>))}
        </div>
        <button style={{ fontSize:9, letterSpacing:'0.14em', color:'#f59e0b', textTransform:'uppercase', fontWeight:600, background:'none', border:'none', fontFamily:'inherit', cursor:'pointer', padding:0 }}
          onClick={e => { e.stopPropagation(); onOpen() }}>See all 10 actions ↗</button>
      </div>
    </div>
  )
}

function HomeDashboard() {
  const navigate = useNavigate()
  const [clock, setClock] = useState('')
  const hours = useMemo(() => getLast5Hours(), [])
  useEffect(() => {
    const tick = () => { const now = new Date(); setClock(now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' })) }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const go = (to: string) => navigate({ to: to as any })
  return (
    <div style={{ fontFamily:"'JetBrains Mono','Fira Code',monospace" }}>
      <div className="flex items-center justify-between" style={{ padding:'12px 20px', borderBottom:'1px solid #1e1e2e', background:'#0f0f17' }}>
        <div className="flex flex-col gap-0.5">
          <p style={{ fontSize:9, letterSpacing:'0.18em', color:'#4a5568', textTransform:'uppercase', margin:0 }}>JEDCO LANDSIDE · KAIA</p>
          <h1 style={{ fontSize:14, fontWeight:600, letterSpacing:'0.1em', color:'#e2e8f0', textTransform:'uppercase', margin:0 }}>Operations Overview</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5" style={{ fontSize:10, letterSpacing:'0.12em', color:'#ef4444', textTransform:'uppercase' }}>
            <div className="rounded-full animate-pulse" style={{ width:6, height:6, background:'#ef4444' }} />LIVE
          </div>
          <span style={{ fontSize:12, color:'#64748b', fontVariantNumeric:'tabular-nums' }}>{clock}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 rounded mx-5 my-4" style={{ background:'#0f0f17', border:'1px solid #1e1e2e', padding:'10px 14px' }}>
        <span style={{ fontSize:9, letterSpacing:'0.18em', color:'#4a5568', textTransform:'uppercase' }}>System Health</span>
        <div className="flex-1 overflow-hidden rounded-sm" style={{ height:4, background:'#1e1e2e' }}>
          <div style={{ height:'100%', width:'60%', background:'#f59e0b', borderRadius:2 }} />
        </div>
        <span style={{ fontSize:10, letterSpacing:'0.1em', color:'#f59e0b', textTransform:'uppercase', fontWeight:600 }}>AMBER</span>
        <span style={{ fontSize:10, color:'#4a5568' }}>2 modules need attention</span>
      </div>
      <div className="px-5 grid gap-3" style={{ gridTemplateColumns:'repeat(3, 1fr)' }}>
        {CARDS.map(card => (<KpiCard key={card.id} card={card} hours={hours} onClick={() => go(card.route)} />))}
      </div>
      <div className="px-5 mt-3 mb-6"><NoorCard onOpen={() => go('/noor')} /></div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomeDashboard,
})
