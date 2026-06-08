import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Home,
  Briefcase,
  Search,
  LayoutGrid,
  UserCheck,
  BarChart3,
  Users,
  Sun,
  Moon,
  Plus,
  Grid3X3,
  List,
  SlidersHorizontal,
} from 'lucide-react'

import type { RootState } from '@/app/store'
import { setAppView, toggleTheme } from '@/shared/store/uiSlice'
import { GuildLogo } from '@/shared/components/GuildLogo'
import PurchaseDashboard from './PurchaseDashboard'
import RequisitionPage from './RequisitionPage'
import RequisitionWorkspace from './RequisitionWorkspace'

type PurchaseTab =
  | 'dashboard'
  | 'requisition'
  | 'sourcing'
  | 'procurement'
  | 'approvals'
  | 'payments'
  | 'vendors'

export default function PurchaseModule() {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.ui.theme)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [purchaseTab, setPurchaseTab] =
    useState<PurchaseTab>('dashboard')

  const purchaseSidebarItems = [
    { icon: Home, label: 'Dashboard', tab: 'dashboard' },
    { icon: Briefcase, label: 'Requisition', tab: 'requisition' },
    { icon: Search, label: 'Sourcing', tab: 'sourcing' },
    { icon: LayoutGrid, label: 'Procurement', tab: 'procurement' },
    { icon: UserCheck, label: 'Approvals', tab: 'approvals' },
    { icon: BarChart3, label: 'Payments', tab: 'payments' },
    { icon: Users, label: 'Vendors', tab: 'vendors' },
  ]

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}

      <aside className="w-[220px] border-r border-border/50 bg-card/40 flex flex-col">
        <div className="h-[88px] flex items-center px-8 border-b border-border/50">
          <button
            onClick={() => dispatch(setAppView('erp-modules'))}
            className="flex items-center justify-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-2xl p-1"
            title="Return to ERP Catalog"
          >
            <GuildLogo className="w-14 h-14" theme={theme} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {purchaseSidebarItems.map((item) => {
            const Icon = item.icon

            const active = purchaseTab === item.tab

            return (
              <button
                key={item.tab}
                onClick={() => {
                  setPurchaseTab(item.tab as PurchaseTab)
                  setSelectedCategory(null)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />

                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}

        <header className="h-[88px] border-b border-border/50 px-8 flex items-center justify-between">
          <h1 className="font-['Fauna_One'] text-[28px] tracking-[0.18em] text-foreground">
            The Guild Procurement
          </h1>

          <div className="flex items-center gap-3">
            <div className="w-[320px] h-11 rounded-xl border border-border/50 bg-card/40 px-4 flex items-center">
              <input
                placeholder="Search requisitions..."
                className="bg-transparent outline-none text-sm w-full text-zinc-300 placeholder:text-zinc-500"
              />
            </div>

            <button className="w-11 h-11 rounded-xl border border-border/50 bg-card/40 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button className="w-11 h-11 rounded-xl border border-border/50 bg-card/40 flex items-center justify-center">
              <Grid3X3 className="w-4 h-4" />
            </button>

            <button className="w-11 h-11 rounded-xl border border-border/50 bg-card/40 flex items-center justify-center">
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-11 h-11 rounded-xl border border-border/50 bg-card/40 flex items-center justify-center hover:bg-white/5 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button className="h-11 px-5 rounded-xl bg-white text-black text-sm font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Request
            </button>
          </div>
        </header>

        {/* Content */}

        <main className="flex-1 overflow-auto">
          {purchaseTab === 'dashboard' && (
            <PurchaseDashboard />
          )}
          {purchaseTab === 'requisition' && (
            selectedCategory === null ? (
              <RequisitionPage onCategorySelect={setSelectedCategory} />
            ) : (
              <RequisitionWorkspace category={selectedCategory} onBack={() => setSelectedCategory(null)} />
            )
          )}
        </main>
      </div>
    </div>
  )
}