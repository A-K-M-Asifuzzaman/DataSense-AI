import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Upload, BarChart3, Sparkles, TrendingUp, Brain,
  ChevronLeft, ChevronRight, Database, RefreshCw, Zap
} from 'lucide-react'
import { useApp } from '../App'

const NAV = [
  { path:'/upload',  icon:Upload,    label:'Upload Data',    desc:'Import CSV',       color:'from-blue-500 to-cyan-500' },
  { path:'/quality', icon:BarChart3,  label:'Data Quality',  desc:'Quality Score',    color:'from-emerald-500 to-teal-500' },
  { path:'/cleaning',icon:Sparkles,   label:'Auto Clean',    desc:'Smart Cleaning',   color:'from-amber-500 to-orange-500' },
  { path:'/eda',     icon:TrendingUp, label:'EDA & Insights',desc:'Visualization',    color:'from-sky-500 to-blue-500' },
  { path:'/ml',      icon:Brain,      label:'AutoML & XAI',  desc:'Train + Explain',  color:'from-violet-500 to-purple-500' },
]

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, session, resetAll } = useApp()
  const navigate = useNavigate()
  const [hoveredPath, setHoveredPath] = useState(null)

  return (
    <aside className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300
      ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
      style={{ background:'rgba(8,9,16,0.95)', borderRight:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(20px)' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-white/5 h-16 ${sidebarCollapsed?'justify-center':''}`}>
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg animate-glow-pulse">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-surface-900 animate-pulse" />
        </div>
        {!sidebarCollapsed && (
          <div className="animate-fade-in overflow-hidden">
            <div className="text-white font-bold text-sm leading-tight" style={{fontFamily:'DM Serif Display,serif'}}>
              DataSense <span className="text-brand-400">AI</span>
            </div>
            <div className="text-slate-500 text-xs mt-0.5">AutoML Platform</div>
          </div>
        )}
      </div>

      {/* Session badge */}
      {session && !sidebarCollapsed && (
        <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl border border-brand-500/20 animate-scale-in"
          style={{background:'rgba(99,102,241,0.08)'}}>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
            <span className="text-xs text-brand-300 font-medium truncate">{session.filename}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {session.rows?.toLocaleString()} rows · {session.columns} cols
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-2 mt-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ path, icon: Icon, label, desc, color }, i) => (
          <NavLink key={path} to={path}
            onMouseEnter={() => setHoveredPath(path)}
            onMouseLeave={() => setHoveredPath(null)}
            style={{ animationDelay: `${i * 60}ms` }}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
               animate-slide-right
               ${isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-white'
               }
               ${sidebarCollapsed ? 'justify-center' : ''}`
            }
            title={sidebarCollapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {/* Active bg */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl" style={{
                    background:'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.1))',
                    border:'1px solid rgba(99,102,241,0.3)'
                  }} />
                )}
                {/* Hover bg */}
                {!isActive && hoveredPath === path && (
                  <div className="absolute inset-0 rounded-xl" style={{
                    background:'rgba(255,255,255,0.04)',
                    border:'1px solid rgba(255,255,255,0.08)'
                  }} />
                )}
                {/* Icon */}
                <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                  ${isActive ? `bg-gradient-to-br ${color} shadow-lg` : 'bg-white/5 group-hover:bg-white/10'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {!sidebarCollapsed && (
                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="text-sm font-medium leading-tight">{label}</div>
                    <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{desc}</div>
                  </div>
                )}
                {/* Active indicator */}
                {isActive && !sidebarCollapsed && (
                  <div className="relative z-10 w-1.5 h-1.5 bg-brand-400 rounded-full flex-shrink-0 animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/5 space-y-1">
        {session && (
          <button onClick={() => { resetAll(); navigate('/upload') }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500
              hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20
              transition-all duration-200 ${sidebarCollapsed?'justify-center':''}`}
            title="New session">
            <RefreshCw className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">New Session</span>}
          </button>
        )}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600
            hover:text-slate-300 hover:bg-white/5 transition-all duration-200 ${sidebarCollapsed?'justify-center':''}`}>
          {sidebarCollapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><ChevronLeft className="w-4 h-4" /><span className="text-xs">Collapse</span></>}
        </button>
      </div>
    </aside>
  )
}
